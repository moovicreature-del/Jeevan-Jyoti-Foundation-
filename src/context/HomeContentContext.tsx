// ============================================================================
// JEEVAN JYOTI FOUNDATION - HOME CONTENT REALTIME CONTEXT
// होम पेज सामग्री और नोटिस बोर्ड का लाइव रियल-टाइम स्टेट मैनेजर
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppHomeContent, NoticeItem } from '../types';
import {
  DEFAULT_HOME_CONTENT,
  subscribeToHomeContent,
  subscribeToNotices,
  applyDynamicAppThumbnail
} from '../services/adminService';

interface HomeContentContextType {
  content: AppHomeContent;
  notices: NoticeItem[];
  activeNotices: NoticeItem[];
  isLoading: boolean;
}

const HomeContentContext = createContext<HomeContentContextType>({
  content: DEFAULT_HOME_CONTENT,
  notices: [],
  activeNotices: [],
  isLoading: true
});

export const HomeContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppHomeContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('jjf_home_content');
        if (local) {
          const parsed = JSON.parse(local);

          // Purge stale or corrupted media paths
          if (parsed.appThumbnailUrl && (parsed.appThumbnailUrl.includes('1791445209912') || parsed.appThumbnailUrl.includes('1791445272050') || parsed.appThumbnailUrl.includes('old'))) {
            parsed.appThumbnailUrl = '';
            localStorage.removeItem('jjf_custom_thumbnail');
          }
          if (parsed.appLogoUrl && (parsed.appLogoUrl.includes('1791445209912') || parsed.appLogoUrl.includes('1791445272050') || parsed.appLogoUrl.includes('old'))) {
            parsed.appLogoUrl = '';
            localStorage.removeItem('jjf_custom_logo');
          }

          if (parsed.appLogoUrl) {
            localStorage.removeItem('jjf_logo_permanently_deleted');
          } else {
            const isLogoDeleted = localStorage.getItem('jjf_logo_permanently_deleted') === 'true';
            const customLogo = isLogoDeleted ? '' : (localStorage.getItem('jjf_custom_logo') || '');
            if (customLogo && !customLogo.includes('1791445209912') && !customLogo.includes('1791445272050')) {
              parsed.appLogoUrl = customLogo;
              localStorage.removeItem('jjf_logo_permanently_deleted');
            } else if (isLogoDeleted) {
              parsed.appLogoUrl = '';
            }
          }

          if (parsed.appThumbnailUrl && parsed.appThumbnailUrl !== '/pwa-icon-512.png') {
            localStorage.removeItem('jjf_thumb_permanently_deleted');
          } else {
            const isThumbDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
            const customThumb = isThumbDeleted ? '' : (localStorage.getItem('jjf_custom_thumbnail') || '');
            if (customThumb && customThumb !== '/pwa-icon-512.png' && !customThumb.includes('1791445209912') && !customThumb.includes('1791445272050')) {
              parsed.appThumbnailUrl = customThumb;
              localStorage.removeItem('jjf_thumb_permanently_deleted');
            } else if (isThumbDeleted) {
              parsed.appThumbnailUrl = '';
            }
          }
          const isSealDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_seal_permanently_deleted') === 'true';
          const customSeal = isSealDeleted ? '' : localStorage.getItem('jjf_custom_certificate_seal');
          if (customSeal && customSeal.trim() && !customSeal.includes('old') && !customSeal.includes('76347e15')) {
            parsed.certificateSealUrl = customSeal.trim();
          } else {
            parsed.certificateSealUrl = '';
          }
          const customSealVariant = localStorage.getItem('jjf_custom_certificate_seal_variant');
          if (customSealVariant) parsed.certificateSealVariant = customSealVariant as any;
          return parsed;
        }
        const customLogo = localStorage.getItem('jjf_custom_logo');
        const isThumbDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
        const customThumb = isThumbDeleted ? '' : localStorage.getItem('jjf_custom_thumbnail');
        const isSealDeleted = localStorage.getItem('jjf_seal_permanently_deleted') === 'true';
        const customSeal = isSealDeleted ? '' : localStorage.getItem('jjf_custom_certificate_seal');
        const validSeal = customSeal && !customSeal.includes('old') && !customSeal.includes('76347e15') ? customSeal : '';
        const customSealVariant = localStorage.getItem('jjf_custom_certificate_seal_variant');
        if (customLogo || customThumb || customSeal) {
          return {
            ...DEFAULT_HOME_CONTENT,
            appLogoUrl: customLogo || '',
            appThumbnailUrl: (customThumb && customThumb !== '/pwa-icon-512.png') ? customThumb : '',
            certificateSealUrl: validSeal,
            certificateSealVariant: (customSealVariant as any) || 'gold-crimson'
          };
        }
      } catch {
        // Ignore
      }
    }
    return DEFAULT_HOME_CONTENT;
  });
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Ensure meta tags sync on startup with any custom thumbnail
    if (content?.appThumbnailUrl) {
      applyDynamicAppThumbnail(content.appThumbnailUrl);
    }

    // 1. होम पेज कंटेंट का रियल-टाइम लिसनर
    const unsubContent = subscribeToHomeContent((updatedContent) => {
      setContent(updatedContent);
      if (updatedContent?.appThumbnailUrl) {
        applyDynamicAppThumbnail(updatedContent.appThumbnailUrl);
      }
      setIsLoading(false);
    });

    // 2. नोटिस बोर्ड का रियल-टाइम लिसनर
    const unsubNotices = subscribeToNotices((updatedNotices) => {
      setNotices(updatedNotices);
    });

    // 3. रियल-टाइम लोगो चेंज इवेंट लिसनर
    const handleLogoChanged = (e: CustomEvent<string>) => {
      const newLogo = typeof e.detail === 'string' ? e.detail : '';
      if (typeof window !== 'undefined') {
        try {
          if (newLogo) {
            localStorage.removeItem('jjf_logo_permanently_deleted');
            localStorage.setItem('jjf_custom_logo', newLogo);
          } else {
            localStorage.removeItem('jjf_custom_logo');
            localStorage.setItem('jjf_logo_permanently_deleted', 'true');
          }
        } catch {}
      }
      setContent((prev) => ({
        ...prev,
        appLogoUrl: newLogo
      }));
    };

    // 4. रियल-टाइम थंबनेल चेंज इवेंट लिसनर
    const handleThumbnailChanged = (e: CustomEvent<string>) => {
      const newThumb = typeof e.detail === 'string' ? e.detail : '';
      if (typeof window !== 'undefined') {
        try {
          if (newThumb && newThumb !== '/pwa-icon-512.png') {
            localStorage.removeItem('jjf_thumb_permanently_deleted');
            localStorage.setItem('jjf_custom_thumbnail', newThumb);
          } else {
            localStorage.removeItem('jjf_custom_thumbnail');
            localStorage.setItem('jjf_thumb_permanently_deleted', 'true');
          }
        } catch {}
      }
      setContent((prev) => ({
        ...prev,
        appThumbnailUrl: newThumb
      }));
      applyDynamicAppThumbnail(newThumb);
    };

    // 5. रियल-टाइम सर्टिफिकेट मुहर (Official Seal) चेंज इवेंट लिसनर
    const handleSealChanged = (e: CustomEvent<any>) => {
      const detail = e.detail;
      if (typeof detail === 'string') {
        setContent((prev) => ({
          ...prev,
          certificateSealUrl: detail
        }));
      } else if (detail && typeof detail === 'object') {
        setContent((prev) => ({
          ...prev,
          ...(detail.sealUrl !== undefined ? { certificateSealUrl: detail.sealUrl } : {}),
          ...(detail.sealVariant ? { certificateSealVariant: detail.sealVariant } : {})
        }));
      }
    };

    // 6. रियल-टाइम होम पेज समग्र कंटेंट (फ़ोटो गैलरी, टेक्स्ट व सेटिंग्स) चेंज इवेंट लिसनर
    const handleContentUpdated = (e: CustomEvent<AppHomeContent>) => {
      if (e.detail && typeof e.detail === 'object') {
        setContent(e.detail);
        if (e.detail.appThumbnailUrl) {
          applyDynamicAppThumbnail(e.detail.appThumbnailUrl);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-logo-changed' as any, handleLogoChanged);
      window.addEventListener('jjf-thumbnail-changed' as any, handleThumbnailChanged);
      window.addEventListener('jjf-seal-changed' as any, handleSealChanged);
      window.addEventListener('jjf-content-updated' as any, handleContentUpdated);
    }

    return () => {
      try {
        if (typeof unsubContent === 'function') unsubContent();
      } catch (err) {
        console.warn('Unsub content notice:', err);
      }
      try {
        if (typeof unsubNotices === 'function') unsubNotices();
      } catch (err) {
        console.warn('Unsub notices notice:', err);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('jjf-logo-changed' as any, handleLogoChanged);
        window.removeEventListener('jjf-thumbnail-changed' as any, handleThumbnailChanged);
        window.removeEventListener('jjf-seal-changed' as any, handleSealChanged);
        window.removeEventListener('jjf-content-updated' as any, handleContentUpdated);
      }
    };
  }, []);

  const activeNotices = notices.filter((n) => n.isActive);

  return (
    <HomeContentContext.Provider
      value={{
        content,
        notices,
        activeNotices,
        isLoading
      }}
    >
      {children}
    </HomeContentContext.Provider>
  );
};

export const useHomeContent = () => {
  const context = useContext(HomeContentContext);
  return context;
};
