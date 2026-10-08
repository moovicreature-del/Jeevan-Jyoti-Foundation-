import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Share, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, Globe, Monitor, HelpCircle } from 'lucide-react';
import { useHomeContent } from '../context/HomeContentContext';

export const PwaInstallBanner: React.FC = () => {
  const homeContext = useHomeContent();
  const content = homeContext?.content;

  const [activeThumbnail, setActiveThumbnail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const isDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
        if (!isDeleted) {
          const localThumb = localStorage.getItem('jjf_custom_thumbnail');
          if (localThumb && localThumb !== '/pwa-icon-512.png') return localThumb;
        }
      } catch {}
    }
    return content?.appThumbnailUrl || content?.appLogoUrl || '/pwa-icon-512.png';
  });

  useEffect(() => {
    if (content?.appThumbnailUrl && content.appThumbnailUrl !== '/pwa-icon-512.png') {
      setActiveThumbnail(content.appThumbnailUrl);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jjf_thumb_permanently_deleted');
      }
    } else {
      const isDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
      if (isDeleted) {
        setActiveThumbnail(content?.appLogoUrl || '/pwa-icon-512.png');
      } else if (content?.appLogoUrl) {
        setActiveThumbnail(content.appLogoUrl);
      } else {
        setActiveThumbnail('/pwa-icon-512.png');
      }
    }
  }, [content?.appThumbnailUrl, content?.appLogoUrl]);

  useEffect(() => {
    const handleThumbChange = (e: CustomEvent<string>) => {
      const newThumb = typeof e.detail === 'string' ? e.detail : '';
      if (newThumb && newThumb !== '/pwa-icon-512.png') {
        setActiveThumbnail(newThumb);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jjf_thumb_permanently_deleted');
        }
      } else {
        setActiveThumbnail(content?.appLogoUrl || '/pwa-icon-512.png');
      }
    };
    window.addEventListener('jjf-thumbnail-changed' as any, handleThumbChange);
    return () => window.removeEventListener('jjf-thumbnail-changed' as any, handleThumbChange);
  }, [content?.appLogoUrl]);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');

  useEffect(() => {
    // 1. Check if running inside iframe (e.g. AI Studio sandbox preview)
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;
    setIsInIframe(inIframe);

    // 2. Check if already installed / running in standalone mode
    const isStandaloneMode =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://'));

    setIsStandalone(isStandaloneMode);

    // 3. Detect OS / Device
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      const iosDevice = /iphone|ipad|ipod/.test(ua);
      const androidDevice = /android/.test(ua);
      const desktopDevice = !iosDevice && !androidDevice;

      setIsIos(iosDevice);
      setIsAndroid(androidDevice);
      setIsDesktop(desktopDevice);

      if (iosDevice) setActiveTab('ios');
      else if (androidDevice) setActiveTab('android');
      else setActiveTab('desktop');

      // Check session dismissal
      const isDismissed = sessionStorage.getItem('jjf_pwa_banner_dismissed') === 'true';
      if (isDismissed || isStandaloneMode) {
        setShowBanner(false);
      }
    }

    // 4. Capture native beforeinstallprompt (Android Chrome / Edge / Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowBanner(false);
      setShowModal(false);
      setDeferredPrompt(null);
    };

    const handleOpenCustomModal = () => {
      setShowModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('open-pwa-install-modal', handleOpenCustomModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-pwa-install-modal', handleOpenCustomModal);
    };
  }, []);

  const handleInstallClick = async () => {
    // If native prompt is available (e.g. running in top level Chrome / Android)
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowBanner(false);
          setShowModal(false);
        }
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.debug('Error invoking deferredPrompt:', err);
      }
    }

    // Otherwise show rich guided modal with Direct Open button
    setShowModal(true);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('jjf_pwa_banner_dismissed', 'true');
  };

  const handleOpenInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <>
      {/* Top Floating PWA Banner (If not dismissed & not in standalone mode) */}
      {showBanner && !isStandalone && (
        <div className="relative z-40 bg-gradient-to-r from-[#8B0000] via-[#9E1B1B] to-[#700000] text-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-md border-b-2 border-amber-400">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            {/* Left: Organization icon & text */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/20 border border-amber-300/80 p-0.5 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                <img
                  src={activeThumbnail}
                  alt="App Icon"
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/pwa-icon-512.png';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-300 truncate">
                  <Smartphone className="w-3.5 h-3.5 text-yellow-300 animate-bounce shrink-0" />
                  <span>फाउंडेशन आधिकारिक ऐप इंस्टॉल करें (Install App)</span>
                </div>
                <p className="text-[11px] text-amber-100 hidden md:block">
                  होम स्क्रीन पर 1-टैप में जोड़ें — सुपरफास्ट लोड, बिना इंटरनेट प्रमाण पत्र सत्यापन व डिजिटल रसीद सुविधा।
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-[#8B0000] rounded-xl text-xs font-black shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 border border-yellow-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ऐप इंस्टॉल करें</span>
              </button>
              <button
                onClick={handleDismiss}
                aria-label="Close install banner"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full cursor-pointer transition-colors"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete PWA Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-400 relative my-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-3">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <img
                  src={activeThumbnail}
                  alt="Jeevan Jyoti Foundation App Icon"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-white"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/pwa-icon-512.png';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full border-2 border-white shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#8B0000] font-['Cinzel',serif]">
                JEEVAN JYOTI FOUNDATION APP
              </h3>
              <p className="text-xs text-gray-700 font-bold mt-0.5">
                आधिकारिक मोबाइल व डेस्कटॉप ऐप इंस्टॉलेशन
              </p>
            </div>

            {/* Live App Icon Confirmation Box */}
            <div className="mb-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-2.5 flex items-center gap-3">
              <img
                src={activeThumbnail}
                alt="Active App Icon"
                className="w-11 h-11 rounded-xl object-cover border border-amber-300 shadow-xs bg-white shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/pwa-icon-512.png';
                }}
              />
              <div className="min-w-0 text-left">
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>ऐप थंबनेल लोगो</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    लाइव सक्रिय
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 truncate">
                  इंस्टॉल होने के बाद यह थंबनेल लोगो आपके होम-स्क्रीन पर दिखाई देगा।
                </p>
              </div>
            </div>

            {/* If in iframe banner warning / recommendation */}
            {isInIframe && (
              <div className="mb-4 bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 text-amber-950 text-xs">
                <div className="font-black flex items-center gap-1.5 text-amber-900 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>पूर्वावलोकन (Preview) मोड से डायरेक्ट इंस्टॉल:</span>
                </div>
                <p className="text-gray-700 text-[11px] leading-relaxed mb-2.5">
                  ब्राउज़र सुरक्षा नियमों के अनुसार, 1-क्लिक ऑटो-इंस्टॉल प्रॉम्प्ट के लिए ऐप को नए टैब/सीधे ब्राउज़र में खोलना आवश्यक है:
                </p>
                <button
                  onClick={handleOpenInNewTab}
                  className="w-full py-2 bg-gradient-to-r from-[#8B0000] to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-lg font-black text-xs shadow flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>नए टैब में खोलें और 1-क्लिक में इंस्टॉल करें</span>
                </button>
              </div>
            )}

            {/* Platform Selector Tabs */}
            <div className="flex border-b border-gray-200 mb-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'android'
                    ? 'border-[#8B0000] text-[#8B0000] bg-red-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android (Chrome)</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'ios'
                    ? 'border-[#8B0000] text-[#8B0000] bg-red-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Share className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'desktop'
                    ? 'border-[#8B0000] text-[#8B0000] bg-red-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Laptop / PC</span>
              </button>
            </div>

            {/* Tab 1: Android Chrome */}
            {activeTab === 'android' && (
              <div className="space-y-2.5 text-xs text-gray-700 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>अपने Chrome ब्राउज़र के ऊपर दाईं ओर <strong>3 डॉट्स (⋮) मेन्यू</strong> पर टैप करें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>सूची में <strong>'Install app'</strong> या <strong>'Add to Home screen (होम स्क्रीन में जोड़ें)'</strong> पर क्लिक करें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>पॉपअप में <strong>'Install'</strong> बटन दबाएं। कुछ ही सेकंड में ऐप आपके फोन में इंस्टॉल हो जाएगा!</p>
                </div>
              </div>
            )}

            {/* Tab 2: iPhone / iPad */}
            {activeTab === 'ios' && (
              <div className="space-y-2.5 text-xs text-gray-700 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>सफारी (Safari) ब्राउज़र के नीचे स्थित <strong className="text-gray-900 inline-flex items-center gap-1 font-bold"><Share className="w-3.5 h-3.5 text-blue-600 inline" /> Share (शेयर)</strong> बटन पर टैप करें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>मेन्यू को नीचे स्क्रॉल करके <strong className="text-gray-900 font-bold">'Add to Home Screen'</strong> विकल्प चुनें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>ऊपर दाईं ओर <strong className="text-gray-900 font-bold">'Add'</strong> दबाएं। ऐप आपके होम स्क्रीन पर उपलब्ध हो जाएगा।</p>
                </div>
              </div>
            )}

            {/* Tab 3: Desktop Chrome / Edge */}
            {activeTab === 'desktop' && (
              <div className="space-y-2.5 text-xs text-gray-700 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>ब्राउज़र की एड्रेस बार (URL bar) के दाईं ओर स्थित <strong className="text-gray-900 font-bold">कंप्यूटर/इंस्टॉल आइकन (⊕)</strong> पर क्लिक करें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>यदि आइकन न दिखे तो <strong>3 डॉट्स (⋮) ➔ 'Save and share' / 'Apps' ➔ 'Install Jeevan Jyoti Foundation'</strong> चुनें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>डेस्कटॉप पर स्वतंत्र विंडो में ऐप शुरू हो जाएगा!</p>
                </div>
              </div>
            )}

            {/* Key App Features Highlight */}
            <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-700">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ऑफ़लाइन सर्टिफिकेट सत्यापन</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>डिजिटल दान रसीदें</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={handleOpenInNewTab}
                className="flex-1 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>ब्राउज़र में खोलें</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-[#8B0000] hover:bg-[#A52A2A] text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-colors"
              >
                समझ गया (Got It)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallBanner;
