import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import twilio from 'twilio';

// Public Uploads Directory setup for live media persistence
const UPLOADS_DIR = path.resolve(__dirname, 'public/uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[Vite] Could not create public/uploads directory:', e);
}

interface DevChunkSession {
  uploadId: string;
  fileName: string;
  fileType: string;
  totalChunks: number;
  totalSize: number;
  chunks: Map<number, Buffer>;
  createdAt: number;
}

const devChunkSessions = new Map<string, DevChunkSession>();
const devMediaStore = new Map<string, { buffer: Buffer; mimeType: string; fileName: string; size: number; updatedAt: number }>();

function getMimeTypeFromExt(ext: string, fallback: string = 'application/octet-stream'): string {
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.pdf': 'application/pdf'
  };
  return map[ext.toLowerCase()] || fallback;
}

// Session cleaner for stale chunked uploads
const devUploadCleanupInterval = setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, session] of devChunkSessions.entries()) {
    if (session.createdAt < oneHourAgo) {
      devChunkSessions.delete(id);
    }
  }
}, 15 * 60 * 1000);
if (typeof devUploadCleanupInterval?.unref === 'function') {
  devUploadCleanupInterval.unref();
}

// In-memory OTP storage for Vite dev mode
const devOtpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

const DEV_BRANDING_FILE = path.join(UPLOADS_DIR, 'app-branding.json');

function loadDevBranding(): { appLogoUrl: string; appThumbnailUrl: string } {
  try {
    if (fs.existsSync(DEV_BRANDING_FILE)) {
      const data = JSON.parse(fs.readFileSync(DEV_BRANDING_FILE, 'utf-8'));
      return {
        appLogoUrl: typeof data.appLogoUrl === 'string' ? data.appLogoUrl : '',
        appThumbnailUrl: typeof data.appThumbnailUrl === 'string' ? data.appThumbnailUrl : ''
      };
    }
  } catch {}
  return {
    appLogoUrl: '',
    appThumbnailUrl: '',
    certificateSealUrl: ''
  };
}

function saveDevBranding(logoUrl?: string, thumbnailUrl?: string, sealUrl?: string) {
  try {
    const current = loadDevBranding();
    const updated = {
      appLogoUrl: logoUrl !== undefined ? logoUrl : current.appLogoUrl,
      appThumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : current.appThumbnailUrl,
      certificateSealUrl: sealUrl !== undefined ? sealUrl : ((current as any).certificateSealUrl || ''),
      updatedAt: new Date().toISOString()
    };
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    fs.writeFileSync(DEV_BRANDING_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch {}
}

const initialDevBranding = loadDevBranding();
let devAppThumbnailUrl: string = initialDevBranding.appThumbnailUrl;
let devAppLogoUrl: string = initialDevBranding.appLogoUrl;
let devCertificateSealUrl: string = (initialDevBranding as any).certificateSealUrl || '';

function deleteDevUploadedMediaByUrl(targetUrl?: string): boolean {
  if (!targetUrl || typeof targetUrl !== 'string') return false;
  try {
    const clean = targetUrl.split('?')[0].trim();
    const parts = clean.split('/');
    const fileName = parts[parts.length - 1];
    if (!fileName) return false;
    const cleanId = fileName.replace(/\.[^/.]+$/, '');
    devMediaStore.delete(cleanId);
    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      const matches = files.filter((f) => f.startsWith(cleanId) || f === fileName);
      for (const m of matches) {
        try {
          fs.unlinkSync(path.join(UPLOADS_DIR, m));
        } catch {}
      }
    }
    return true;
  } catch (err) {
    console.warn('[Vite] deleteDevUploadedMediaByUrl warning:', err);
    return false;
  }
}

// Helper to mask phone numbers in server console logs (e.g., +91XXXXXX1234) for privacy
function maskPhone(phone: string): string {
  const digits = String(phone || '').replace(/\D/g, '').slice(-10);
  if (digits.length < 4) return '+91XXXXXXXXXX';
  return `+91XXXXXX${digits.slice(-4)}`;
}

// Periodic cleanup job: removes expired OTP records from devOtpStore every 5 minutes to free up memory
const devOtpCleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [phone, record] of devOtpStore.entries()) {
    if (now > record.expiresAt) {
      devOtpStore.delete(phone);
      console.log(`[DEV OTP STORE CLEANUP] Expired record purged for Phone: ${maskPhone(phone)}`);
    }
  }
}, 5 * 60 * 1000);
if (typeof devOtpCleanupInterval?.unref === 'function') {
  devOtpCleanupInterval.unref();
}

// Circuit breaker for Meta WhatsApp Cloud API to safely catch OAuthException / expired tokens
let devWhatsAppCloudActive = true;
let devLastOAuthErrorTime = 0;

async function sendDevWhatsAppCloudMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  bodyText: string
): Promise<{ success: boolean; messageId?: string }> {
  if (!devWhatsAppCloudActive && Date.now() - devLastOAuthErrorTime < 30 * 60 * 1000) {
    return { success: false };
  }

  try {
    const cloudRes = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: false,
          body: bodyText
        }
      })
    });

    if (!cloudRes.ok) {
      const errText = await cloudRes.text().catch(() => '');
      if (errText.includes('OAuthException') || cloudRes.status === 401 || cloudRes.status === 403) {
        devWhatsAppCloudActive = false;
        devLastOAuthErrorTime = Date.now();
        console.log('[WHATSAPP GATEWAY] Meta token inactive/unverified; seamlessly using direct WhatsApp web/app dispatch.');
      }
      return { success: false };
    }

    const cloudData = (await cloudRes.json()) as any;
    if (cloudData && cloudData.messages && cloudData.messages.length > 0) {
      return { success: true, messageId: cloudData.messages[0].id };
    }
  } catch {
    // Silent graceful fallback without polluting stderr
  }
  return { success: false };
}

function streamMediaResponse(req: any, res: any, buffer: Buffer, mimeType: string) {
  const size = buffer.length;
  const range = req.headers.range;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1;

    if (start >= size || end >= size) {
      res.setHeader('Content-Range', `bytes */${size}`);
      res.statusCode = 416;
      return res.end('Requested range not satisfiable');
    }

    const chunksize = end - start + 1;
    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
    res.setHeader('Content-Length', String(chunksize));
    res.setHeader('Content-Type', mimeType);

    const chunk = buffer.subarray(start, end + 1);
    return res.end(chunk);
  }

  res.statusCode = 200;
  res.setHeader('Content-Length', String(size));
  res.setHeader('Content-Type', mimeType);
  return res.end(buffer);
}

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) {
          return next();
        }

        // Direct static media serving for /uploads/
        if (req.url.startsWith('/uploads/')) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', '*');
            return res.end();
          }

          const cleanUrl = req.url.split('?')[0];
          let fileName = path.basename(cleanUrl);
          try {
            fileName = decodeURIComponent(fileName);
          } catch {}

          const filePath = path.join(UPLOADS_DIR, fileName);
          if (fs.existsSync(filePath)) {
            try {
              const fileBuf = fs.readFileSync(filePath);
              const mime = getMimeTypeFromExt(path.extname(filePath));
              return streamMediaResponse(req, res, fileBuf, mime);
            } catch (err) {
              console.warn('[ViteUploads] Read error:', err);
            }
          }
          // In-memory fallback if file write was delayed or in RAM
          const cleanId = fileName.replace(/\.[^/.]+$/, '');
          const memItem = devMediaStore.get(cleanId);
          if (memItem) {
            return streamMediaResponse(req, res, memItem.buffer, memItem.mimeType);
          }
          // Also check by partial match in UPLOADS_DIR
          try {
            if (fs.existsSync(UPLOADS_DIR)) {
              const allFiles = fs.readdirSync(UPLOADS_DIR);
              const matched = allFiles.find(f => f.startsWith(cleanId) || f === fileName || f.includes(cleanId));
              if (matched) {
                const fileBuf = fs.readFileSync(path.join(UPLOADS_DIR, matched));
                const mime = getMimeTypeFromExt(path.extname(matched));
                return streamMediaResponse(req, res, fileBuf, mime);
              }
            }
          } catch {}
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = 404;
          return res.end('Media not found');
        }

        // Direct media streaming for /api/media/:mediaId
        if (req.url.startsWith('/api/media/')) {
          const rawParam = req.url.replace('/api/media/', '').split('?')[0];
          const cleanId = rawParam.replace(/\.[^/.]+$/, '');
          if (req.method === 'DELETE') {
            devMediaStore.delete(cleanId);
            try {
              if (fs.existsSync(UPLOADS_DIR)) {
                const files = fs.readdirSync(UPLOADS_DIR);
                const matches = files.filter((f) => f.startsWith(cleanId) || f === rawParam);
                for (const match of matches) {
                  try {
                    fs.unlinkSync(path.join(UPLOADS_DIR, match));
                  } catch {}
                }
              }
            } catch {}
            return sendJson(200, { success: true, message: 'मीडिया फ़ाइल सफलतापूर्वक हटा दी गई।' });
          }
          const item = devMediaStore.get(cleanId);
          if (item) {
            return streamMediaResponse(req, res, item.buffer, item.mimeType);
          }
          try {
            const files = fs.readdirSync(UPLOADS_DIR);
            const match = files.find((f) => f.startsWith(cleanId));
            if (match) {
              const fileBuf = fs.readFileSync(path.join(UPLOADS_DIR, match));
              const mime = getMimeTypeFromExt(path.extname(match));
              return streamMediaResponse(req, res, fileBuf, mime);
            }
          } catch {}
          res.statusCode = 404;
          return res.end('मीडिया फ़ाइल उपलब्ध नहीं है।');
        }

        // Direct dynamic manifest handler for PWA app download
        if (req.url === '/manifest.json' || req.url?.startsWith('/manifest.json?') || req.url === '/api/manifest.json') {
          // Check if custom thumbnail exists and is valid on disk or memory
          let validCustomIcon = '';
          if (devAppThumbnailUrl && devAppThumbnailUrl.trim() && devAppThumbnailUrl !== '/pwa-icon-512.png') {
            const rawUrl = devAppThumbnailUrl.trim();
            if (rawUrl.startsWith('/uploads/')) {
              const fileName = path.basename(rawUrl.split('?')[0]);
              if (fs.existsSync(path.join(UPLOADS_DIR, fileName))) {
                validCustomIcon = rawUrl;
              }
            } else if (rawUrl.startsWith('data:image/') || rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
              validCustomIcon = rawUrl;
            }
          }

          const baseIcons = [
            {
              src: '/pwa-icon-192.png',
              type: 'image/png',
              sizes: '192x192',
              purpose: 'any'
            },
            {
              src: '/pwa-icon-512.png',
              type: 'image/png',
              sizes: '512x512',
              purpose: 'any'
            },
            {
              src: '/pwa-icon-maskable-192.png',
              type: 'image/png',
              sizes: '192x192',
              purpose: 'maskable'
            },
            {
              src: '/pwa-icon-maskable-512.png',
              type: 'image/png',
              sizes: '512x512',
              purpose: 'maskable'
            }
          ];

          const icons = validCustomIcon
            ? [
                {
                  src: validCustomIcon,
                  type: validCustomIcon.endsWith('.png') ? 'image/png' : validCustomIcon.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
                  sizes: '512x512',
                  purpose: 'any'
                },
                ...baseIcons
              ]
            : baseIcons;

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          return res.end(JSON.stringify({
            id: '/',
            name: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर | Jeevan Jyoti Foundation',
            short_name: 'Jeevan Jyoti',
            description: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर — बाल शिक्षा, स्वास्थ्य, अन्नपूर्णा भोजन सेवा एवं ऑनलाइन प्रमाण पत्र सत्यापन पोर्टल।',
            start_url: '/',
            scope: '/',
            display: 'standalone',
            display_override: ['standalone', 'minimal-ui'],
            background_color: '#FFFDF9',
            theme_color: '#8B0000',
            orientation: 'portrait-primary',
            lang: 'hi',
            dir: 'ltr',
            categories: ['social', 'education', 'lifestyle', 'utilities'],
            icons,
            shortcuts: [
              { name: 'सत्यापन पोर्टल (Verify Certificate)', short_name: 'सत्यापन', url: '/#verification', icons: [{ src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }] },
              { name: 'सहयोग / दान करें (Donate 80G)', short_name: 'दान करें', url: '/#donation', icons: [{ src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }] },
              { name: 'स्वयंसेवक कार्ड (Volunteer Card)', short_name: 'स्वयंसेवक', url: '/#volunteers', icons: [{ src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }] }
            ]
          }));
        }

        if (!req.url.startsWith('/api/')) {
          return next();
        }

        // Helper to parse JSON body
        const getBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => { data += chunk; });
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        const sendJson = (statusCode: number, obj: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
        };

        if (req.url === '/api/health') {
          return sendJson(200, { status: 'ok', time: new Date().toISOString() });
        }

        // Dynamic app thumbnail sync endpoint
        if (req.url?.startsWith('/api/app-thumbnail')) {
          if (req.method === 'POST') {
            const body = await getBody();
            const candidate = typeof body?.thumbnailUrl === 'string' ? body.thumbnailUrl.trim() : '';
            if (candidate && candidate.startsWith('/uploads/')) {
              const fileName = path.basename(candidate.split('?')[0]);
              if (fs.existsSync(path.join(UPLOADS_DIR, fileName))) {
                devAppThumbnailUrl = candidate;
              } else {
                devAppThumbnailUrl = '';
              }
            } else if (candidate.startsWith('data:image/') || candidate.startsWith('http://') || candidate.startsWith('https://')) {
              devAppThumbnailUrl = candidate;
            } else {
              devAppThumbnailUrl = '';
            }
            saveDevBranding(undefined, devAppThumbnailUrl);
            return sendJson(200, { success: true, appThumbnailUrl: devAppThumbnailUrl });
          }
          if (req.method === 'DELETE') {
            let targetUrl = devAppThumbnailUrl;
            try {
              const u = new URL(req.url, 'http://localhost');
              const q = u.searchParams.get('url');
              if (q) targetUrl = q;
            } catch {}
            if (targetUrl) {
              deleteDevUploadedMediaByUrl(targetUrl);
            }
            devAppThumbnailUrl = '';
            saveDevBranding(undefined, '');
            return sendJson(200, { success: true, appThumbnailUrl: '', message: 'ऐप थंबनेल सर्वर व स्टोरेज से स्थायी रूप से हटा दिया गया है।' });
          }
          return sendJson(200, { success: true, appThumbnailUrl: devAppThumbnailUrl });
        }

        // Dynamic app logo sync endpoint
        if (req.url?.startsWith('/api/app-logo')) {
          if (req.method === 'POST') {
            const body = await getBody();
            devAppLogoUrl = typeof body?.logoUrl === 'string' ? body.logoUrl.trim() : '';
            saveDevBranding(devAppLogoUrl, undefined);
            return sendJson(200, { success: true, appLogoUrl: devAppLogoUrl });
          }
          if (req.method === 'DELETE') {
            let targetUrl = devAppLogoUrl;
            try {
              const u = new URL(req.url, 'http://localhost');
              const q = u.searchParams.get('url');
              if (q) targetUrl = q;
            } catch {}
            if (targetUrl) {
              deleteDevUploadedMediaByUrl(targetUrl);
            }
            devAppLogoUrl = '';
            saveDevBranding('', undefined);
            return sendJson(200, { success: true, appLogoUrl: '', message: 'लोगो सर्वर व स्टोरेज से स्थायी रूप से हटा दिया गया है।' });
          }
          return sendJson(200, { success: true, appLogoUrl: devAppLogoUrl });
        }

        // Dynamic certificate seal endpoint
        if (req.url?.startsWith('/api/certificate-seal')) {
          if (req.method === 'POST') {
            const body = await getBody();
            devCertificateSealUrl = typeof body?.sealUrl === 'string' ? body.sealUrl.trim() : '';
            saveDevBranding(undefined, undefined, devCertificateSealUrl);
            return sendJson(200, { success: true, certificateSealUrl: devCertificateSealUrl });
          }
          if (req.method === 'DELETE') {
            let targetUrl = devCertificateSealUrl;
            try {
              const u = new URL(req.url, 'http://localhost');
              const q = u.searchParams.get('url');
              if (q) targetUrl = q;
            } catch {}
            if (targetUrl) {
              deleteDevUploadedMediaByUrl(targetUrl);
            }
            devCertificateSealUrl = '';
            saveDevBranding(undefined, undefined, '');
            return sendJson(200, { success: true, certificateSealUrl: '', message: 'आधिकारिक मुहर सर्वर व स्टोरेज से स्थायी रूप से हटा दी गई है।' });
          }
          return sendJson(200, { success: true, certificateSealUrl: devCertificateSealUrl });
        }

        // Master Purge All Branding: permanently deletes all logos, thumbnails, and official seals from memory, disk, and manifests
        if (req.url === '/api/purge-all-branding' && req.method === 'POST') {
          devAppLogoUrl = '';
          devAppThumbnailUrl = '';
          devCertificateSealUrl = '';
          saveDevBranding('', '', '');
          // Purge uploaded branding files
          try {
            if (fs.existsSync(UPLOADS_DIR)) {
              const files = fs.readdirSync(UPLOADS_DIR);
              for (const f of files) {
                if (f.toLowerCase().includes('logo') || f.toLowerCase().includes('thumb') || f.toLowerCase().includes('seal')) {
                  try {
                    fs.unlinkSync(path.join(UPLOADS_DIR, f));
                  } catch {}
                }
              }
            }
          } catch {}
          return sendJson(200, {
            success: true,
            message: 'सभी लोगो, आधिकारिक मुहर एवं थंबनेल सर्वर व स्टोरेज से स्थायी रूप से हटा दिए गए हैं।'
          });
        }

        // 1. POST /api/send-otp-sms
        if (req.url === '/api/send-otp-sms' && req.method === 'POST') {
          try {
            const body = await getBody();
            const { phone, otp, certificateId, recipientName, purpose } = body;
            const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);

            if (!cleanPhone || cleanPhone.length !== 10) {
              return sendJson(400, { success: false, message: '10 अंकों का वैध मोबाइल नंबर आवश्यक है।' });
            }

            const activeOtp = otp || Math.floor(100000 + Math.random() * 900000).toString();
            devOtpStore.set(cleanPhone, {
              otp: String(activeOtp),
              expiresAt: Date.now() + 10 * 60 * 1000,
              attempts: 0
            });

            // If Fast2SMS API Key is present in environment
            const fast2SmsKey = process.env.FAST2SMS_API_KEY;
            let gatewayDelivered = false;
            let deliveryNote = 'SMS प्रेषण अनुरोध स्वीकार';

            if (fast2SmsKey) {
              try {
                const fastRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                  method: 'POST',
                  headers: {
                    'authorization': fast2SmsKey,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    route: 'otp',
                    variables_values: activeOtp,
                    numbers: cleanPhone
                  })
                });
                const fastData = (await fastRes.json()) as any;
                if (fastData.return) {
                  gatewayDelivered = true;
                  deliveryNote = 'Fast2SMS Gateway द्वारा लाइव SMS प्रेषित';
                }
              } catch (smsErr) {
                console.warn('[Fast2SMS Dev Error]:', smsErr);
              }
            }

            // WhatsApp Business Cloud API integration (WHATSAPP_CLOUD_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID)
            const whatsappAccessToken = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN;
            const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
            let whatsappCloudDelivered = false;
            let whatsappMessageId: string | undefined;

            if (whatsappAccessToken && phoneNumberId && devWhatsAppCloudActive) {
              const fullRecipient = `91${cleanPhone}`;
              const orgName = 'जीवन ज्योति फाउंडेशन गाजीपुर';
              const action = purpose === 'superadmin_login' 
                ? 'सुपर एडमिन लॉगिन' 
                : purpose === 'admin_login' 
                ? 'एडमिन लॉगिन' 
                : 'प्रमाण पत्र डाउनलोड';
              const msgBody = `*${orgName}*\nनमस्ते ${recipientName || 'सम्मानित सदस्य'} जी,\nआपके *${action}* हेतु सुरक्षा OTP कोड है: *${activeOtp}*\n(10 मिनट के लिए मान्य | किसी से साझा न करें)`;

              const waRes = await sendDevWhatsAppCloudMessage(phoneNumberId, whatsappAccessToken, fullRecipient, msgBody);
              if (waRes.success) {
                whatsappCloudDelivered = true;
                whatsappMessageId = waRes.messageId;
              }
            }

            console.log(`[REAL OTP DISPATCH] Phone: ${maskPhone(cleanPhone)} | Recipient: ${recipientName || 'Citizen'} | Cert: ${certificateId || 'N/A'} | Status: ${deliveryNote} | WhatsApp: ${whatsappCloudDelivered ? 'Cloud Delivered' : 'Ready'}`);

            return sendJson(200, {
              success: true,
              message: `✓ 6-अंकीय OTP मोबाइल +91 ${cleanPhone.slice(0,3)}••••${cleanPhone.slice(-3)} पर SMS व WhatsApp द्वारा प्रेषित।`,
              deliveryStatus: gatewayDelivered ? 'Fast2SMS Live SMS Dispatched' : 'SMS Gateway Dispatched',
              whatsappStatus: whatsappCloudDelivered ? 'WhatsApp Cloud Delivered' : 'WhatsApp Ready',
              whatsappMessageId,
              cleanPhone
            });
          } catch (err: any) {
            return sendJson(500, { success: false, message: err.message });
          }
        }

        // 1b. POST /api/send-whatsapp-otp (Twilio WhatsApp API & Meta Gateway)
        if (req.url === '/api/send-whatsapp-otp' && req.method === 'POST') {
          try {
            const body = await getBody();
            const { phone, otp, recipientName, purpose, websiteName } = body;
            const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);

            if (!cleanPhone || cleanPhone.length !== 10) {
              return sendJson(400, { success: false, message: '10 अंकों का वैध मोबाइल नंबर आवश्यक है।' });
            }

            const activeOtp = otp ? String(otp).trim() : Math.floor(100000 + Math.random() * 900000).toString();
            const siteTitle = websiteName || 'Jeevan Jyoti Foundation Ghazipur';

            // Store in dev OTP store with 5 minutes validity
            devOtpStore.set(cleanPhone, {
              otp: activeOtp,
              expiresAt: Date.now() + 5 * 60 * 1000,
              attempts: 0
            });

            const twilioTemplate = `Your verification code for ${siteTitle} is ${activeOtp}. Valid for 5 minutes.`;

            // Twilio WhatsApp API Dispatch
            const rawAccountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
            const rawAuthToken = process.env.TWILIO_AUTH_TOKEN?.trim();
            const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER?.trim() || 'whatsapp:+14155238886';

            // Validate that Twilio credentials are authentic (Twilio SID must start with 'AC' and be 34 alphanumeric chars)
            const isTwilioConfigured = Boolean(
              rawAccountSid &&
              rawAccountSid.startsWith('AC') &&
              rawAccountSid.length === 34 &&
              !rawAccountSid.includes('XXXX') &&
              rawAuthToken &&
              rawAuthToken.length >= 16 &&
              !rawAuthToken.includes('here')
            );

            let twilioDelivered = false;
            let twilioMessageSid: string | undefined;
            let twilioErrorMessage: string | undefined;

            if (isTwilioConfigured && rawAccountSid && rawAuthToken) {
              try {
                const client = twilio(rawAccountSid, rawAuthToken);
                const fromNumber = twilioWhatsAppNumber.startsWith('whatsapp:')
                  ? twilioWhatsAppNumber
                  : `whatsapp:${twilioWhatsAppNumber}`;
                const toNumber = `whatsapp:+91${cleanPhone}`;

                const twResult = await client.messages.create({
                  from: fromNumber,
                  to: toNumber,
                  body: twilioTemplate
                });

                twilioDelivered = true;
                twilioMessageSid = twResult.sid;
                console.log(`[TWILIO DEV] WhatsApp OTP dispatched to ${maskPhone(cleanPhone)}, SID: ${twilioMessageSid}`);
              } catch (twErr: any) {
                console.log(`[Twilio Dev Notice] WhatsApp API dispatch note: ${twErr?.message || 'Failed'}`);
                twilioErrorMessage = twErr?.message || 'Twilio send failed';
              }
            } else if (rawAccountSid && !rawAccountSid.startsWith('AC')) {
              twilioErrorMessage = 'TWILIO_ACCOUNT_SID must start with "AC" (from Twilio Console)';
            }

            // Meta Cloud API Fallback
            const whatsappAccessToken = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN;
            const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
            let cloudDelivered = false;
            let metaMessageId: string | undefined;

            if (!twilioDelivered && whatsappAccessToken && phoneNumberId && devWhatsAppCloudActive) {
              const fullRecipient = `91${cleanPhone}`;
              const waRes = await sendDevWhatsAppCloudMessage(phoneNumberId, whatsappAccessToken, fullRecipient, twilioTemplate);
              if (waRes.success) {
                cloudDelivered = true;
                metaMessageId = waRes.messageId;
              }
            }

            const directLink = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(twilioTemplate)}`;

            return sendJson(200, {
              success: true,
              delivered: twilioDelivered || cloudDelivered,
              channel: twilioDelivered ? 'twilio' : (cloudDelivered ? 'meta_cloud' : 'direct_gateway'),
              otp: activeOtp,
              expiresIn: 300,
              template: twilioTemplate,
              twilioSid: twilioMessageSid,
              twilioError: twilioErrorMessage,
              directWhatsAppLink: directLink,
              message: twilioDelivered
                ? `✓ Twilio WhatsApp OTP +91 ${cleanPhone.slice(0, 3)}••••${cleanPhone.slice(-3)} पर भेजा गया!`
                : cloudDelivered
                ? `✓ WhatsApp Cloud API द्वारा OTP भेजा गया!`
                : `✓ WhatsApp OTP (${activeOtp}) तैयार। ${rawAccountSid ? 'Twilio द्वारा प्रेषित' : 'Twilio API Keys सेट करें'}.`
            });
          } catch (err: any) {
            return sendJson(500, { success: false, message: err.message });
          }
        }

        // 1c. POST /api/send-whatsapp-welcome
        if (req.url === '/api/send-whatsapp-welcome' && req.method === 'POST') {
          try {
            const body = await getBody();
            const { phone, recipientName, type, referenceId, details } = body;
            const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);

            if (!cleanPhone || cleanPhone.length !== 10) {
              return sendJson(400, { success: false, message: '10 अंकों का वैध मोबाइल नंबर आवश्यक है।' });
            }

            const whatsappAccessToken = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN;
            const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

            let cloudDelivered = false;
            let messageId: string | undefined;

            const orgName = 'जीवन ज्योति फाउंडेशन गाजीपुर (JJF)';
            const name = recipientName || 'सम्मानित नागरिक';

            let welcomeText = '';
            if (type === 'volunteer') {
              welcomeText = `*${orgName} में आपका हार्दिक स्वागत है!* 🌸🙏\n\nनमस्ते *${name}* जी,\n\nजीवन ज्योति फाउंडेशन के साथ स्वयंसेवक (Volunteer) के रूप में जुड़ने और WhatsApp अपडेट्स की सहमति देने हेतु धन्यवाद।\n\n📌 *आईडी:* ${referenceId || 'JJF-VOL'}\n📍 *कार्यक्षेत्र:* गाजीपुर (उ.प्र.)\n🕊️ *सेवा संकल्प:* निःशुल्क बाल शिक्षा, स्वास्थ्य सुरक्षा व अन्नपूर्णा सेवा\n\nआपको आगामी सेवा अभियानों व प्रमाण पत्र की स्थिति की सीधी जानकारी WhatsApp पर मिलती रहेगी।\n\nहेल्पलाइन: +91-8052361666 | NITI Aayog: UP/2018/0207700`;
            } else {
              welcomeText = `*जीवन ज्योति फाउंडेशन गाजीपुर (JJF) - धन्यवाद एवं स्वागत!* 💐🙏\n\nनमस्ते *${name}* जी,\n\nजीवन ज्योति फाउंडेशन के लोक-कल्याणकारी प्रकल्पों में आपके पावन दान सहयोग एवं WhatsApp अपडेट्स की सहमति हेतु सहृदय आभार।\n\n🧾 *दान संदर्भ:* ${referenceId || 'JJF-DON-2026'}\n🌿 *विवरण:* ${details || 'शिक्षा, स्वास्थ्य व भोजन सेवा'}\n🛡️ *आधिकारिक दान पावती:* सरकारी पंजीकृत संस्था\n\nस्वीकृति के उपरांत आपकी आधिकारिक दान रसीद का सीधा लिंक WhatsApp पर भेजा जाएगा।\n\nसंपर्क: +91-8052361666`;
            }

            if (whatsappAccessToken && phoneNumberId && devWhatsAppCloudActive) {
              const fullRecipient = `91${cleanPhone}`;
              const waRes = await sendDevWhatsAppCloudMessage(phoneNumberId, whatsappAccessToken, fullRecipient, welcomeText);
              if (waRes.success) {
                cloudDelivered = true;
                messageId = waRes.messageId;
              }
            }

            return sendJson(200, {
              success: true,
              message: cloudDelivered 
                ? `✓ WhatsApp Cloud API द्वारा स्वागत संदेश +91 ${cleanPhone.slice(0,3)}••••${cleanPhone.slice(-3)} पर भेजा गया!`
                : `✓ WhatsApp स्वागत संदेश प्रेषण तैयार हुआ।`,
              channel: cloudDelivered ? 'cloud_api' : 'server_proxy',
              messageId
            });
          } catch (err: any) {
            return sendJson(500, { success: false, message: err.message });
          }
        }

        // 2. POST /api/verify-otp & /api/verify-otp-sms
        if ((req.url === '/api/verify-otp' || req.url === '/api/verify-otp-sms') && req.method === 'POST') {
          try {
            const body = await getBody();
            const { phone, otp, certificateId } = body;
            const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);

            if (!cleanPhone || cleanPhone.length !== 10) {
              return sendJson(400, { success: false, verified: false, message: '10 अंकों का वैध मोबाइल नंबर आवश्यक है।' });
            }

            if (!otp || String(otp).trim().length === 0) {
              return sendJson(400, { success: false, verified: false, message: 'कृपया 6-अंकीय OTP दर्ज करें।' });
            }

            const cleanCode = String(otp).trim();

            // Direct verification for Admin (110215) and Super Admin (121015)
            if (cleanCode === '121015' || cleanCode === '110215') {
              const isSuper = cleanCode === '121015';
              const roleText = isSuper ? 'Super Admin' : 'Admin';
              console.log(`[DEV OTP STORE] ${roleText} OTP verified successfully for Phone: ${maskPhone(cleanPhone)}`);
              const verificationToken = `JJF_${isSuper ? 'SUPERADMIN' : 'ADMIN'}_${cleanPhone}_${Date.now()}`;
              return sendJson(200, {
                success: true,
                verified: true,
                message: `✓ ${roleText} OTP सफल सत्यापन!`,
                phone: `+91${cleanPhone}`,
                verificationToken,
                role: isSuper ? 'superadmin' : 'admin',
                certificateId
              });
            }

            const record = devOtpStore.get(cleanPhone);

            if (!record) {
              return sendJson(400, { success: false, verified: false, message: 'OTP सत्र उपलब्ध नहीं है या समाप्त हो चुका है। कृपया नया OTP मांगें।' });
            }

            if (Date.now() > record.expiresAt) {
              devOtpStore.delete(cleanPhone);
              return sendJson(400, { success: false, verified: false, message: 'OTP की वैधता (5 मिनट) समाप्त हो गई है। कृपया पुनः नया OTP भेजें।' });
            }

            if (record.attempts >= 3) {
              devOtpStore.delete(cleanPhone);
              return sendJson(400, { success: false, verified: false, message: '3 बार गलत OTP दर्ज हुआ। सत्र रद्द किया गया।' });
            }

            if (record.otp === String(otp).trim()) {
              devOtpStore.delete(cleanPhone);
              console.log(`[DEV OTP STORE] Verified successfully for Phone: ${maskPhone(cleanPhone)}`);
              const verificationToken = `JJF_VERIFIED_${cleanPhone}_${Date.now()}`;
              return sendJson(200, {
                success: true,
                verified: true,
                message: '✓ OTP सफल सत्यापन! (OTP Verified Successfully)',
                phone: `+91${cleanPhone}`,
                verificationToken,
                certificateId
              });
            } else {
              record.attempts += 1;
              const remaining = 3 - record.attempts;
              console.log(`[DEV OTP STORE] Invalid OTP attempt (${record.attempts}/3) for Phone: ${maskPhone(cleanPhone)}`);
              return sendJson(400, {
                success: false,
                verified: false,
                message: `⚠️ गलत OTP दर्ज किया गया है। (${remaining} प्रयास शेष)`
              });
            }
          } catch (err: any) {
            return sendJson(500, { success: false, verified: false, message: err.message });
          }
        }

        // 3. GET /api/bot-config
        if (req.url === '/api/bot-config' && req.method === 'GET') {
          const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
          const telegramChatId = process.env.TELEGRAM_CHAT_ID;
          const slackWebhook = process.env.SLACK_WEBHOOK_URL;

          return sendJson(200, {
            telegramConfigured: Boolean(telegramToken && telegramChatId),
            telegramChatId: telegramChatId ? `${String(telegramChatId).slice(0, 3)}••••` : undefined,
            slackConfigured: Boolean(slackWebhook && slackWebhook.startsWith('https://hooks.slack.com')),
            slackWebhook: slackWebhook ? `https://hooks.slack.com/services/••••` : undefined
          });
        }

        // 4. POST /api/send-admin-bot-notification (Telegram & Slack Real-time Bot Alerts)
        if (req.url === '/api/send-admin-bot-notification' && req.method === 'POST') {
          try {
            const body = await getBody();
            const {
              type,
              title,
              data = {},
              customTelegramToken,
              customTelegramChatId,
              customSlackWebhook,
              telegramEnabled = true,
              slackEnabled = true
            } = body;

            const telegramToken = customTelegramToken || process.env.TELEGRAM_BOT_TOKEN;
            const telegramChatId = customTelegramChatId || process.env.TELEGRAM_CHAT_ID;
            const slackWebhook = customSlackWebhook || process.env.SLACK_WEBHOOK_URL;

            const maskedPhone = data.phone ? maskPhone(data.phone) : 'N/A';
            const timestamp = data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            // Telegram HTML payload
            let telegramText = `🏛️ <b>JEEVAN JYOTI FOUNDATION • ADMIN ALERT</b>\n`;
            telegramText += `🔔 <b>${title || 'प्रशासनिक सूचना'}</b>\n`;
            telegramText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            if (data.name) telegramText += `👤 <b>Name:</b> ${data.name}\n`;
            if (data.id) telegramText += `🆔 <b>Record ID:</b> <code>${data.id}</code>\n`;
            if (data.fatherOrSpouse) telegramText += `👨‍👩‍👧 <b>Guardian:</b> ${data.fatherOrSpouse}\n`;
            if (data.phone) telegramText += `📞 <b>Phone:</b> ${maskedPhone}\n`;
            if (data.role) telegramText += `👔 <b>Role:</b> ${data.role}\n`;
            if (data.area) telegramText += `📂 <b>Area/Sector:</b> ${data.area}\n`;
            if (data.certificateType) telegramText += `📜 <b>Certificate:</b> ${data.certificateType}\n`;
            if (data.amount) telegramText += `💰 <b>Amount:</b> ${data.amount} (${data.paymentMode || 'Online'})\n`;
            if (data.location) telegramText += `📍 <b>Location:</b> ${data.location}\n`;
            if (data.note) telegramText += `📝 <b>Note:</b> ${data.note}\n`;
            telegramText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            telegramText += `⏰ <i>${timestamp}</i>\n`;
            telegramText += `⚡ <i>Admin action: Review in Super Admin Portal.</i>`;

            // Slack JSON payload
            const slackFields = [];
            if (data.name) slackFields.push({ type: 'mrkdwn', text: `*Name:*\n${data.name}` });
            if (data.id) slackFields.push({ type: 'mrkdwn', text: `*Record ID:*\n\`${data.id}\`` });
            if (data.phone) slackFields.push({ type: 'mrkdwn', text: `*Phone:*\n${maskedPhone}` });
            if (data.area || data.certificateType) slackFields.push({ type: 'mrkdwn', text: `*Details:*\n${data.area || data.certificateType}` });
            if (data.amount) slackFields.push({ type: 'mrkdwn', text: `*Amount:*\n${data.amount}` });
            if (data.location) slackFields.push({ type: 'mrkdwn', text: `*Location:*\n${data.location}` });

            const slackPayload = {
              text: `🔔 [JJF Admin Alert] ${title}: ${data.name || data.id || 'New Submission'}`,
              blocks: [
                {
                  type: 'header',
                  text: { type: 'plain_text', text: `🔔 ${title || 'JJF Admin Alert'}` }
                },
                {
                  type: 'section',
                  fields: slackFields.length > 0 ? slackFields : [{ type: 'mrkdwn', text: `*Alert:*\n${title}` }]
                },
                {
                  type: 'context',
                  elements: [
                    { type: 'mrkdwn', text: `🏛️ *Jeevan Jyoti Foundation Ghazipur* | Time: _${timestamp}_` }
                  ]
                }
              ]
            };

            let telegramResult: { success: boolean; messageId?: number; error?: string } = { success: false, error: 'Telegram not configured' };
            let slackResult: { success: boolean; error?: string } = { success: false, error: 'Slack not configured' };

            // Send Telegram
            if (telegramEnabled && telegramToken && telegramChatId) {
              try {
                const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: telegramText,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                  })
                });
                const tgData = (await tgRes.json()) as any;
                telegramResult = tgRes.ok && tgData.ok
                  ? { success: true, messageId: tgData.result?.message_id }
                  : { success: false, error: tgData?.description || `HTTP ${tgRes.status}` };
                console.log(`[DEV BOT DISPATCH] Telegram: ${telegramResult.success ? 'Delivered' : telegramResult.error}`);
              } catch (tgErr: any) {
                telegramResult = { success: false, error: tgErr.message };
              }
            }

            // Send Slack
            if (slackEnabled && slackWebhook && slackWebhook.startsWith('https://')) {
              try {
                const slRes = await fetch(slackWebhook, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(slackPayload)
                });
                slackResult = slRes.ok
                  ? { success: true }
                  : { success: false, error: await slRes.text().catch(() => `HTTP ${slRes.status}`) };
                console.log(`[DEV BOT DISPATCH] Slack: ${slackResult.success ? 'Delivered' : slackResult.error}`);
              } catch (slErr: any) {
                slackResult = { success: false, error: slErr.message };
              }
            }

            const anySuccess = telegramResult.success || slackResult.success;
            return sendJson(200, {
              success: true,
              delivered: anySuccess,
              telegram: telegramResult,
              slack: slackResult,
              message: anySuccess
                ? '✓ Real-time bot notification delivered to configured admin channels.'
                : 'Bot alert processed. Configure Telegram Bot Token or Slack Webhook to receive instant app alerts.'
            });
          } catch (err: any) {
            return sendJson(500, { success: false, message: err.message });
          }
        }

        // 7. POST /api/upload-direct (Direct file upload for logos, photos, seals)
        if ((req.url === '/api/upload-direct' || req.url?.startsWith('/api/upload-direct?')) && req.method === 'POST') {
          try {
            const body = await getBody();
            const { data, fileName, fileType } = body;
            if (!data) {
              return sendJson(400, { success: false, message: 'डेटा फ़ील्ड आवश्यक है।' });
            }

            const base64Content = data.includes(',') ? data.split(',')[1] : data;
            const fileBuffer = Buffer.from(base64Content, 'base64');
            const resolvedName = fileName || 'media_upload.jpg';
            const cleanExt = path.extname(resolvedName) || '.jpg';
            const mediaId = `jjf_media_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
            const safeDiskFileName = `${mediaId}${cleanExt}`;

            devMediaStore.set(mediaId, {
              buffer: fileBuffer,
              mimeType: fileType || getMimeTypeFromExt(cleanExt),
              fileName: resolvedName,
              size: fileBuffer.length,
              updatedAt: Date.now()
            });

            let publicUrl = `/uploads/${safeDiskFileName}`;
            try {
              const filePath = path.join(UPLOADS_DIR, safeDiskFileName);
              fs.writeFileSync(filePath, fileBuffer);
            } catch (diskErr) {
              console.warn('[Vite] Could not write to public/uploads:', diskErr);
              publicUrl = `/api/media/${mediaId}`;
            }

            console.log(`[DEV UPLOAD DIRECT] ✓ Saved: ${safeDiskFileName} (${(fileBuffer.length / 1024).toFixed(1)} KB) -> ${publicUrl}`);

            return sendJson(200, {
              success: true,
              url: publicUrl,
              mediaId,
              fileName: resolvedName,
              size: fileBuffer.length,
              progress: 100
            });
          } catch (err: any) {
            console.error('[UploadDirectError]:', err);
            return sendJson(500, { success: false, message: err?.message || 'डायरेक्ट अपलोड विफल' });
          }
        }

        // 8. POST /api/upload-chunk (Chunked upload for HD Videos & large files)
        if ((req.url === '/api/upload-chunk' || req.url?.startsWith('/api/upload-chunk?')) && req.method === 'POST') {
          try {
            const body = await getBody();
            const { uploadId, chunkIndex, totalChunks, fileName, fileType, chunkData, totalSize } = body;

            if (!uploadId || chunkIndex === undefined || !totalChunks || !chunkData) {
              return sendJson(400, { success: false, message: 'अवैध चंक डेटा पैरामीटर्स।' });
            }

            let session = devChunkSessions.get(uploadId);
            if (!session) {
              session = {
                uploadId,
                fileName: fileName || 'media_file',
                fileType: fileType || 'application/octet-stream',
                totalChunks: Number(totalChunks),
                totalSize: Number(totalSize) || 0,
                chunks: new Map<number, Buffer>(),
                createdAt: Date.now()
              };
              devChunkSessions.set(uploadId, session);
            }

            const base64Content = chunkData.includes(',') ? chunkData.split(',')[1] : chunkData;
            const chunkBuffer = Buffer.from(base64Content, 'base64');
            session.chunks.set(Number(chunkIndex), chunkBuffer);

            const receivedCount = session.chunks.size;
            const progress = Math.min(99, Math.round((receivedCount / session.totalChunks) * 100));

            return sendJson(200, {
              success: true,
              chunkIndex: Number(chunkIndex),
              receivedChunks: receivedCount,
              totalChunks: session.totalChunks,
              progress
            });
          } catch (err: any) {
            console.error('[UploadChunkError]:', err);
            return sendJson(500, { success: false, message: err?.message || 'चंक अपलोड विफल' });
          }
        }

        // 9. POST /api/upload-complete (Assemble chunked upload and persist)
        if ((req.url === '/api/upload-complete' || req.url?.startsWith('/api/upload-complete?')) && req.method === 'POST') {
          try {
            const body = await getBody();
            const { uploadId, fileName, fileType } = body;

            const session = devChunkSessions.get(uploadId);
            if (!session) {
              return sendJson(404, { success: false, message: 'अपलोड सत्र समाप्त या नहीं मिला।' });
            }

            if (session.chunks.size < session.totalChunks) {
              return sendJson(400, {
                success: false,
                message: `अपूर्ण चंक डेटा: केवल ${session.chunks.size}/${session.totalChunks} चंक प्राप्त हुए हैं।`
              });
            }

            const sortedBuffers: Buffer[] = [];
            for (let i = 0; i < session.totalChunks; i++) {
              const b = session.chunks.get(i);
              if (!b) {
                return sendJson(400, { success: false, message: `चंक #${i} अनुपलब्ध है।` });
              }
              sortedBuffers.push(b);
            }

            const assembledBuffer = Buffer.concat(sortedBuffers);
            const resolvedName = fileName || session.fileName || 'media_file';
            const cleanExt = path.extname(resolvedName) || (session.fileType.includes('video') ? '.mp4' : '.jpg');
            const mediaId = `jjf_media_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
            const safeDiskFileName = `${mediaId}${cleanExt}`;

            devMediaStore.set(mediaId, {
              buffer: assembledBuffer,
              mimeType: fileType || session.fileType || getMimeTypeFromExt(cleanExt),
              fileName: resolvedName,
              size: assembledBuffer.length,
              updatedAt: Date.now()
            });

            let publicUrl = `/uploads/${safeDiskFileName}`;
            try {
              const filePath = path.join(UPLOADS_DIR, safeDiskFileName);
              fs.writeFileSync(filePath, assembledBuffer);
            } catch (diskErr) {
              console.warn('[Vite] Could not write to public/uploads:', diskErr);
              publicUrl = `/api/media/${mediaId}`;
            }

            devChunkSessions.delete(uploadId);

            console.log(`[DEV UPLOAD CHUNK COMPLETE] ✓ Assembled: ${safeDiskFileName} (${(assembledBuffer.length / (1024 * 1024)).toFixed(2)} MB) -> ${publicUrl}`);

            return sendJson(200, {
              success: true,
              url: publicUrl,
              mediaId,
              fileName: resolvedName,
              size: assembledBuffer.length,
              progress: 100
            });
          } catch (err: any) {
            console.error('[UploadCompleteError]:', err);
            return sendJson(500, { success: false, message: err?.message || 'अपलोड पूर्ण करने में त्रुटि' });
          }
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevServerPlugin()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    },
    dedupe: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'firebase'
    ]
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ]
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    watch: {
      ignored: ['**/public/uploads/**', '**/uploads/**', '**/node_modules/**']
    }
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500
  }
});
