import React, { useState } from 'react';
import { X, Lock, User, Key, ShieldCheck, AlertCircle, Sparkles, Eye, EyeOff, UserPlus, KeyRound, Phone, ArrowRight, RotateCw } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { CreateAdminCredentialsForm } from './admin/CreateAdminCredentialsForm';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithCredentials, verifyOtpAndLogin, sendOtp } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'otp' | 'create'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // OTP Login state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginWithCredentials(username.trim(), password.trim());
      if (res.success) {
        setIsLoggedIn(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'अमान्य यूज़र आईडी या पासवर्ड। कृपया सही क्रेडेंशियल्स दर्ज करें अथवा नया बनाएं।');
      }
    } catch {
      setError('लॉगिन करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = otpPhone.replace(/\D/g, '').slice(-10);
    if (cleanDigits.length !== 10) {
      setOtpError('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें!');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      await sendOtp(cleanDigits, null);
      setIsOtpSent(true);
    } catch {
      setIsOtpSent(true);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = otpCode.replace(/\D/g, '').trim();
    if (cleanCode.length !== 6) {
      setOtpError('कृपया 6-अंकीय पूर्ण OTP दर्ज करें!');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await verifyOtpAndLogin(cleanCode, otpPhone);
      if (res.success) {
        setIsLoggedIn(true);
        if (onSuccess) onSuccess();
      } else {
        setOtpError('गलत OTP! कृपया सही 6-अंकीय सुरक्षा कोड दर्ज करें।');
      }
    } catch (err: any) {
      setOtpError(err?.message || 'गलत OTP! कृपया सही कोड दर्ज करें।');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">पदाधिकारी / एडमिन पोर्टल</h3>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  Official Administrative Access
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher: Login vs Mobile OTP vs Create */}
          {!isLoggedIn && (
            <div className="px-6 pt-4">
              <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] sm:text-xs ${
                    activeTab === 'login'
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className={`w-3.5 h-3.5 ${activeTab === 'login' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>आईडी / पासवर्ड</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('otp');
                    setOtpError('');
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] sm:text-xs ${
                    activeTab === 'otp'
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Phone className={`w-3.5 h-3.5 ${activeTab === 'otp' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>मोबाइल OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('create');
                    setError('');
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] sm:text-xs ${
                    activeTab === 'create'
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className={`w-3.5 h-3.5 ${activeTab === 'create' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>नया बनाएं</span>
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {isLoggedIn ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  प्रशासनिक लॉगिन सफल
                </h4>
                <p className="text-xs text-slate-600">
                  (जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - अधिकृत प्रशासनिक पोर्टल)
                </p>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                  आपके पास प्रमाण पत्र अनुमोदन, दान रसीद जनरेशन और स्वयंसेवक डेटाबेस का पूर्ण प्रशासनिक अधिकार है।
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  डैशबोर्ड पर जारी रखें
                </button>
              </div>
            ) : activeTab === 'create' ? (
              /* CREATE USERNAME & PASSWORD FORM */
              <CreateAdminCredentialsForm
                onSuccess={(created) => {
                  setUsername(created.userId);
                  if (onSuccess) onSuccess();
                }}
                onSwitchToLogin={(newId) => {
                  if (newId) setUsername(newId);
                  setActiveTab('login');
                }}
              />
            ) : activeTab === 'otp' ? (
              /* MOBILE OTP LOGIN FORM */
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mx-auto mb-2 border border-blue-100">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">
                    मोबाइल OTP लॉगिन (Admin OTP Login)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    अपना मोबाइल नंबर एवं 6-अंकीय OTP कोड दर्ज करके प्रवेश करें
                  </p>
                </div>

                {otpError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {!isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4" autoComplete="off">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        पंजीकृत मोबाइल नंबर (Mobile Number) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4 text-blue-700" />
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          autoComplete="off"
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-अंकीय मोबाइल नंबर दर्ज करें"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {otpLoading ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>OTP भेजा जा रहा है...</span>
                        </>
                      ) : (
                        <>
                          <span>OTP कोड प्राप्त करें (SMS / WhatsApp)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setIsOtpSent(true)}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline transition cursor-pointer"
                      >
                        पहले से प्राप्त OTP कोड सीधे दर्ज करें →
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4" autoComplete="off">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          6-अंकीय OTP कोड दर्ज करें *
                        </label>
                        {otpPhone && (
                          <span className="text-[11px] font-mono text-blue-700 font-bold">
                            +91 {otpPhone}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="• • • • • •"
                        className="w-full text-center tracking-[0.4em] py-3.5 bg-slate-50 border-2 border-blue-300 rounded-xl text-xl font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 transition font-mono"
                      />
                    </div>

                    {/* Security Notice: OTP sent to mobile & WhatsApp, hidden for privacy and security */}
                    <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>गोपनीय सुरक्षा OTP प्रेषित</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        सुरक्षा कारणों से OTP स्क्रीन पर प्रदर्शित नहीं किया जाता है। कृपया आपके पंजीकृत मोबाइल नंबर पर SMS / WhatsApp द्वारा प्राप्त 6-अंकीय कोड दर्ज करें।
                      </p>
                    </div>

                    {/* Resend OTP Button */}
                    <div className="flex items-center justify-between text-xs px-1">
                      <button
                        type="button"
                        onClick={async () => {
                          const cleanDigits = otpPhone.replace(/\D/g, '').slice(-10);
                          if (cleanDigits.length === 10) {
                            setOtpLoading(true);
                            setOtpError('');
                            try {
                              await sendOtp(cleanDigits, null);
                            } finally {
                              setOtpLoading(false);
                            }
                          }
                        }}
                        disabled={otpLoading}
                        className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer disabled:opacity-50"
                      >
                        OTP कोड पुनः भेजें (Resend OTP)
                      </button>
                      <span className="text-[11px] text-slate-500">SMS / WhatsApp</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtpSent(false);
                          setOtpCode('');
                          setOtpError('');
                        }}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        नंबर बदलें
                      </button>
                      <button
                        type="submit"
                        disabled={otpLoading || otpCode.length < 6}
                        className="flex-2 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {otpLoading ? (
                          <>
                            <RotateCw className="w-4 h-4 animate-spin" />
                            <span>सत्यापित हो रहा है...</span>
                          </>
                        ) : (
                          <>
                            <span>सत्यापित करें एवं लॉगिन करें</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* STANDARD LOGIN FORM */
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 border border-amber-200">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">
                    प्रशासनिक लॉगिन (Admin Login)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    अपना User ID एवं गोपनीय पासवर्ड दर्ज करके प्रवेश करें
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    यूज़र आईडी / उपयोगकर्ता नाम (User ID / Username) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-blue-700 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="उदा. superadmin, admin या आपका बनाया Username"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    गोपनीय पासवर्ड (Password) *
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-blue-700 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="पासवर्ड दर्ज करें"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-950 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer mt-2 disabled:opacity-50"
                >
                  {loading ? 'सत्यापित किया जा रहा है...' : 'सुरक्षित लॉगिन करें (Secure Login)'}
                </button>

                {/* Direct Link to Create Username & Password */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className="text-xs text-blue-800 hover:text-blue-950 font-black flex items-center justify-center gap-1.5 mx-auto bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition cursor-pointer w-full"
                  >
                    <UserPlus className="w-4 h-4 text-blue-700" />
                    <span>नया Username और Password बनाना चाहते हैं? यहाँ क्लिक करें</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
