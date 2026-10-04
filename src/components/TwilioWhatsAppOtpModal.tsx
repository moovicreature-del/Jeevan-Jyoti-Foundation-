// ============================================================================
// JEEVAN JYOTI FOUNDATION - TWILIO WHATSAPP OTP VERIFICATION COMPONENT
// जीवन ज्योति फाउंडेशन गाजीपुर - ट्विलियो व्हाट्सएप ओटीपी सत्यापन प्रणाली
// ============================================================================
//
// 🔑 TWILIO CREDENTIALS GUIDE:
// Set your credentials in .env or Render/Vercel Environment Variables:
// 1. TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// 2. TWILIO_AUTH_TOKEN  = your_auth_token
// 3. TWILIO_WHATSAPP_NUMBER = whatsapp:+14155238886 (or your registered sender)
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ArrowRight,
  Send,
  Lock,
  RefreshCw,
  X,
  ExternalLink,
  Smartphone,
  KeyRound,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TwilioWhatsAppOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess?: (result: { phone: string; token: string }) => void;
  initialPhone?: string;
  websiteName?: string;
  title?: string;
  subtitle?: string;
}

export const TwilioWhatsAppOtpModal: React.FC<TwilioWhatsAppOtpModalProps> = ({
  isOpen,
  onClose,
  onVerificationSuccess,
  initialPhone = '',
  websiteName = 'Jeevan Jyoti Foundation Ghazipur',
  title = 'WhatsApp OTP सत्यापन',
  subtitle = 'Twilio WhatsApp API द्वारा 6-अंकीय सत्यापन कोड'
}) => {
  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  const [phoneNumber, setPhoneNumber] = useState(
    initialPhone.replace(/\D/g, '').slice(-10)
  );
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'input_phone' | 'enter_otp' | 'success'>('input_phone');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes (300 seconds)
  const [resendCooldown, setResendCooldown] = useState(45);
  const [showSandboxHelp, setShowSandboxHelp] = useState(false);
  const [serverOtpHint, setServerOtpHint] = useState<string | null>(null);
  const [directLink, setDirectLink] = useState<string | null>(null);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  const otpInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  // Sync initial phone
  useEffect(() => {
    if (initialPhone) {
      setPhoneNumber(initialPhone.replace(/\D/g, '').slice(-10));
    }
  }, [initialPhone]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 5-minute Countdown Timer
  useEffect(() => {
    if (step === 'enter_otp') {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });

        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  // Focus OTP input when step changes
  useEffect(() => {
    if (step === 'enter_otp') {
      setTimeout(() => otpInputRef.current?.focus(), 150);
    }
  }, [step]);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // Format Minutes : Seconds
  // --------------------------------------------------------------------------
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --------------------------------------------------------------------------
  // Send WhatsApp OTP via Twilio Backend
  // --------------------------------------------------------------------------
  const handleSendWhatsAppOtp = async () => {
    setErrorMessage(null);
    setStatusMessage(null);

    const clean = phoneNumber.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      setErrorMessage('कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/send-whatsapp-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: clean,
          websiteName: websiteName
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep('enter_otp');
        setCountdown(300); // 5 minutes
        setResendCooldown(45);
        setStatusMessage(data.message || 'WhatsApp पर सत्यापन कोड प्रेषित किया गया है।');
        if (data.otp) setServerOtpHint(data.otp);
        if (data.directWhatsAppLink) setDirectLink(data.directWhatsAppLink);

        toast.success(`WhatsApp OTP कोड +91 ${clean.slice(0, 3)}••••${clean.slice(-3)} पर भेजा गया!`);
      } else {
        setErrorMessage(data.message || 'OTP प्रेषण विफल रहा। कृपया पुनः प्रयास करें।');
        if (data.directWhatsAppLink) setDirectLink(data.directWhatsAppLink);
      }
    } catch (err: any) {
      setErrorMessage(`नेटवर्क त्रुटि: ${err.message || 'सर्वर से संपर्क नहीं हो सका'}`);
    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------------------------------------------------
  // Verify OTP via Backend
  // --------------------------------------------------------------------------
  const handleVerifyOtp = async () => {
    setErrorMessage(null);
    const cleanOtp = otpCode.replace(/\D/g, '');
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

    if (cleanOtp.length !== 6) {
      setErrorMessage('कृपया 6 अंकों का सही OTP कोड दर्ज करें।');
      return;
    }

    if (countdown === 0) {
      setErrorMessage('OTP की 5 मिनट की वैधता समाप्त हो गई है। कृपया "पुनः भेजें" पर क्लिक करें।');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: cleanOtp
        })
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        setStep('success');
        setVerifiedToken(data.verificationToken || `JJF_VERIFIED_${cleanPhone}`);
        toast.success('✓ WhatsApp OTP सफल सत्यापन!');

        if (onVerificationSuccess) {
          onVerificationSuccess({
            phone: `+91${cleanPhone}`,
            token: data.verificationToken || `JJF_VERIFIED_${cleanPhone}`
          });
        }
      } else {
        setErrorMessage(data.message || 'गलत OTP कोड दर्ज किया गया।');
      }
    } catch (err: any) {
      setErrorMessage(`सत्यापन त्रुटि: ${err.message || 'सर्वर से संपर्क नहीं हो सका'}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 flex flex-col max-h-[92vh]">
        {/* Header with WhatsApp Theme */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
              <MessageSquare className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-snug flex items-center gap-1.5 text-white">
                {title}
                <span className="text-[10px] bg-emerald-500/50 uppercase tracking-wider px-2 py-0.5 rounded-full font-black border border-white/30">
                  Twilio API
                </span>
              </h3>
              <p className="text-xs text-emerald-100/90 font-medium">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* STEP 1: Phone Number Input */}
          {step === 'input_phone' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">
                    WhatsApp संदेश टेम्पलेट (Template):
                  </p>
                  <p className="font-mono text-[11px] bg-white p-2 rounded-lg mt-1.5 border border-emerald-200 text-gray-700 select-all">
                    &quot;Your verification code for {websiteName} is <strong className="text-emerald-700">XXXXXX</strong>. Valid for 5 minutes.&quot;
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  व्हाट्सएप पंजीकृत मोबाइल नंबर (10-Digit Mobile)
                </label>
                <div className="flex items-center rounded-2xl border-2 border-emerald-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-200 bg-white transition-all overflow-hidden shadow-xs">
                  <div className="flex items-center gap-1.5 px-3.5 py-3 bg-emerald-50/70 border-r border-emerald-200 text-xs font-black text-emerald-950 select-none">
                    <span className="text-base">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(val);
                      setErrorMessage(null);
                    }}
                    placeholder="9876543210"
                    className="w-full px-3 py-3 text-base font-bold text-gray-900 outline-hidden tracking-wider"
                    disabled={isSending}
                    autoFocus
                  />
                  {phoneNumber.length === 10 && (
                    <div className="pr-3 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-emerald-600" />
                  आपके इस नंबर पर Twilio WhatsApp API द्वारा तुरंत OTP भेजा जाएगा।
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSendWhatsAppOtp}
                disabled={isSending || phoneNumber.length !== 10}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg active:scale-[0.99]"
              >
                {isSending ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>WhatsApp पर OTP भेजा जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>WhatsApp पर OTP प्राप्त करें (Send OTP)</span>
                  </>
                )}
              </button>

              {/* Twilio Sandbox Info Accordion */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSandboxHelp(!showSandboxHelp)}
                  className="w-full flex items-center justify-between text-[11px] text-gray-500 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    ट्विलियो सैंडबॉक्स (Twilio Sandbox) में परीक्षण कैसे करें?
                  </span>
                  <span>{showSandboxHelp ? '▲' : '▼'}</span>
                </button>

                {showSandboxHelp && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1.5 leading-relaxed">
                    <p>
                      <strong>1.</strong> Twilio Console में <strong>Develop &gt; Messaging &gt; Try WhatsApp</strong> पर जाएं।
                    </p>
                    <p>
                      <strong>2.</strong> अपने फोन से WhatsApp खोलें और Twilio नंबर <code className="bg-white px-1 py-0.5 rounded border border-gray-300 font-mono text-emerald-800">+1 415 523 8886</code> पर दिया गया कोड भेजें (उदा. <code>join &lt;your-code&gt;</code>)।
                    </p>
                    <p>
                      <strong>3.</strong> इसके बाद यह पोर्टल सीधे आपके WhatsApp पर 6-अंकीय OTP डिलीवर कर देगा!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Enter 6-digit OTP */}
          {step === 'enter_otp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">
                    +91 {phoneNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('input_phone');
                    setOtpCode('');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                >
                  नंबर बदलें
                </button>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{statusMessage}</span>
                </div>
              )}

              {/* OTP Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    व्हाट्सएप पर प्राप्त 6-अंकीय OTP कोड
                  </label>
                  <span
                    className={`text-xs font-black flex items-center gap-1 ${
                      countdown < 60 ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    वैधता: {formatTimer(countdown)}
                  </span>
                </div>

                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtpCode(val);
                      setErrorMessage(null);
                    }}
                    placeholder="••••••"
                    className="w-full px-4 py-3.5 text-center text-2xl font-black tracking-[0.5em] text-emerald-950 rounded-2xl border-2 border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 bg-white transition-all outline-hidden shadow-xs"
                    disabled={isVerifying}
                  />
                  <KeyRound className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>

                <p className="text-[11px] text-gray-500 mt-1 text-center">
                  अपने WhatsApp ऐप के नए संदेशों में कोड देखें (संदेश 5 मिनट के लिए वैध है)
                </p>
              </div>

              {/* Developer Test Helper Hint (Shown if server generated OTP) */}
              {serverOtpHint && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    परीक्षण कोड: <strong className="font-mono text-xs">{serverOtpHint}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(serverOtpHint)}
                    className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-md font-bold text-[10px] cursor-pointer"
                  >
                    स्वतः भरें (Autofill)
                  </button>
                </div>
              )}

              {/* Direct WhatsApp Web Link Fallback */}
              {directLink && (
                <a
                  href={directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp वेब/ऐप में संदेश सीधे खोलें</span>
                </a>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otpCode.length !== 6 || countdown === 0}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg active:scale-[0.99]"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>सत्यापन किया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>OTP सत्यापित करें (Verify OTP)</span>
                  </>
                )}
              </button>

              {/* Resend OTP Row */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <span className="text-gray-500">कोड नहीं मिला?</span>
                <button
                  type="button"
                  onClick={handleSendWhatsAppOtp}
                  disabled={resendCooldown > 0 || isSending}
                  className="font-bold text-emerald-700 hover:text-emerald-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0
                      ? `पुनः भेजें (${resendCooldown}s)`
                      : 'WhatsApp पर पुनः भेजें'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification Success */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-black text-gray-900">
                  सत्यापन पूर्ण हुआ! (Verified)
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  मोबाइल नंबर <strong className="text-emerald-800">+91 {phoneNumber}</strong> सफलतापूर्वक WhatsApp OTP द्वारा सत्यापित हो चुका है।
                </p>
              </div>

              {verifiedToken && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[11px] font-mono text-gray-600 break-all select-all">
                  Token: {verifiedToken}
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-sm transition-colors cursor-pointer"
              >
                आगे बढ़ें (Continue)
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Security Badge */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            256-bit SSL End-to-End WhatsApp Encryption
          </span>
          <span className="font-semibold text-emerald-800">
            Twilio API Powered
          </span>
        </div>
      </div>
    </div>
  );
};
