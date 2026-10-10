// Official Permanent Certificate Seal Data
// Jeevan Jyoti Foundation - Official Seal & Stamp
// जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - आधिकारिक डिजिटल मुहर

export const DEFAULT_OFFICIAL_SEAL_URL = "";
export const BACKUP_OFFICIAL_SEAL_URL = "";
export const OFFICIAL_SEAL_PNG_URL = "";
export const OFFICIAL_SEAL_JPG_URL = "";

/**
 * High-definition authentic Official Government-Registered SVG Seal Data URL.
 * Vector-crisp, offline-capable, CORS-free, and guaranteed never to load broken external files.
 */
export const OFFICIAL_SEAL_SVG_DATA_URL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="sealGoldGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23FFFDF5"/>
      <stop offset="65%" stop-color="%23FFF8DC"/>
      <stop offset="90%" stop-color="%23FFECB3"/>
      <stop offset="100%" stop-color="%23E6B800"/>
    </radialGradient>
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23D4AF37"/>
      <stop offset="30%" stop-color="%23FFF8DC"/>
      <stop offset="70%" stop-color="%23B8860B"/>
      <stop offset="100%" stop-color="%23D4AF37"/>
    </linearGradient>
    <path id="circleTop" d="M 60,250 A 190,190 0 1,1 440,250" fill="none"/>
    <path id="circleBottom" d="M 440,250 A 190,190 0 0,1 60,250" fill="none"/>
  </defs>

  <!-- Outer Starburst Serrated Edge (36 Points) -->
  <circle cx="250" cy="250" r="242" fill="%238B0000" stroke="%23D4AF37" stroke-width="4"/>
  <circle cx="250" cy="250" r="236" fill="none" stroke="%23FFF8DC" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- Main Embossed Golden Rim -->
  <circle cx="250" cy="250" r="226" fill="url(%23sealGoldGrad)" stroke="%23B8860B" stroke-width="5"/>
  <circle cx="250" cy="250" r="214" fill="%238B0000" stroke="%23D4AF37" stroke-width="2.5"/>

  <!-- Circular Outer Text - Upper: JEEVAN JYOTI FOUNDATION -->
  <text fill="%23FFF8DC" font-family="'Cinzel', 'Georgia', serif" font-weight="900" font-size="24" letter-spacing="4">
    <textPath href="%23circleTop" startOffset="50%" text-anchor="middle">JEEVAN JYOTI FOUNDATION</textPath>
  </text>

  <!-- Circular Outer Text - Lower: GHAZIPUR (U.P.) -->
  <text fill="%23FFF8DC" font-family="'Cinzel', 'Georgia', serif" font-weight="900" font-size="24" letter-spacing="6">
    <textPath href="%23circleBottom" startOffset="50%" text-anchor="middle">GHAZIPUR (U.P.)</textPath>
  </text>

  <!-- Side Decorative Stars -->
  <polygon points="62,250 58,243 65,246 69,240 70,247 77,250 70,253 69,260 65,254 58,257" fill="%23FFD700"/>
  <polygon points="438,250 434,243 441,246 445,240 446,247 453,250 446,253 445,260 441,254 434,257" fill="%23FFD700"/>

  <!-- Inner Golden Circle -->
  <circle cx="250" cy="250" r="148" fill="%23FFFDF5" stroke="%23B8860B" stroke-width="3"/>
  <circle cx="250" cy="250" r="142" fill="none" stroke="%238B0000" stroke-width="1.5" stroke-dasharray="3,3"/>

  <!-- Center Official Seal Emblem (Golden Flame / Jyoti of Hope) -->
  <!-- Radiance Rays -->
  <circle cx="250" cy="235" r="70" fill="none" stroke="%23FFD54F" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
  <!-- Government Registration Header -->
  <text x="250" y="160" font-family="sans-serif" font-weight="900" font-size="16" fill="%238B0000" text-anchor="middle" letter-spacing="2">GOVT. REG. NGO</text>
  <text x="250" y="178" font-family="sans-serif" font-weight="700" font-size="12" fill="%23B8860B" text-anchor="middle" letter-spacing="1">NITI AAYOG DARPAN</text>

  <!-- Sacred Flame / Jyoti -->
  <path d="M 250,195 C 235,225 220,242 225,265 C 229,282 240,292 250,292 C 260,292 271,282 275,265 C 280,242 265,225 250,195 Z" fill="%23FF8F00"/>
  <path d="M 250,215 C 242,235 233,247 237,264 C 240,276 245,282 250,282 C 255,282 260,276 263,264 C 267,247 258,235 250,215 Z" fill="%23FFD54F"/>
  <path d="M 250,240 C 246,252 242,260 245,270 C 247,276 248,278 250,278 C 252,278 253,276 255,270 C 258,260 254,252 250,240 Z" fill="%23FFFDE7"/>

  <!-- Supporting Hands of Seva -->
  <path d="M 210,275 C 218,290 232,298 250,298 C 268,298 282,290 290,275 C 282,284 268,288 250,288 C 232,288 218,284 210,275 Z" fill="%238B0000"/>

  <!-- Footer Verification Badge -->
  <rect x="180" y="306" width="140" height="24" rx="12" fill="%238B0000" stroke="%23D4AF37" stroke-width="1.5"/>
  <text x="250" y="322" font-family="sans-serif" font-weight="900" font-size="12" fill="%23FFF8DC" text-anchor="middle" letter-spacing="1.5">OFFICIAL SEAL</text>
  <text x="250" y="348" font-family="sans-serif" font-weight="800" font-size="11" fill="%23B8860B" text-anchor="middle" letter-spacing="1">ESTD. 2020</text>
</svg>`;

export const OFFICIAL_SEAL_BASE64_DATA_URL = OFFICIAL_SEAL_SVG_DATA_URL;

/**
 * Returns the active official seal URL.
 * If user uploaded a new custom seal, returns it.
 * If deleted or default, returns empty string so RoyalCertificateSeal renders the pure SVG seal.
 */
export function getActiveOfficialSealUrl(customUrl?: string): string {
  if (customUrl && customUrl.trim() && !customUrl.includes('old') && !customUrl.includes('76347e15')) {
    return customUrl.trim();
  }
  if (typeof window !== 'undefined') {
    try {
      const isDeleted = localStorage.getItem('jjf_seal_permanently_deleted') === 'true';
      if (isDeleted) return '';

      const stored = localStorage.getItem('jjf_custom_certificate_seal');
      if (stored && stored.trim() && !stored.includes('old') && !stored.includes('76347e15')) {
        return stored.trim();
      }
    } catch {}
  }
  return '';
}
