// ============================================================================
// JEEVAN JYOTI FOUNDATION - FIREBASE PHONE AUTHENTICATION SYSTEM
// जीवन ज्योति फाउंडेशन गाजीपुर - अधिकृत गूगल फायरबेस फोन ओटीपी प्रमाणीकरण
// ============================================================================
//
// 🔑 FIREBASE API CONFIGURATION NOTE (यहाँ अपनी Firebase API Keys लगाएं):
// ----------------------------------------------------------------------------
// If you want to use your custom Firebase project keys, paste them in:
// 1. /firebase-applet-config.json
// 2. /index.html (inside window.__FIREBASE_CONFIG__)
// 3. Or directly into /src/lib/firebase.ts
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
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
  Sparkles,
  Smartphone,
  KeyRound
} from 'lucide-react';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth, PROJECT_ID, AUTH_DOMAIN } from '../lib/firebase';
import toast from 'react-hot-toast';

interface FirebasePhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess?: (result: { phone: string; uid?: string; token?: string }) => void;
  initialPhone?: string;
  title?: string;
  subtitle?: string;
  redirectToSuccessPage?: boolean;
}

export const FirebasePhoneAuthModal: React.FC<FirebasePhoneAuthModalProps> = ({
  isOpen,
  onClose,
  onVerificationSuccess,
  initialPhone = '',
  title = 'सुरक्षित मोबाइल OTP सत्यापन',
  subtitle = 'Google Firebase Authentication द्वारा सीधा 6-अंकीय SMS OTP',
  redirectToSuccessPage = false
}) => {
  // --------------------------------------------------------------------------
  // Component State
  // --------------------------------------------------------------------------
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [step, setStep] = useState<'input_phone' | 'input_otp' | 'verified'>('input_phone');
  
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [verifiedUserData, setVerifiedUserData] = useState<{ phone: string; uid?: string } | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize phone from props
  useEffect(() => {
    if (initialPhone) {
      const clean = initialPhone.replace(/\D/g, '').slice(-10);
      setPhoneNumber(clean);
    }
  }, [initialPhone]);

  // Handle countdown timer for Resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus OTP input when step changes
  useEffect(() => {
    if (step === 'input_otp') {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 200);
    }
  }, [step]);

  // Cleanup reCAPTCHA on unmount or modal close
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // Clean Indian 10-Digit Mobile Number
  // --------------------------------------------------------------------------
  const clean10DigitPhone = phoneNumber.replace(/\D/g, '').slice(-10);

  // --------------------------------------------------------------------------
  // Friendly Human Hindi Error Parser for Firebase Auth Exceptions
  // --------------------------------------------------------------------------
  const parseFirebasePhoneError = (err: any): string => {
    const code = err?.code || '';
    const message = err?.message || '';

    console.warn('[Firebase Phone Auth] Error code:', code, message);

    switch (code) {
      case 'auth/invalid-phone-number':
        return '⚠️ अमान्य मोबाइल नंबर! कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (उदा. 8052361666)।';
      case 'auth/missing-phone-number':
        return '⚠️ कृपया अपना 10-अंकीय मोबाइल नंबर दर्ज करें।';
      case 'auth/quota-exceeded':
        return '⚠️ आज के लिए Google SMS कोटा पूर्ण हो चुका है। कृपया कुछ समय पश्चात पुनः प्रयास करें।';
      case 'auth/too-many-requests':
        return '⛔ बहुत अधिक प्रयास किए गए हैं! सुरक्षा कारणों से यह अनुरोध रोक दिया गया है। कृपया 5-10 मिनट बाद पुनः प्रयास करें।';
      case 'auth/captcha-check-failed':
        return '🛡️ reCAPTCHA सुरक्षा जांच विफल रही। कृपया पृष्ठ को रीफ़्रेश करें और पुनः प्रयास करें।';
      case 'auth/invalid-verification-code':
        return '❌ गलत OTP कोड! कृपया अपने मोबाइल पर SMS द्वारा आया सही 6-अंकीय कोड दर्ज करें।';
      case 'auth/code-expired':
        return '⏳ इस OTP कोड की समय सीमा (Expiry) समाप्त हो चुकी है। कृपया "OTP दोबारा भेजें" पर क्लिक करें।';
      case 'auth/network-request-failed':
        return '📶 नेटवर्क कनेक्शन समस्या! कृपया अपना इंटरनेट कनेक्शन जांचकर पुनः प्रयास करें।';
      case 'auth/app-not-authorized':
        return '🔒 यह डोमेन Firebase Console में अधिकृत (Authorized Domains) सूची में नहीं है।';
      default:
        return message || 'OTP सेवा में तकनीकी समस्या आई। कृपया पुनः प्रयास करें।';
    }
  };

  // --------------------------------------------------------------------------
  // STEP 1: INITIALIZE RECAPTCHA AND TRIGGER FIREBASE signInWithPhoneNumber
  // --------------------------------------------------------------------------
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (clean10DigitPhone.length !== 10) {
      setErrorMessage('कृपया 10-अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें!');
      toast.error('अमान्य मोबाइल नंबर!');
      return;
    }

    setIsSending(true);
    setStatusMessage('Google Firebase reCAPTCHA सुरक्षा सत्यापन जांचा जा रहा है...');

    try {
      const authInstance = auth || getAuth();
      const formattedE164 = `+91${clean10DigitPhone}`;

      // Reset previous reCAPTCHA if exists
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore
        }
        recaptchaVerifierRef.current = null;
      }

      // Initialize invisible RecaptchaVerifier
      const appVerifier = new RecaptchaVerifier(authInstance, 'btn-firebase-send-otp', {
        size: 'invisible',
        callback: () => {
          console.info('Firebase invisible reCAPTCHA solved successfully.');
        },
        'expired-callback': () => {
          setErrorMessage('reCAPTCHA सत्र समाप्त हुआ। कृपया "OTP भेजें" पर पुनः क्लिक करें।');
          recaptchaVerifierRef.current = null;
        }
      });

      recaptchaVerifierRef.current = appVerifier;

      setStatusMessage(`📲 मोबाइल ${formattedE164} पर Google SMS भेजा जा रहा है...`);

      // Trigger Firebase signInWithPhoneNumber
      const confirmation = await signInWithPhoneNumber(authInstance, formattedE164, appVerifier);
      
      setConfirmationResult(confirmation);
      setStep('input_otp');
      setResendCooldown(60);
      setStatusMessage(`✓ 6-अंकीय OTP कोड मोबाइल +91 ${clean10DigitPhone} पर SMS द्वारा भेज दिया गया है।`);
      toast.success(`📲 SMS OTP भेजा गया: +91 ${clean10DigitPhone}`);
    } catch (err: any) {
      console.error('Firebase Phone Auth send error:', err);
      const friendlyErr = parseFirebasePhoneError(err);
      setErrorMessage(friendlyErr);
      toast.error(friendlyErr);
    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------------------------------------------------
  // STEP 2: VERIFY OTP CODE VIA confirmationResult.confirm(otpCode)
  // --------------------------------------------------------------------------
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanOtp = otpCode.replace(/\D/g, '').trim();
    if (cleanOtp.length < 6) {
      setErrorMessage('कृपया 6-अंकों का पूरा OTP कोड दर्ज करें!');
      toast.error('कृपया 6-अंकीय OTP कोड लिखें!');
      return;
    }

    if (!confirmationResult) {
      setErrorMessage('सत्र समाप्त हो चुका है। कृपया नया OTP कोड मंगाएं।');
      setStep('input_phone');
      return;
    }

    setIsVerifying(true);
    setStatusMessage('OTP कोड सत्यापित किया जा रहा है...');

    try {
      const userCredential = await confirmationResult.confirm(cleanOtp);
      const user = userCredential.user;

      const verifiedData = {
        phone: clean10DigitPhone,
        uid: user?.uid,
        token: await user.getIdToken().catch(() => undefined)
      };

      setVerifiedUserData(verifiedData);
      setStep('verified');
      setStatusMessage('✓ मोबाइल नंबर सफलतापूर्वक सत्यापित हुआ!');
      toast.success('🎉 मोबाइल नंबर सफलतापूर्वक सत्यापित हुआ!');

      if (onVerificationSuccess) {
        onVerificationSuccess(verifiedData);
      }

      // If redirect requested, smoothly route to /success.html
      if (redirectToSuccessPage) {
        setTimeout(() => {
          window.location.href = `/success.html?phone=${clean10DigitPhone}`;
        }, 1200);
      }
    } catch (err: any) {
      console.error('Firebase OTP verification failed:', err);
      const friendlyErr = parseFirebasePhoneError(err);
      setErrorMessage(friendlyErr);
      toast.error(friendlyErr);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Tricolor Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-300">
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {title}
              </h3>
              <p className="text-[11px] text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Status / Error Notifications */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="font-semibold leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {statusMessage && !errorMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <div className="font-semibold">{statusMessage}</div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 1: PHONE NUMBER INPUT FORM                                 */}
          {/* ================================================================ */}
          {step === 'input_phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  भारतीय मोबाइल नंबर दर्ज करें (Enter 10-Digit Mobile) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-base mr-1">🇮🇳</span>
                    <span className="text-xs font-black text-slate-700 border-r border-slate-300 pr-2">
                      +91
                    </span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    autoFocus
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''));
                      setErrorMessage(null);
                    }}
                    placeholder="उदा. 8052361666"
                    className="w-full pl-20 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-mono font-black text-slate-900 tracking-wide focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Google Firebase Authentication द्वारा सीधा SMS OTP भेजा जाएगा।</span>
                </p>
              </div>

              {/* Invisible Recaptcha Trigger Button */}
              <div>
                <button
                  id="btn-firebase-send-otp"
                  type="submit"
                  disabled={isSending || clean10DigitPhone.length !== 10}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>OTP भेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>OTP कोड भेजें (Send SMS OTP)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Technical / Key Info Note */}
              <div className="pt-2 text-center text-[10px] text-slate-400">
                सुरक्षित प्रमाणीकरण | प्रोजेक्ट: <code className="font-mono text-slate-600">{PROJECT_ID || 'Firebase Auth'}</code>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* STEP 2: 6-DIGIT OTP VERIFICATION FORM                            */}
          {/* ================================================================ */}
          {step === 'input_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4" autoComplete="off">
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="block text-slate-500 font-bold">OTP भेजा गया:</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    +91 {clean10DigitPhone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('input_phone');
                    setOtpCode('');
                    setErrorMessage(null);
                  }}
                  className="text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                >
                  नंबर बदलें
                </button>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  6-अंकीय सुरक्षा OTP कोड दर्ज करें *
                </label>
                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, ''));
                      setErrorMessage(null);
                    }}
                    placeholder="••••••"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-amber-400 rounded-2xl text-center text-xl font-mono font-black text-slate-900 tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                  />
                </div>
              </div>

              {/* Resend Cooldown Countdown */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                {resendCooldown > 0 ? (
                  <span className="text-slate-500 font-medium">
                    पुनः OTP भेजें: <strong className="text-amber-800">{resendCooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSending}
                    className="text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>OTP दोबारा भेजें (Resend OTP)</span>
                  </button>
                )}

                <span className="text-[11px] text-slate-400">10 मिनट तक मान्य</span>
              </div>

              {/* Verify OTP Button */}
              <div>
                <button
                  type="submit"
                  disabled={isVerifying || otpCode.length < 6}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>सत्यापित किया जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>OTP सत्यापित करें (Verify & Confirm)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* STEP 3: VERIFIED CELEBRATION SCREEN                             */}
          {/* ================================================================ */}
          {step === 'verified' && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-black text-[11px] uppercase tracking-wider border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Verified Successfully</span>
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  सत्यापन पूर्ण हुआ!
                </h4>
                <p className="text-xs text-slate-600">
                  मोबाइल <strong className="text-emerald-900 font-mono">+91 {verifiedUserData?.phone}</strong> का Google Firebase Phone Auth प्रमाणीकरण सफल रहा।
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {redirectToSuccessPage ? (
                  <a
                    href={`/success.html?phone=${verifiedUserData?.phone || clean10DigitPhone}`}
                    className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>सत्यापन पृष्ठ पर जाएं (Redirect to success.html)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    जारी रखें (Continue)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>जीवन ज्योति फाउंडेशन गाजीपुर</span>
          <span className="font-mono text-emerald-700 font-bold">100% Secure SSL</span>
        </div>
      </div>
    </div>
  );
};
