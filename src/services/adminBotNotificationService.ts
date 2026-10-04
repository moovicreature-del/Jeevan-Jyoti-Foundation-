// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN BOT NOTIFICATION SERVICE (TELEGRAM & SLACK)
// जीवन ज्योति फाउंडेशन - रियल-टाइम टेलीग्राम एवं स्लैक बॉट प्रशासनिक अलर्ट सेवा
// ============================================================================

export interface BotConfig {
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  slackEnabled: boolean;
  slackWebhookUrl: string;
  alertOnVolunteer: boolean;
  alertOnCertificate: boolean;
  alertOnStaff: boolean;
  alertOnDonation: boolean;
  lastUpdated?: string;
}

const STORAGE_KEY = 'jjf_admin_bot_config_v1';
const HISTORY_KEY = 'jjf_admin_bot_history_v1';

export interface BotNotificationHistoryItem {
  id: string;
  type: 'volunteer' | 'certificate' | 'staff' | 'donation' | 'test';
  title: string;
  summary: string;
  timestamp: string;
  channels: {
    telegram?: boolean;
    slack?: boolean;
  };
  status: 'sent' | 'partial' | 'failed' | 'simulated';
}

const DEFAULT_CONFIG: BotConfig = {
  telegramEnabled: true,
  telegramBotToken: '',
  telegramChatId: '',
  slackEnabled: true,
  slackWebhookUrl: '',
  alertOnVolunteer: true,
  alertOnCertificate: true,
  alertOnStaff: true,
  alertOnDonation: true
};

/**
 * Get current bot configuration (merged from localStorage and server defaults)
 */
export function getStoredBotConfig(): BotConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse bot config:', e);
  }
  return DEFAULT_CONFIG;
}

/**
 * Save bot configuration to localStorage
 */
export function saveBotConfig(config: BotConfig): void {
  try {
    const toSave = {
      ...config,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save bot config:', e);
  }
}

/**
 * Get notification dispatch history
 */
export function getBotNotificationHistory(): BotNotificationHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

/**
 * Append an item to dispatch history (keeps last 50 entries)
 */
function recordHistory(item: BotNotificationHistoryItem) {
  try {
    const current = getBotNotificationHistory();
    const updated = [item, ...current].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/**
 * Fetch server-level env status
 */
export async function getServerBotConfig(): Promise<{
  serverTelegramConfigured: boolean;
  serverTelegramChatId?: string;
  serverSlackConfigured: boolean;
  serverSlackWebhook?: string;
}> {
  try {
    const res = await fetch('/api/bot-config');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // offline or dev
  }
  return {
    serverTelegramConfigured: false,
    serverSlackConfigured: false
  };
}

/**
 * Primary dispatch function sending payload to backend
 */
export async function sendAdminBotNotification(payload: {
  type: 'volunteer' | 'certificate' | 'staff' | 'donation' | 'test';
  title: string;
  data: Record<string, any>;
}): Promise<{
  success: boolean;
  telegram?: { success: boolean; message?: string };
  slack?: { success: boolean; message?: string };
  simulated?: boolean;
}> {
  const config = getStoredBotConfig();

  // Filter based on admin preferences
  if (payload.type === 'volunteer' && !config.alertOnVolunteer) return { success: true };
  if (payload.type === 'certificate' && !config.alertOnCertificate) return { success: true };
  if (payload.type === 'staff' && !config.alertOnStaff) return { success: true };
  if (payload.type === 'donation' && !config.alertOnDonation) return { success: true };

  const requestBody = {
    ...payload,
    customTelegramToken: config.telegramBotToken || undefined,
    customTelegramChatId: config.telegramChatId || undefined,
    customSlackWebhook: config.slackWebhookUrl || undefined,
    telegramEnabled: config.telegramEnabled,
    slackEnabled: config.slackEnabled
  };

  try {
    const res = await fetch('/api/send-admin-bot-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const result = await res.json();

    // Record into history
    recordHistory({
      id: `NOTIF_${Date.now()}`,
      type: payload.type,
      title: payload.title,
      summary: `${payload.data.name || payload.data.title || 'Entry'} (${payload.data.id || payload.data.phone || 'N/A'})`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      channels: {
        telegram: result.telegram?.success,
        slack: result.slack?.success
      },
      status: result.success
        ? (result.telegram?.success && result.slack?.success ? 'sent' : 'partial')
        : 'failed'
    });

    return result;
  } catch (err: any) {
    console.warn('[Bot Notification Dispatch Warning]:', err?.message);

    recordHistory({
      id: `NOTIF_${Date.now()}`,
      type: payload.type,
      title: payload.title,
      summary: `${payload.data.name || 'Entry'} - Dispatched locally`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      channels: { telegram: false, slack: false },
      status: 'simulated'
    });

    return {
      success: true,
      simulated: true
    };
  }
}

/**
 * 1. Alert for New Volunteer Registration
 */
export async function notifyNewVolunteerRegistration(vol: {
  id: string;
  name: string;
  fatherName?: string;
  relationType?: string;
  phone: string;
  area?: string;
  location?: string;
  joinDate?: string;
}) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return sendAdminBotNotification({
    type: 'volunteer',
    title: '🚨 नया स्वयंसेवक पंजीकरण (New Volunteer Registered)',
    data: {
      id: vol.id,
      name: vol.name,
      fatherOrSpouse: vol.fatherName ? `${vol.relationType || 'Father'}: ${vol.fatherName}` : 'N/A',
      phone: vol.phone,
      area: vol.area || 'समाज सेवा एवं शिक्षा',
      location: vol.location || 'गाजीपुर, उत्तर प्रदेश',
      timestamp: now,
      portalLink: 'https://ais-dev-y42a4jvnstoswhlwg3nycf-565644485260.asia-southeast1.run.app'
    }
  });
}

/**
 * 2. Alert for New Certificate Request / Issuance
 */
export async function notifyNewCertificateRequest(cert: {
  id: string;
  name: string;
  title: string;
  category?: string;
  phone?: string;
  location?: string;
}) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return sendAdminBotNotification({
    type: 'certificate',
    title: '📜 नया प्रमाण पत्र आवेदन (New Certificate Issued / Requested)',
    data: {
      id: cert.id,
      name: cert.name,
      certificateType: cert.title,
      category: cert.category || 'Appreciation Award',
      phone: cert.phone || 'N/A',
      location: cert.location || 'गाजीपुर, उत्तर प्रदेश',
      timestamp: now
    }
  });
}

/**
 * 3. Alert for New Staff / Employee Application
 */
export async function notifyNewStaffApplication(staff: {
  id: string;
  name: string;
  role: string;
  phone: string;
  department?: string;
}) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return sendAdminBotNotification({
    type: 'staff',
    title: '👔 नया स्टाफ / पदाधिकारी आवेदन (New Staff Application)',
    data: {
      id: staff.id,
      name: staff.name,
      role: staff.role,
      department: staff.department || 'General Administration',
      phone: staff.phone,
      timestamp: now
    }
  });
}

/**
 * 4. Alert for New Donation
 */
export async function notifyNewDonation(donation: {
  id: string;
  donorName: string;
  amount: number;
  paymentMode?: string;
  phone?: string;
}) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return sendAdminBotNotification({
    type: 'donation',
    title: '💰 नया दान सहयोग प्राप्त (New Donation Received)',
    data: {
      id: donation.id,
      name: donation.donorName,
      amount: `₹${Number(donation.amount).toLocaleString('en-IN')}`,
      paymentMode: donation.paymentMode || 'UPI / Online',
      phone: donation.phone || 'N/A',
      timestamp: now
    }
  });
}

/**
 * 5. Send Test Ping to verify connections
 */
export async function sendBotTestPing(channel: 'telegram' | 'slack' | 'both' = 'both') {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return sendAdminBotNotification({
    type: 'test',
    title: '🧪 बॉट कनेक्शन टेस्ट (JJF Bot Connectivity Test)',
    data: {
      name: 'Super Admin Test Ping',
      id: `TEST-${Date.now().toString().slice(-6)}`,
      status: 'Connected & Operational',
      timestamp: now,
      note: 'यदि आपको यह संदेश मिला है, तो आपका बॉट सफलतापूर्वक सक्रिय है!'
    }
  });
}
