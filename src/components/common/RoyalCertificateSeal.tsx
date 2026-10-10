import React, { useState, useEffect, useId, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useHomeContent } from '../../context/HomeContentContext';
import {
  DEFAULT_OFFICIAL_SEAL_URL,
  OFFICIAL_SEAL_BASE64_DATA_URL,
  getActiveOfficialSealUrl
} from '../../data/officialSealData';
import { getCacheBustedImageUrl } from '../../services/offlineCertificateCache';

interface RoyalCertificateSealProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto' | 'responsive' | number;
  variant?: 'gold-crimson' | 'royal-gold' | 'emerald-gold';
  showRibbons?: boolean;
  className?: string;
  style?: React.CSSProperties;
  customSealUrl?: string; // Optional custom seal override
}

/**
 * RoyalCertificateSeal
 * High-definition Official Embossed Seal for Certificates, Awards, and Posters
 * Permanently uses the authentic uploaded official foundation seal across all documents.
 */
export const RoyalCertificateSeal: React.FC<RoyalCertificateSealProps> = ({
  size = 'auto',
  variant: propVariant,
  showRibbons = true,
  className = '',
  style,
  customSealUrl
}) => {
  // Global Context & Local Storage Integration for Dynamic Seal
  const homeContext = useHomeContent();
  const contextSeal = homeContext?.content?.certificateSealUrl || '';
  const contextVariant = (homeContext?.content as any)?.certificateSealVariant || 'gold-crimson';

  const [activeSealUrl, setActiveSealUrl] = useState<string>(() => {
    return getActiveOfficialSealUrl(customSealUrl || contextSeal);
  });

  const [activeVariant, setActiveVariant] = useState<'gold-crimson' | 'royal-gold' | 'emerald-gold'>(() => {
    if (propVariant) return propVariant;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jjf_custom_certificate_seal_variant');
        if (stored && ['gold-crimson', 'royal-gold', 'emerald-gold'].includes(stored)) {
          return stored as any;
        }
      } catch {}
    }
    return contextVariant || 'gold-crimson';
  });

  const [sealImgFailed, setSealImgFailed] = useState<boolean>(false);

  // Synchronize when props or context changes
  useEffect(() => {
    const resolved = getActiveOfficialSealUrl(customSealUrl || contextSeal);
    setActiveSealUrl(resolved);
    setSealImgFailed(false);
  }, [customSealUrl, contextSeal]);

  useEffect(() => {
    if (propVariant) {
      setActiveVariant(propVariant);
    } else if (contextVariant) {
      setActiveVariant(contextVariant);
    }
  }, [propVariant, contextVariant]);

  // Reactive listener for instant cross-component updates
  useEffect(() => {
    const handleSealChange = (e: CustomEvent<any>) => {
      const detail = e.detail;
      if (typeof detail === 'string' && detail.trim()) {
        setActiveSealUrl(detail.trim());
        setSealImgFailed(false);
      } else if (detail && typeof detail === 'object') {
        if (detail.sealUrl && typeof detail.sealUrl === 'string' && detail.sealUrl.trim()) {
          setActiveSealUrl(detail.sealUrl.trim());
          setSealImgFailed(false);
        }
        if (detail.sealVariant && ['gold-crimson', 'royal-gold', 'emerald-gold'].includes(detail.sealVariant)) {
          setActiveVariant(detail.sealVariant);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-seal-changed', handleSealChange as EventListener);
      return () => {
        window.removeEventListener('jjf-seal-changed', handleSealChange as EventListener);
      };
    }
  }, []);

  const variant = activeVariant;

  const isAuto = size === 'auto' || size === 'responsive';
  const numericSize = typeof size === 'number' ? size : null;

  const dimensions = numericSize
    ? {
        seal: numericSize,
        logo: Math.round(numericSize * 0.42),
        ribbonH: Math.round(numericSize * 0.24),
        fontTop: Math.max(6, Math.round(numericSize * 0.085)),
        fontBottom: Math.max(5.5, Math.round(numericSize * 0.075)),
        fontCenter: Math.max(6, Math.round(numericSize * 0.09))
      }
    : !isAuto && typeof size === 'string' && size in { sm: 1, md: 1, lg: 1, xl: 1 }
    ? {
        sm: { seal: 72, logo: 30, ribbonH: 18, fontTop: 6, fontBottom: 5.5, fontCenter: 6.5 },
        md: { seal: 88, logo: 38, ribbonH: 22, fontTop: 7.5, fontBottom: 6.5, fontCenter: 8 },
        lg: { seal: 104, logo: 46, ribbonH: 26, fontTop: 9, fontBottom: 8, fontCenter: 9.5 },
        xl: { seal: 120, logo: 54, ribbonH: 30, fontTop: 10.5, fontBottom: 9, fontCenter: 11 }
      }[size as 'sm' | 'md' | 'lg' | 'xl']
    : {
        // Auto responsive mode: uses fluid proportions
        seal: 86,
        logo: 36,
        ribbonH: 22,
        fontTop: 7.5,
        fontBottom: 6.5,
        fontCenter: 8
      };

  const colors = {
    'gold-crimson': {
      rimOuter: '#B8860B',
      rimGold: '#D4AF37',
      goldLight: '#FFF8DC',
      crimsonDark: '#8B0000',
      crimsonDeep: '#700000',
      textGold: '#8B0000',
      ribbonLeft: '#8B0000',
      ribbonRight: '#A52A2A',
      ribbonBorder: '#D4AF37',
      bgCenter: '#FFFDF5'
    },
    'royal-gold': {
      rimOuter: '#996515',
      rimGold: '#FFD700',
      goldLight: '#FFFDF0',
      crimsonDark: '#0022B8',
      crimsonDeep: '#001A8A',
      textGold: '#0022B8',
      ribbonLeft: '#0022B8',
      ribbonRight: '#1E40AF',
      ribbonBorder: '#FFD700',
      bgCenter: '#FFFDF8'
    },
    'emerald-gold': {
      rimOuter: '#B8860B',
      rimGold: '#D4AF37',
      goldLight: '#F4FBF7',
      crimsonDark: '#047857',
      crimsonDeep: '#065F46',
      textGold: '#065F46',
      ribbonLeft: '#065F46',
      ribbonRight: '#047857',
      ribbonBorder: '#D4AF37',
      bgCenter: '#FFFFFF'
    }
  }[variant];

  // The effective image source: user-uploaded official seal or empty for default SVG royal seal
  const hasCustomUploadedSeal = Boolean(
    activeSealUrl &&
    activeSealUrl.trim() &&
    !activeSealUrl.includes('old') &&
    !activeSealUrl.includes('76347e15') &&
    !sealImgFailed
  );

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        isAuto ? 'w-full max-w-[clamp(68px,11cqw,98px)]' : ''
      } ${className}`}
      style={{
        width: isAuto ? undefined : `${dimensions.seal}px`,
        maxWidth: '100%',
        ...style
      }}
    >
      {/* Top-Right Verified Security Checkmark Shield */}
      <div className="absolute -top-1 -right-1 z-20 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white shrink-0">
        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
      </div>

      {/* Main Circular Royal Embossed Seal - Displays custom uploaded seal if present, or pristine SVG royal seal */}
      <div
        className="relative rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-transform shrink-0 overflow-hidden"
        style={{
          width: isAuto ? '100%' : `${dimensions.seal}px`,
          height: isAuto ? undefined : `${dimensions.seal}px`,
          aspectRatio: '1 / 1',
          maxWidth: `${dimensions.seal}px`,
          maxHeight: `${dimensions.seal}px`,
          backgroundColor: '#FFFFFF',
          border: `2.5px solid ${colors.rimGold}`,
          boxShadow: `0 0 0 2px ${colors.crimsonDark}, 0 4px 12px rgba(139, 0, 0, 0.25)`
        }}
      >
        <div className="relative w-full h-full p-0.5 flex items-center justify-center bg-white rounded-full overflow-hidden">
          {hasCustomUploadedSeal ? (
            <img
              data-official-seal="true"
              src={getCacheBustedImageUrl(activeSealUrl)}
              alt="Official Certificate Seal"
              crossOrigin="anonymous"
              className="w-full h-full object-contain pointer-events-none drop-shadow-xs"
              onError={() => {
                setSealImgFailed(true);
              }}
            />
          ) : (
            <svg
              data-official-seal="true"
              viewBox="0 0 500 500"
              className="w-full h-full object-contain pointer-events-none"
            >
              <defs>
                <radialGradient id={`sealBgGrad-${dimensions.seal}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFDF7" />
                  <stop offset="70%" stopColor="#FFF8DC" />
                  <stop offset="100%" stopColor="#FFECB3" />
                </radialGradient>
                <path id={`sealPathTop-${dimensions.seal}`} d="M 60,250 A 190,190 0 1,1 440,250" fill="none" />
                <path id={`sealPathBottom-${dimensions.seal}`} d="M 440,250 A 190,190 0 0,1 60,250" fill="none" />
              </defs>

              {/* Outer Scalloped Edge */}
              <circle cx="250" cy="250" r="242" fill={colors.crimsonDark} stroke={colors.rimGold} strokeWidth="4" />
              <circle cx="250" cy="250" r="236" fill="none" stroke="#FFF8DC" strokeWidth="1.5" strokeDasharray="4,4" />

              {/* Main Embossed Inner Ring */}
              <circle cx="250" cy="250" r="226" fill={`url(#sealBgGrad-${dimensions.seal})`} stroke={colors.rimOuter} strokeWidth="5" />
              <circle cx="250" cy="250" r="214" fill={colors.crimsonDark} stroke={colors.rimGold} strokeWidth="2.5" />

              {/* Circular Text Top: JEEVAN JYOTI FOUNDATION */}
              <text fill="#FFF8DC" fontFamily="'Cinzel', 'Georgia', serif" fontWeight="900" fontSize="23" letterSpacing="4">
                <textPath href={`#sealPathTop-${dimensions.seal}`} startOffset="50%" textAnchor="middle">
                  JEEVAN JYOTI FOUNDATION
                </textPath>
              </text>

              {/* Circular Text Bottom: GHAZIPUR (U.P.) */}
              <text fill="#FFF8DC" fontFamily="'Cinzel', 'Georgia', serif" fontWeight="900" fontSize="23" letterSpacing="6">
                <textPath href={`#sealPathBottom-${dimensions.seal}`} startOffset="50%" textAnchor="middle">
                  GHAZIPUR (U.P.)
                </textPath>
              </text>

              {/* Side Gold Stars */}
              <polygon points="62,250 58,243 65,246 69,240 70,247 77,250 70,253 69,260 65,254 58,257" fill="#FFD700" />
              <polygon points="438,250 434,243 441,246 445,240 446,247 453,250 446,253 445,260 441,254 434,257" fill="#FFD700" />

              {/* Center Core Circle */}
              <circle cx="250" cy="250" r="148" fill="#FFFDF5" stroke={colors.rimOuter} strokeWidth="3" />
              <circle cx="250" cy="250" r="142" fill="none" stroke={colors.crimsonDark} strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Center NGO Government Details */}
              <text x="250" y="160" fontFamily="sans-serif" fontWeight="900" fontSize="16" fill={colors.crimsonDark} textAnchor="middle" letterSpacing="2">
                GOVT. REG. NGO
              </text>
              <text x="250" y="178" fontFamily="sans-serif" fontWeight="700" fontSize="12" fill={colors.rimOuter} textAnchor="middle" letterSpacing="1">
                NITI AAYOG DARPAN
              </text>

              {/* Sacred Flame / Jyoti of Foundation */}
              <path d="M 250,195 C 235,225 220,242 225,265 C 229,282 240,292 250,292 C 260,292 271,282 275,265 C 280,242 265,225 250,195 Z" fill="#FF8F00" />
              <path d="M 250,215 C 242,235 233,247 237,264 C 240,276 245,282 250,282 C 255,282 260,276 263,264 C 267,247 258,235 250,215 Z" fill="#FFD54F" />
              <path d="M 250,240 C 246,252 242,260 245,270 C 247,276 248,278 250,278 C 252,278 253,276 255,270 C 258,260 254,252 250,240 Z" fill="#FFFDE7" />

              {/* Supporting Seva Base */}
              <path d="M 210,275 C 218,290 232,298 250,298 C 268,298 282,290 290,275 C 282,284 268,288 250,288 C 232,288 218,284 210,275 Z" fill={colors.crimsonDark} />

              {/* Seal Badge */}
              <rect x="180" y="306" width="140" height="24" rx="12" fill={colors.crimsonDark} stroke={colors.rimGold} strokeWidth="1.5" />
              <text x="250" y="322" fontFamily="sans-serif" fontWeight="900" fontSize="12" fill="#FFF8DC" textAnchor="middle" letterSpacing="1.5">
                OFFICIAL SEAL
              </text>
              <text x="250" y="348" fontFamily="sans-serif" fontWeight="800" fontSize="11" fill={colors.rimOuter} textAnchor="middle" letterSpacing="1">
                ESTD. 2020
              </text>
            </svg>
          )}
        </div>
      </div>

      {/* Royal Gold Ribbon Tails Underneath */}
      {showRibbons && (
        <div
          className="relative -mt-1.5 z-0 flex items-center justify-center"
          style={{ height: `${dimensions.ribbonH}px` }}
        >
          <svg
            viewBox="0 0 120 40"
            className="h-full w-auto drop-shadow-xs"
          >
            {/* Left Ribbon Tail */}
            <path
              d="M 40 0 L 15 35 L 30 28 L 45 35 L 50 0 Z"
              fill={colors.ribbonLeft}
              stroke={colors.ribbonBorder}
              strokeWidth="1.5"
            />
            {/* Right Ribbon Tail */}
            <path
              d="M 70 0 L 75 35 L 90 28 L 105 35 L 80 0 Z"
              fill={colors.ribbonRight}
              stroke={colors.ribbonBorder}
              strokeWidth="1.5"
            />
            {/* Center Join Band */}
            <rect
              x="42"
              y="0"
              width="36"
              height="10"
              rx="3"
              fill={colors.rimGold}
              stroke={colors.crimsonDark}
              strokeWidth="1"
            />
            <text
              x="60"
              y="7.5"
              fontSize="6.5"
              fontWeight="900"
              fill={colors.crimsonDark}
              textAnchor="middle"
              letterSpacing="0.5"
            >
              GOVT. REG.
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default RoyalCertificateSeal;
