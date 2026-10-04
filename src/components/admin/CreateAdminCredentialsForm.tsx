// ============================================================================
// JEEVAN JYOTI FOUNDATION - CREATE ADMIN & SUPER ADMIN CREDENTIALS FORM
// जीवन ज्योति फाउंडेशन - अधिकृत मोबाइल OTP सत्यापन उपरांत नया एडमिन/सुपर एडमिन लॉगिन निर्माण
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  KeyRound,
  ShieldCheck,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Crown,
  RotateCw,
  ArrowRight,
  Send,
  Check,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  Unlock,
  AlertTriangle,
  BadgeCheck
} from 'lucide-react';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth as defaultAuth } from '../../lib/firebase';
import {
  createOrSetAdminCredentials,
  checkRegisteredAdminMobile,
  DEFAULT_ADMIN_CREDENTIALS
} from '../../services/adminCredentialsService';
import { logAdminOtpAttempt } from '../../services/adminOtpLogService';
import { sendRealOtp, verifyRealOtp } from '../../services/realSmsOtpService';
import { sendWhatsAppOtp } from '../../services/whatsappCloudService';
import { useAdminAuth, SUPER_ADMIN_PHONE, ADMIN_PHONE } from '../../context/AdminAuthContext';
import { AdminRole } from '../../types';
import toast from 'react-hot-toast';

interface CreateAdminCredentialsFormProps {
  onSuccess?: (created: { userId: string; role: AdminRole }) => void;
  onSwitchToLogin?: (createdUserId?: string) => void;
  defaultRole?: 'superadmin' | 'admin';
}

export const CreateAdminCredentialsForm: React.FC<CreateAdminCredentialsFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  defaultRole = 'superadmin'
}) => {
  const { loginWithCredentials } = useAdminAuth();

  // ==========================================================================
  // STAGE 1: ADMINISTRATIVE AUTHORIZATION VERIFICATION (प्रशासनिक प्रमाणीकरण द्वार)
  // ==========================================================================
  // Must be verified on a registered Admin/Super Admin phone number before opening the registration part!
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Manual phone entry (Starts completely empty - user must manually enter)
  const [authMobile, setAuthMobile] = useState<string>('');
  const [deliveryChannel, setDeliveryChannel] = useState<'sms' | 'whatsapp'>('sms');

  // OTP State
  const [otpInput, setOtpInput] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpSending, setIsOtpSending] = useState<boolean>(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState<boolean>(false);
  const [otpSessionToken, setOtpSessionToken] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Verified Authorizer Info
  const [verifiedAuthorizer, setVerifiedAuthorizer] = useState<{
    name: string;
    role: 'superadmin' | 'admin';
    mobile: string;
  } | null>(null);

  // ==========================================================================
  // STAGE 2: REGISTRATION FORM (खुलने वाला रजिस्ट्रेशन भाग)
  // ==========================================================================
  const [selectedRole, setSelectedRole] = useState<'superadmin' | 'admin'>(defaultRole);
  const [adminName, setAdminName] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Submission & Success
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdSuccess, setCreatedSuccess] = useState<{
    userId: string;
    role: AdminRole;
    message: string;
  } | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Real-time inspection of entered mobile number
  const mobileInspection = checkRegisteredAdminMobile(authMobile);

  // Cooldown countdown effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // SETUP FIREBASE RECAPTCHA VERIFIER (Web / React signInWithPhoneNumber pattern)
  // --------------------------------------------------------------------------
  const getOrCreateRecaptchaVerifier = (): RecaptchaVerifier | null => {
    try {
      const authInstance = defaultAuth || getAuth();
      if (recaptchaVerifierRef.current) {
        return recaptchaVerifierRef.current;
      }

      // Check if button container exists
      const btnEl = document.getElementById('btn-send-admin-auth-otp');
      if (!btnEl) return null;

      const verifier = new RecaptchaVerifier(authInstance, 'btn-send-admin-auth-otp', {
        size: 'invisible',
        callback: () => {
          console.info('Firebase reCAPTCHA solved for Admin Registration verification');
        },
        'expired-callback': () => {
          toast.error('reCAPTCHA सत्र समाप्त। कृपया दोबारा प्रयास करें।');
        }
      });

      recaptchaVerifierRef.current = verifier;
      return verifier;
    } catch (err) {
      console.warn('RecaptchaVerifier initialization notice (will use SMS fallback):', err);
      return null;
    }
  };

  // --------------------------------------------------------------------------
  // 1. SEND OTP TO REGISTERED ADMIN / SUPER ADMIN MOBILE NUMBER
  // --------------------------------------------------------------------------
  const handleSendAuthorizationOtp = async () => {
    const cleanPhone = authMobile.replace(/\D/g, '').slice(-10);

    if (cleanPhone.length !== 10) {
      toast.error('कृपया 10-अंकीय मान्य मोबाइल नंबर दर्ज करें!');
      return;
    }

    if (!mobileInspection.isRegistered) {
      toast.error(
        '⚠️ यह मोबाइल नंबर संस्था के अधिकृत एडमिन अथवा सुपर एडमिन के रूप में पंजीकृत नहीं है!'
      );
      return;
    }

    setIsOtpSending(true);

    try {
      const recipientName = mobileInspection.name || 'अधिकृत प्रशासनिक अधिकारी';
      const purpose =
        mobileInspection.role === 'superadmin' ? 'superadmin_login' : 'admin_login';

      let sentViaFirebase = false;

      // 1. If SMS channel chosen, try Firebase Phone Auth first (as requested by user)
      if (deliveryChannel === 'sms') {
        try {
          const authInstance = defaultAuth || getAuth();
          const verifier = getOrCreateRecaptchaVerifier();

          if (verifier) {
            const formattedPhone = `+91${cleanPhone}`;
            const confirmation = await signInWithPhoneNumber(
              authInstance,
              formattedPhone,
              verifier
            );
            setConfirmationResult(confirmation);
            sentViaFirebase = true;
            toast.success(
              `📲 Firebase SMS द्वारा 6-अंकीय OTP मोबाइल +91-${cleanPhone} पर भेज दिया गया है!`
            );
          }
        } catch (fbErr: any) {
          console.warn(
            'Firebase signInWithPhoneNumber failed or blocked by iframe domain, falling back to direct SMS & WhatsApp gateway:',
            fbErr?.message || fbErr
          );
        }
      }

      // 2. Direct Real SMS & WhatsApp Gateway (Fallback or if WhatsApp selected)
      if (!sentViaFirebase) {
        const gatewayRes = await sendRealOtp({
          phone: cleanPhone,
          recipientName: recipientName,
          purpose: purpose,
          preferredChannel: deliveryChannel === 'whatsapp' ? 'whatsapp' : 'sms'
        });

        if (gatewayRes.success) {
          setOtpSessionToken(gatewayRes.sessionToken || '');
          if (deliveryChannel === 'whatsapp') {
            toast.success(
              `💬 6-अंकीय OTP कोड मोबाइल +91-${cleanPhone} के WhatsApp पर भेज दिया गया है!`
            );
          } else {
            toast.success(
              `📲 6-अंकीय OTP कोड मोबाइल +91-${cleanPhone} पर SMS द्वारा भेज दिया गया है!`
            );
          }
        } else {
          toast.error(
            gatewayRes.message || 'OTP भेजने में विफलता हुई। कृपया नेटवर्क की जांच करें।'
          );
          setIsOtpSending(false);
          return;
        }
      }

      setIsOtpSent(true);
      setResendCooldown(60);
    } catch (err: any) {
      console.error('Error sending authorization OTP:', err);
      toast.error('OTP सेवा से संपर्क करने में तकनीकी समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsOtpSending(false);
    }
  };

  // --------------------------------------------------------------------------
  // 2. VERIFY OTP AND UNLOCK THE REGISTRATION PART
  // --------------------------------------------------------------------------
  const handleVerifyAuthorizationOtp = async () => {
    const cleanDigits = otpInput.replace(/\D/g, '').trim();
    const cleanPhone = authMobile.replace(/\D/g, '').slice(-10);

    if (cleanDigits.length < 6) {
      toast.error('कृपया 6-अंकों का मान्य OTP कोड दर्ज करें!');
      return;
    }

    setIsOtpVerifying(true);

    try {
      // 0. Manual OTP checks for Super Admin (121015) & Admin (110215)
      if (cleanDigits === '121015') {
        const authorizer = {
          name: 'श्री शैलेश प्रधान जी',
          role: 'superadmin' as const,
          mobile: cleanPhone || SUPER_ADMIN_PHONE
        };
        setVerifiedAuthorizer(authorizer);
        setSelectedRole('superadmin');
        setAdminName('श्री शैलेश प्रधान जी');
        setIsUnlocked(true);

        logAdminOtpAttempt({
          phone: cleanPhone || SUPER_ADMIN_PHONE,
          role: 'superadmin',
          status: 'SUCCESS',
          otpEntered: cleanDigits,
          action: 'MANUAL_OTP_CREDENTIALS_AUTH_SUCCESS',
          details: 'क्रेडेंशियल्स निर्माण हेतु सुपर एडमिन सुरक्षा कोड (121015) सफल प्रमाणीकरण।',
          adminName: 'श्री शैलेश प्रधान जी'
        }).catch(() => {});

        toast.success(`🎉 सुपर एडमिन सुरक्षा कोड सत्यापित हुआ! नया क्रेडेंशियल्स फॉर्म अनलॉक हो गया।`, { duration: 5000 });
        setIsOtpVerifying(false);
        return;
      }

      if (cleanDigits === '110215') {
        const authorizer = {
          name: 'अधिकृत एडमिन (व्यवस्थापक)',
          role: 'admin' as const,
          mobile: cleanPhone || ADMIN_PHONE
        };
        setVerifiedAuthorizer(authorizer);
        setSelectedRole('admin');
        setAdminName('अधिकृत एडमिन (व्यवस्थापक)');
        setIsUnlocked(true);

        logAdminOtpAttempt({
          phone: cleanPhone || ADMIN_PHONE,
          role: 'admin',
          status: 'SUCCESS',
          otpEntered: cleanDigits,
          action: 'MANUAL_OTP_CREDENTIALS_AUTH_SUCCESS',
          details: 'क्रेडेंशियल्स निर्माण हेतु एडमिन सुरक्षा कोड (110215) सफल प्रमाणीकरण।',
          adminName: 'अधिकृत एडमिन (व्यवस्थापक)'
        }).catch(() => {});

        toast.success(`🎉 एडमिन सुरक्षा कोड सत्यापित हुआ! नया क्रेडेंशियल्स फॉर्म अनलॉक हो गया।`, { duration: 5000 });
        setIsOtpVerifying(false);
        return;
      }

      let isVerified = false;

      // 1. If we have a Firebase Phone Auth ConfirmationResult
      if (confirmationResult) {
        try {
          await confirmationResult.confirm(cleanDigits);
          isVerified = true;
        } catch (fbVerifyErr) {
          console.warn('Firebase confirmation failed, trying gateway verification fallback...');
        }
      }

      // 2. If not verified yet, verify through the backend/token service
      if (!isVerified) {
        const verifyRes = await verifyRealOtp({
          phone: cleanPhone,
          otp: cleanDigits,
          sessionToken: otpSessionToken
        });

        if (verifyRes.verified) {
          isVerified = true;
        } else {
          logAdminOtpAttempt({
            phone: cleanPhone,
            role: mobileInspection.role || 'unknown',
            status: 'FAILED',
            otpEntered: cleanDigits,
            action: 'MANUAL_OTP_CREDENTIALS_AUTH_FAILED',
            details: 'क्रेडेंशियल्स फॉर्म अनलॉक करने हेतु अमान्य OTP दर्ज किया गया।'
          }).catch(() => {});

          toast.error(verifyRes.message || 'गलत OTP कोड! कृपया सही 6-अंकीय कोड दर्ज करें।');
          setIsOtpVerifying(false);
          return;
        }
      }

      // On successful verification:
      const authorizer = {
        name: mobileInspection.name || 'पंजीकृत अधिकारी',
        role: (mobileInspection.role || 'admin') as 'superadmin' | 'admin',
        mobile: cleanPhone
      };

      setVerifiedAuthorizer(authorizer);
      setSelectedRole(authorizer.role);
      setAdminName(
        authorizer.role === 'superadmin' ? 'श्री शैलेश प्रधान जी' : 'अधिकृत एडमिन (व्यवस्थापक)'
      );

      // UNLOCK THE REGISTRATION PART!
      setIsUnlocked(true);

      toast.success(
        `🎉 अधिकृत मोबाइल (+91-${cleanPhone}) सत्यापित हुआ! नया एडमिन/सुपर एडमिन रजिस्ट्रेशन फ़ॉर्म अनलॉक हो गया।`,
        { duration: 5000 }
      );
    } catch (err: any) {
      console.error('OTP verification error:', err);
      toast.error('अमान्य OTP कोड! कृपया अपने मोबाइल/WhatsApp पर आया सही 6-अंकीय कोड दर्ज करें।');
    } finally {
      setIsOtpVerifying(false);
    }
  };

  // --------------------------------------------------------------------------
  // 3. SUBMIT NEW ADMIN / SUPER ADMIN USERNAME & PASSWORD
  // --------------------------------------------------------------------------
  const handleCreateCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUnlocked || !verifiedAuthorizer) {
      toast.error('सुरक्षा त्रुटि: पंजीकरण फ़ॉर्म अनलॉक नहीं है!');
      return;
    }

    const cleanUsername = newUsername.trim().toLowerCase();
    const cleanPassword = newPassword.trim();
    const cleanMobile = verifiedAuthorizer.mobile;

    if (!cleanUsername || cleanUsername.length < 3) {
      toast.error('Username कम से कम 3 अक्षरों का होना चाहिए!');
      return;
    }

    if (/\s/.test(cleanUsername)) {
      toast.error('Username में स्पेस (खाली स्थान) नहीं होना चाहिए!');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      toast.error('Password कम से कम 6 अक्षरों का होना चाहिए!');
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      toast.error('पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं!');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrSetAdminCredentials({
        role: selectedRole,
        name: adminName.trim() || verifiedAuthorizer.name,
        mobile: cleanMobile,
        newUserId: cleanUsername,
        newPassword: cleanPassword,
        isOtpVerified: true,
        modifierName: verifiedAuthorizer.name
      });

      if (result.success) {
        setCreatedSuccess({
          userId: cleanUsername,
          role: selectedRole,
          message: result.message
        });
        toast.success(`🎉 नया Username '${cleanUsername}' एवं Password सफलतापूर्वक सुरक्षित हुआ!`, {
          duration: 5000
        });
        if (onSuccess) {
          onSuccess({ userId: cleanUsername, role: selectedRole });
        }
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      console.error('Credentials creation error:', err);
      toast.error('क्रेडेंशियल सुरक्षित करने में तकनीकी समस्या आई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant login with created credentials
  const handleInstantLogin = async () => {
    if (!createdSuccess) return;
    setIsSubmitting(true);
    try {
      const res = await loginWithCredentials(createdSuccess.userId, newPassword.trim());
      if (res.success && onSuccess) {
        onSuccess(createdSuccess);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // SUCCESS SCREEN
  // --------------------------------------------------------------------------
  if (createdSuccess) {
    return (
      <div className="text-center py-6 px-4 space-y-5 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md border-2 border-emerald-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            क्रेडेंशियल्स सफलतापूर्वक सक्रिय
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            नया Username व Password बन गया!
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            अब आप इस Username और Password से कभी भी सीधे प्रशासनिक लॉगिन कर सकते हैं।
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 max-w-sm mx-auto shadow-xs">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-bold">प्रशासनिक पद:</span>
            <span className="font-black text-blue-900">
              {createdSuccess.role === 'superadmin' ? '👑 सुपर एडमिन' : '🛡️ अधिकृत एडमिन'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-bold">नया Username:</span>
            <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {createdSuccess.userId}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-bold">पंजीकृत नाम:</span>
            <span className="font-bold text-slate-800">{adminName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold">सत्यापित मोबाइल:</span>
            <span className="font-mono font-bold text-slate-700">
              +91 {verifiedAuthorizer?.mobile}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 max-w-sm mx-auto">
          <button
            type="button"
            onClick={handleInstantLogin}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>लॉगिन हो रहा है...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>इस नए Username से तुरंत लॉगिन करें</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {onSwitchToLogin && (
            <button
              type="button"
              onClick={() => onSwitchToLogin(createdSuccess.userId)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              लॉगिन स्क्रीन पर वापस जाएं
            </button>
          )}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 1: LOCKED STATE -> REQUIRE REGISTERED MOBILE & OTP TO OPEN
  // (Admin aur super admin new login banane wala registration part
  //  admin or super admin ke register mobile number ke manual enter
  //  aur us number me msg ya WhatsApp ke otp verification ke baad open ho)
  // ==========================================================================
  if (!isUnlocked) {
    return (
      <div className="space-y-5 text-left animate-in fade-in zoom-in-95">
        {/* Invisible container for Firebase reCAPTCHA */}
        <div id="recaptcha-admin-reg-gate"></div>

        {/* Security Shield Header */}
        <div className="p-4 bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-indigo-500/10 rounded-2xl border-2 border-amber-300/80 text-center space-y-2 shadow-xs">
          <div className="w-13 h-13 bg-gradient-to-tr from-amber-500 to-amber-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-amber-500/30">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase tracking-wider border border-amber-300">
              <ShieldAlert className="w-3 h-3 text-amber-700" />
              <span>प्रशासनिक सुरक्षा प्रमाणीकरण द्वार</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              नया एडमिन/सुपर एडमिन लॉगिन निर्माण
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
              नया एडमिन या सुपर एडमिन लॉगिन / क्रेडेंशियल बनाने हेतु संस्था के पंजीकृत{' '}
              <strong className="text-blue-900">सुपर एडमिन अथवा एडमिन का मोबाइल नंबर</strong>{' '}
              मैन्युअल दर्ज करें। उस नंबर पर मैसेज (SMS) या WhatsApp OTP सत्यापन के बाद ही नया रजिस्ट्रेशन फ़ॉर्म खुलेगा।
            </p>
          </div>
        </div>

        {/* Manual Mobile Number Entry */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              1. अधिकृत पंजीकृत मोबाइल नंबर (Manual Enter) *
            </label>
            <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              मैन्युअल दर्ज करें
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4 text-blue-800" />
            </div>
            <div className="absolute inset-y-0 left-10 flex items-center text-xs font-bold text-slate-600 border-r border-slate-200 pr-2 my-2">
              +91
            </div>
            <input
              type="tel"
              maxLength={10}
              autoComplete="off"
              value={authMobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setAuthMobile(val);
                setIsOtpSent(false);
                setOtpInput('');
              }}
              placeholder="10-अंकीय पंजीकृत मोबाइल नंबर दर्ज करें (उदा. 8052361666)"
              className="w-full pl-22 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition font-mono"
            />
          </div>

          {/* Real-time Recognition Banner */}
          {authMobile.length === 10 && (
            <div className="animate-in fade-in duration-200">
              {mobileInspection.isRegistered ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-950 font-bold">
                  {mobileInspection.role === 'superadmin' ? (
                    <Crown className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <span className="block font-black text-emerald-900">
                      ✓ अधिकृत {mobileInspection.role === 'superadmin' ? 'सुपर एडमिन' : 'एडमिन'}{' '}
                      नंबर मान्य है
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      {mobileInspection.name} (+91 {mobileInspection.mobile})
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    ⚠️ यह नंबर संस्था के पंजीकृत एडमिन या सुपर एडमिन के रूप में दर्ज नहीं है। कृपया
                    मान्य पंजीकृत नंबर दर्ज करें (उदा. 8052361666 या 8948165666)।
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delivery Channel Selector: SMS or WhatsApp */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            2. OTP प्राप्ति का माध्यम चुनें (Delivery Channel) *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryChannel('sms')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                deliveryChannel === 'sms'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>📱 मोबाइल SMS (Firebase)</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryChannel('whatsapp')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                deliveryChannel === 'whatsapp'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>💬 WhatsApp पर OTP</span>
            </button>
          </div>
        </div>

        {/* Send OTP Action Button */}
        {!isOtpSent ? (
          <div>
            <button
              id="btn-send-admin-auth-otp"
              type="button"
              onClick={handleSendAuthorizationOtp}
              disabled={isOtpSending || authMobile.length !== 10 || !mobileInspection.isRegistered}
              className="w-full py-3.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-950 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-800/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOtpSending ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>सुरक्षा OTP भेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {deliveryChannel === 'whatsapp'
                      ? 'WhatsApp पर OTP कोड प्राप्त करें'
                      : 'मोबाइल SMS द्वारा OTP कोड प्राप्त करें'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* OTP Input & Verification Box */
          <div className="p-4 bg-slate-50 border-2 border-blue-200 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-blue-900">
                <KeyRound className="w-4 h-4 text-blue-700" />
                <span>3. प्रेषित 6-अंकीय OTP कोड दर्ज करें *</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                भेजा गया: +91 {authMobile}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="6-अंकीय OTP कोड लिखें"
                className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl text-center text-lg font-mono font-black text-slate-900 tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
              {resendCooldown > 0 ? (
                <span>पुनः OTP भेजें: <strong>{resendCooldown} सेकंड बाद</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendAuthorizationOtp}
                  className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>OTP कोड दोबारा भेजें</span>
                </button>
              )}

              <span className="text-slate-400">माध्यम: {deliveryChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}</span>
            </div>

            <button
              type="button"
              onClick={handleVerifyAuthorizationOtp}
              disabled={isOtpVerifying || otpInput.length < 6}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isOtpVerifying ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>OTP सत्यापित किया जा रहा है...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-amber-300" />
                  <span>✓ OTP सत्यापित करें और रजिस्ट्रेशन फ़ॉर्म खोलें</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Back to standard login */}
        {onSwitchToLogin && (
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onSwitchToLogin()}
              className="text-xs text-slate-600 hover:text-slate-900 font-bold transition cursor-pointer"
            >
              ← वापस मानक लॉगिन स्क्रीन पर जाएं
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: UNLOCKED STATE -> REGISTRATION PART IS NOW OPEN!
  // (Only opens after successful OTP verification on registered admin number)
  // ==========================================================================
  return (
    <form
      onSubmit={handleCreateCredentialsSubmit}
      className="space-y-4 text-left animate-in fade-in duration-300"
      autoComplete="off"
    >
      {/* Verified Authorization Banner */}
      <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-emerald-950">
                ✓ सुरक्षा प्रमाणीकरण सफल: रजिस्ट्रेशन फ़ॉर्म अनलॉक
              </span>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2 py-0.2 rounded-full">
                सत्यापित
              </span>
            </div>
            <p className="text-[11px] text-emerald-800">
              अधिकृत अधिकारी: <strong>{verifiedAuthorizer?.name}</strong> (+91 {verifiedAuthorizer?.mobile})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsUnlocked(false);
            setIsOtpSent(false);
            setOtpInput('');
            toast.success('रजिस्ट्रेशन फ़ॉर्म पुनः लॉक कर दिया गया है।');
          }}
          className="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold bg-white px-2 py-1 rounded-lg border border-emerald-300 transition cursor-pointer shrink-0 ml-2"
          title="फ़ॉर्म पुनः लॉक करें"
        >
          🔒 पुनः लॉक करें
        </button>
      </div>

      <div className="text-center space-y-1 pb-1">
        <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-1 border border-amber-200">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-900">
          नया प्रशासनिक Username और Password बनाएं
        </h3>
        <p className="text-xs text-slate-500">
          प्रशासनिक कार्य हेतु अपना मनचाहा User ID व नया गोपनीय पासवर्ड सेट करें
        </p>
      </div>

      {/* 1. Administrative Role Selection */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          1. प्रशासनिक पद चुनें (Select Admin Role) *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('superadmin');
              setAdminName('श्री शैलेश प्रधान जी');
            }}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
              selectedRole === 'superadmin'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Crown
                className={`w-5 h-5 ${
                  selectedRole === 'superadmin' ? 'text-amber-600' : 'text-slate-400'
                }`}
              />
              {selectedRole === 'superadmin' && (
                <span className="w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <div>
              <span className="block text-xs font-black text-slate-900">
                सुपर एडमिन (Super Admin)
              </span>
              <span className="text-[10px] text-slate-500">संस्था प्रमुख / मुख्य प्रशासक</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setAdminName('अधिकृत एडमिन (व्यवस्थापक)');
            }}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
              selectedRole === 'admin'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <ShieldCheck
                className={`w-5 h-5 ${
                  selectedRole === 'admin' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              {selectedRole === 'admin' && (
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <div>
              <span className="block text-xs font-black text-slate-900">अधिकृत एडमिन (Admin)</span>
              <span className="text-[10px] text-slate-500">प्रशासनिक व्यवस्थापक</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Admin Name */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1">
          2. अधिकारी का नाम (Full Name) *
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder="नाम दर्ज करें"
            required
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>
      </div>

      {/* 3. Desired Username (User ID) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            3. नया Username (यूज़र आईडी बनाएं) *
          </label>
          <span className="text-[10px] text-slate-400">बिना स्पेस, कम से कम 3 अक्षर</span>
        </div>
        <div className="relative">
          <User className="w-4 h-4 text-blue-700 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            autoComplete="off"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
            placeholder="उदा. shailesh, superadmin, admin_ghazipur"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>
        {newUsername.trim().length > 0 && (
          <p className="text-[10px] text-blue-800 mt-1 font-semibold">
            लॉगिन यूज़र आईडी होगी:{' '}
            <span className="font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {newUsername.trim().toLowerCase()}
            </span>
          </p>
        )}
      </div>

      {/* 4. Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            4. नया गोपनीय पासवर्ड (Password) *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="कम से कम 6 अक्षर"
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            पासवर्ड पुनः दर्ज करें (Confirm) *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="पासवर्ड दोबारा लिखें"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>
        </div>
      </div>

      {/* Password Match Status */}
      {confirmPassword.length > 0 && (
        <div className="text-[11px]">
          {newPassword === confirmPassword ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> दोनों पासवर्ड मेल खा रहे हैं।
            </span>
          ) : (
            <span className="text-red-600 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> पासवर्ड मेल नहीं खा रहे हैं!
            </span>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-950 text-white font-black text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>सुरक्षित किया जा रहा है...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>💾 नया Username और Password सुरक्षित करें</span>
            </>
          )}
        </button>
      </div>

      {onSwitchToLogin && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => onSwitchToLogin()}
            className="text-xs text-blue-700 hover:text-blue-900 font-bold cursor-pointer underline"
          >
            पहले से Username और Password है? यहाँ क्लिक करके लॉगिन करें
          </button>
        </div>
      )}
    </form>
  );
};
