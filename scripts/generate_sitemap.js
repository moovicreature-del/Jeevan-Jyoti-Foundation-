import fs from 'fs';
import path from 'path';

const publicDir = path.resolve(process.cwd(), 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const robotsPath = path.join(publicDir, 'robots.txt');

export function generateSitemapXml(baseUrl = 'https://jeevanjyotifoundationghazipur.org', extraCertIds = []) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/verify', priority: '0.9', changefreq: 'weekly' },
    { path: '/donate', priority: '0.9', changefreq: 'monthly' },
    { path: '/volunteer', priority: '0.8', changefreq: 'monthly' },
    { path: '/gallery', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}${page.path ? `${page.path}` : '/'}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  if (Array.isArray(extraCertIds)) {
    for (const certId of extraCertIds) {
      if (certId) {
        xml += `  <url>\n`;
        xml += `    <loc>${cleanBase}/verify?id=${encodeURIComponent(certId)}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
      }
    }
  }

  xml += `</urlset>`;
  return xml;
}

export function generateRobotsTxt(baseUrl = 'https://jeevanjyotifoundationghazipur.org') {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /superadmin\n\nSitemap: ${cleanBase}/sitemap.xml\n`;
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapContent = generateSitemapXml();
fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');

const robotsContent = generateRobotsTxt();
fs.writeFileSync(robotsPath, robotsContent, 'utf-8');

console.log('Sitemap and robots.txt generated successfully.');
