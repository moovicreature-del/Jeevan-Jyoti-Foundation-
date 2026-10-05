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
          const customLogo = localStorage.getItem('jjf_custom_logo');
          if (customLogo) parsed.appLogoUrl = customLogo;
          const isThumbDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
          if (isThumbDeleted) {
            parsed.appThumbnailUrl = '';
          } else {
            const customThumb = localStorage.getItem('jjf_custom_thumbnail');
            if (customThumb && customThumb !== '/pwa-icon-512.png') {
              parsed.appThumbnailUrl = customThumb;
            }
          }
          const customSeal = localStorage.getItem('jjf_custom_certificate_seal');
          if (customSeal !== null) parsed.certificateSealUrl = customSeal;
          const customSealVariant = localStorage.getItem('jjf_custom_certificate_seal_variant');
          if (customSealVariant) parsed.certificateSealVariant = customSealVariant as any;
          return parsed;
        }
        const customLogo = localStorage.getItem('jjf_custom_logo');
        const isThumbDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
        const customThumb = isThumbDeleted ? '' : localStorage.getItem('jjf_custom_thumbnail');
        const customSeal = localStorage.getItem('jjf_custom_certificate_seal');
        const customSealVariant = localStorage.getItem('jjf_custom_certificate_seal_variant');
        if (customLogo || customThumb || customSeal) {
          return {
            ...DEFAULT_HOME_CONTENT,
            appLogoUrl: customLogo || '',
            appThumbnailUrl: (customThumb && customThumb !== '/pwa-icon-512.png') ? customThumb : '',
            certificateSealUrl: customSeal || '',
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
      setContent((prev) => ({
        ...prev,
        appLogoUrl: newLogo
      }));
    };

    // 4. रियल-टाइम थंबनेल चेंज इवेंट लिसनर
    const handleThumbnailChanged = (e: CustomEvent<string>) => {
      const newThumb = typeof e.detail === 'string' ? e.detail : '';
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

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-logo-changed' as any, handleLogoChanged);
      window.addEventListener('jjf-thumbnail-changed' as any, handleThumbnailChanged);
      window.addEventListener('jjf-seal-changed' as any, handleSealChanged);
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
