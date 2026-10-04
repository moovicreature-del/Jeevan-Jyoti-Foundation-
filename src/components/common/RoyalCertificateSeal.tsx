import React, { useState, useEffect, useId, useMemo } from 'react';
import { CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { useHomeContent } from '../../context/HomeContentContext';

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
 * High-definition Vector & Custom Image Royal Embossed Seal for Certificates & Official Awards
 * Features outer gold filigree serrated ring, crimson accent, foundation emblem or custom seal,
 * official registration stars, and authentic ribbon tails.
 * Supports auto-size adjustment based on certificate canvas shape and size.
 */
export const RoyalCertificateSeal: React.FC<RoyalCertificateSealProps> = ({
  size = 'auto',
  variant: propVariant,
  showRibbons = true,
  className = '',
  style,
  customSealUrl
}) => {
  const rawId = useId();
  const safeId = useMemo(() => rawId.replace(/[^a-zA-Z0-9_-]/g, '_'), [rawId]);
  const topPathId = `seal_top_path_${safeId}`;
  const bottomPathId = `seal_bottom_path_${safeId}`;

  // Global Context & Local Storage Integration for Dynamic Seal
  const homeContext = useHomeContent();
  const contextSeal = homeContext?.content?.certificateSealUrl || '';
  const contextVariant = (homeContext?.content as any)?.certificateSealVariant || 'gold-crimson';

  const [activeSealUrl, setActiveSealUrl] = useState<string>(() => {
    if (customSealUrl !== undefined && customSealUrl !== '') return customSealUrl;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jjf_custom_certificate_seal');
        if (stored) return stored;
      } catch {}
    }
    return contextSeal || '';
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
    if (customSealUrl !== undefined) {
      setActiveSealUrl(customSealUrl);
      setSealImgFailed(false);
    } else if (contextSeal !== undefined) {
      setActiveSealUrl(contextSeal);
      setSealImgFailed(false);
    }
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
      if (typeof detail === 'string') {
        setActiveSealUrl(detail);
        setSealImgFailed(false);
      } else if (detail && typeof detail === 'object') {
        if (detail.sealUrl !== undefined) {
          setActiveSealUrl(detail.sealUrl);
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

  const hasCustomSealImage = Boolean(activeSealUrl && !sealImgFailed);

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

      {/* Main Circular Royal Embossed Seal */}
      <div
        className="relative rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-transform shrink-0 overflow-hidden"
        style={{
          width: isAuto ? '100%' : `${dimensions.seal}px`,
          height: isAuto ? undefined : `${dimensions.seal}px`,
          aspectRatio: '1 / 1',
          maxWidth: `${dimensions.seal}px`,
          maxHeight: `${dimensions.seal}px`,
          backgroundColor: colors.bgCenter,
          border: `3px solid ${colors.rimGold}`,
          boxShadow: `0 0 0 2px ${colors.crimsonDark}, 0 4px 12px rgba(139, 0, 0, 0.25)`
        }}
      >
        {hasCustomSealImage ? (
          <div className="relative w-full h-full p-1 flex items-center justify-center bg-white/95 rounded-full overflow-hidden">
            <img
              src={activeSealUrl}
              alt="Official Certificate Seal"
              crossOrigin="anonymous"
              className="w-full h-full object-contain pointer-events-none drop-shadow-xs"
              onError={() => setSealImgFailed(true)}
            />
          </div>
        ) : (
          <>
            {/* SVG Serrated Gold Border & Curved Ring Text */}
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <defs>
                {/* Top Text Path */}
                <path
                  id={topPathId}
                  d="M 28 100 A 72 72 0 0 1 172 100"
                  fill="none"
                />
                {/* Bottom Text Path */}
                <path
                  id={bottomPathId}
                  d="M 172 100 A 72 72 0 0 1 28 100"
                  fill="none"
                />
              </defs>

              {/* Decorative Outer Beaded / Cogged Ring */}
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke={colors.rimGold}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke={colors.crimsonDark}
                strokeWidth="1.5"
              />
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="none"
                stroke={colors.rimGold}
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Top Text: Organization Name */}
              <text
                fontSize="14"
                fontWeight="900"
                fill={colors.crimsonDark}
                letterSpacing="2.5"
                textAnchor="middle"
              >
                <textPath
                  href={`#${topPathId}`}
                  xlinkHref={`#${topPathId}`}
                  startOffset="50%"
                >
                  JEEVAN JYOTI FOUNDATION
                </textPath>
              </text>

              {/* Bottom Text: Reg No & Location */}
              <text
                fontSize="12.5"
                fontWeight="800"
                fill={colors.crimsonDark}
                letterSpacing="1.8"
                textAnchor="middle"
              >
                <textPath
                  href={`#${bottomPathId}`}
                  xlinkHref={`#${bottomPathId}`}
                  startOffset="50%"
                >
                  ★ GHAZIPUR • REG. 1827 ★
                </textPath>
              </text>
            </svg>

            {/* Center Emblem with Foundation Logo */}
            <div
              className="relative z-10 rounded-full flex flex-col items-center justify-center p-1 bg-white/95 shadow-inner"
              style={{
                width: `${dimensions.logo + 16}px`,
                height: `${dimensions.logo + 16}px`,
                border: `1.5px solid ${colors.rimGold}`
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <BrandLogo size={dimensions.logo} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Center Ribbon Title */}
            <div
              className="absolute bottom-4.5 z-10 px-2 py-0.5 rounded-full font-black tracking-widest uppercase shadow-xs flex items-center gap-0.5"
              style={{
                backgroundColor: colors.crimsonDark,
                color: '#FFFFFF',
                border: `1px solid ${colors.rimGold}`,
                fontSize: `${dimensions.fontCenter}px`,
                lineHeight: 1
              }}
            >
              <span>★</span>
              <span>OFFICIAL SEAL</span>
              <span>★</span>
            </div>
          </>
        )}
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
