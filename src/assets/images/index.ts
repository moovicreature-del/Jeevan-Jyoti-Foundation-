// Base asset paths for Jeevan Jyoti Foundation visual assets
import { OFFICIAL_SEAL_BASE64_DATA_URL, DEFAULT_OFFICIAL_SEAL_URL } from '../../data/officialSealData';

export const JJF_LOGO_PNG = '';
export const JJF_LOGO_JPG = '';
export const JJF_LOGO_SVG = '';
export const JJF_LOGO_PATH = '';
export const JJF_SIGNATURE_OVERLAY_PATH = '/signature-shailesh-overlay.png';
export const JJF_OFFICIAL_SEAL_PATH = DEFAULT_OFFICIAL_SEAL_URL;

// Authentic Official Certificate Seal & Stamp
export const JJF_STAMP_SVG = OFFICIAL_SEAL_BASE64_DATA_URL;

export const JJF_SIGNATURE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80"><path d="M25 45 C45 15, 55 58, 75 28 C90 12, 100 60, 120 35 C135 20, 145 52, 165 32 C180 18, 195 55, 225 25" fill="none" stroke="%231a365d" stroke-width="2.8" stroke-linecap="round"/><text x="120" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231a365d" text-anchor="middle">Shailesh Pradhan</text></svg>`;

export default {
  logo: '',
  stamp: JJF_STAMP_SVG,
  officialSeal: JJF_OFFICIAL_SEAL_PATH,
  signature: JJF_SIGNATURE_SVG,
  signatureOverlay: JJF_SIGNATURE_OVERLAY_PATH
};
