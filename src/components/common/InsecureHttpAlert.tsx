import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { useHttpsCheck } from '../../hooks/useHttpsCheck';

export const InsecureHttpAlert: React.FC = () => {
  const { isInsecureHttp, upgradeToHttps } = useHttpsCheck();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('jjf_insecure_http_alert_dismissed') === 'true';
  });

  if (!isInsecureHttp || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('jjf_insecure_http_alert_dismissed', 'true');
    } catch {}
  };

  return (
    <div
      role="alert"
      className="relative z-50 bg-gradient-to-r from-red-700 via-rose-700 to-amber-800 text-white px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg border-b-2 border-yellow-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Icon and warning copy */}
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="p-1.5 bg-white/20 rounded-lg shrink-0 mt-0.5 border border-white/30 text-yellow-300 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm">
            <div className="font-black text-yellow-200 flex items-center gap-1.5 flex-wrap">
              <AlertTriangle className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>असुरक्षित कनेक्शन चेतावनी (Insecure HTTP Detected)</span>
              <span className="text-[11px] bg-red-900/80 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-300/40">
                PWA Disabled by Browser
              </span>
            </div>
            <p className="mt-0.5 text-white/95 leading-snug text-xs sm:text-[13px]">
              यह ऐप असुरक्षित <strong>HTTP</strong> पर चल रहा है। ब्राउज़र सुरक्षा नियमों (W3C PWA Policy) के तहत <strong>PWA ऐप इंस्टॉलेशन (Installation)</strong> और ऑफ़लाइन सेवाएँ असुरक्षित कनेक्शन पर ब्राउज़र द्वारा स्वतः अक्षम (Disabled) कर दी जाती हैं।
            </p>
            <p className="text-[11px] text-yellow-100/90 font-mono mt-0.5 hidden sm:block">
              PWA installation & service worker features are disabled over insecure HTTP. Please access using HTTPS.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={upgradeToHttps}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black rounded-lg text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-yellow-200"
            title="सुरक्षित HTTPS पर रीडायरेक्ट करें"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>सुरक्षित HTTPS पर जाएँ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss insecure HTTP alert"
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
            title="चेतावनी बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsecureHttpAlert;
