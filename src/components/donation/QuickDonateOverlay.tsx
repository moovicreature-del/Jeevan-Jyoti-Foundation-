import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Minimize2,
  Maximize2,
  Smartphone,
  Building2,
  CheckCircle2,
  Download,
  Share2,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Receipt,
  CreditCard
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { DonationRecord } from '../../types';
import { useDonationPaymentSettings } from '../../hooks/useDonationPaymentSettings';
import { BrandLogo } from '../common/BrandLogo';
import { RealPaymentGatewayModal, GatewayStep, PaymentMethodType, DonorPaymentData } from './RealPaymentGatewayModal';
import { trackPaymentMethodClick } from '../../services/paymentAnalyticsService';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface QuickDonateOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationSuccess?: (donation: DonationRecord) => void;
  onOpenFullForm?: () => void;
  onOpenAdminSettings?: () => void;
  initialAmount?: number;
}

export const QuickDonateOverlay: React.FC<QuickDonateOverlayProps> = ({
  isOpen,
  onClose,
  onDonationSuccess,
  onOpenFullForm,
  onOpenAdminSettings,
  initialAmount = 500
}) => {
  const { settings: paymentSettings } = useDonationPaymentSettings();

  // State
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('Shiksha & Seva (शिक्षा व भोजन सेवा)');
  const [showBankDetails, setShowBankDetails] = useState<boolean>(true);
  const [showClaimForm, setShowClaimForm] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Quick Donation Receipt Claim Details
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState<boolean>(false);

  const qrContainerRef = useRef<HTMLDivElement>(null);

  // Selected Quick Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'gpay' | 'phonepe' | 'paytm' | 'card' | 'upi'>('gpay');

  // Currently Active Direct Bank Account Payment App (without QR)
  const [activeDirectApp, setActiveDirectApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'card' | null>(null);

  // Real Payment Gateway Modal state for Direct Account / Card Payments
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);
  const [gatewayStep, setGatewayStep] = useState<GatewayStep>('method_screen');
  const [gatewayMethod, setGatewayMethod] = useState<PaymentMethodType>('card');

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const activeUpiId = paymentSettings.upiId || FOUNDATION_INFO.upiId;
  const activePayeeName = paymentSettings.upiPayeeName || FOUNDATION_INFO.nameEnglish;

  // Active Foundation Bank Details
  const activeBankName = paymentSettings.bankName || FOUNDATION_INFO.bankName || 'BANK OF INDIA';
  const activeAccountName = paymentSettings.bankAccountName || FOUNDATION_INFO.bankAccountName || 'JEEVAN JYOTI FOUNDATION';
  const activeAccountNumber = paymentSettings.bankAccountNumber || FOUNDATION_INFO.bankAccountNumber || '718720110000323';
  const activeIfsc = paymentSettings.bankIfsc || FOUNDATION_INFO.bankIfsc || 'BKID0007187';
  const activeBranch = paymentSettings.bankBranch || FOUNDATION_INFO.bankBranch || 'Daudpur, Mohammadabad, Ghazipur - 233303';

  // Preset Amounts
  const presetAmounts = [100, 250, 500, 1000, 2100, 5100, 11000];

  // Dynamic UPI Payment Deep Link (General UPI ID)
  const noteText = `Jeevan Jyoti Foundation - ${selectedPurpose}`;
  const upiUrl = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(noteText)}`;

  // Mobile Deep Links (UPI ID)
  const gpayUrl = `gpay://upi/pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(noteText)}`;
  const phonepeUrl = `phonepe://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(noteText)}`;
  const paytmUrl = `paytmmp://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(noteText)}`;

  // Direct Account Payment Links (Bank Account + IFSC standard NPCI UPI address)
  const targetIfscClean = (activeIfsc || 'BKID0007187').trim().toUpperCase();
  const accountUpiAddress = `${activeAccountNumber}@${targetIfscClean}.ifsc.npci`;
  const accountNoteText = `JJF Direct Account - ${selectedPurpose}`;
  const gpayAccountUrl = `gpay://upi/pay?pa=${accountUpiAddress}&pn=${encodeURIComponent(activeAccountName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(accountNoteText)}`;
  const phonepeAccountUrl = `phonepe://pay?pa=${accountUpiAddress}&pn=${encodeURIComponent(activeAccountName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(accountNoteText)}`;
  const paytmAccountUrl = `paytmmp://pay?pa=${accountUpiAddress}&pn=${encodeURIComponent(activeAccountName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(accountNoteText)}`;

  // Safe and resilient clipboard copy helper (works in secure contexts, iframes, and mobile browsers)
  const fallbackCopyText = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  };

  const copyTextSafely = (text: string): boolean => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => {
          fallbackCopyText(text);
        });
        return true;
      } else {
        return fallbackCopyText(text);
      }
    } catch {
      return fallbackCopyText(text);
    }
  };

  // Generate appropriate deep link based on selected method and destination (Direct Bank Account vs General UPI ID)
  const generateDeepLink = (method: 'gpay' | 'phonepe' | 'paytm' | 'card' | 'upi', forDirectAccount: boolean = false): string => {
    // In NPCI specification, pa={accountNumber}@{ifsc}.ifsc.npci routes directly into the beneficiary's bank account.
    // Literal @ is required so mobile apps' regex patterns instantly match the Account+IFSC VPA domain.
    const ifscUpper = (activeIfsc || 'BKID0007187').trim().toUpperCase();
    const targetPa = forDirectAccount ? `${activeAccountNumber}@${ifscUpper}.ifsc.npci` : activeUpiId;
    const targetPn = forDirectAccount ? activeAccountName : activePayeeName;
    const targetNote = forDirectAccount ? `JJF Bank A/c - ${selectedPurpose}` : `JJF Donation - ${selectedPurpose}`;
    const amtQuery = finalAmount > 0 ? `&am=${finalAmount}` : '';
    // mode=02 explicitly specifies Account+IFSC transfer mode in NPCI UPI specs
    const directParams = forDirectAccount
      ? `&mode=02&purpose=00&orgid=000000&acc=${activeAccountNumber}&accountNumber=${activeAccountNumber}&account=${activeAccountNumber}&accNo=${activeAccountNumber}&accountNo=${activeAccountNumber}&an=${activeAccountNumber}&ifsc=${ifscUpper}&ifscCode=${ifscUpper}&bk_ifsc=${ifscUpper}&beneficiaryIfsc=${ifscUpper}&beneficiaryIFSC=${ifscUpper}&beneficiaryName=${encodeURIComponent(activeAccountName)}&benename=${encodeURIComponent(activeAccountName)}&name=${encodeURIComponent(activeAccountName)}&mc=8398`
      : '';
    const baseParams = `pa=${targetPa}&pn=${encodeURIComponent(targetPn)}${amtQuery}&cu=INR&tn=${encodeURIComponent(targetNote)}${directParams}`;

    switch (method) {
      case 'gpay':
        return `gpay://upi/pay?${baseParams}`;
      case 'phonepe':
        return `phonepe://pay?${baseParams}`;
      case 'paytm':
        return `paytmmp://pay?${baseParams}`;
      case 'upi':
        return `upi://pay?${baseParams}`;
      case 'card':
        return '';
      default:
        return `upi://pay?${baseParams}`;
    }
  };

  // Helper to automatically open the user's mobile payment app directly with bank details
  const openMobilePaymentApp = (
    deepLink: string,
    appName: string,
    androidPackage?: string,
    forDirectAccount: boolean = false,
    methodKey?: string
  ) => {
    if (!deepLink) return;

    // Automatically copy formatted Bank Account & IFSC details to clipboard
    // PhonePe, Google Pay, Paytm & modern UPI apps auto-detect Account Number and IFSC Code together from clipboard
    // so both Account Number and IFSC Code automatically paste/fill without manual re-typing
    if (forDirectAccount) {
      try {
        const ifscUpper = (activeIfsc || 'BKID0007187').trim().toUpperCase();
        const autoPasteDetails = `Account Number: ${activeAccountNumber}\nIFSC: ${ifscUpper}\nName: ${activeAccountName}\nBank: ${activeBankName}`;
        copyTextSafely(autoPasteDetails);
      } catch {}
    }

    const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
    const queryString = deepLink.includes('?') ? deepLink.split('?')[1] : '';

    let targetLink = deepLink;

    if (isAndroid && androidPackage && queryString) {
      if (methodKey === 'phonepe') {
        // Direct PhonePe Intent targeted specifically to PhonePe package to open "To Bank / Self A/c -> To Account Number & IFSC"
        targetLink = `intent://pay?${queryString}#Intent;scheme=phonepe;package=${androidPackage};action=android.intent.action.VIEW;end`;
      } else if (methodKey === 'gpay') {
        // Direct Google Pay Intent targeted specifically to Google Pay to open "Bank Transfer"
        targetLink = `intent://upi/pay?${queryString}#Intent;scheme=upi;package=${androidPackage};action=android.intent.action.VIEW;end`;
      } else {
        targetLink = `intent://upi/pay?${queryString}#Intent;scheme=upi;package=${androidPackage};action=android.intent.action.VIEW;end`;
      }
    }

    try {
      const anchor = document.createElement('a');
      anchor.href = targetLink;
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      setTimeout(() => {
        try {
          if (document.body.contains(anchor)) {
            document.body.removeChild(anchor);
          }
        } catch {}
      }, 300);
    } catch {
      window.location.href = targetLink;
    }

    // Fallback: If custom intent URL didn't switch within 400ms on Android, also attempt direct app scheme
    if (isAndroid && targetLink.startsWith('intent:') && queryString) {
      setTimeout(() => {
        try {
          const directSchemeLink =
            methodKey === 'phonepe'
              ? `phonepe://pay?${queryString}`
              : methodKey === 'gpay'
              ? `gpay://upi/pay?${queryString}`
              : `upi://pay?${queryString}`;
          window.location.href = directSchemeLink;
        } catch {}
      }, 400);
    }

    // Specific guidance toast notifications with Account Number and IFSC auto-fill confirmation
    if (forDirectAccount) {
      const ifscUpper = (activeIfsc || 'BKID0007187').trim().toUpperCase();
      if (methodKey === 'phonepe') {
        toast.success(
          `✓ PhonePe: खाता संख्या (${activeAccountNumber}) व IFSC (${ifscUpper}) स्वतः भर कर खोला जा रहा है... (क्लिपबोर्ड में दोनों ऑटो-पेस्ट हेतु तैयार)`,
          {
            icon: '💜',
            id: 'phonepe-bank-toast',
            duration: 5000
          }
        );
      } else if (methodKey === 'gpay') {
        toast.success(
          `✓ Google Pay: खाता संख्या (${activeAccountNumber}) व IFSC (${ifscUpper}) स्वतः भर कर खोला जा रहा है... (क्लिपबोर्ड में दोनों ऑटो-पेस्ट हेतु तैयार)`,
          {
            icon: '🔵',
            id: 'gpay-bank-toast',
            duration: 5000
          }
        );
      } else {
        toast.success(`✓ ${appName}: बैंक खाता (${activeAccountNumber}) व IFSC (${ifscUpper}) स्वतः भर कर खोला जा रहा है... (क्लिपबोर्ड में दोनों ऑटो-पेस्ट हेतु तैयार)`, {
          icon: '📲',
          id: 'app-launch-toast',
          duration: 4000
        });
      }
    } else {
      toast.success(`✓ ${appName} में ₹${finalAmount > 0 ? finalAmount : 500} भुगतान हेतु ऐप खोला जा रहा है...`, {
        icon: '📲',
        id: 'app-launch-toast',
        duration: 3500
      });
    }
  };

  // Handler when user selects a payment method: generates deep link & automatically opens app
  const handleSelectPaymentMethod = (method: 'gpay' | 'phonepe' | 'paytm' | 'card' | 'upi', forDirectAccount: boolean = false) => {
    setSelectedPaymentMethod(method);

    // Track payment method click for future donor preference analytics
    trackPaymentMethodClick({
      method,
      channel: method === 'card' ? 'gateway_card' : forDirectAccount ? 'direct_bank_account' : 'upi_intent',
      amount: finalAmount > 0 ? finalAmount : 500,
      purpose: selectedPurpose,
      isDirectAccount: forDirectAccount
    });

    if (method === 'card') {
      setGatewayMethod('card');
      setGatewayStep('method_screen');
      setIsGatewayOpen(true);
      toast.success('डेबिट/क्रेडिट कार्ड पेमेंट (3D Secure) खोला जा रहा है...', {
        icon: '💳',
        id: 'card-gateway-toast'
      });
      return;
    }

    const appInfo: Record<string, { name: string; pkg?: string }> = {
      gpay: { name: 'Google Pay', pkg: 'com.google.android.apps.nbu.paisa.user' },
      phonepe: { name: 'PhonePe', pkg: 'com.phonepe.app' },
      paytm: { name: 'Paytm', pkg: 'net.one97.paytm' },
      upi: { name: 'Any UPI' },
      card: { name: 'Credit / Debit Card' }
    };

    const target = appInfo[method] || { name: 'UPI' };
    const link = generateDeepLink(method, forDirectAccount);
    openMobilePaymentApp(link, target.name, target.pkg, forDirectAccount, method);
  };

  // Direct Account Payment Selection Handler:
  // "qr ko nhi balki directly payment app ke bank account pay open ho aur usme required sabhi bank details automatically yaha se fill ho jaye"
  const handleDirectAccountPayment = (method: 'gpay' | 'phonepe' | 'paytm' | 'card') => {
    setActiveDirectApp(method);

    // Track direct account payment method click for donor preference analytics
    trackPaymentMethodClick({
      method,
      channel: method === 'card' ? 'gateway_card' : 'direct_bank_account',
      amount: finalAmount > 0 ? finalAmount : 500,
      purpose: selectedPurpose,
      isDirectAccount: true
    });

    if (method === 'card') {
      setGatewayMethod('card');
      setGatewayStep('method_screen');
      setIsGatewayOpen(true);
      toast.success('कार्ड द्वारा सीधे संस्था बैंक खाते में भुगतान हेतु गेटवे सक्रिय किया गया', {
        icon: '💳',
        id: 'card-account-toast'
      });
      return;
    }

    const appInfo: Record<string, { name: string; pkg?: string }> = {
      gpay: { name: 'Google Pay', pkg: 'com.google.android.apps.nbu.paisa.user' },
      phonepe: { name: 'PhonePe', pkg: 'com.phonepe.app' },
      paytm: { name: 'Paytm', pkg: 'net.one97.paytm' }
    };

    const target = appInfo[method];
    const link = generateDeepLink(method, true);
    openMobilePaymentApp(link, target ? target.name : 'Payment App', target ? target.pkg : undefined, true, method);
  };

  // Donor Data payload for RealPaymentGatewayModal
  const donorDataForGateway: DonorPaymentData = {
    name: donorName.trim() || 'शुभचिंतक दानदाता (Well-wisher Donor)',
    phone: donorPhone.trim() || '9876543210',
    email: donorEmail.trim() || undefined,
    panNumber: donorPan.trim() || undefined,
    amount: finalAmount > 0 ? finalAmount : 500,
    purpose: selectedPurpose
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, fieldName: string) => {
    copyTextSafely(text);
    setCopiedField(fieldName);
    toast.success(`कॉपी हुआ: ${text}`, {
      id: `copy-${fieldName}`,
      duration: 2500,
      icon: '📋'
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Helper to copy both Account Number and IFSC Code simultaneously in standard payment app format
  const handleCopyBothBankDetails = () => {
    const ifscUpper = (activeIfsc || 'BKID0007187').trim().toUpperCase();
    const formatted = `Account Number: ${activeAccountNumber}\nIFSC: ${ifscUpper}\nName: ${activeAccountName}\nBank: ${activeBankName}`;
    copyTextSafely(formatted);
    setCopiedField('both-acc-ifsc');
    toast.success(`✓ खाता संख्या (${activeAccountNumber}) व IFSC (${ifscUpper}) दोनों कॉपी हुए — पेमेंट ऐप में स्वतः पेस्ट करें!`, {
      id: 'copy-both-toast',
      duration: 4000,
      icon: '⚡'
    });
    setTimeout(() => setCopiedField(null), 3000);
  };

  // Quick Donation Claim Handler
  const handleClaimReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      toast.error('कृपया दानदाता का नाम दर्ज करें (Please enter Donor Name)');
      return;
    }
    if (finalAmount <= 0) {
      toast.error('कृपया मान्य दान राशि चुनें (Please enter a valid amount)');
      return;
    }

    setIsSubmittingClaim(true);
    const receiptNo = `JJF/DON/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newDonation: DonationRecord = {
      id: receiptNo,
      receiptNo,
      donorName: donorName.trim(),
      phone: donorPhone.trim() || undefined,
      email: donorEmail.trim() || undefined,
      panNumber: donorPan.trim().toUpperCase() || undefined,
      amount: finalAmount,
      date: new Date().toISOString(),
      purpose: selectedPurpose,
      purposeHindi: 'शिक्षा, स्वास्थ्य एवं असहाय जन सेवा',
      paymentMode: 'Direct Quick UPI Payment',
      transactionRef: utrNumber.trim() ? `UPI/UTR/${utrNumber.trim()}` : `UPI/QUICK/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      taxExemptEligible: false,
      city: 'Ghazipur',
      emailSent: Boolean(donorEmail.trim() && donorEmail.includes('@')),
      emailSentAt: donorEmail.trim() ? new Date().toISOString() : undefined
    };

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast.success('🎉 धन्यवाद! आपका दान रसीद प्रमाण पत्र तुरंत जनरेट हो गया है।', {
      duration: 5000,
      icon: '📜'
    });

    setIsSubmittingClaim(false);
    onClose();
    if (onDonationSuccess) {
      onDonationSuccess(newDonation);
    }
  };

  // Keyboard shortcut: Escape to minimize or close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (!isMinimized) {
          setIsMinimized(true);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized, onClose]);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // 1. MINIMIZED FLOATING DOCK (Persistent Pill on Bottom-Right)
  // --------------------------------------------------------------------------
  if (isMinimized) {
    return (
      <div
        id="quick-donate-minimized-dock"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-[#8B0000] via-red-800 to-amber-900 text-white p-2.5 px-4 rounded-full shadow-2xl border-2 border-yellow-400 animate-in fade-in slide-in-from-bottom-5 duration-300 select-none group"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md animate-pulse">
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </div>

        <button
          onClick={() => setIsMinimized(false)}
          className="flex flex-col text-left cursor-pointer hover:opacity-90 transition-opacity"
          title="क्लिक कर क्विक डोनेट QR विंडो खोलें"
        >
          <div className="flex items-center gap-1.5 font-black text-xs text-yellow-300">
            <span>⚡ Quick Donate QR</span>
            <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px] text-white">
              ₹{finalAmount > 0 ? finalAmount.toLocaleString('en-IN') : 'Custom'}
            </span>
          </div>
          <span className="text-[9.5px] text-orange-100 font-bold">1-Tap UPI Mobile Payment</span>
        </button>

        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/20">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 hover:bg-white/20 rounded-full text-yellow-300 hover:text-white transition-colors cursor-pointer"
            title="Expand Full QR Modal"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full text-red-200 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. FULL EXPANDED QUICK DONATE OVERLAY MODAL
  // --------------------------------------------------------------------------
  return (
    <div
      id="quick-donate-overlay-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="quick-donate-overlay-card"
        className="bg-white rounded-3xl max-w-xl w-full p-0 shadow-2xl border-2 border-amber-300 relative overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#8B0000] via-red-800 to-amber-900 text-white p-4 sm:p-5 relative">
          <div className="absolute top-0 right-0 p-3 flex items-center gap-1.5 z-10">
            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 hover:text-white transition-all cursor-pointer"
              title="Minimize to floating widget (छोटा करें)"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-red-200 hover:text-white transition-all cursor-pointer"
              title="Close (बंद करें)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 p-1 flex items-center justify-center shadow-lg border border-yellow-200 shrink-0">
              <BrandLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-300/40 text-yellow-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <Zap className="w-3 h-3 fill-yellow-300" />
                <span>Quick UPI Pay • त्वरित दान</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight font-serif">
                {FOUNDATION_INFO.nameHindi}
              </h2>
              <p className="text-[11px] text-orange-200 font-medium">
                Govt. Registered NGO • NITI Aayog UID: {FOUNDATION_INFO.nitiAayogUid}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* 1. Amount Selection Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1 uppercase tracking-wide">
                <span>सहयोग राशि चुनें (Select Amount):</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                100% सुरक्षित दान
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {presetAmounts.map((amt) => {
                const isSelected = !customAmount && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-1 rounded-xl text-center font-black text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#8B0000] text-yellow-300 border-[#8B0000] shadow-md ring-2 ring-yellow-400 scale-[1.03]'
                        : 'bg-amber-50/70 border-amber-200 text-slate-800 hover:bg-amber-100 hover:border-amber-400'
                    }`}
                  >
                    ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
                ₹
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="अन्य राशि (Enter custom amount e.g. 5000)"
                className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] outline-none"
              />
            </div>
          </div>

          {/* 2. QR Code & Rapid Payment Section */}
          <div className="bg-gradient-to-b from-amber-50/90 to-yellow-50/40 p-4 rounded-2xl border-2 border-amber-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* High-res Scannable Dynamic QR Code */}
              <div
                ref={qrContainerRef}
                className="p-3 bg-white rounded-2xl border-2 border-amber-400/80 shadow-md flex flex-col items-center shrink-0 relative group"
              >
                {paymentSettings.qrCodeMode === 'custom_image' && paymentSettings.customQrImageUrl ? (
                  <div className="relative w-[150px] h-[150px] flex items-center justify-center p-1 bg-white rounded-xl overflow-hidden">
                    <img
                      src={paymentSettings.customQrImageUrl}
                      alt="Official JJF Quick Donation QR"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                    />
                    <div className="absolute top-1 right-1 bg-indigo-900/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs">
                      Official QR
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <QRCodeSVG
                      value={selectedPaymentMethod === 'card' ? upiUrl : (generateDeepLink(selectedPaymentMethod, false) || upiUrl)}
                      size={150}
                      level="H"
                      includeMargin={false}
                      fgColor="#0B132B"
                      bgColor="#FFFFFF"
                      imageSettings={{
                        src: '/icon.png',
                        x: undefined,
                        y: undefined,
                        height: 28,
                        width: 28,
                        excavate: true
                      }}
                    />
                  </div>
                )}

                <div className="text-[10px] font-black text-slate-800 mt-1.5 uppercase tracking-wider text-center flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>
                    {selectedPaymentMethod === 'card' ? 'Scan to Pay with Any UPI' : `Scan for ${selectedPaymentMethod.toUpperCase()} Pay`} (₹{finalAmount > 0 ? finalAmount.toLocaleString('en-IN') : 'Any'})
                  </span>
                </div>
              </div>

              {/* UPI ID & App Triggers */}
              <div className="flex-1 w-full space-y-2.5 text-left">
                {/* Official UPI ID Box with 1-Click Copy */}
                <div className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center justify-between">
                    <span>आधिकारिक UPI ID (Official ID):</span>
                    <span className="text-emerald-700 font-extrabold text-[9.5px]">✓ Govt Verified</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 gap-2">
                    <span className="font-mono font-black text-xs sm:text-sm text-blue-950 truncate">
                      {activeUpiId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeUpiId, 'upi-id')}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      {copiedField === 'upi-id' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* PayU Official Payment Link & Button */}
                <div className="bg-emerald-50/90 border border-emerald-300 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1CA953] animate-pulse"></span>
                      PayU Official Gateway
                    </span>
                    <p className="text-[10.5px] text-emerald-800 font-medium">
                      क्रेडिट/डेबिट कार्ड, नेटबैंकिंग व सभी UPI से सीधा दान
                    </p>
                  </div>
                  <div>
                    <a
                      style={{
                        width: '130px',
                        backgroundColor: '#1CA953',
                        textAlign: 'center',
                        fontWeight: 800,
                        padding: '9px 0px',
                        color: 'white',
                        fontSize: '11px',
                        display: 'inline-block',
                        textDecoration: 'none',
                        borderRadius: '3.229px'
                      }}
                      href={paymentSettings.payuDonationUrl || 'https://u.payu.in/fJwCvOSIlICb'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:brightness-105 shadow-sm transition-all inline-block active:scale-95"
                    >
                      Donate Now
                    </a>
                  </div>
                </div>

                {/* 1-Tap Mobile Payment App / Method Selector (Auto-launches on selection) */}
                <div>
                  <div className="text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-[#8B0000]" />
                      <span>भुगतान माध्यम चुनें (Select Method):</span>
                    </span>
                    <span className="text-[9.5px] text-amber-800 font-extrabold bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
                      ⚡ क्लिक पर स्वतः ऐप खुलेगा
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {/* Google Pay */}
                    <button
                      type="button"
                      onClick={() => handleSelectPaymentMethod('gpay')}
                      className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl text-xs font-black shadow-2xs hover:shadow-xs transition-all text-center cursor-pointer border ${
                        selectedPaymentMethod === 'gpay'
                          ? 'border-[#8B0000] ring-2 ring-yellow-400 bg-amber-50/80 text-slate-950 scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                      }`}
                      title="Google Pay चुनें एवं ऐप खोलें"
                    >
                      <div className="flex items-center gap-0.5 font-black text-xs">
                        <span className="text-blue-600 font-extrabold">G</span>
                        <span className="text-red-500 font-extrabold">P</span>
                        <span className="text-yellow-500 font-extrabold">a</span>
                        <span className="text-green-600 font-extrabold">y</span>
                        {selectedPaymentMethod === 'gpay' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1 shrink-0" />
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 font-bold mt-0.5">Google Pay</span>
                    </button>

                    {/* PhonePe */}
                    <button
                      type="button"
                      onClick={() => handleSelectPaymentMethod('phonepe')}
                      className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl text-xs font-black shadow-2xs hover:shadow-xs transition-all text-center cursor-pointer border ${
                        selectedPaymentMethod === 'phonepe'
                          ? 'border-purple-600 ring-2 ring-yellow-400 bg-purple-50 text-purple-950 scale-[1.02]'
                          : 'bg-[#5F259F] hover:bg-[#4d1d82] text-white border-transparent'
                      }`}
                      title="PhonePe चुनें एवं ऐप खोलें"
                    >
                      <div className="flex items-center gap-1 font-black text-xs">
                        <span>PhonePe</span>
                        {selectedPaymentMethod === 'phonepe' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5 shrink-0" />
                        )}
                      </div>
                      <span className={`text-[9px] font-bold mt-0.5 ${selectedPaymentMethod === 'phonepe' ? 'text-purple-800' : 'text-purple-200'}`}>PhonePe App</span>
                    </button>

                    {/* Paytm */}
                    <button
                      type="button"
                      onClick={() => handleSelectPaymentMethod('paytm')}
                      className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl text-xs font-black shadow-2xs hover:shadow-xs transition-all text-center cursor-pointer border ${
                        selectedPaymentMethod === 'paytm'
                          ? 'border-sky-600 ring-2 ring-yellow-400 bg-sky-50 text-sky-950 scale-[1.02]'
                          : 'bg-[#002E6E] hover:bg-[#00204d] text-white border-transparent'
                      }`}
                      title="Paytm चुनें एवं ऐप खोलें"
                    >
                      <div className="flex items-center gap-1 font-black text-xs">
                        <span>Paytm</span>
                        {selectedPaymentMethod === 'paytm' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5 shrink-0" />
                        )}
                      </div>
                      <span className={`text-[9px] font-bold mt-0.5 ${selectedPaymentMethod === 'paytm' ? 'text-sky-800' : 'text-sky-200'}`}>Paytm App</span>
                    </button>

                    {/* Credit Card / Debit Card */}
                    <button
                      type="button"
                      onClick={() => handleSelectPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl text-xs font-black shadow-2xs hover:shadow-xs transition-all text-center cursor-pointer border ${
                        selectedPaymentMethod === 'card'
                          ? 'border-amber-600 ring-2 ring-yellow-400 bg-amber-50 text-amber-950 scale-[1.02]'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-transparent'
                      }`}
                      title="क्रेडिट / डेबिट कार्ड द्वारा भुगतान"
                    >
                      <div className="flex items-center gap-1 font-black text-xs">
                        <CreditCard className="w-3.5 h-3.5 shrink-0" />
                        <span>Card</span>
                        {selectedPaymentMethod === 'card' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5 shrink-0" />
                        )}
                      </div>
                      <span className={`text-[9px] font-bold mt-0.5 ${selectedPaymentMethod === 'card' ? 'text-amber-800' : 'text-amber-100'}`}>Credit/Debit</span>
                    </button>
                  </div>

                  {/* Dynamic Action CTA Button to launch/re-open payment method */}
                  <div className="mt-2">
                    {selectedPaymentMethod === 'card' ? (
                      <button
                        type="button"
                        onClick={() => handleSelectPaymentMethod('card')}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>कार्ड द्वारा ₹{finalAmount > 0 ? finalAmount.toLocaleString('en-IN') : '500'} का भुगतान करें (3D Secure Bank OTP)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectPaymentMethod(selectedPaymentMethod)}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 hover:from-emerald-800 hover:to-teal-900 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                        <span>
                          {selectedPaymentMethod === 'gpay'
                            ? 'Google Pay'
                            : selectedPaymentMethod === 'phonepe'
                            ? 'PhonePe'
                            : selectedPaymentMethod === 'paytm'
                            ? 'Paytm'
                            : 'UPI'}{' '}
                          ऐप में ₹{finalAmount > 0 ? finalAmount.toLocaleString('en-IN') : '500'} भुगतान खोलें (Tap to Open)
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 ml-auto text-yellow-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bank Account Details Accordion */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            <button
              type="button"
              onClick={() => setShowBankDetails(!showBankDetails)}
              className="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span className="font-black text-slate-900">सीधे बैंक खाते में ट्रांसफर (Account Pay: GPay, PhonePe, Paytm, Cards)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                  सीधा खाता भुगतान
                </span>
                {showBankDetails ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {showBankDetails && (
              <div className="p-3 pt-0 text-xs space-y-2 border-t border-slate-200 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">बैंक का नाम (Bank):</span>
                    <span className="font-extrabold text-slate-900">{activeBankName}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">खाता धारक (Account Name):</span>
                    <span className="font-extrabold text-slate-900">{activeAccountName}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">खाता संख्या (A/C No):</span>
                      <span className="font-mono font-black text-slate-900">{activeAccountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeAccountNumber, 'acct-no')}
                      className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="खाता संख्या कॉपी करें"
                    >
                      {copiedField === 'acct-no' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'acct-no' ? 'कॉपी हुआ' : 'खाता कॉपी'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">IFSC कोड:</span>
                      <span className="font-mono font-black text-slate-900">{targetIfscClean}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(targetIfscClean, 'ifsc')}
                      className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="IFSC कोड कॉपी करें"
                    >
                      {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'ifsc' ? 'कॉपी हुआ' : 'IFSC कॉपी'}</span>
                    </button>
                  </div>
                </div>

                {/* 1-Tap Copy Both Account Number + IFSC Code */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleCopyBothBankDetails}
                    className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
                    title="खाता संख्या और IFSC कोड दोनों को एक साथ पेमेंट ऐप में पेस्ट करने हेतु कॉपी करें"
                  >
                    {copiedField === 'both-acc-ifsc' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>✓ खाता संख्या व IFSC कोड दोनों कॉपी हो गए (पेमेंट ऐप में स्वतः पेस्ट करें)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                        <span>⚡ खाता संख्या + IFSC दोनों ऑटो-कॉपी करें (पेमेंट ऐप में सीधे पेस्ट हेतु)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* DIRECT TO ACCOUNT PAYMENT OPTIONS (Google Pay, PhonePe, Paytm, Debit/Credit Card) */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>खाते में सीधे भुगतान करें (Direct Bank Account Pay):</span>
                    </span>
                    <span className="text-[9.5px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                      ⚡ बिना QR कोड • ऑटो-फिल
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mb-2 leading-relaxed">
                    नीचे से ऐप चुनें — यह <strong>QR स्कैन किए बिना</strong> सीधे आपके पेमेंट ऐप के <em>Bank Account Transfer</em> में खाता संख्या (<strong>{activeAccountNumber}</strong>), IFSC कोड (<strong>{targetIfscClean}</strong>) और राशि स्वतः भर कर पेमेंट खोलेगा:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Google Pay */}
                    <button
                      type="button"
                      onClick={() => handleDirectAccountPayment('gpay')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all group cursor-pointer text-center ${
                        activeDirectApp === 'gpay'
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300 shadow-md scale-[1.02]'
                          : 'border-blue-200 hover:border-blue-600 bg-white hover:bg-blue-50/50 shadow-2xs hover:shadow'
                      }`}
                      title="Google Pay के Bank Transfer टैब में स्वतः भर कर सीधे बैंक खाते में भुगतान करें"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-xs mb-1 group-hover:scale-105 transition-transform shadow-2xs">
                        <span className="text-blue-600">G</span>
                        <span className="text-red-500">P</span>
                        <span className="text-yellow-500">a</span>
                        <span className="text-green-600">y</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">Google Pay</span>
                      <span className="text-[9px] text-blue-700 font-extrabold bg-blue-100 border border-blue-200 px-1.5 py-0.2 rounded mt-0.5">
                        Bank Transfer Tab
                      </span>
                    </button>

                    {/* PhonePe */}
                    <button
                      type="button"
                      onClick={() => handleDirectAccountPayment('phonepe')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all group cursor-pointer text-center ${
                        activeDirectApp === 'phonepe'
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300 shadow-md scale-[1.02]'
                          : 'border-purple-200 hover:border-purple-600 bg-white hover:bg-purple-50/50 shadow-2xs hover:shadow'
                      }`}
                      title="PhonePe के To Bank & Self A/c -> To Account Number & IFSC में ऑटो-फिल कर भुगतान करें"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#5F259F] text-white flex items-center justify-center font-black text-xs mb-1 group-hover:scale-105 transition-transform shadow-2xs">
                        Pe
                      </div>
                      <span className="text-xs font-black text-purple-950">PhonePe</span>
                      <span className="text-[9px] text-purple-700 font-extrabold bg-purple-100 border border-purple-200 px-1.5 py-0.2 rounded mt-0.5">
                        To Bank & Self A/c
                      </span>
                    </button>

                    {/* Paytm */}
                    <button
                      type="button"
                      onClick={() => handleDirectAccountPayment('paytm')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all group cursor-pointer text-center ${
                        activeDirectApp === 'paytm'
                          ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-300 shadow-md scale-[1.02]'
                          : 'border-sky-200 hover:border-sky-600 bg-white hover:bg-sky-50/50 shadow-2xs hover:shadow'
                      }`}
                      title="Paytm से सीधे बैंक खाता में ऑटो-फिल कर भुगतान करें"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#002E6E] text-white flex items-center justify-center font-black text-[10px] mb-1 group-hover:scale-105 transition-transform shadow-2xs">
                        Paytm
                      </div>
                      <span className="text-xs font-black text-[#002E6E]">Paytm</span>
                      <span className="text-[9px] text-sky-800 font-extrabold bg-sky-100 border border-sky-200 px-1.5 py-0.2 rounded mt-0.5">
                        To Bank A/c
                      </span>
                    </button>

                    {/* Debit / Credit Card */}
                    <button
                      type="button"
                      onClick={() => handleDirectAccountPayment('card')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all group cursor-pointer text-center ${
                        activeDirectApp === 'card'
                          ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-300 shadow-md scale-[1.02]'
                          : 'border-amber-300 hover:border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 shadow-2xs hover:shadow'
                      }`}
                      title="डेबिट / क्रेडिट कार्ड द्वारा सीधे खाते में भुगतान करें"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center font-black text-xs mb-1 group-hover:scale-105 transition-transform shadow-2xs">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-amber-950">Debit / Card</span>
                      <span className="text-[9px] text-amber-900 font-extrabold bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded mt-0.5">
                        Visa • RuPay • OTP
                      </span>
                    </button>
                  </div>

                  {/* ACTIVE DIRECT BANK ACCOUNT TRANSFER STATUS & RE-LAUNCH CARD (NO QR NEEDED) */}
                  {activeDirectApp && activeDirectApp !== 'card' && (
                    <div className="mt-3 p-3.5 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-100/60 border-2 border-emerald-400 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-xl text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                            activeDirectApp === 'phonepe' ? 'bg-[#5F259F]' : activeDirectApp === 'gpay' ? 'bg-blue-600' : 'bg-[#002E6E]'
                          }`}>
                            {activeDirectApp === 'phonepe' ? 'Pe' : activeDirectApp === 'gpay' ? 'G' : 'P'}
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 block">
                              {activeDirectApp === 'gpay'
                                ? 'Google Pay: Bank Transfer टैब'
                                : activeDirectApp === 'phonepe'
                                ? 'PhonePe: To Bank & Self A/c ➔ To Account Number & IFSC'
                                : 'Paytm: Bank A/c Transfer'}
                            </span>
                            <span className="text-[10px] text-emerald-800 font-semibold block leading-tight">
                              {activeDirectApp === 'gpay'
                                ? '✓ Google Pay के Bank Transfer में खाता संख्या, IFSC व संस्था विवरण स्वतः भरे गए हैं'
                                : activeDirectApp === 'phonepe'
                                ? '✓ PhonePe के "To Bank & Self A/c" ➔ "To Account Number & IFSC" में सभी विवरण स्वतः भरे गए हैं'
                                : '✓ बैंक ट्रांसफर हेतु विवरण सीधे ऐप में स्वतः भर कर भेजा गया है'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9.5px] bg-emerald-700 text-white font-black px-2 py-0.5 rounded-full shadow-2xs">
                          Auto-Filled
                        </span>
                      </div>

                      {/* Auto-filled parameters summary */}
                      <div className="bg-white/95 p-2.5 rounded-xl border border-emerald-200 text-xs space-y-1.5 shadow-2xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500 font-bold">बैंक:</span>
                          <span className="font-extrabold text-slate-900">{activeBankName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500 font-bold">खाताधारक:</span>
                          <span className="font-extrabold text-slate-900">{activeAccountName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200/80">
                          <span className="text-slate-600 font-bold">खाता संख्या (A/C No):</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-emerald-950 text-xs sm:text-sm">{activeAccountNumber}</span>
                            <span className="text-[9px] bg-emerald-200 text-emerald-800 font-extrabold px-1 rounded">Auto-filled</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(activeAccountNumber, 'acct-no-status')}
                              className="px-1.5 py-0.5 bg-white hover:bg-emerald-100 text-emerald-900 rounded border border-emerald-300 text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                              title="खाता संख्या कॉपी करें"
                            >
                              {copiedField === 'acct-no-status' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'acct-no-status' ? 'कॉपी हुआ' : 'कॉपी'}</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200/80">
                          <span className="text-slate-600 font-bold">IFSC कोड:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-emerald-950 text-xs sm:text-sm">{targetIfscClean}</span>
                            <span className="text-[9px] bg-emerald-200 text-emerald-800 font-extrabold px-1 rounded">Auto-filled</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(targetIfscClean, 'ifsc-status')}
                              className="px-1.5 py-0.5 bg-white hover:bg-emerald-100 text-emerald-900 rounded border border-emerald-300 text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                              title="IFSC कोड कॉपी करें"
                            >
                              {copiedField === 'ifsc-status' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'ifsc-status' ? 'कॉपी हुआ' : 'कॉपी'}</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500 font-bold">भुगतान राशि:</span>
                          <span className="font-black text-[#8B0000] text-sm">₹{finalAmount > 0 ? finalAmount.toLocaleString('en-IN') : '500'}</span>
                        </div>
                      </div>

                      {/* 1-Tap Copy Both Helper for Payment App Paste */}
                      <button
                        type="button"
                        onClick={handleCopyBothBankDetails}
                        className="mt-2 w-full py-2 px-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
                        title="पेमेंट ऐप में खाता संख्या और IFSC दोनों को एक साथ स्वतः पेस्ट करने हेतु ऑटो-कॉपी"
                      >
                        {copiedField === 'both-acc-ifsc' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>✓ खाता संख्या + IFSC दोनों कॉपी हो गए (पेमेंट ऐप में स्वतः पेस्ट करें)</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 animate-pulse" />
                            <span>⚡ दोनों (खाता + IFSC) ऑटो-पेस्ट कॉपी करें</span>
                          </>
                        )}
                      </button>

                      {/* Helpful Tip Banner */}
                      <div className="mt-2 p-2 bg-emerald-100/70 border border-emerald-300 rounded-xl text-[10.5px] text-emerald-950 leading-relaxed flex items-start gap-1.5">
                        <span className="text-emerald-800 shrink-0 mt-0.5 font-black">💡 टिप:</span>
                        <span>
                          पेमेंट ऐप ({activeDirectApp === 'gpay' ? 'Google Pay' : activeDirectApp === 'phonepe' ? 'PhonePe' : 'Paytm'}) में बैंक ट्रांसफर स्क्रीन पर यदि प्रविष्टियां न दिखें, तो <strong>"Paste"</strong> या <strong>"Pay to copied account"</strong> पर टैप करें — खाता संख्या <strong>{activeAccountNumber}</strong> और IFSC कोड <strong>{targetIfscClean}</strong> दोनों एक साथ स्वतः पेस्ट हो जाएंगे!
                        </span>
                      </div>

                      {/* Action buttons: Re-open in App, Copy Details, Claim receipt */}
                      <div className="mt-2.5 flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => handleDirectAccountPayment(activeDirectApp)}
                          className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                          <span>
                            {activeDirectApp === 'gpay' ? 'Google Pay' : activeDirectApp === 'phonepe' ? 'PhonePe' : 'Paytm'} ऐप पुनः खोलें
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const fullDetails = `बैंक: ${activeBankName}\nखाताधारक: ${activeAccountName}\nखाता संख्या: ${activeAccountNumber}\nIFSC कोड: ${targetIfscClean}\nराशि: ₹${finalAmount > 0 ? finalAmount : 500}`;
                            handleCopy(fullDetails, 'all-bank-info');
                          }}
                          className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedField === 'all-bank-info' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">कॉपी हुआ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>सभी विवरण कॉपी</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setShowClaimForm(true)}
                          className="text-[11px] text-emerald-800 hover:text-emerald-950 font-black underline cursor-pointer"
                        >
                          भुगतान पूर्ण हो गया? 80G दान रसीद व प्रमाण पत्र तुरंत जनरेट करें →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Instant Receipt Claim Option */}
          <div className="border-2 border-emerald-300 rounded-2xl bg-emerald-50/50 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <h4 className="text-xs font-black text-emerald-950">
                    तुरंत दान रसीद प्राप्त करें
                  </h4>
                  <p className="text-[10px] text-emerald-800">
                    भुगतान के बाद 1 मिनट में आधिकारिक PDF रसीद व प्रमाण पत्र डाउनलोड करें
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowClaimForm(!showClaimForm)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shrink-0"
              >
                {showClaimForm ? 'फॉर्म छुपाएं' : 'रसीद जनरेट करें'}
              </button>
            </div>

            {/* Quick Confirmation Sub-form */}
            {showClaimForm && (
              <form onSubmit={handleClaimReceipt} className="mt-3 pt-3 border-t border-emerald-200 space-y-2.5 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                      दानदाता का पूरा नाम *
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                      मोबाइल नंबर (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                      PAN नंबर (यदि उपलब्ध हो)
                    </label>
                    <input
                      type="text"
                      value={donorPan}
                      onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-emerald-600 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                      UPI UTR / Ref No (यदि उपलब्ध हो)
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 423984729182"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingClaim}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-xl font-black text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Receipt className="w-4 h-4" />
                  <span>तुरंत दान रसीद व प्रमाण पत्र जारी करें (Generate Receipt)</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer info & full form link */}
        <div className="bg-slate-50 p-3 px-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600">
          <div className="flex items-center gap-2 font-mono">
            <span>Reg No: <strong className="text-black">{FOUNDATION_INFO.regNo}</strong></span>
            <span>•</span>
            <span>PAN: <strong className="text-black">{FOUNDATION_INFO.pan}</strong></span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {onOpenAdminSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminSettings();
                }}
                className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200"
                title="व्यवस्थापक: UPI ID व QR बदलें"
              >
                <span>⚙️ QR / UPI बदलें</span>
              </button>
            )}

            {onOpenFullForm && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullForm();
                }}
                className="text-[#8B0000] font-black hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>विस्तृत दान पोर्टल</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real Payment Gateway Modal for Direct Account / Card Payments */}
      {isGatewayOpen && (
        <RealPaymentGatewayModal
          isOpen={isGatewayOpen}
          onClose={() => setIsGatewayOpen(false)}
          donorData={donorDataForGateway}
          initialStep={gatewayStep}
          initialMethod={gatewayMethod}
          onPaymentSuccess={(donation) => {
            setIsGatewayOpen(false);
            onClose();
            if (onDonationSuccess) {
              onDonationSuccess(donation);
            }
          }}
        />
      )}
    </div>
  );
};

export default QuickDonateOverlay;
