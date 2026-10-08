import React, { useState, useEffect } from 'react';
import { useHomeContent } from '../../context/HomeContentContext';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export interface BrandLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'default' | 'white' | 'dark';
  watermark?: boolean;
  opacity?: number;
  id?: string;
  alt?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  customLogoUrl?: string;
  forceVector?: boolean;
  onClick?: (e: React.MouseEvent<SVGSVGElement | HTMLImageElement | HTMLDivElement>) => void;
}

/**
 * BrandLogo - Universal Dynamic NGO Logo Component with Fallback Vector Emblem
 * Dynamically renders custom uploaded app logo or high-precision official JJF vector emblem.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 200, 
  className = '',
  variant = 'default',
  watermark = false,
  opacity,
  id,
  alt = 'जीवन ज्योति फाउंडेशन आधिकारिक लोगो',
  style = {},
  customLogoUrl,
  forceVector = false,
  onClick
}) => {
  const homeContext = useHomeContent();
  const contextLogo = homeContext?.content?.appLogoUrl || '';

  const [localCustomLogo, setLocalCustomLogo] = useState<string>(() => {
    if (customLogoUrl !== undefined && customLogoUrl !== '') return customLogoUrl;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jjf_custom_logo');
        if (stored) return stored;
      } catch {
        // Ignore
      }
    }
    return contextLogo || '';
  });

  const [imgFailed, setImgFailed] = useState<boolean>(false);

  // Sync with contextLogo or customLogoUrl
  useEffect(() => {
    if (customLogoUrl !== undefined) {
      setLocalCustomLogo(customLogoUrl);
      setImgFailed(false);
    } else if (contextLogo !== undefined) {
      setLocalCustomLogo(contextLogo || '');
      setImgFailed(false);
    }
  }, [customLogoUrl, contextLogo]);

  // Listen for instant custom events for immediate updates across all components
  useEffect(() => {
    const handleLogoChange = (e: CustomEvent<string>) => {
      const newLogo = typeof e.detail === 'string' ? e.detail : '';
      setLocalCustomLogo(newLogo);
      if (newLogo && typeof window !== 'undefined') {
        localStorage.removeItem('jjf_logo_permanently_deleted');
      }
      setImgFailed(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-logo-changed' as any, handleLogoChange);
      return () => {
        window.removeEventListener('jjf-logo-changed' as any, handleLogoChange);
      };
    }
  }, []);

  const resolvedSize = typeof size === 'number' 
    ? size 
    : (size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 80 : size);

  // Determine active logo URL to render:
  // Priority: 1. explicit prop, 2. context logo, 3. local event state, 4. local storage, 5. official default vector emblem
  let activeLogoUrl = '';
  const isPermanentlyDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_logo_permanently_deleted') === 'true';

  if (customLogoUrl !== undefined && customLogoUrl !== '') {
    activeLogoUrl = customLogoUrl;
  } else if (contextLogo && contextLogo.trim()) {
    activeLogoUrl = contextLogo.trim();
  } else if (localCustomLogo && localCustomLogo.trim()) {
    activeLogoUrl = localCustomLogo.trim();
  } else if (typeof window !== 'undefined' && !isPermanentlyDeleted) {
    try {
      activeLogoUrl = localStorage.getItem('jjf_custom_logo') || '';
    } catch {
      activeLogoUrl = '';
    }
  } else {
    activeLogoUrl = '';
  }

  // Reset imgFailed when the URL changes
  useEffect(() => {
    setImgFailed(false);
  }, [activeLogoUrl]);

  const finalOpacity = watermark ? (opacity ?? 0.12) : (opacity ?? 1);
  const effectiveLogoUrl = activeLogoUrl || '/logo.svg';

  // Render official logo (custom or official default emblem)
  if (effectiveLogoUrl && !imgFailed && !forceVector) {
    const dimensionStyle: React.CSSProperties = typeof resolvedSize === 'number' 
      ? { width: `${resolvedSize}px`, height: `${resolvedSize}px` } 
      : { width: resolvedSize, height: resolvedSize };

    return (
      <img
        id={id}
        src={getOptimizedImageUrl(effectiveLogoUrl, { width: typeof resolvedSize === 'number' ? resolvedSize * 2 : 256, quality: 80 })}
        alt={alt}
        className={`object-contain rounded-full inline-block shrink-0 ${className} ${watermark ? 'pointer-events-none select-none' : ''}`}
        style={{
          ...dimensionStyle,
          opacity: finalOpacity,
          ...(watermark ? { filter: 'contrast(1.05)' } : {}),
          ...style
        }}
        onError={() => setImgFailed(true)}
        onClick={onClick}
        loading="eager"
        decoding="async"
      />
    );
  }

  return null;
};

export default BrandLogo;

