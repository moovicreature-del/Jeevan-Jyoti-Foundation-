// ============================================================================
// JEEVAN JYOTI FOUNDATION - MOTIVATIONAL QUOTES & POSTER STUDIO COMPONENT
// जीवन ज्योति फाउंडेशन - प्रेरक सुविचार एवं फोटो पोस्टर जनरेटर स्टूडियो
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Upload,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Check,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Square,
  Monitor,
  User,
  Quote,
  Sliders,
  Palette,
  Eye,
  Camera,
  Heart,
  Facebook,
  Award,
  Crown,
  MapPin,
  Briefcase,
  Link2,
  X,
  ExternalLink,
  CheckCheck,
  BookOpen,
  Search,
  ListOrdered,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RoyalFourCorners, RoyalCenterFlourish } from '../common/RoyalCertificateBorder';

// Dedicated Official WhatsApp Icon SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.95 7.44 8.68 7.5 8.46 7.74C8.24 7.97 7.62 8.56 7.62 9.75C7.62 10.95 8.5 12.1 8.62 12.26C8.75 12.43 10.32 14.86 12.74 15.9C13.32 16.15 13.77 16.3 14.12 16.41C14.7 16.6 15.22 16.57 15.64 16.51C16.1 16.44 17.07 15.92 17.27 15.34C17.47 14.77 17.47 14.28 17.41 14.18C17.35 14.07 17.19 14.01 16.95 13.89C16.71 13.77 15.53 13.19 15.31 13.11C15.09 13.03 14.93 12.99 14.77 13.23C14.61 13.47 14.15 14.01 14.01 14.17C13.87 14.33 13.73 14.35 13.49 14.23C13.25 14.11 12.48 13.86 11.57 13.05C10.86 12.42 10.38 11.64 10.24 11.4C10.1 11.16 10.23 11.03 10.35 10.91C10.46 10.8 10.6 10.62 10.72 10.48C10.84 10.34 10.88 10.24 10.96 10.08C11.04 9.92 11 9.78 10.94 9.66C10.88 9.54 10.42 8.41 10.22 7.94C10.03 7.48 9.84 7.54 9.69 7.53C9.55 7.52 9.39 7.52 9.23 7.52L9.11 7.44Z" />
  </svg>
);

// Dedicated Ornate Royal Corner Filigree SVG Component
const RoyalCornerFlourish: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#d97706'
}) => (
  <svg
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Primary Royal Bracket with Curved Flare */}
    <path
      d="M3 46V10C3 6.134 6.134 3 10 3H46"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Middle Inset Accent Arc */}
    <path
      d="M9 34C9 20.1929 20.1929 9 34 9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    {/* Inner Filigree Loop */}
    <path
      d="M15 24C15 19.0294 19.0294 15 24 15"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeDasharray="2 2"
      strokeOpacity="0.6"
    />
    {/* Central Royal Diamond Emblem (✦) */}
    <polygon
      points="23,16 26,22 32,25 26,28 23,34 20,28 14,25 20,22"
      fill={color}
    />
    {/* Terminal Golden Finials */}
    <circle cx="3" cy="46" r="2.8" fill={color} />
    <circle cx="46" cy="3" r="2.8" fill={color} />
  </svg>
);
import {
  QUOTE_CATEGORIES,
  MOTIVATIONAL_QUOTES,
  POSTER_THEMES,
  POSTER_RATIO_CONFIGS,
  QuoteCategoryKey,
  MotivationalQuote,
  PosterThemePreset,
  PosterRatioConfig
} from '../../data/motivationalQuotesData';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { BrandLogo } from '../common/BrandLogo';
import { RoyalCertificateSeal } from '../common/RoyalCertificateSeal';

// Official Certificate Seal SVG (Exact replica of RoyalCertificateSeal from official certificates with ribbon tails & caption)
const JJF_OFFICIAL_SEAL_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg viewBox="0 0 200 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="sealTopPath" d="M 28 100 A 72 72 0 0 1 172 100" fill="none" />
    <path id="sealBottomPath" d="M 172 100 A 72 72 0 0 1 28 100" fill="none" />
    <filter id="sealShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#8B0000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Hanging Ribbon Tails -->
  <g>
    <path d="M 52 165 L 26 230 L 46 220 L 66 230 L 76 165 Z" fill="#8B0000" stroke="#D4AF37" stroke-width="1.8" />
    <path d="M 148 165 L 128 230 L 148 220 L 168 230 L 140 165 Z" fill="#A52A2A" stroke="#D4AF37" stroke-width="1.8" />
    <!-- Join Band -->
    <rect x="68" y="160" width="64" height="15" rx="4" fill="#D4AF37" stroke="#8B0000" stroke-width="1.2" />
    <text x="100" y="171" font-family="sans-serif" font-size="8.5" font-weight="900" fill="#8B0000" text-anchor="middle" letter-spacing="0.5">GOVT. REG.</text>
  </g>

  <!-- Outer Beaded / Cogged Ring -->
  <circle cx="100" cy="100" r="94" fill="#FFFDF5" stroke="#D4AF37" stroke-width="3" filter="url(#sealShadow)"/>
  <circle cx="100" cy="100" r="88" fill="none" stroke="#8B0000" stroke-width="2.5" />
  <circle cx="100" cy="100" r="83" fill="none" stroke="#D4AF37" stroke-width="2" stroke-dasharray="4 3" />
  <circle cx="100" cy="100" r="58" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="2 2" />

  <!-- Arched Organization Name -->
  <text font-family="'Cinzel', serif, sans-serif" font-size="13" font-weight="900" fill="#8B0000" letter-spacing="2" text-anchor="middle">
    <textPath href="#sealTopPath" startOffset="50%">JEEVAN JYOTI FOUNDATION</textPath>
  </text>

  <!-- Arched Reg / Ghazipur -->
  <text font-family="sans-serif" font-size="11.5" font-weight="900" fill="#8B0000" letter-spacing="1.5" text-anchor="middle">
    <textPath href="#sealBottomPath" startOffset="50%">★ GHAZIPUR • REG. 1827 ★</textPath>
  </text>

  <!-- Center Circular Medallion with JJF Logo -->
  <circle cx="100" cy="100" r="34" fill="#FFFDE7" stroke="#D4AF37" stroke-width="2" />
  <!-- Center Yogi Silhouette -->
  <g transform="translate(74, 74) scale(0.104)">
    <circle cx="250" cy="220" r="210" fill="#FFDE00" stroke="#2E1E6B" stroke-width="6"/>
    <path d="M 105 295 A 150 150 0 1 1 395 295" fill="none" stroke="#FA7815" stroke-width="28"/>
    <circle cx="250" cy="152" r="22" fill="#2E1E6B"/>
    <path d="M 243 174 C 243 178, 230 188, 204 204 C 180 218, 160 248, 154 274 C 152 284, 158 292, 172 286 C 184 280, 198 266, 206 252 C 212 242, 216 232, 218 220 C 218 232, 218 248, 216 268 C 208 278, 182 290, 165 302 C 157 308, 163 318, 180 320 C 202 322, 235 316, 250 316 C 265 316, 298 322, 320 320 C 337 318, 343 308, 335 302 C 318 290, 292 278, 284 268 C 282 248, 282 232, 282 220 C 284 232, 288 242, 294 252 C 302 266, 316 280, 328 286 C 342 292, 348 284, 346 274 C 340 248, 320 218, 296 204 C 270 188, 257 178, 257 174 Z" fill="#2E1E6B"/>
    <path d="M 250 495 C 246 435, 208 390, 138 344 C 90 338, 40 354, 24 358 C 36 378, 82 432, 148 464 C 190 484, 228 492, 250 495 Z" fill="#008844"/>
    <path d="M 250 495 C 254 435, 292 390, 362 344 C 410 338, 460 354, 476 358 C 464 378, 418 432, 352 464 C 310 484, 272 492, 250 495 Z" fill="#008844"/>
  </g>

  <!-- Red Ribbon Badge across bottom center -->
  <rect x="30" y="112" width="140" height="23" rx="11.5" fill="#8B0000" stroke="#D4AF37" stroke-width="1.8" />
  <text x="100" y="128" font-family="'Cinzel', sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">★ OFFICIAL SEAL ★</text>

  <!-- Top-Right Verified Green Shield Checkmark -->
  <circle cx="166" cy="36" r="14" fill="#059669" stroke="#FFFFFF" stroke-width="2.5" />
  <path d="M 160 36 L 164 40 L 173 31" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Bottom Certificate Caption: ऑफिशियल मुहर / प्रमाणित -->
  <text x="100" y="249" font-family="'Noto Sans Devanagari', 'Mukta', sans-serif" font-size="9" font-weight="900" fill="#8B0000" text-anchor="middle" letter-spacing="1">ऑफिशियल मुहर / प्रमाणित</text>
</svg>
`)}`;

interface Props {
  onClose?: () => void;
  isModal?: boolean;
}

// Sample avatars if user doesn't immediately have an image
const SAMPLE_AVATARS = [
  {
    name: 'श्री शैलेश प्रधान',
    title: 'संस्थापक एवं अध्यक्ष, JJF',
    city: 'ग़ाज़ीपुर',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'अमित कुमार सिंह',
    title: 'युवा समाजसेवी',
    city: 'ग़ाज़ीपुर',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'डॉ. अनिता वर्मा',
    title: 'शिक्षा प्रेरक',
    city: 'वाराणसी / ग़ाज़ीपुर',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  }
];

export const MotivationalQuotesPosterStudio: React.FC<Props> = ({ onClose, isModal = false }) => {
  // 1. Category state
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategoryKey>('educational');

  // Filtered quotes for active category
  const activeQuotes = MOTIVATIONAL_QUOTES.filter((q) => q.category === selectedCategory);

  // 2. Active quote state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const activeQuote = activeQuotes[currentQuoteIndex] || activeQuotes[0] || MOTIVATIONAL_QUOTES[0];

  // Editable quote content
  const [quoteText, setQuoteText] = useState<string>(activeQuote.quoteHi);
  const [quoteAuthor, setQuoteAuthor] = useState<string>(activeQuote.author);

  // 3. User Personalization & Photo state
  const [userName, setUserName] = useState<string>('श्री शैलेश प्रधान जी');
  const [userTitle, setUserTitle] = useState<string>('समाजसेवी • संस्थापक JJF');
  const [userCity, setUserCity] = useState<string>('ग़ाज़ीपुर (उ.प्र.)');
  const [userPhoto, setUserPhoto] = useState<string>(SAMPLE_AVATARS[0].url);
  const [frameShape, setFrameShape] = useState<'circle' | 'rounded' | 'shield'>('circle');

  // 4. Platform Ratio state (Square / 9:16 Status / 4:5 Portrait / 16:9 Landscape)
  const [selectedRatioId, setSelectedRatioId] = useState<PosterRatioConfig['id']>('square-post');
  const activeRatio = POSTER_RATIO_CONFIGS.find((r) => r.id === selectedRatioId) || POSTER_RATIO_CONFIGS[0];

  // 5. Theme & Background state
  const defaultTheme =
    POSTER_THEMES.find((t) => t.category === selectedCategory) ||
    POSTER_THEMES.find((t) => t.id === 'theme-royal-maroon') ||
    POSTER_THEMES[0];
  const [selectedThemeId, setSelectedThemeId] = useState<string>(defaultTheme.id);
  const activeTheme = POSTER_THEMES.find((t) => t.id === selectedThemeId) || defaultTheme;

  // Custom visual toggles
  const [includeBranding, setIncludeBranding] = useState<boolean>(true);
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'compact'>('normal');
  const [overlayDarkness, setOverlayDarkness] = useState<number>(0); // percentage (0 for clean light themes)

  // Photo Watermark on Quote Section state
  const [includePhotoWatermark, setIncludePhotoWatermark] = useState<boolean>(true);
  const [watermarkPhotoOpacity, setWatermarkPhotoOpacity] = useState<number>(20); // 8% - 45%

  // UI state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);
  const [generatedPosterUri, setGeneratedPosterUri] = useState<string | null>(null);
  const [generatedPosterBlob, setGeneratedPosterBlob] = useState<Blob | null>(null);
  const [generatedPosterFileName, setGeneratedPosterFileName] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showAllQuotesModal, setShowAllQuotesModal] = useState<boolean>(false);
  const [quoteSearchTerm, setQuoteSearchTerm] = useState<string>('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const posterPreviewRef = useRef<HTMLDivElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quick Select quote by index (0 to 19)
  const handleSelectQuoteByIndex = (idx: number) => {
    if (idx >= 0 && idx < activeQuotes.length) {
      setCurrentQuoteIndex(idx);
      setQuoteText(activeQuotes[idx].quoteHi);
      setQuoteAuthor(activeQuotes[idx].author);
      toast.success(`सुविचार #${idx + 1} चुना गया!`, { icon: '✨' });
    }
  };

  // Whenever category changes, auto-select first quote and update theme to matching category theme
  const handleSelectCategory = (catKey: QuoteCategoryKey) => {
    setSelectedCategory(catKey);
    setCurrentQuoteIndex(0);
    setQuoteSearchTerm('');
    const catQuotes = MOTIVATIONAL_QUOTES.filter((q) => q.category === catKey);
    const newQuote = catQuotes[0] || MOTIVATIONAL_QUOTES[0];
    setQuoteText(newQuote.quoteHi);
    setQuoteAuthor(newQuote.author);

    // Auto-update theme matching the category
    const matchingTheme = POSTER_THEMES.find((t) => t.category === catKey);
    if (matchingTheme) {
      setSelectedThemeId(matchingTheme.id);
    }
  };

  // Quote navigation
  const handleNextQuote = () => {
    const nextIdx = (currentQuoteIndex + 1) % activeQuotes.length;
    setCurrentQuoteIndex(nextIdx);
    setQuoteText(activeQuotes[nextIdx].quoteHi);
    setQuoteAuthor(activeQuotes[nextIdx].author);
  };

  const handlePrevQuote = () => {
    const prevIdx = (currentQuoteIndex - 1 + activeQuotes.length) % activeQuotes.length;
    setCurrentQuoteIndex(prevIdx);
    setQuoteText(activeQuotes[prevIdx].quoteHi);
    setQuoteAuthor(activeQuotes[prevIdx].author);
  };

  const handleRandomQuote = () => {
    const randIdx = Math.floor(Math.random() * activeQuotes.length);
    setCurrentQuoteIndex(randIdx);
    setQuoteText(activeQuotes[randIdx].quoteHi);
    setQuoteAuthor(activeQuotes[randIdx].author);
    toast.success('नया प्रेरक विचार चुना गया!', { icon: '✨' });
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल फोटो (JPG, PNG) अपलोड करें');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('फोटो का आकार 10MB से कम होना चाहिए');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUserPhoto(event.target.result);
        toast.success('आपकी फोटो सफलतापूर्वक जोड़ी गई!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Copy Quote Text
  const handleCopyQuote = () => {
    const fullText = `"${quoteText}"\n— ${quoteAuthor}\n\nप्रेरणा: जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर (उ.प्र.)\n🌐 ${window.location.origin}`;
    navigator.clipboard.writeText(fullText);
    setCopiedQuote(true);
    toast.success('सुविचार कॉपी हो गया! अब आप इसे कहीं भी शेयर कर सकते हैं।');
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  // High-Resolution Direct HTML5 Canvas Poster Renderer
  const renderPosterCanvas = async (): Promise<{
    canvas: HTMLCanvasElement;
    blob: Blob;
    dataUrl: string;
    file: File;
  }> => {
    const canvas = hiddenCanvasRef.current || document.createElement('canvas');
    const width = activeRatio.width;
    const height = activeRatio.height;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context could not be created');
    }

    // 1. Draw Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (activeTheme.id === 'theme-edu-wisdom') {
      grad.addColorStop(0, '#fffdf0');
      grad.addColorStop(0.35, '#fef9c3');
      grad.addColorStop(0.7, '#fef08a');
      grad.addColorStop(1, '#fffbeb');
    } else if (activeTheme.id === 'theme-career-gold') {
      grad.addColorStop(0, '#f0fdf4');
      grad.addColorStop(0.35, '#dcfce7');
      grad.addColorStop(0.7, '#bbf7d0');
      grad.addColorStop(1, '#ecfdf5');
    } else if (activeTheme.id === 'theme-devo-saffron') {
      grad.addColorStop(0, '#fff7ed');
      grad.addColorStop(0.35, '#ffedd5');
      grad.addColorStop(0.7, '#fed7aa');
      grad.addColorStop(1, '#fef3c7');
    } else if (activeTheme.id === 'theme-humanity-emerald') {
      grad.addColorStop(0, '#f0f9ff');
      grad.addColorStop(0.35, '#e0f2fe');
      grad.addColorStop(0.7, '#bae6fd');
      grad.addColorStop(1, '#ecfeff');
    } else if (activeTheme.id === 'theme-family-terracotta') {
      grad.addColorStop(0, '#fff1f2');
      grad.addColorStop(0.35, '#ffe4e6');
      grad.addColorStop(0.7, '#fce7f3');
      grad.addColorStop(1, '#fff7ed');
    } else if (activeTheme.id === 'theme-friends-teal') {
      grad.addColorStop(0, '#ecfeff');
      grad.addColorStop(0.4, '#cffafe');
      grad.addColorStop(0.75, '#e0f2fe');
      grad.addColorStop(1, '#f0fdf4');
    } else if (activeTheme.id === 'theme-life-serene') {
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(0.4, '#f1f5f9');
      grad.addColorStop(0.75, '#e2e8f0');
      grad.addColorStop(1, '#ffffff');
    } else if (activeTheme.id === 'theme-patriot-tricolor') {
      grad.addColorStop(0, '#fff7ed');
      grad.addColorStop(0.4, '#ffffff');
      grad.addColorStop(0.75, '#f0fdf4');
      grad.addColorStop(1, '#ecfdf5');
    } else if (activeTheme.id === 'theme-royal-maroon') {
      grad.addColorStop(0, '#fffdf5');
      grad.addColorStop(0.35, '#fef9c3');
      grad.addColorStop(0.7, '#fef3c7');
      grad.addColorStop(1, '#ffffff');
    } else {
      // Classic Dark fallback
      grad.addColorStop(0, '#450a0a');
      grad.addColorStop(0.4, '#7f1d1d');
      grad.addColorStop(0.75, '#831843');
      grad.addColorStop(1, '#3b0764');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Vignette & Overlay Darkness (only on dark themes or if manually set)
    if (!activeTheme.isLight && overlayDarkness > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${overlayDarkness / 100})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Radial Golden/Accent Aura Center Glow
    const auraRad = Math.min(width, height) * 0.55;
    const auraGrad = ctx.createRadialGradient(width / 2, height * 0.42, 10, width / 2, height * 0.42, auraRad);
    if (activeTheme.isLight) {
      auraGrad.addColorStop(0, `${activeTheme.accentColor}25`);
      auraGrad.addColorStop(0.6, `${activeTheme.accentColor}08`);
      auraGrad.addColorStop(1, 'transparent');
    } else {
      auraGrad.addColorStop(0, `${activeTheme.accentColor}33`);
      auraGrad.addColorStop(0.6, `${activeTheme.accentColor}0a`);
      auraGrad.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. OFFICIAL DOCUMENT ROYAL MULTI-TIER BORDER FRAMING
    // Consistent with official foundation certificates: Deep Crimson (#8B0000), Dark Crimson (#700000) & Royal Gold (#D4AF37)
    const inset = Math.round(width * 0.028);
    const midInset = inset + Math.round(width * 0.009);
    const innerInset = midInset + Math.round(width * 0.007);

    // Tier 1: Outer Royal Deep Crimson Primary Border (Proportional to official certificates)
    const crimsonBandWidth = Math.round(width * 0.013);
    ctx.save();
    ctx.strokeStyle = '#8B0000'; // Official Royal Deep Crimson
    ctx.lineWidth = crimsonBandWidth;
    ctx.strokeRect(crimsonBandWidth / 2 + 2, crimsonBandWidth / 2 + 2, width - crimsonBandWidth - 4, height - crimsonBandWidth - 4);

    // Outermost & Innermost Gold Hairlines along Crimson Border
    ctx.strokeStyle = '#D4AF37'; // Official Royal Gold
    ctx.lineWidth = 2.5;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);
    ctx.strokeRect(crimsonBandWidth + 2.5, crimsonBandWidth + 2.5, width - (crimsonBandWidth + 2.5) * 2, height - (crimsonBandWidth + 2.5) * 2);

    // Deep Shadow Layer for official certificate relief
    ctx.strokeStyle = 'rgba(112, 0, 0, 0.45)'; // #700000
    ctx.lineWidth = 1.5;
    ctx.strokeRect(crimsonBandWidth + 4.5, crimsonBandWidth + 4.5, width - (crimsonBandWidth + 4.5) * 2, height - (crimsonBandWidth + 4.5) * 2);

    // Tier 2: Double Inset Royal Gold Frame (Matches official certificates)
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.4;
    ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(inset + 4, inset + 4, width - (inset + 4) * 2, height - (inset + 4) * 2);

    // Tier 3: Guilloché Dashed Security Accent Frame
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([8, 5]);
    ctx.strokeRect(innerInset, innerInset, width - innerInset * 2, height - innerInset * 2);
    ctx.setLineDash([]); // Reset line dash
    ctx.restore();

    // High-Precision Official Baroque Royal Corner Ornaments (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
    const drawRoyalCorner = (cx: number, cy: number, flipX: number, flipY: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(flipX, flipY);

      const goldColor = '#D4AF37';
      const crimsonColor = '#8B0000';
      const cSize = Math.round(width * 0.054);

      // Outer Corner L-Frame
      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(cSize, 2);
      ctx.lineTo(cSize, 5);
      ctx.lineTo(5, 5);
      ctx.lineTo(5, cSize);
      ctx.lineTo(2, cSize);
      ctx.closePath();
      ctx.fill();

      // Secondary Thin Parallel Frame
      ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
      ctx.beginPath();
      ctx.moveTo(9, 9);
      ctx.lineTo(cSize * 0.86, 9);
      ctx.lineTo(cSize * 0.86, 11);
      ctx.lineTo(11, 11);
      ctx.lineTo(11, cSize * 0.86);
      ctx.lineTo(9, cSize * 0.86);
      ctx.closePath();
      ctx.fill();

      // Baroque Scrollwork & Filigree Curved Leaf
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cSize * 0.42, cSize * 0.42, cSize * 0.28, Math.PI, 1.5 * Math.PI, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cSize * 0.42, cSize * 0.42, cSize * 0.16, 0.5 * Math.PI, Math.PI, false);
      ctx.stroke();

      // Central Royal Rosette / Diamond
      const dX = cSize * 0.36;
      const dY = cSize * 0.36;
      const dRad = Math.round(width * 0.007);
      ctx.fillStyle = crimsonColor;
      ctx.beginPath();
      ctx.moveTo(dX, dY - dRad * 1.4);
      ctx.lineTo(dX + dRad, dY);
      ctx.lineTo(dX, dY + dRad * 1.4);
      ctx.lineTo(dX - dRad, dY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Decorative Finials
      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.arc(cSize, 3.5, 3, 0, Math.PI * 2);
      ctx.arc(3.5, cSize, 3, 0, Math.PI * 2);
      ctx.arc(dX, dY, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    drawRoyalCorner(inset, inset, 1, 1); // TL
    drawRoyalCorner(width - inset, inset, -1, 1); // TR
    drawRoyalCorner(inset, height - inset, 1, -1); // BL
    drawRoyalCorner(width - inset, height - inset, -1, -1); // BR

    // Royal Top Center Crest Embellishment (Matching official certificate flourish)
    ctx.save();
    ctx.fillStyle = '#D4AF37';
    ctx.strokeStyle = '#D4AF37';
    const topFlourishY = inset;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(width / 2 - Math.round(width * 0.11), topFlourishY);
    ctx.lineTo(width / 2 - Math.round(width * 0.03), topFlourishY);
    ctx.moveTo(width / 2 + Math.round(width * 0.03), topFlourishY);
    ctx.lineTo(width / 2 + Math.round(width * 0.11), topFlourishY);
    ctx.stroke();

    // Center Diamond & Lotus Motif
    const crRad = Math.round(width * 0.009);
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.moveTo(width / 2, topFlourishY - crRad * 1.3);
    ctx.lineTo(width / 2 + crRad, topFlourishY);
    ctx.lineTo(width / 2, topFlourishY + crRad * 1.3);
    ctx.lineTo(width / 2 - crRad, topFlourishY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(width / 2 - Math.round(width * 0.11), topFlourishY, 2.5, 0, Math.PI * 2);
    ctx.arc(width / 2 + Math.round(width * 0.11), topFlourishY, 2.5, 0, Math.PI * 2);
    ctx.arc(width / 2, topFlourishY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Royal Bottom Center Flourish Embellishment (Matching official certificate flourish)
    ctx.save();
    ctx.fillStyle = '#D4AF37';
    ctx.strokeStyle = '#D4AF37';
    const btmFlourishY = height - inset;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(width / 2 - Math.round(width * 0.09), btmFlourishY);
    ctx.lineTo(width / 2 - Math.round(width * 0.025), btmFlourishY);
    ctx.moveTo(width / 2 + Math.round(width * 0.025), btmFlourishY);
    ctx.lineTo(width / 2 + Math.round(width * 0.09), btmFlourishY);
    ctx.stroke();

    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.moveTo(width / 2, btmFlourishY - crRad);
    ctx.lineTo(width / 2 + crRad * 0.9, btmFlourishY);
    ctx.lineTo(width / 2, btmFlourishY + crRad);
    ctx.lineTo(width / 2 - crRad * 0.9, btmFlourishY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(width / 2 - Math.round(width * 0.09), btmFlourishY, 2.5, 0, Math.PI * 2);
    ctx.arc(width / 2 + Math.round(width * 0.09), btmFlourishY, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. ATTRACTIVE TOP BORDER STRIP: Organization Logo & Name Occupying Full Vertical Space
    // ("Poster me ngo ka logo lagaye, ngo ka naam poster ke top pr full vertical space me rhe, anumodit vibhag na likha rhe")
    let topContentOffset = inset;
    if (includeBranding) {
      const topStripH = Math.round(height * (activeRatio.id === 'whatsapp-status' ? 0.056 : 0.062));
      const topStripX = inset + 4;
      const topStripY = inset + 4;
      const topStripW = width - (inset + 4) * 2;
      topContentOffset = topStripY + topStripH + Math.round(height * 0.012);

      ctx.save();
      // Rich royal gradient background for top border strip
      const stripGrad = ctx.createLinearGradient(topStripX, topStripY, topStripX + topStripW, topStripY);
      if (activeTheme.isLight) {
        stripGrad.addColorStop(0, '#78350f');
        stripGrad.addColorStop(0.25, '#8B0000');
        stripGrad.addColorStop(0.75, '#700000');
        stripGrad.addColorStop(1, '#451a03');
      } else {
        stripGrad.addColorStop(0, '#020617');
        stripGrad.addColorStop(0.3, '#1e1b4b');
        stripGrad.addColorStop(0.7, '#3b0764');
        stripGrad.addColorStop(1, '#020617');
      }
      ctx.fillStyle = stripGrad;

      // Rounded banner inside royal frame
      const rCorner = Math.round(topStripH * 0.16);
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(topStripX, topStripY, topStripW, topStripH, rCorner);
      } else {
        ctx.rect(topStripX, topStripY, topStripW, topStripH);
      }
      ctx.closePath();
      ctx.fill();

      // Golden Border & Hairline Glow on Top Strip
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Left: JJF Foundation Official Vector Logo Medallion
      const stripLogoSize = Math.round(topStripH * 0.82);
      const stripLogoX = topStripX + Math.round(width * 0.014);
      const stripLogoY = topStripY + (topStripH - stripLogoSize) / 2;

      // White circle backing with gold rim
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(stripLogoX + stripLogoSize / 2, stripLogoY + stripLogoSize / 2, stripLogoSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Draw custom logo inside medallion only if custom logo is active
      let customLogoUrl = '';
      try {
        customLogoUrl = localStorage.getItem('jjf_custom_logo') || '';
      } catch {
        // Ignore
      }
      if (customLogoUrl) {
        const stripLogoImg = new Image();
        stripLogoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          stripLogoImg.onload = () => resolve();
          stripLogoImg.onerror = () => resolve();
          stripLogoImg.src = customLogoUrl;
        });
        if (stripLogoImg.complete && stripLogoImg.naturalWidth > 0) {
          ctx.drawImage(stripLogoImg, stripLogoX + 2, stripLogoY + 2, stripLogoSize - 4, stripLogoSize - 4);
        }
      }

      // Name occupying full vertical space at top (अनुमोदित विभाग नहीं लिखा है)
      const stripTextLeft = stripLogoX + stripLogoSize + Math.round(width * 0.014);
      ctx.textAlign = 'left';

      // Primary NGO Name - commanding full vertical presence
      ctx.fillStyle = '#fef08a';
      ctx.font = `900 ${Math.round(topStripH * 0.44)}px 'Noto Sans Devanagari', sans-serif`;
      ctx.fillText('जीवन ज्योति फाउंडेशन', stripTextLeft, topStripY + topStripH * 0.46);

      // Subtitle - Location & English Org Name filling the lower vertical space
      ctx.fillStyle = '#fde047';
      ctx.font = `bold ${Math.round(topStripH * 0.25)}px 'Noto Sans Devanagari', sans-serif`;
      ctx.fillText('जनपद ग़ाज़ीपुर, उत्तर प्रदेश • JEEVAN JYOTI FOUNDATION', stripTextLeft, topStripY + topStripH * 0.78);

      // Right: Dignified Government Registered NGO Tag
      const stripRightX = topStripX + topStripW - Math.round(width * 0.016);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fef9c3';
      ctx.font = `800 ${Math.round(topStripH * 0.26)}px sans-serif`;
      ctx.fillText('★ Govt. Regd. NGO ★', stripRightX, topStripY + topStripH * 0.58);

      ctx.restore();
    }

    // 5. Category Indicator Badge (Clean unboxed text)
    const catMeta = QUOTE_CATEGORIES.find((c) => c.key === selectedCategory) || QUOTE_CATEGORIES[0];
    const catBadgeY = topContentOffset + Math.round(height * 0.024);
    ctx.textAlign = 'center';
    ctx.fillStyle = activeTheme.accentColor;
    ctx.font = `800 ${Math.round(width * 0.018)}px sans-serif`;
    ctx.fillText(`✦ ${catMeta.icon} ${catMeta.labelHi} ✦`, width / 2, catBadgeY);

    // Footer Card sits cleanly inside the bottom royal border (Bottom details strip removed)
    const footerCardHeight = Math.round(height * (activeRatio.id === 'whatsapp-status' ? 0.125 : 0.145));
    const footerCardY = height - inset - footerCardHeight - Math.round(height * 0.014);
    const footerCardWidth = width - inset * 2 - Math.round(width * 0.04);
    const footerCardX = (width - footerCardWidth) / 2;

    // 6. PHOTO WATERMARK ON THE QUOTES PART (User photo as translucent watermark behind quote text)
    if (includePhotoWatermark && userPhoto) {
      const wmImg = new Image();
      wmImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        wmImg.onload = () => resolve();
        wmImg.onerror = () => resolve();
        wmImg.src = userPhoto;
      });

      if (wmImg.complete && wmImg.naturalWidth > 0) {
        ctx.save();
        const qCenterX = width / 2;
        // Position watermark photo in upper-middle area so the portrait face is fully visible
        const availableMiddleTop = catBadgeY + Math.round(height * 0.025);
        const availableMiddleBottom = footerCardY - Math.round(height * 0.025);
        const availableMiddleHeight = availableMiddleBottom - availableMiddleTop;
        const qCenterY = availableMiddleTop + Math.round(availableMiddleHeight * 0.35);
        const wmRadius = Math.min(width * 0.35, availableMiddleHeight * 0.27);

        // Circular clipping
        ctx.beginPath();
        ctx.arc(qCenterX, qCenterY, wmRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Watermark Opacity
        ctx.globalAlpha = watermarkPhotoOpacity / 100;

        // Cover draw
        const imgAspect = wmImg.naturalWidth / wmImg.naturalHeight;
        let dw = wmRadius * 2.2;
        let dh = dw / imgAspect;
        if (dh < wmRadius * 2.2) {
          dh = wmRadius * 2.2;
          dw = dh * imgAspect;
        }

        ctx.drawImage(wmImg, qCenterX - dw / 2, qCenterY - dh / 2, dw, dh);

        // Feathered blend wash to softly blend edges into poster background
        const fadeGrad = ctx.createRadialGradient(qCenterX, qCenterY, wmRadius * 0.38, qCenterX, qCenterY, wmRadius);
        fadeGrad.addColorStop(0, 'transparent');
        fadeGrad.addColorStop(0.75, activeTheme.isLight ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)');
        fadeGrad.addColorStop(1, activeTheme.isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.92)');
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(qCenterX - wmRadius, qCenterY - wmRadius, wmRadius * 2, wmRadius * 2);

        ctx.restore();
      }
    }

    // 7. Measure & Wrap Quote Text for Balanced Typographic Geometry
    const quoteFontSize =
      fontSizeScale === 'large'
        ? Math.round(width * 0.034)
        : fontSizeScale === 'compact'
        ? Math.round(width * 0.025)
        : Math.round(width * 0.029);

    ctx.font = `bold ${quoteFontSize}px 'Noto Sans Devanagari', 'Mukta', sans-serif`;

    // Available vertical area between category badge and bottom royal card
    const availableTop = catBadgeY + Math.round(height * 0.025);
    const availableBottom = footerCardY - Math.round(height * 0.025);
    const availableHeight = availableBottom - availableTop;

    // Plaque dimensions: snug width leaving margin for poster border
    const plaqueWidth = Math.min(width * 0.88, width - inset * 2 - Math.round(width * 0.04));
    const plaqueX = (width - plaqueWidth) / 2;

    // Leave space on sides inside plaque for 3D golden quotation marks
    const maxQuoteWidth = plaqueWidth - Math.round(quoteFontSize * 4.2);
    const words = quoteText.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxQuoteWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    if (lines.length === 0) lines.push(quoteText);

    const lineHeight = Math.round(quoteFontSize * 1.54);
    const textBlockHeight = (lines.length - 1) * lineHeight + quoteFontSize;

    // Precise Plaque Height Calculation: ONLY as much height as needed for quote and author!
    // No excessive empty space underneath ("फ़्लोटिंग 3D उभार पट्टिका उतना ही रखे जितने में विचार और लेखक लिखा हो")
    const hasAuthor = Boolean(quoteAuthor.trim());
    const plaquePadY = Math.round(quoteFontSize * 0.95);
    const authorSectionHeight = hasAuthor ? Math.round(quoteFontSize * 2.3) : 0;
    const neededPlaqueHeight = plaquePadY * 2 + textBlockHeight + authorSectionHeight;
    const plaqueHeight = Math.min(availableHeight * 0.82, neededPlaqueHeight);

    // Adjust plaque position so it does NOT cover the watermark portrait face!
    // ("और इसको ऐसे एडजस्ट करें की वाटर मार्क फोटो ना ढके")
    let plaqueY: number;
    if (includePhotoWatermark && userPhoto) {
      // Place in lower area below watermark face, right above footer card with breathing margin
      const minPlaqueY = availableTop + Math.round(availableHeight * 0.54);
      const desiredPlaqueY = availableBottom - plaqueHeight - Math.round(height * 0.018);
      plaqueY = Math.max(minPlaqueY, desiredPlaqueY);
      if (plaqueY + plaqueHeight > availableBottom) {
        plaqueY = availableBottom - plaqueHeight - Math.round(height * 0.008);
      }
      if (plaqueY < availableTop) {
        plaqueY = availableTop;
      }
    } else {
      // If no photo watermark, center plaque vertically in middle space
      plaqueY = availableTop + (availableHeight - plaqueHeight) / 2;
    }

    // 8. RENDER ROYAL FLOATING "UBHAAR" PARCHMENT PLAQUE (3D Relief & Elevation)
    ctx.save();
    // 3D Ubhaar Ambient Shadow (Lifts the quote plaque off the background)
    ctx.shadowColor = activeTheme.isLight ? 'rgba(180, 83, 9, 0.22)' : 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = Math.round(width * 0.032);
    ctx.shadowOffsetY = Math.round(width * 0.012);

    // Royal Frosted Silk Plaque with gentle translucent glassmorphism
    const plaqueGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX + plaqueWidth, plaqueY + plaqueHeight);
    if (activeTheme.isLight) {
      plaqueGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      plaqueGrad.addColorStop(0.5, 'rgba(255, 253, 245, 0.88)');
      plaqueGrad.addColorStop(1, 'rgba(255, 255, 255, 0.92)');
    } else {
      plaqueGrad.addColorStop(0, 'rgba(15, 23, 42, 0.90)');
      plaqueGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.86)');
      plaqueGrad.addColorStop(1, 'rgba(15, 23, 42, 0.90)');
    }
    ctx.fillStyle = plaqueGrad;
    ctx.beginPath();
    ctx.roundRect(plaqueX, plaqueY, plaqueWidth, plaqueHeight, [22]);
    ctx.fill();
    ctx.restore();

    // Outer Royal Golden Border on Plaque
    ctx.strokeStyle = activeTheme.isLight ? '#d97706' : '#fbbf24';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(plaqueX, plaqueY, plaqueWidth, plaqueHeight, [22]);
    ctx.stroke();

    // Inner Hairline Golden Inset Frame on Plaque
    ctx.strokeStyle = activeTheme.isLight ? 'rgba(217, 119, 6, 0.35)' : 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(plaqueX + 5, plaqueY + 5, plaqueWidth - 10, plaqueHeight - 10, [18]);
    ctx.stroke();

    // 4 Corner Royal Golden Diamonds on Quote Plaque
    ctx.fillStyle = activeTheme.isLight ? '#d97706' : '#fbbf24';
    const drawPlaqueDiamond = (px: number, py: number) => {
      ctx.beginPath();
      ctx.moveTo(px, py - 4);
      ctx.lineTo(px + 4, py);
      ctx.lineTo(px, py + 4);
      ctx.lineTo(px - 4, py);
      ctx.closePath();
      ctx.fill();
    };
    drawPlaqueDiamond(plaqueX + 15, plaqueY + 15);
    drawPlaqueDiamond(plaqueX + plaqueWidth - 15, plaqueY + 15);
    drawPlaqueDiamond(plaqueX + 15, plaqueY + plaqueHeight - 15);
    drawPlaqueDiamond(plaqueX + plaqueWidth - 15, plaqueY + plaqueHeight - 15);

    // 9. Main Quote Text with 3D Depth & Relief ("Ubhaar")
    const textStartY = plaqueY + plaquePadY + Math.round(quoteFontSize * 0.85);

    ctx.save();
    // 3D Embossed Relief Shadow (Ubhaar Effect)
    ctx.shadowColor = activeTheme.isLight ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = Math.round(quoteFontSize * 0.22);
    ctx.shadowOffsetY = Math.round(quoteFontSize * 0.07);

    ctx.fillStyle = activeTheme.quoteColor || (activeTheme.isLight ? '#0f172a' : '#ffffff');
    ctx.font = `bold ${quoteFontSize}px 'Noto Sans Devanagari', 'Mukta', sans-serif`;
    ctx.textAlign = 'center';

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], width / 2, textStartY + i * lineHeight);
    }
    ctx.restore();

    // 10. 3D GOLDEN QUOTATION MARKS ADJUSTED PROPERLY AT START AND END OF QUOTE LINES
    // ("3D गोल्डन कोट्स मार्क को विचार के लाइन के शुरू और अंत में सही तरीके से एडजस्ट करें")
    const line1Width = ctx.measureText(lines[0]).width;
    const line1StartX = width / 2 - line1Width / 2;

    const lastLineWidth = ctx.measureText(lines[lines.length - 1]).width;
    const lastLineEndX = width / 2 + lastLineWidth / 2;
    const lastLineY = textStartY + (lines.length - 1) * lineHeight;

    const quoteMarkSize = Math.round(quoteFontSize * 1.15);
    ctx.save();
    ctx.font = `900 ${quoteMarkSize}px serif`;

    // 3D Rich Gold Gradient generator for metallic embossing
    const create3DGoldGrad = (gx: number, gy: number) => {
      const grad = ctx.createLinearGradient(gx, gy - quoteMarkSize, gx, gy);
      grad.addColorStop(0, '#fef08a'); // luminous highlight
      grad.addColorStop(0.3, '#f59e0b'); // vibrant amber gold
      grad.addColorStop(0.7, '#d97706'); // warm burnished gold
      grad.addColorStop(1, '#78350f'); // deep bronze base shadow
      return grad;
    };

    // Opening 3D Quote Mark (❝) right at the beginning of the first line (never overlapping words!)
    const openQuoteGap = Math.round(quoteFontSize * 0.28);
    const openQuoteX = line1StartX - openQuoteGap;
    const openQuoteY = textStartY;

    ctx.textAlign = 'right';
    ctx.shadowColor = 'rgba(180, 83, 9, 0.7)';
    ctx.shadowBlur = Math.round(quoteFontSize * 0.22);
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = create3DGoldGrad(openQuoteX, openQuoteY);
    ctx.fillText('❝', openQuoteX, openQuoteY);

    // Metallic fine edge stroke for 3D bevel definition
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.strokeText('❝', openQuoteX, openQuoteY);

    // Closing 3D Quote Mark (❞) right at the end of the last line (never overlapping words!)
    const closeQuoteGap = Math.round(quoteFontSize * 0.28);
    const closeQuoteX = lastLineEndX + closeQuoteGap;
    const closeQuoteY = lastLineY;

    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(180, 83, 9, 0.7)';
    ctx.shadowBlur = Math.round(quoteFontSize * 0.22);
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = create3DGoldGrad(closeQuoteX, closeQuoteY);
    ctx.fillText('❞', closeQuoteX, closeQuoteY);

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.strokeText('❞', closeQuoteX, closeQuoteY);

    ctx.restore();

    // 11. Author Attribution with Royal Golden Wings & ⚜ Fleur-de-lis Inscription
    if (hasAuthor) {
      const sepY = lastLineY + Math.round(quoteFontSize * 0.95);

      // Royal Golden Divider Wings
      const wingLength = Math.round(width * 0.13);
      ctx.strokeStyle = activeTheme.isLight ? 'rgba(217, 119, 6, 0.55)' : 'rgba(251, 191, 36, 0.55)';
      ctx.lineWidth = 1.3;

      // Left wing
      ctx.beginPath();
      ctx.moveTo(width / 2 - wingLength, sepY);
      ctx.lineTo(width / 2 - Math.round(width * 0.035), sepY);
      ctx.stroke();

      // Center gold diamond
      ctx.fillStyle = activeTheme.isLight ? '#d97706' : '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(width / 2, sepY - 3.5);
      ctx.lineTo(width / 2 + 3.5, sepY);
      ctx.lineTo(width / 2, sepY + 3.5);
      ctx.lineTo(width / 2 - 3.5, sepY);
      ctx.closePath();
      ctx.fill();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(width / 2 + Math.round(width * 0.035), sepY);
      ctx.lineTo(width / 2 + wingLength, sepY);
      ctx.stroke();

      // Author text
      const authorTextY = sepY + Math.round(quoteFontSize * 0.92);
      ctx.fillStyle = activeTheme.authorColor || (activeTheme.isLight ? '#b45309' : '#93c5fd');
      ctx.font = `italic bold ${Math.round(quoteFontSize * 0.72)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`⚜  ${quoteAuthor}  ⚜`, width / 2, authorTextY);
    }

    // 12. BOTTOM USER PROFILE ROYAL PLAQUE ("niche white wala barer ko bhi royal look de")
    // Luxurious Royal Plaque Background with 3D Depth & Amber Rim Glow
    ctx.save();
    ctx.shadowColor = activeTheme.isLight ? 'rgba(180, 83, 9, 0.24)' : 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = Math.round(width * 0.032);
    ctx.shadowOffsetY = Math.round(width * 0.012);

    const cardGrad = ctx.createLinearGradient(footerCardX, footerCardY, footerCardX + footerCardWidth, footerCardY + footerCardHeight);
    if (activeTheme.isLight) {
      cardGrad.addColorStop(0, '#ffffff');
      cardGrad.addColorStop(0.35, '#fffdf5');
      cardGrad.addColorStop(0.7, '#fef9ee');
      cardGrad.addColorStop(1, '#ffffff');
    } else {
      cardGrad.addColorStop(0, '#0f172a');
      cardGrad.addColorStop(0.5, '#1e293b');
      cardGrad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = cardGrad;
    ctx.beginPath();
    ctx.roundRect(footerCardX, footerCardY, footerCardWidth, footerCardHeight, [20]);
    ctx.fill();
    ctx.restore();

    // Outer Royal Golden Border on Bottom Bar
    ctx.strokeStyle = activeTheme.isLight ? '#d97706' : '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(footerCardX, footerCardY, footerCardWidth, footerCardHeight, [20]);
    ctx.stroke();

    // Inner Hairline Golden Inset Frame
    ctx.strokeStyle = activeTheme.isLight ? 'rgba(217, 119, 6, 0.35)' : 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(footerCardX + 5, footerCardY + 5, footerCardWidth - 10, footerCardHeight - 10, [16]);
    ctx.stroke();

    // 4 Corner Royal Diamonds on the Bottom Bar
    ctx.fillStyle = activeTheme.isLight ? '#d97706' : '#fbbf24';
    const drawCardDiamond = (px: number, py: number) => {
      ctx.beginPath();
      ctx.moveTo(px, py - 3.5);
      ctx.lineTo(px + 3.5, py);
      ctx.lineTo(px, py + 3.5);
      ctx.lineTo(px - 3.5, py);
      ctx.closePath();
      ctx.fill();
    };
    drawCardDiamond(footerCardX + 12, footerCardY + 12);
    drawCardDiamond(footerCardX + footerCardWidth - 12, footerCardY + 12);
    drawCardDiamond(footerCardX + 12, footerCardY + footerCardHeight - 12);
    drawCardDiamond(footerCardX + footerCardWidth - 12, footerCardY + footerCardHeight - 12);

    // Royal Golden Medallion Frame for User Photo
    const photoSize = Math.round(footerCardHeight * 0.72);
    const photoX = footerCardX + Math.round(footerCardHeight * 0.22);
    const photoY = footerCardY + (footerCardHeight - photoSize) / 2;

    const userImg = new Image();
    userImg.crossOrigin = 'anonymous';

    await new Promise<void>((resolve) => {
      userImg.onload = () => resolve();
      userImg.onerror = () => resolve();
      userImg.src = userPhoto;
    });

    ctx.save();
    ctx.beginPath();
    if (frameShape === 'circle') {
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    } else {
      ctx.roundRect(photoX, photoY, photoSize, photoSize, [14]);
    }
    ctx.closePath();
    ctx.clip();

    if (userImg.complete && userImg.naturalWidth > 0) {
      ctx.drawImage(userImg, photoX, photoY, photoSize, photoSize);
    } else {
      ctx.fillStyle = activeTheme.badgeBg;
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.fillStyle = activeTheme.isLight ? '#0f172a' : '#ffffff';
      ctx.font = `bold ${Math.round(photoSize * 0.4)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(userName.charAt(0) || 'J', photoX + photoSize / 2, photoY + photoSize * 0.65);
    }
    ctx.restore();

    // Multi-tier Royal Golden Bezel around Photo
    ctx.save();
    ctx.strokeStyle = activeTheme.isLight ? '#d97706' : '#fbbf24';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    if (frameShape === 'circle') {
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 2, 0, Math.PI * 2);
    } else {
      ctx.roundRect(photoX - 2, photoY - 2, photoSize + 4, photoSize + 4, [16]);
    }
    ctx.stroke();

    // Inner fine gold bezel
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (frameShape === 'circle') {
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 - 1, 0, Math.PI * 2);
    } else {
      ctx.roundRect(photoX + 1, photoY + 1, photoSize - 2, photoSize - 2, [13]);
    }
    ctx.stroke();

    // Crown Medallion Accent atop photo
    ctx.font = `${Math.round(photoSize * 0.28)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👑', photoX + photoSize - 4, photoY + 4);
    ctx.restore();

    // User Information Inscription (Right of Photo)
    const textLeft = photoX + photoSize + Math.round(footerCardHeight * 0.22);
    ctx.textAlign = 'left';

    // User Name with Royal Crown/Star Accent
    ctx.fillStyle = activeTheme.isLight ? (activeTheme.cardTextColor || '#0f172a') : '#ffffff';
    ctx.font = `900 ${Math.round(width * 0.025)}px sans-serif`;
    ctx.fillText(`${userName}`, textLeft, photoY + photoSize * 0.32);

    // Star accent next to name
    ctx.fillStyle = '#d97706';
    ctx.font = `bold ${Math.round(width * 0.016)}px sans-serif`;
    const nameWidth = ctx.measureText(userName).width;
    ctx.fillText(' ✦', textLeft + nameWidth, photoY + photoSize * 0.32);

    // User Title on Royal Ribbon Badge
    if (userTitle) {
      const badgeY = photoY + photoSize * 0.44;
      const badgeHeight = Math.round(photoSize * 0.26);
      ctx.font = `800 ${Math.round(width * 0.015)}px sans-serif`;
      const titleWidth = ctx.measureText(`⚜ ${userTitle}`).width;
      const badgePad = 10;

      // Golden Ribbon Pill
      ctx.fillStyle = activeTheme.isLight ? 'rgba(245, 158, 11, 0.18)' : 'rgba(251, 191, 36, 0.2)';
      ctx.strokeStyle = activeTheme.isLight ? 'rgba(217, 119, 6, 0.45)' : 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(textLeft, badgeY, titleWidth + badgePad * 2, badgeHeight, [Math.round(badgeHeight / 2)]);
      ctx.fill();
      ctx.stroke();

      // Ribbon Text
      ctx.fillStyle = activeTheme.isLight ? '#92400e' : '#fef08a';
      ctx.fillText(`⚜ ${userTitle}`, textLeft + badgePad, badgeY + badgeHeight * 0.72);
    }

    // City / Location with Golden Pin
    if (userCity) {
      ctx.fillStyle = activeTheme.isLight ? (activeTheme.cardSubTextColor || '#64748b') : '#cbd5e1';
      ctx.font = `600 ${Math.round(width * 0.013)}px sans-serif`;
      ctx.fillText(`📍 ${userCity}`, textLeft, photoY + photoSize * 0.94);
    }

    // Foundation Official Certificate Seal Stamp on Right of Card
    // ("सुविचार वाले पार्ट में पोस्टर पर ऑफिशियल सील सेम वही रखे जो बाकी सर्टिफिकेट पर पट्टी वाली रहती है उससे थोड़ा भी अलग ना हो")
    if (includeWatermark) {
      const sealW = Math.round(footerCardHeight * 0.72);
      const sealH = Math.round(sealW * 1.28); // incorporates ribbon tails & official caption
      const sealX = footerCardX + footerCardWidth - sealW - Math.round(footerCardWidth * 0.024);
      const sealY = footerCardY + (footerCardHeight - sealH) / 2 - 2;

      // Vertical subtle golden separator divider
      ctx.strokeStyle = activeTheme.isLight ? 'rgba(217, 119, 6, 0.35)' : 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sealX - Math.round(footerCardWidth * 0.018), footerCardY + footerCardHeight * 0.16);
      ctx.lineTo(sealX - Math.round(footerCardWidth * 0.018), footerCardY + footerCardHeight * 0.84);
      ctx.stroke();

      // Load & draw official certificate seal (exact replica from official certificates)
      const sealImg = new Image();
      sealImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        sealImg.onload = () => resolve();
        sealImg.onerror = () => resolve();
        sealImg.src = JJF_OFFICIAL_SEAL_SVG;
      });

      if (sealImg.complete && sealImg.naturalWidth > 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(139, 0, 0, 0.30)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.drawImage(sealImg, sealX, sealY, sealW, sealH);
        ctx.restore();
      }
    }

    // Bottom border strip was moved to the top (Bottom details removed as requested)

    // Convert canvas to image Data URL & Blob
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas blob generation failed'))), 'image/png', 1.0);
    });

    const safeName = (userName || 'JJF').replace(/\s+/g, '_');
    const safeCat = selectedCategory;
    const fileName = `JJF_Motivational_Poster_${safeCat}_${safeName}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    setGeneratedPosterUri(dataUrl);
    setGeneratedPosterBlob(blob);
    setGeneratedPosterFileName(fileName);

    return { canvas, blob, dataUrl, file };
  };

  // 1. Share to WhatsApp using generated poster image URI and social sharing intent
  const handleShareToWhatsApp = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('WhatsApp के लिए HD पोस्टर तैयार हो रहा है...');

    try {
      const { blob, dataUrl, file } = await renderPosterCanvas();

      const shareText = `🌟 *दैनिक प्रेरक सुविचार (जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर)* 🌟\n\n"${quoteText}"\n\n— *${quoteAuthor}*\n\nसादर: ${userName}${userTitle ? ` (${userTitle})` : ''}\n📍 ${userCity}\n\n🎨 अपना फोटो पोस्टर बनाएं:\n${window.location.origin}`;

      // Check if Web Share API with image file is supported (Android Chrome, iOS Safari, etc.)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'दैनिक प्रेरक सुविचार पोस्टर',
            text: shareText,
            files: [file]
          });
          toast.dismiss(toastId);
          toast.success('WhatsApp पर पोस्टर सफलतापूर्वक साझा किया गया!', { icon: '🟢' });
          return;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            toast.dismiss(toastId);
            return;
          }
          console.warn('Native share error, falling back to WhatsApp intent:', shareErr);
        }
      }

      // Fallback for desktop & browsers without direct file Web Share:
      // 1. Copy image to clipboard so user can paste immediately (Ctrl+V) in WhatsApp Web
      let copiedToClipboard = false;
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          copiedToClipboard = true;
        } catch (clipErr) {
          console.warn('Clipboard write failed:', clipErr);
        }
      }

      // 2. Automatically download image file so user has the generated poster image ready
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = file.name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // 3. Open WhatsApp intent with text and quote details
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');

      toast.dismiss(toastId);
      toast.success(
        copiedToClipboard
          ? 'WhatsApp खुल रहा है! HD पोस्टर क्लिपबोर्ड में कॉपी और डाउनलोड हो गया है, इसे चैट में (Ctrl+V) पेस्ट करें!'
          : 'WhatsApp खुल रहा है! HD पोस्टर डाउनलोड हो गया है, इसे अपनी चैट या स्टेटस में जोड़ें।',
        { duration: 6000, icon: '🟢' }
      );
    } catch (err: any) {
      console.error('Error sharing to WhatsApp:', err);
      toast.dismiss(toastId);
      toast.error('WhatsApp पर साझा करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Share to Facebook using generated poster image URI and social sharing intent
  const handleShareToFacebook = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('Facebook के लिए HD पोस्टर तैयार हो रहा है...');

    try {
      const { blob, dataUrl, file } = await renderPosterCanvas();

      const shareQuote = `"${quoteText}" — ${quoteAuthor} (सादर: ${userName}, ${userCity}) • जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर`;

      // Check if Web Share API with image file is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'प्रेरक सुविचार पोस्टर | जीवन ज्योति फाउंडेशन',
            text: shareQuote,
            files: [file]
          });
          toast.dismiss(toastId);
          toast.success('Facebook पर पोस्टर सफलतापूर्वक साझा किया गया!', { icon: '🔵' });
          return;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            toast.dismiss(toastId);
            return;
          }
          console.warn('Native share error, falling back to Facebook intent:', shareErr);
        }
      }

      // Fallback: Copy image to clipboard + Download HD poster + Open Facebook Sharer Intent
      let copiedToClipboard = false;
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          copiedToClipboard = true;
        } catch (clipErr) {
          console.warn('Clipboard write failed:', clipErr);
        }
      }

      // Download HD Poster so user has the file
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = file.name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Open Facebook Sharer dialog intent
      const shareUrl = encodeURIComponent(window.location.origin);
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(shareQuote)}`;
      window.open(fbUrl, '_blank', 'width=640,height=580');

      toast.dismiss(toastId);
      toast.success(
        copiedToClipboard
          ? 'Facebook शेयर विंडो खुल गई है! HD पोस्टर क्लिपबोर्ड में कॉपी और डाउनलोड हो गया है, इसे पोस्ट में पेस्ट/अटैच करें!'
          : 'Facebook शेयर विंडो खुल गई है! HD पोस्टर डाउनलोड हो गया है, इसे पोस्ट में आसानी से अपलोड करें।',
        { duration: 6000, icon: '🔵' }
      );
    } catch (err: any) {
      console.error('Error sharing to Facebook:', err);
      toast.dismiss(toastId);
      toast.error('Facebook पर साझा करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  // High-Resolution Direct HTML5 Canvas Poster Downloader
  const handleDownloadPoster = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('उच्च गुणवत्ता वाला HD पोस्टर तैयार हो रहा है...');

    try {
      const { dataUrl, file } = await renderPosterCanvas();

      const link = document.createElement('a');
      link.download = file.name;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss(toastId);
      toast.success('🎉 1080p Ultra HD पोस्टर सफलतापूर्वक डाउनलोड हो गया! इसे WhatsApp और Facebook पर शेयर करें।', {
        duration: 5000
      });
    } catch (err: any) {
      console.error('Error rendering poster canvas:', err);
      toast.dismiss(toastId);
      toast.error('पोस्टर डाउनलोड करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Image Blob Directly to Clipboard
  const handleCopyImageToClipboard = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('इमेज तैयार की जा रही है...');
    try {
      const { blob } = await renderPosterCanvas();
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast.dismiss(toastId);
        toast.success('📋 HD पोस्टर इमेज क्लिपबोर्ड में कॉपी हो गई! इसे सीधे WhatsApp Web, Facebook या Word में पेस्ट (Ctrl+V) करें।');
      } else {
        toast.dismiss(toastId);
        toast.error('आपके ब्राउज़र में डायरेक्ट इमेज क्लिपबोर्ड सपोर्ट नहीं है। कृपया डाउनलोड बटन का उपयोग करें।');
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('इमेज कॉपी करने में असमर्थ।');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Data URI to Clipboard
  const handleCopyImageUri = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('इमेज URI तैयार हो रही है...');
    try {
      const { dataUrl } = await renderPosterCanvas();
      await navigator.clipboard.writeText(dataUrl);
      toast.dismiss(toastId);
      toast.success('🔗 पोस्टर इमेज डेटा URI (Base64 Data URL) क्लिपबोर्ड में कॉपी हो गया!');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('इमेज URI कॉपी करने में असमर्थ।');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="quotes-poster" className="py-12 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>डिजिटल सेवा एवं सामाजिक प्रेरणा मंच</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-serif tracking-tight">
              प्रेरक सुविचार एवं फोटो पोस्टर जनरेटर स्टूडियो
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              अपनी फोटो और नाम के साथ फेसबुक, व्हाट्सएप स्टेटस एवं DP के लिए उच्च गुणवत्ता वाले सुंदर प्रेरक पोस्टर्स तुरंत बनाएं और शेयर करें।
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRandomQuote}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer shadow-sm"
              title="कोई भी नया प्रेरक विचार चुनें"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>यादृच्छिक सुविचार</span>
            </button>
            <button
              type="button"
              onClick={handleCopyQuote}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer shadow-sm"
              title="सुविचार टेक्स्ट कॉपी करें"
            >
              {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQuote ? 'कॉपी हुआ' : 'टेक्स्ट कॉपी'}</span>
            </button>
          </div>
        </div>

        {/* 1. CATEGORY SELECTOR TABS ("Quotes tab click krne pr usme section select krne ka option ho") */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>सुविचार श्रेणी चुनें (Select Quotes Category):</span>
            </span>
            <span className="text-[11px] text-amber-400">कुल 8 विषय उपलब्ध</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
            {QUOTE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleSelectCategory(cat.key)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.labelHi}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    50
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Tagline */}
          {(() => {
            const activeCatMeta = QUOTE_CATEGORIES.find((c) => c.key === selectedCategory);
            return (
              <div className="text-[11px] text-slate-400 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <span>💡 {activeCatMeta?.taglineHi}</span>
                <button
                  type="button"
                  onClick={() => setShowAllQuotesModal(true)}
                  className="font-mono text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  सभी 50 विचार देखें
                </button>
              </div>
            );
          })()}
        </div>

        {/* 2. MAIN 2-COLUMN STUDIO LAYOUT: Left Controls, Right Real-time Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: CONTROLS & PERSONALIZATION (5 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* STEP 1: QUOTE SELECTION & EDITING */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 font-black text-sm text-slate-100">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">1</span>
                  <span>प्रेरक सुविचार चुनें (50 शीर्ष विचार)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevQuote}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="पिछला विचार"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-amber-400 font-bold px-2 py-0.5 bg-slate-950 rounded-lg border border-slate-800">
                    #{currentQuoteIndex + 1} / {activeQuotes.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextQuote}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="अगला विचार"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DIRECT QUOTE SELECTOR DROPDOWN & BROWSE ALL 50 BUTTON */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>इस श्रेणी के 50 शीर्ष विचारों में से चुनें:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAllQuotesModal(true)}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-2 transition cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>सूची देखें (सभी 50)</span>
                  </button>
                </div>

                {/* Dropdown Select for the 50 Quotes */}
                <div className="relative">
                  <select
                    value={currentQuoteIndex}
                    onChange={(e) => handleSelectQuoteByIndex(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 hover:border-amber-500 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none transition leading-relaxed pr-8"
                  >
                    {activeQuotes.map((q, idx) => (
                      <option key={q.id || idx} value={idx} className="bg-slate-900 text-slate-100 py-1">
                        #{idx + 1}: {q.quoteHi.length > 58 ? q.quoteHi.substring(0, 58) + '...' : q.quoteHi} — {q.author}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>

                {/* Quick 50 Numbered Jump Pills */}
                <div className="pt-1">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      तुरंत विचार संख्या चुनें (1 से 50):
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">50 विचार उपलब्ध</span>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                    {activeQuotes.map((_, idx) => {
                      const isSelected = currentQuoteIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectQuoteByIndex(idx)}
                          className={`w-7 h-7 shrink-0 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30 scale-105 ring-2 ring-amber-300'
                              : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                          title={`सुविचार #${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quote Textarea (Editable) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">सुविचार टेक्स्ट (आवश्यकतानुसार एडिट करें):</label>
                  <span className="text-[10px] text-slate-500">कस्टमाइज़ करने की स्वतंत्रता</span>
                </div>
                <textarea
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition leading-relaxed"
                  placeholder="अपना मनपसंद प्रेरक विचार यहां लिखें..."
                />
              </div>

              {/* Author Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">रचनाकार / प्रेरणा स्रोत (Author):</label>
                <input
                  type="text"
                  value={quoteAuthor}
                  onChange={(e) => setQuoteAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
                  placeholder="जैसे: डॉ. ए. पी. जे. अब्दुल कलाम / स्वामी विवेकानंद"
                />
              </div>
            </div>

            {/* STEP 2: USER PHOTO & IDENTIFICATION */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 font-black text-sm text-slate-100">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">2</span>
                  <span>आपकी फोटो एवं नाम विवरण</span>
                </div>
                <span className="text-[11px] text-amber-400 font-bold">पोस्टर पर प्रदर्शित होगा</span>
              </div>

              {/* Photo Upload Row */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={userPhoto}
                    alt={userName}
                    className={`w-16 h-16 object-cover border-2 border-amber-400 shadow-md ${
                      frameShape === 'circle' ? 'rounded-full' : 'rounded-2xl'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full hover:bg-amber-400 transition cursor-pointer shadow-sm"
                    title="नई फोटो अपलोड करें"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>अपनी फोटो अपलोड करें (Gallery / Camera)</span>
                  </button>

                  {/* Frame Shape Toggle */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-[11px]">फोटो फ्रेम:</span>
                    <button
                      type="button"
                      onClick={() => setFrameShape('circle')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        frameShape === 'circle'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      गोलाकार (Circle)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrameShape('rounded')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        frameShape === 'rounded'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      चौकोर (Rounded)
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample Quick Avatars */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block">या तुरंत सैंपल प्रोफाइल चुनें:</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_AVATARS.map((av) => (
                    <button
                      key={av.name}
                      type="button"
                      onClick={() => {
                        setUserPhoto(av.url);
                        setUserName(av.name);
                        setUserTitle(av.title);
                        setUserCity(av.city);
                        toast.success(`${av.name} प्रोफाइल सेट की गई`);
                      }}
                      className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium border border-slate-700/60 shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <img src={av.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span>{av.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PHOTO WATERMARK ON QUOTES CONTROLS */}
              <div className="bg-slate-950/90 border border-amber-500/20 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>सुविचार पर फोटो वॉटरमार्क (Photo Watermark on Quotes)</span>
                    </span>
                    <p className="text-[10px] text-slate-400">
                      अपलोड की गई फोटो पूरे सुविचार वाले भाग के पीछे खूबसूरत पारदर्शी वॉटरमार्क के रूप में दिखेगी
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludePhotoWatermark(!includePhotoWatermark)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      includePhotoWatermark ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        includePhotoWatermark ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {includePhotoWatermark && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
                    <span className="text-[11px] text-slate-300 shrink-0 font-medium">वॉटरमार्क पारदर्शिता:</span>
                    <input
                      type="range"
                      min={8}
                      max={45}
                      step={1}
                      value={watermarkPhotoOpacity}
                      onChange={(e) => setWatermarkPhotoOpacity(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-[11px] font-mono font-bold text-amber-400 w-10 text-right">
                      {watermarkPhotoOpacity}%
                    </span>
                  </div>
                )}
              </div>

              {/* Name, Designation, City Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">आपका नाम (Full Name):</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none"
                    placeholder="जैसे: श्री राहुल शर्मा"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">पद / उपाधि (Designation):</label>
                  <input
                    type="text"
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none"
                    placeholder="जैसे: समाजसेवी / शिक्षक / विद्यार्थी"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">स्थान / शहर (Location):</label>
                <input
                  type="text"
                  value={userCity}
                  onChange={(e) => setUserCity(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none"
                  placeholder="जैसे: ग़ाज़ीपुर, उत्तर प्रदेश"
                />
              </div>
            </div>

            {/* STEP 3: PLATFORM RATIO & THEMES */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 font-black text-sm text-slate-100">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">3</span>
                  <span>फेसबुक व व्हाट्सएप साइज़ और बैकग्राउंड</span>
                </div>
                <span className="text-[11px] text-amber-400 font-bold">HD रिज़ॉल्यूशन</span>
              </div>

              {/* Aspect Ratio Selector (WhatsApp Status, Square, FB Portrait, Landscape) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">प्लेटफॉर्म व साइज़ चुनें (Social Ratio):</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {POSTER_RATIO_CONFIGS.map((ratio) => {
                    const isSelected = selectedRatioId === ratio.id;
                    return (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => setSelectedRatioId(ratio.id)}
                        className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 text-amber-400 font-black shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {ratio.id === 'whatsapp-status' ? (
                          <Smartphone className="w-4 h-4 text-emerald-400" />
                        ) : ratio.id === 'square-post' ? (
                          <Square className="w-4 h-4 text-blue-400" />
                        ) : ratio.id === 'facebook-portrait' ? (
                          <Facebook className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Monitor className="w-4 h-4 text-purple-400" />
                        )}
                        <span className="text-[11px] font-bold block leading-tight">{ratio.labelHi.split('(')[0]}</span>
                        <span className="text-[9px] font-mono opacity-80">{ratio.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thematic Background Selector ("quotes ke according poster ka background ho") */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-300 block">सुविचार अनुकूल बैकग्राउंड थीम (Theme Presets):</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POSTER_THEMES.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/40'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                        style={{ background: theme.bgGradient }}
                      >
                        <div
                          className={`text-[11px] font-extrabold truncate drop-shadow-sm ${
                            theme.isLight ? 'text-slate-900 font-black' : 'text-white'
                          }`}
                        >
                          {theme.nameHi.split('(')[0]}
                        </div>
                        <div
                          className={`text-[9px] truncate font-bold ${
                            theme.isLight ? 'text-slate-700' : 'text-amber-200/90'
                          }`}
                        >
                          {theme.nameHi.includes('(') ? theme.nameHi.split('(')[1].replace(')', '') : theme.category}
                        </div>
                        {theme.isLight && (
                          <span className="inline-block mt-0.5 text-[8px] font-black uppercase px-1 py-0.2 bg-amber-500/25 text-amber-900 rounded">
                            लाइट थीम
                          </span>
                        )}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Options */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBranding}
                    onChange={(e) => setIncludeBranding(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                  <span>JJF संस्था लोगो शामिल करें</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWatermark}
                    onChange={(e) => setIncludeWatermark(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                  <span>वेबसाइट मुहर लगाएं</span>
                </label>
              </div>
            </div>

            {/* DOWNLOAD & SHARE ACTION BAR */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-5 text-slate-950 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide">पोस्टर तैयार है!</h4>
                  <p className="text-xs text-slate-900 font-medium">फेसबुक, व्हाट्सएप स्टेटस व ग्रुप्स पर तुरंत शेयर करें</p>
                </div>
                <span className="text-[10px] font-black bg-slate-950 text-amber-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  1080p Ultra HD
                </span>
              </div>

              {/* PRIMARY ROW: DIRECT SHARE TO WHATSAPP & SHARE TO FACEBOOK WITH IMAGE INTENT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                {/* Share to WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleShareToWhatsApp}
                  disabled={isGenerating}
                  className="px-4 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl font-black text-xs transition flex items-center justify-center gap-2.5 cursor-pointer shadow-lg disabled:opacity-50 group"
                  title="WhatsApp पर पोस्टर इमेज और सुविचार सीधे शेयर करें"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-800/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block font-black text-[13px]">WhatsApp पर शेयर करें</span>
                    <span className="text-[10px] text-emerald-200 font-medium">Share to WhatsApp (Image)</span>
                  </div>
                </button>

                {/* Share to Facebook Button */}
                <button
                  type="button"
                  onClick={handleShareToFacebook}
                  disabled={isGenerating}
                  className="px-4 py-3 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white rounded-2xl font-black text-xs transition flex items-center justify-center gap-2.5 cursor-pointer shadow-lg disabled:opacity-50 group"
                  title="Facebook पर पोस्टर इमेज और सुविचार सीधे शेयर करें"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-800/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Facebook className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block font-black text-[13px]">Facebook पर शेयर करें</span>
                    <span className="text-[10px] text-blue-200 font-medium">Share to Facebook (Image)</span>
                  </div>
                </button>
              </div>

              {/* SECONDARY ROW: HD POSTER DOWNLOAD & CLIPBOARD IMAGE COPY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleDownloadPoster}
                  disabled={isGenerating}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  title="1080p Ultra HD पोस्टर सीधे डिवाइस में डाउनलोड करें"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGenerating ? 'तैयार हो रहा है...' : 'HD पोस्टर डाउनलोड करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyImageToClipboard}
                  disabled={isGenerating}
                  className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-slate-100 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  title="पोस्टर इमेज को क्लिपबोर्ड में कॉपी करें (Ctrl+V से सीधे पेस्ट करें)"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>इमेज क्लिपबोर्ड में कॉपी</span>
                </button>
              </div>

              {/* TERTIARY ROW: TEXT COPY & IMAGE DATA URI DRAWER */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-950/20 text-slate-900 font-bold">
                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                  title="सुविचार का टेक्स्ट कॉपी करें"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedQuote ? '✓ टेक्स्ट कॉपी हो गया' : 'विचार टेक्स्ट कॉपी करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!generatedPosterUri) {
                      await renderPosterCanvas();
                    }
                    setShowShareModal(true);
                  }}
                  className="hover:underline flex items-center gap-1 cursor-pointer font-black"
                  title="पोस्टर इमेज URI देखें और डायरेक्ट लिंक शेयर करें"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>इमेज URI देखें व शेयर करें</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE POSTER LIVE PREVIEW (7 Cols) */}
          <div className="lg:col-span-6 sticky top-24 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>लाइव पोस्टर प्रीव्यू (Live Canvas Preview):</span>
              </span>
              <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-bold">
                {activeRatio.description}
              </span>
            </div>

            {/* POSTER CARD (Styled dynamically matching the selected aspect ratio and theme) */}
            <div className="flex justify-center">
              <div
                ref={posterPreviewRef}
                className={`w-full max-w-[480px] rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between ${
                  activeRatio.id === 'whatsapp-status'
                    ? 'min-h-[660px]'
                    : activeRatio.id === 'facebook-portrait'
                    ? 'min-h-[580px]'
                    : activeRatio.id === 'facebook-landscape'
                    ? 'min-h-[340px]'
                    : 'min-h-[480px]'
                }`}
                style={{
                  background: activeTheme.bgGradient,
                  border: '8px solid #8B0000', // Outer Royal Deep Crimson (matches official certificates)
                  boxShadow:
                    '0 0 0 2.5px #D4AF37, 0 0 0 5px #700000, 0 16px 45px rgba(139, 0, 0, 0.32)'
                }}
              >
                {/* Decorative Subtle Overlay (only active if dark theme or manually set) */}
                {!activeTheme.isLight && overlayDarkness > 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: `rgba(0,0,0, ${overlayDarkness / 100})` }}
                  ></div>
                )}

                {/* Official Document Multi-Tier Border Framing (Consistent with official certificates) */}
                {/* Tier 2: Double Inset Royal Gold Frame & Dashed Filigree Frame */}
                <div
                  className="absolute inset-2 sm:inset-2.5 rounded-xl pointer-events-none"
                  style={{
                    border: '2.5px double #D4AF37',
                    outline: '1px dashed rgba(212, 175, 55, 0.55)',
                    outlineOffset: '-5px'
                  }}
                />

                {/* Tier 3: Secondary Fine Gold Accent Frame */}
                <div
                  className="absolute inset-3.5 sm:inset-4 rounded-lg pointer-events-none"
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.35)'
                  }}
                />

                {/* 4 Ornate Royal Corner Filigree Flourishes (Official Royal Gold #D4AF37) */}
                <RoyalCornerFlourish
                  className="absolute top-2 left-2 w-9 h-9 sm:w-10 sm:h-10 pointer-events-none select-none drop-shadow-xs"
                  color="#D4AF37"
                />
                <RoyalCornerFlourish
                  className="absolute top-2 right-2 w-9 h-9 sm:w-10 sm:h-10 pointer-events-none select-none drop-shadow-xs -scale-x-100"
                  color="#D4AF37"
                />
                <RoyalCornerFlourish
                  className="absolute bottom-2 left-2 w-9 h-9 sm:w-10 sm:h-10 pointer-events-none select-none drop-shadow-xs -scale-y-100"
                  color="#D4AF37"
                />
                <RoyalCornerFlourish
                  className="absolute bottom-2 right-2 w-9 h-9 sm:w-10 sm:h-10 pointer-events-none select-none drop-shadow-xs -scale-x-100 -scale-y-100"
                  color="#D4AF37"
                />

                {/* Royal Top Center Crest Motif (Deep Crimson & Royal Gold) */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none select-none z-10">
                  <span className="w-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]"></span>
                  <span className="text-[#8B0000] bg-[#D4AF37] text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs tracking-wider">⚜ JJF</span>
                  <span className="w-8 h-[1.5px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]"></span>
                </div>

                {/* Royal Bottom Center Flourish Motif */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none select-none z-10">
                  <span className="w-6 h-[1.5px] bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
                  <span className="text-[#D4AF37] font-serif text-[11px] drop-shadow-xs">❖</span>
                  <span className="w-6 h-[1.5px] bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
                </div>

                {/* PHOTO WATERMARK ON THE QUOTES PART (Rendered in upper area so portrait face is fully visible) */}
                {includePhotoWatermark && userPhoto && (
                  <div className="absolute inset-x-2 top-16 sm:top-20 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                    <img
                      src={userPhoto}
                      alt="Quote Watermark"
                      className={`w-56 h-56 sm:w-68 sm:h-68 object-cover rounded-full ${
                        activeTheme.isLight ? 'mix-blend-multiply' : 'mix-blend-luminosity'
                      } filter contrast-125 transition-all`}
                      style={{
                        opacity: watermarkPhotoOpacity / 100,
                        maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)',
                        WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)'
                      }}
                    />
                  </div>
                )}

                {/* ATTRACTIVE TOP BORDER STRIP: NGO Logo & Name Occupying Full Vertical Space */}
                {/* ("Poster me ngo ka logo lagaye, ngo ka naam poster ke top pr full vertical space me rhe, anumodit vibhag na likha rhe") */}
                {includeBranding && (
                  <div
                    className={`relative z-10 -mx-3 sm:-mx-3.5 -mt-3 sm:-mt-3.5 mb-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-amber-400/80 flex items-center justify-between gap-3 transition-all select-none shadow-md ${
                      activeTheme.isLight
                        ? 'bg-gradient-to-r from-amber-950 via-[#8B0000] to-amber-950 text-white shadow-[0_4px_12px_rgba(139,0,0,0.25)]'
                        : 'bg-gradient-to-r from-slate-950 via-amber-950 to-slate-950 text-amber-100 shadow-[0_4px_14px_rgba(0,0,0,0.6)]'
                    }`}
                  >
                    {/* Bottom Fine Gold Filigree Hairline */}
                    <div className="absolute bottom-0.5 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />

                    {/* Left & Center: NGO Official Name & Dynamic Logo */}
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                      <BrandLogo size={36} className="shrink-0" />
                      <div className="text-left leading-tight flex-1 min-w-0">
                        <div className="font-serif font-black text-sm sm:text-base md:text-lg text-yellow-300 tracking-wide drop-shadow-xs truncate">
                          जीवन ज्योति फाउंडेशन
                        </div>
                        <div className="text-[8.5px] sm:text-[10px] font-bold text-amber-200 tracking-wide flex items-center gap-1.5 truncate">
                          <span>जनपद ग़ाज़ीपुर, उत्तर प्रदेश</span>
                          <span className="text-amber-400/80 font-mono text-[8px] hidden sm:inline">• JEEVAN JYOTI FOUNDATION</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Dignified Government Registered NGO Tag */}
                    <div className="shrink-0 text-right hidden xs:flex flex-col items-end justify-center">
                      <span className="text-[8px] sm:text-[9.5px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-400/40 shadow-xs">
                        ★ Govt. Regd. NGO
                      </span>
                    </div>
                  </div>
                )}

                {/* Clean unboxed category metadata */}
                <div
                  className="pt-1 text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 select-none"
                  style={{ color: activeTheme.accentColor }}
                >
                  <span>✦</span>
                  <span>{QUOTE_CATEGORIES.find((c) => c.key === selectedCategory)?.icon}</span>
                  <span>{QUOTE_CATEGORIES.find((c) => c.key === selectedCategory)?.labelHi}</span>
                  <span>✦</span>
                </div>

                {/* MIDDLE: ROYAL FLOATING QUOTE PLAQUE WITH "UBHAAR" (Snug height fitting only quote & author, non-obstructing) */}
                <div
                  className={`relative z-10 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-3xl border-2 transition-all text-center space-y-2 overflow-hidden max-w-[95%] mx-auto ${
                    includePhotoWatermark && userPhoto ? 'mt-auto mb-2.5' : 'my-auto'
                  } ${
                    activeTheme.isLight
                      ? 'bg-gradient-to-b from-white/92 via-amber-50/80 to-white/92 border-amber-500/60 shadow-[0_14px_34px_-8px_rgba(180,83,9,0.22)] ring-1 ring-amber-400/40 backdrop-blur-sm'
                      : 'bg-gradient-to-b from-slate-900/90 via-slate-800/85 to-slate-900/90 border-amber-400/50 shadow-[0_14px_34px_-8px_rgba(0,0,0,0.7)] ring-1 ring-amber-400/35 backdrop-blur-sm'
                  }`}
                >
                  {/* Corner Royal Diamonds on Quote Plaque */}
                  <span className="absolute top-2 left-2 text-amber-500/80 text-[10px] select-none pointer-events-none">❖</span>
                  <span className="absolute top-2 right-2 text-amber-500/80 text-[10px] select-none pointer-events-none">❖</span>
                  <span className="absolute bottom-2 left-2 text-amber-500/80 text-[10px] select-none pointer-events-none">❖</span>
                  <span className="absolute bottom-2 right-2 text-amber-500/80 text-[10px] select-none pointer-events-none">❖</span>

                  {/* Main Quote with 3D Golden Quote Marks adjusted at the beginning and end of the quote line */}
                  <blockquote
                    className={`font-black leading-relaxed tracking-normal transition-all ${
                      fontSizeScale === 'large'
                        ? 'text-sm sm:text-base'
                        : fontSizeScale === 'compact'
                        ? 'text-[11px] sm:text-xs'
                        : 'text-xs sm:text-sm'
                    }`}
                    style={{
                      color: activeTheme.quoteColor || (activeTheme.isLight ? '#0f172a' : '#ffffff'),
                      textShadow: activeTheme.isLight
                        ? '0 1px 0 rgba(255,255,255,0.95), 0 2px 6px rgba(0,0,0,0.20)'
                        : '0 2px 6px rgba(0,0,0,0.85), 0 0 14px rgba(251,191,36,0.35)'
                    }}
                  >
                    {/* 3D Golden Opening Quote Mark at the beginning */}
                    <span
                      className="inline-block text-lg sm:text-xl font-serif font-black select-none align-baseline mr-1 drop-shadow-[0_2px_3px_rgba(217,119,6,0.6)]"
                      style={{
                        background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      ❝
                    </span>
                    <span>{quoteText}</span>
                    {/* 3D Golden Closing Quote Mark at the end */}
                    <span
                      className="inline-block text-lg sm:text-xl font-serif font-black select-none align-baseline ml-1 drop-shadow-[0_2px_3px_rgba(217,119,6,0.6)]"
                      style={{
                        background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      ❞
                    </span>
                  </blockquote>

                  {/* Author Attribution with Royal Wings & Fleur-de-lis Inscription */}
                  {quoteAuthor.trim() && (
                    <div className="pt-1 flex items-center justify-center gap-2">
                      <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-amber-500"></span>
                      <span className="text-amber-600 dark:text-amber-400 text-xs font-serif">⚜</span>
                      <span
                        className="text-xs sm:text-sm font-black italic tracking-wide"
                        style={{ color: activeTheme.authorColor || (activeTheme.isLight ? '#b45309' : '#93c5fd') }}
                      >
                        {quoteAuthor}
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 text-xs font-serif">⚜</span>
                      <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent via-amber-500 to-amber-500"></span>
                    </div>
                  )}
                </div>

                {/* BOTTOM: USER PROFILE ROYAL PLAQUE ("niche white wala barer ko bhi royal look de") */}
                <div
                  className={`relative z-10 rounded-2xl p-3 sm:p-3.5 border-2 flex items-center justify-between gap-3 shadow-2xl transition-all overflow-hidden ${
                    activeTheme.isLight
                      ? 'bg-gradient-to-r from-white via-amber-50/50 to-white border-amber-500/70 shadow-[0_18px_38px_-8px_rgba(180,83,9,0.22)] ring-1 ring-amber-400/40'
                      : 'bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border-amber-400/60 shadow-[0_18px_38px_-8px_rgba(0,0,0,0.7)] ring-1 ring-amber-400/35'
                  }`}
                >
                  {/* Corner Golden Accent Diamonds on the Bar */}
                  <span className="absolute top-1.5 left-1.5 text-amber-500/80 text-[8px] pointer-events-none select-none">❖</span>
                  <span className="absolute top-1.5 right-1.5 text-amber-500/80 text-[8px] pointer-events-none select-none">❖</span>
                  <span className="absolute bottom-1.5 left-1.5 text-amber-500/80 text-[8px] pointer-events-none select-none">❖</span>
                  <span className="absolute bottom-1.5 right-1.5 text-amber-500/80 text-[8px] pointer-events-none select-none">❖</span>

                  <div className="flex items-center gap-3 min-w-0">
                    {/* Royal Medallion Golden Frame around Photo */}
                    <div className="relative shrink-0">
                      <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 shadow-md ring-2 ring-amber-400/40">
                        <img
                          src={userPhoto}
                          alt={userName}
                          className={`w-full h-full object-cover ${
                            frameShape === 'circle' ? 'rounded-full' : 'rounded-xl'
                          }`}
                        />
                      </div>
                      {/* Crown Medallion Badge */}
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 border border-amber-700 shadow-sm flex items-center justify-center text-[9px] text-slate-950 font-black">
                        👑
                      </span>
                    </div>

                    <div className="space-y-0.5 text-left min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-xs sm:text-sm font-black leading-tight drop-shadow-sm truncate"
                          style={{ color: activeTheme.isLight ? (activeTheme.cardTextColor || '#0f172a') : '#ffffff' }}
                        >
                          {userName}
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold">✦</span>
                      </div>

                      {userTitle && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-800 dark:text-amber-300 text-[10px] font-black leading-tight">
                          <span>⚜</span>
                          <span className="truncate">{userTitle}</span>
                        </div>
                      )}

                      {userCity && (
                        <div
                          className="text-[9px] flex items-center gap-1 leading-tight font-medium"
                          style={{ color: activeTheme.isLight ? (activeTheme.cardSubTextColor || '#64748b') : '#cbd5e1' }}
                        >
                          <MapPin className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>{userCity}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Foundation Official Certificate Seal on Card Right */}
                  {/* ("सुविचार वाले पार्ट में पोस्टर पर ऑफिशियल सील सेम वही रखे जो बाकी सर्टिफिकेट पर पट्टी वाली रहती है उससे थोड़ा भी अलग ना हो") */}
                  {includeWatermark && (
                    <div className="shrink-0 flex flex-col items-center justify-center pl-2 sm:pl-3 border-l border-amber-300/40 dark:border-slate-700/80">
                      <RoyalCertificateSeal
                        size={66}
                        variant="gold-crimson"
                        showRibbons={true}
                        className="drop-shadow-md shrink-0 scale-95 sm:scale-100"
                      />
                      <div className="text-[7px] sm:text-[7.5px] font-black uppercase tracking-wider text-[#8B0000] dark:text-amber-300 mt-1 text-center truncate max-w-full">
                        ऑफिशियल मुहर / प्रमाणित
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DIRECT SOCIAL SHARING BAR UNDER PREVIEW */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>डायरेक्ट सोशल मीडिया शेयर (Share Poster Intent):</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  इमेज URI सपोर्टेड
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShareToWhatsApp}
                  disabled={isGenerating}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  title="WhatsApp पर पोस्टर इमेज और सुविचार तुरंत साझा करें"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Share to WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareToFacebook}
                  disabled={isGenerating}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  title="Facebook पर पोस्टर इमेज और सुविचार तुरंत साझा करें"
                >
                  <Facebook className="w-4 h-4 shrink-0" />
                  <span>Share to Facebook</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleDownloadPoster}
                  disabled={isGenerating}
                  className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition font-bold"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>1080p HD डाउनलोड</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyImageToClipboard}
                  disabled={isGenerating}
                  className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition font-bold"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>इमेज कॉपी</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!generatedPosterUri) {
                      await renderPosterCanvas();
                    }
                    setShowShareModal(true);
                  }}
                  className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition font-bold text-amber-400"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>इमेज URI देखें</span>
                </button>
              </div>
            </div>

            {/* Quick Helper Notes */}
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>सुझाव: सोशल मीडिया पर कैसे उपयोग करें?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                • <strong>WhatsApp Status</strong> के लिए <strong>9:16</strong> अनुपात चुनें ताकि स्टेटस स्क्रीन पूरी तरह कवर हो।
                <br />
                • <strong>Facebook & Instagram Post</strong> के लिए <strong>1:1</strong> या <strong>4:5</strong> अनुपात चुनें।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Poster Image URI & Sharing Modal */}
      {showShareModal && generatedPosterUri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition"
              title="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-black text-white">पोस्टर इमेज व सोशल मीडिया शेयरिंग</h3>
                <p className="text-xs text-slate-400">1080p Ultra HD पोस्टर इमेज URI तैयार है</p>
              </div>
            </div>

            {/* Poster Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center max-h-56 p-2">
              <img
                src={generatedPosterUri}
                alt="Generated Motivational Poster"
                className="max-h-52 object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Poster Image Data URI Display */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold">
                <span>पोस्टर इमेज डेटा URI (Base64 Data URI):</span>
                <span className="text-[10px] text-amber-400 font-mono">PNG 1080p HD</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedPosterUri}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-300/90 truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyImageUri}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shrink-0 transition flex items-center gap-1 cursor-pointer"
                  title="डेटा URI कॉपी करें"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>कॉपी URI</span>
                </button>
              </div>
            </div>

            {/* Direct Social Media Sharing Buttons inside Modal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleShareToWhatsApp}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Share to WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareToFacebook}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <Facebook className="w-4 h-4 shrink-0" />
                <span>Share to Facebook</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300 font-bold">
              <button
                type="button"
                onClick={handleDownloadPoster}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>HD पोस्टर डाउनलोड करें</span>
              </button>

              <button
                type="button"
                onClick={handleCopyImageToClipboard}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>इमेज क्लिपबोर्ड में कॉपी करें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Browse All 50 Quotes Interactive Modal */}
      {showAllQuotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                  {QUOTE_CATEGORIES.find((c) => c.key === selectedCategory)?.icon || '📚'}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>{QUOTE_CATEGORIES.find((c) => c.key === selectedCategory)?.labelHi}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                      50 शीर्ष सुविचार
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    पोस्टर पर लगाने के लिए कोई भी सुविचार तुरंत चुनें
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAllQuotesModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 space-y-3">
              {/* Category selector row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
                {QUOTE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleSelectCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.labelHi}</span>
                      <span className="text-[10px] opacity-75 font-mono">(50)</span>
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={quoteSearchTerm}
                  onChange={(e) => setQuoteSearchTerm(e.target.value)}
                  placeholder="विचार या रचनाकार (Author) खोजें... (जैसे: कलाम, विवेकानंद, कबीर, आदि)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
                {quoteSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setQuoteSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    हटाएं
                  </button>
                )}
              </div>
            </div>

            {/* Quotes Grid / List */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
              {(() => {
                const term = quoteSearchTerm.trim().toLowerCase();
                const filteredQuotes = term
                  ? activeQuotes.filter(
                      (q) =>
                        q.quoteHi.toLowerCase().includes(term) ||
                        (q.quoteEn && q.quoteEn.toLowerCase().includes(term)) ||
                        q.author.toLowerCase().includes(term)
                    )
                  : activeQuotes;

                if (filteredQuotes.length === 0) {
                  return (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <p className="text-sm font-semibold">कोई सुविचार नहीं मिला</p>
                      <button
                        type="button"
                        onClick={() => setQuoteSearchTerm('')}
                        className="text-xs text-amber-400 hover:underline"
                      >
                        खोज फ़िल्टर रीसेट करें
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredQuotes.map((q, idx) => {
                      const originalIdx = activeQuotes.findIndex((item) => item.id === q.id);
                      const isSelected = currentQuoteIndex === originalIdx;
                      return (
                        <div
                          key={q.id || idx}
                          onClick={() => {
                            if (originalIdx !== -1) {
                              handleSelectQuoteByIndex(originalIdx);
                              setShowAllQuotesModal(false);
                            }
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                              : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                  isSelected
                                    ? 'bg-amber-500 text-slate-950 font-black'
                                    : 'bg-slate-800 text-amber-400'
                                }`}
                              >
                                सुविचार #{originalIdx !== -1 ? originalIdx + 1 : idx + 1}
                              </span>
                              {isSelected && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>वर्तमान चयनित</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed font-serif">
                              "{q.quoteHi}"
                            </p>

                            {q.quoteEn && (
                              <p className="text-[11px] text-slate-400 italic line-clamp-2">
                                {q.quoteEn}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                              <span>— {q.author}</span>
                            </span>

                            <button
                              type="button"
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300'
                              }`}
                            >
                              <span>{isSelected ? 'चयनित' : 'यह चुनें'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">इस श्रेणी में कुल {activeQuotes.length} प्रेरक सुविचार उपलब्ध हैं</span>
              <button
                type="button"
                onClick={() => setShowAllQuotesModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for high-resolution 1080p generation */}
      <canvas ref={hiddenCanvasRef} className="hidden" />
    </section>
  );
};
