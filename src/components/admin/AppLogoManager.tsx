// ============================================================================
// JEEVAN JYOTI FOUNDATION - APP LOGO & THUMBNAIL MANAGER
// जीवन ज्योति फाउंडेशन - आधिकारिक ऐप लोगो एवं वेबसाइट थंबनेल प्रबंधक
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  RotateCw,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Award,
  FileCheck,
  Eye,
  Trash2,
  Globe,
  ExternalLink,
  Layers,
  Share2,
  Smartphone,
  Copy,
  Check,
  Compass
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';
import {
  updateAppLogo,
  resetAppLogo,
  updateAppThumbnail,
  resetAppThumbnail,
  deleteThumbnailFromAllDatabases,
  uploadMediaFile,
  optimizeImageFile,
  purgeAllOtherLogosFromDatabaseAndEnforceSoleLogo,
  deleteLogoFromAllDatabases
} from '../../services/adminService';
import { BrandLogo } from '../common/BrandLogo';
import { RoyalCertificateSeal } from '../common/RoyalCertificateSeal';
import { CertificateOfficialSealManager } from './CertificateOfficialSealManager';
import toast from 'react-hot-toast';

export const AppLogoManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { content } = useHomeContent();
  const { startUpload, updateProgress, completeUpload, failUpload } = useAdminUploadProgress();

  // Active Management Section: 'logo' (Brand Logo), 'thumbnail' (App Thumbnail), or 'seal' (Universal Certificate Seal)
  const [managerMode, setManagerMode] = useState<'logo' | 'thumbnail' | 'seal'>('logo');

  // --- 1. MAIN LOGO STATE ---
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jjf_custom_logo');
        if (stored) return stored;
      } catch {
        // Ignore
      }
    }
    return content?.appLogoUrl || '';
  });
  const [logoDirectUrlInput, setLogoDirectUrlInput] = useState<string>('');
  const [activeLogoPreviewTab, setActiveLogoPreviewTab] = useState<'navbar' | 'certificate' | 'seal' | 'watermark'>('navbar');

  // --- 2. APP THUMBNAIL STATE ---
  const [selectedThumbFile, setSelectedThumbFile] = useState<File | null>(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const isPermanentlyDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
        if (isPermanentlyDeleted) return '';
        const stored = localStorage.getItem('jjf_custom_thumbnail');
        if (stored && stored !== '/pwa-icon-512.png') return stored;
      } catch {
        // Ignore
      }
    }
    return (content?.appThumbnailUrl && content.appThumbnailUrl !== '/pwa-icon-512.png') ? content.appThumbnailUrl : '';
  });
  const [thumbDirectUrlInput, setThumbDirectUrlInput] = useState<string>('');
  const [activeThumbPreviewTab, setActiveThumbPreviewTab] = useState<'whatsapp' | 'mobile_app' | 'browser'>('whatsapp');

  // --- COMMON STATE ---
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // In-app confirmation dialog state (replaces window.confirm for 100% reliable execution in iframes)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    isDanger: boolean;
    action: () => Promise<void>;
  } | null>(null);

  // Sync with context updates and local storage
  useEffect(() => {
    if (content?.appLogoUrl) {
      setLogoPreviewUrl(content.appLogoUrl);
    } else if (typeof window !== 'undefined') {
      const isPermanentlyDeleted = localStorage.getItem('jjf_logo_permanently_deleted') === 'true';
      if (isPermanentlyDeleted) {
        setLogoPreviewUrl('');
      } else {
        const stored = localStorage.getItem('jjf_custom_logo');
        setLogoPreviewUrl(stored || '');
      }
    } else {
      setLogoPreviewUrl('');
    }

    const isThumbPermanentlyDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
    if (isThumbPermanentlyDeleted) {
      setThumbPreviewUrl('');
    } else if (content?.appThumbnailUrl && content.appThumbnailUrl !== '/pwa-icon-512.png') {
      setThumbPreviewUrl(content.appThumbnailUrl);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jjf_custom_thumbnail');
      setThumbPreviewUrl((stored && stored !== '/pwa-icon-512.png') ? stored : '');
    } else {
      setThumbPreviewUrl('');
    }
  }, [content?.appLogoUrl, content?.appThumbnailUrl]);

  // Reactive listener for logo and thumbnail changes across the application
  useEffect(() => {
    const handleLogoChange = (e: CustomEvent<string>) => {
      const val = typeof e.detail === 'string' ? e.detail : '';
      setLogoPreviewUrl(val);
      if (!val) {
        setSelectedLogoFile(null);
        setLogoDirectUrlInput('');
      }
    };

    const handleThumbChange = (e: CustomEvent<string>) => {
      const val = typeof e.detail === 'string' ? e.detail : '';
      if (!val || val === '/pwa-icon-512.png') {
        setThumbPreviewUrl('');
        setSelectedThumbFile(null);
        setThumbDirectUrlInput('');
        const fileInput = document.getElementById('admin-app-thumbnail-file-input') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
      } else {
        setThumbPreviewUrl(val);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-logo-changed' as any, handleLogoChange);
      window.addEventListener('jjf-thumbnail-changed' as any, handleThumbChange);
      return () => {
        window.removeEventListener('jjf-logo-changed' as any, handleLogoChange);
        window.removeEventListener('jjf-thumbnail-changed' as any, handleThumbChange);
      };
    }
  }, []);

  // ==========================================
  // HANDLERS FOR MAIN LOGO
  // ==========================================
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल इमेज फ़ाइल (PNG, JPG, WEBP, SVG) चुनें!');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('फ़ाइल का आकार 10MB से कम होना चाहिए!');
      return;
    }

    setSelectedLogoFile(file);
    try {
      const optimizedUrl = await optimizeImageFile(file);
      setLogoPreviewUrl(optimizedUrl);
      setLogoDirectUrlInput('');
      toast.success('लोगो फ़ोटो चुनी गई! लागू करने के लिए "नया मुख्य लोगो सेव करें" पर क्लिक करें।');
    } catch {
      const localBlobUrl = URL.createObjectURL(file);
      setLogoPreviewUrl(localBlobUrl);
      setLogoDirectUrlInput('');
      toast.success('लोगो फ़ोटो चुनी गई! लागू करने के लिए "नया मुख्य लोगो सेव करें" पर क्लिक करें।');
    }
  };

  const handleLogoDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLogoDirectUrlInput(url);
    if (url.trim()) {
      setSelectedLogoFile(null);
      setLogoPreviewUrl(url.trim());
    } else {
      setLogoPreviewUrl(content?.appLogoUrl || '');
    }
  };

  const handleApplyNewLogo = async () => {
    const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
    const adminUid = adminProfile?.uid || 'admin';

    let finalLogoUrl = logoPreviewUrl;
    if (!finalLogoUrl && !selectedLogoFile) {
      toast.error('कृपया पहले कोई लोगो फ़ाइल चुनें या इमेज URL दर्ज करें!');
      return;
    }

    setIsApplying(true);
    startUpload('संस्था लोगो सार्वभौमिक अपडेट', 'content', 'लोगो अनुकूलन, अपलोड व रीयलटाइम डेटाबेस सिंक');

    try {
      if (selectedLogoFile) {
        setIsUploading(true);
        updateProgress(20, 'लोगो इमेज अनुकूलन व अपलोड प्रारंभ...');
        finalLogoUrl = await uploadMediaFile(
          selectedLogoFile,
          'banners',
          (progress, message, bytesDetail) => {
            const mapped = Math.min(80, Math.round(20 + (progress * 0.6)));
            updateProgress(mapped, message || 'लोगो अपलोड हो रहा है...', bytesDetail);
          }
        );
      }

      updateProgress(85, 'सभी पेजों, प्रमाणपत्रों व नेवबार में लोगो लागू हो रहा है...');
      await updateAppLogo(finalLogoUrl, adminName, adminUid);

      updateProgress(95, 'सिस्टम सेटिंग्स व नेवबार सिंक हो रहे हैं...');
      await new Promise((r) => setTimeout(r, 60));

      setLogoPreviewUrl(finalLogoUrl);
      setSelectedLogoFile(null);
      setLogoDirectUrlInput('');

      const fileInput = document.getElementById('admin-app-logo-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      updateProgress(100, 'नया लोगो 100% सफलतापूर्वक लागू हो गया!');
      completeUpload('नया लोगो सभी पेजों पर 100% सफलतापूर्वक लागू हो गया!');
      toast.success('🎉 नया लोगो पूरी वेबसाइट, नेवबार, रसीदों व प्रमाण पत्रों पर तुरंत लागू हो गया!');
    } catch (err: any) {
      console.error(err);
      failUpload(err?.message || 'लोगो अपडेट करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
      toast.error('लोगो अपडेट करने में त्रुटि आई।');
    } finally {
      setIsUploading(false);
      setIsApplying(false);
    }
  };

  const handleClearSelectedLogoFile = () => {
    setSelectedLogoFile(null);
    const fileInput = document.getElementById('admin-app-logo-file-input') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
    const isPermanentlyDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_logo_permanently_deleted') === 'true';
    setLogoPreviewUrl(isPermanentlyDeleted ? '' : (content?.appLogoUrl || ''));
    toast.success('चयनित लोगो फ़ाइल हटा दी गई।');
  };

  const handleClearLogoDirectUrl = () => {
    setLogoDirectUrlInput('');
    const isPermanentlyDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_logo_permanently_deleted') === 'true';
    setLogoPreviewUrl(isPermanentlyDeleted ? '' : (content?.appLogoUrl || ''));
    toast.success('लोगो URL हटा दिया गया।');
  };

  const handleResetLogoToDefault = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'मूल डिफ़ॉल्ट लोगो रीसेट करें?',
      description: 'क्या आप लोगो को मूल डिफ़ॉल्ट वेक्टर प्रतीक (Official Vector Emblem) में रीसेट करना चाहते हैं? इसके बाद संस्था का अधिकृत मूल प्रतीक प्रदर्शित होगा।',
      confirmLabel: 'हाँ, डिफ़ॉल्ट लोगो रीसेट करें',
      isDanger: false,
      action: async () => {
        const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
        const adminUid = adminProfile?.uid || 'admin';

        // 1. Immediate UI update
        setLogoPreviewUrl('');
        setSelectedLogoFile(null);
        setLogoDirectUrlInput('');
        const fileInput = document.getElementById('admin-app-logo-file-input') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';

        setIsApplying(true);
        startUpload('मूल लोगो रीसेट प्रक्रिया', 'content', 'डिफ़ॉल्ट वेक्टर प्रतीक पुनर्स्थापित हो रहा है');

        try {
          await resetAppLogo(adminName, adminUid);
          completeUpload('मूल डिफ़ॉल्ट वेक्टर लोगो सफलतापूर्वक पुनर्स्थापित हो गया!');
          toast.success('मूल डिफ़ॉल्ट लोगो सफलतापूर्वक रीसेट हो गया!');
        } catch (err) {
          console.error(err);
          failUpload('रीसेट करने में त्रुटि आई।');
          toast.error('लोगो रीसेट करने में त्रुटि आई।');
        } finally {
          setIsApplying(false);
        }
      }
    });
  };

  const handleDeleteLogoEverywhere = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'डेटाबेस से लोगो स्थायी रूप से डिलीट करें?',
      description: 'क्या आप डेटाबेस (Firestore), सभी स्टोरेज और पेजों से संस्था का लोगो पूरी तरह स्थायी रूप से डिलीट (Permanent Delete) करना चाहते हैं? इसके उपरांत संस्था का आधिकारिक मूल वेक्टर प्रतीक सक्रिय रहेगा।',
      confirmLabel: 'हाँ, स्थायी रूप से डिलीट करें',
      isDanger: true,
      action: async () => {
        const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';

        // 1. Immediate UI update for instant feedback
        setLogoPreviewUrl('');
        setSelectedLogoFile(null);
        setLogoDirectUrlInput('');
        const fileInput = document.getElementById('admin-app-logo-file-input') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';

        setIsApplying(true);
        startUpload('लोगो स्थायी निष्कासन', 'content', 'डेटाबेस, फायरस्टोर व सभी स्टोरेज से लोगो स्थायी रूप से डिलीट किया जा रहा है...');

        try {
          await deleteLogoFromAllDatabases(adminName);
          completeUpload('डेटाबेस और सभी स्टोरेज से लोगो स्थायी रूप से डिलीट कर दिया गया!');
          toast.success('🎉 डेटाबेस, फायरस्टोर और लोकल स्टोरेज से लोगो पूरी तरह स्थायी रूप से डिलीट कर दिया गया!');
        } catch (err) {
          console.error(err);
          failUpload('लोगो डिलीट करने में त्रुटि आई।');
          toast.error('लोगो डिलीट करने में त्रुटि आई।');
        } finally {
          setIsApplying(false);
        }
      }
    });
  };

  // ==========================================
  // HANDLERS FOR APP & WEBSITE THUMBNAIL LOGO
  // ==========================================
  const handleThumbFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल इमेज फ़ाइल (PNG, JPG, WEBP, SVG) चुनें!');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('फ़ाइल का आकार 10MB से कम होना चाहिए!');
      return;
    }

    setSelectedThumbFile(file);
    try {
      const optimizedUrl = await optimizeImageFile(file);
      setThumbPreviewUrl(optimizedUrl);
      setThumbDirectUrlInput('');
      toast.success('थंबनेल इमेज चुनी गई! लागू करने के लिए "वेबसाइट एवं ऐप थंबनेल सेव करें" पर क्लिक करें।');
    } catch {
      const localBlobUrl = URL.createObjectURL(file);
      setThumbPreviewUrl(localBlobUrl);
      setThumbDirectUrlInput('');
      toast.success('थंबनेल इमेज चुनी गई! लागू करने के लिए "वेबसाइट एवं ऐप थंबनेल सेव करें" पर क्लिक करें।');
    }
  };

  const handleThumbDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setThumbDirectUrlInput(url);
    if (url.trim()) {
      setSelectedThumbFile(null);
      setThumbPreviewUrl(url.trim());
    } else {
      setThumbPreviewUrl(content?.appThumbnailUrl || '');
    }
  };

  // Copy Main Logo into Thumbnail
  const handleCopyMainLogoToThumbnail = () => {
    const mainLogo = logoPreviewUrl || content?.appLogoUrl || '';
    if (!mainLogo) {
      toast.error('मुख्य लोगो अभी खाली है! कृपया पहले मुख्य लोगो अपलोड करें या कोई इमेज चुनें।');
      return;
    }
    setThumbPreviewUrl(mainLogo);
    setSelectedThumbFile(null);
    setThumbDirectUrlInput('');
    toast.success('मुख्य लोगो को थंबनेल पूर्वावलोकन में कॉपी कर दिया गया है! अब "थंबनेल सेव करें" पर क्लिक करें।');
  };

  // Upload and Apply App Thumbnail
  const handleApplyAppThumbnail = async () => {
    const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
    const adminUid = adminProfile?.uid || 'admin';

    let finalThumbUrl = thumbPreviewUrl;
    if (thumbDirectUrlInput.trim()) {
      finalThumbUrl = thumbDirectUrlInput.trim();
    }

    if (!selectedThumbFile && (!finalThumbUrl || finalThumbUrl === '/pwa-icon-512.png')) {
      toast.error('कृपया पहले कोई थंबनेल इमेज फ़ाइल चुनें या URL दर्ज करें!');
      return;
    }

    setIsApplying(true);
    startUpload('ऐप थंबनेल सार्वभौमिक अपडेट', 'content', 'थंबनेल अनुकूलन, अपलोड व सोशल शेयर सिंक');

    try {
      if (selectedThumbFile) {
        setIsUploading(true);
        updateProgress(20, 'थंबनेल इमेज अनुकूलन व अपलोड प्रारंभ (512x512)...');
        finalThumbUrl = await uploadMediaFile(
          selectedThumbFile,
          'banners',
          (progress, message, bytesDetail) => {
            const mapped = Math.min(80, Math.round(20 + (progress * 0.6)));
            updateProgress(mapped, message || 'थंबनेल अपलोड हो रहा है...', bytesDetail);
          }
        );
      }

      if (!finalThumbUrl || finalThumbUrl === '/pwa-icon-512.png') {
        throw new Error('थंबनेल इमेज URL अमान्य है।');
      }

      updateProgress(85, 'मेटा टैग्स, OpenGraph, व्हाट्सएप शेयर कार्ड व PWA आइकन में थंबनेल लागू हो रहा है...');
      await updateAppThumbnail(finalThumbUrl, adminName, adminUid);

      updateProgress(95, 'PWA व सोशल शेयर कार्ड सिंक हो रहे हैं...');
      await new Promise((r) => setTimeout(r, 60));

      setThumbPreviewUrl(finalThumbUrl);
      setSelectedThumbFile(null);
      setThumbDirectUrlInput('');

      const fileInput = document.getElementById('admin-app-thumbnail-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      updateProgress(100, 'थंबनेल 100% सफलतापूर्वक लागू हो गया!');
      completeUpload('ऐप थंबनेल लोगो 100% सफलतापूर्वक अपडेट हो गया!');
      toast.success('🎉 वेबसाइट एवं ऐप का थंबनेल लोगो सफलतापूर्वक अपडेट हो गया! व्हाट्सएप शेयर, सोशल मीडिया व PWA आइकन पर तुरंत लागू!');
    } catch (err: any) {
      console.error(err);
      failUpload(err?.message || 'थंबनेल अपडेट करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
      toast.error('थंबनेल अपडेट करने में त्रुटि आई।');
    } finally {
      setIsUploading(false);
      setIsApplying(false);
    }
  };

  const handleClearSelectedThumbFile = () => {
    setSelectedThumbFile(null);
    const fileInput = document.getElementById('admin-app-thumbnail-file-input') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
    const isPermanentlyDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
    setThumbPreviewUrl(isPermanentlyDeleted ? '' : (content?.appThumbnailUrl || ''));
    toast.success('चयनित थंबनेल फ़ाइल हटा दी गई।');
  };

  const handleClearThumbDirectUrl = () => {
    setThumbDirectUrlInput('');
    const isPermanentlyDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
    setThumbPreviewUrl(isPermanentlyDeleted ? '' : (content?.appThumbnailUrl || ''));
    toast.success('थंबनेल URL हटा दिया गया।');
  };

  const handleResetThumbToDefault = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'डिफ़ॉल्ट थंबनेल रीसेट करें?',
      description: 'क्या आप ऐप थंबनेल को मूल डिफ़ॉल्ट (Default PWA Emblem) में रीसेट करना चाहते हैं? इसके बाद डिफ़ॉल्ट ऐप प्रतीक लागू होगा।',
      confirmLabel: 'हाँ, थंबनेल रीसेट करें',
      isDanger: false,
      action: async () => {
        const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
        const adminUid = adminProfile?.uid || 'admin';

        // Immediate UI update
        setThumbPreviewUrl('');
        setSelectedThumbFile(null);
        setThumbDirectUrlInput('');
        const fileInput = document.getElementById('admin-app-thumbnail-file-input') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';

        setIsApplying(true);
        startUpload('थंबनेल रीसेट प्रक्रिया', 'content', 'डिफ़ॉल्ट थंबनेल पुनर्स्थापित हो रहा है');

        try {
          await resetAppThumbnail(adminName, adminUid);
          completeUpload('डिफ़ॉल्ट थंबनेल सफलतापूर्वक पुनर्स्थापित हो गया!');
          toast.success('डिफ़ॉल्ट थंबनेल सफलतापूर्वक रीसेट हो गया!');
        } catch (err) {
          console.error(err);
          failUpload('थंबनेल रीसेट करने में त्रुटि आई।');
          toast.error('थंबनेल रीसेट करने में त्रुटि आई।');
        } finally {
          setIsApplying(false);
        }
      }
    });
  };

  const handleDeleteThumbEverywhere = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'ऐप थंबनेल लोगो हटाएं?',
      description: 'क्या आप डेटाबेस और स्टोरेज से कस्टम ऐप थंबनेल लोगो हटाना चाहते हैं? इसके बाद डिफ़ॉल्ट PWA प्रतीक प्रदर्शित होगा।',
      confirmLabel: 'हाँ, थंबनेल हटाएं',
      isDanger: true,
      action: async () => {
        const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
        const adminUid = adminProfile?.uid || 'admin';

        // Immediate UI update
        setThumbPreviewUrl('');
        setSelectedThumbFile(null);
        setThumbDirectUrlInput('');
        const fileInput = document.getElementById('admin-app-thumbnail-file-input') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';

        setIsApplying(true);
        startUpload('थंबनेल निष्कासन', 'content', 'डेटाबेस से थंबनेल हटाया जा रहा है...');

        try {
          const res = await deleteThumbnailFromAllDatabases(adminName, adminUid);
          completeUpload(res.message);
          toast.success(res.message);
        } catch (err) {
          console.error(err);
          failUpload('थंबनेल हटाने में त्रुटि आई।');
          toast.error('थंबनेल हटाने में त्रुटि आई।');
        } finally {
          setIsApplying(false);
        }
      }
    });
  };

  const isCustomLogoActive = Boolean(content?.appLogoUrl || logoPreviewUrl);
  const isCustomThumbActive = Boolean(
    (content?.appThumbnailUrl && content.appThumbnailUrl.trim() !== '' && content.appThumbnailUrl !== '/pwa-icon-512.png') ||
    (thumbPreviewUrl && thumbPreviewUrl.trim() !== '' && thumbPreviewUrl !== '/pwa-icon-512.png')
  );

  const resolvedThumbDisplay = (thumbPreviewUrl && thumbPreviewUrl.trim() !== '' && thumbPreviewUrl !== '/pwa-icon-512.png')
    ? thumbPreviewUrl
    : (content?.appThumbnailUrl && content.appThumbnailUrl.trim() !== '' && content.appThumbnailUrl !== '/pwa-icon-512.png')
    ? content.appThumbnailUrl
    : '/pwa-icon-512.png';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
      {/* 1. TOP HEADER & MODE SELECTOR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-blue-950 flex items-center justify-center font-black shadow-md border border-amber-300 shrink-0">
            <Sparkles className="w-6 h-6 text-blue-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                ऐप लोगो एवं थंबनेल प्रबंधक (App Logo & Thumbnail Manager)
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Global Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              संस्था का मुख्य लोगो (Navbar/Certificates) एवं वेबसाइट/ऐप का सोशल शेयर थंबनेल (WhatsApp/PWA/Favicon) यहाँ से बदलें।
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          {managerMode === 'logo' ? (
            isCustomLogoActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                कस्टम मुख्य लोगो सक्रिय
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                डिफ़ॉल्ट वेक्टर लोगो सक्रिय
              </span>
            )
          ) : (
            isCustomThumbActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                कस्टम ऐप थंबनेल सक्रिय
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold">
                <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                डिफ़ॉल्ट PWA थंबनेल सक्रिय
              </span>
            )
          )}
        </div>
      </div>

      {/* 2. TRIPLE MODE NAVIGATION TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setManagerMode('logo')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            managerMode === 'logo'
              ? 'bg-white text-blue-900 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>1. संस्था मुख्य लोगो</span>
        </button>

        <button
          type="button"
          id="btn-switch-to-thumbnail-tab"
          onClick={() => setManagerMode('thumbnail')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            managerMode === 'thumbnail'
              ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Share2 className={`w-4 h-4 ${managerMode === 'thumbnail' ? 'text-amber-300' : 'text-purple-700'}`} />
          <span>2. ऐप थंबनेल व पोस्टर</span>
        </button>

        <button
          type="button"
          id="btn-switch-to-seal-tab"
          onClick={() => setManagerMode('seal')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            managerMode === 'seal'
              ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white shadow-md ring-2 ring-amber-300/60'
              : 'text-amber-900 bg-amber-50/70 hover:bg-amber-100 border border-amber-200/60'
          }`}
        >
          <Award className={`w-4 h-4 ${managerMode === 'seal' ? 'text-amber-200' : 'text-amber-700'}`} />
          <span>3. सर्टिफिकेट आधिकारिक मुहर</span>
          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full uppercase">
            Seal
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MAIN LOGO MANAGER */}
      {/* ========================================================================= */}
      {managerMode === 'logo' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">संस्था का मुख्य लोगो (Universal Brand Logo):</strong>
              यह लोगो वेबसाइट के मुख्य नेवबार हेडर, फुटर, दान पावती रसीदों, स्वयंसेवक व दानदाता प्रमाण पत्रों, डिजिटल मुहर (Stamp) तथा आधिकारिक लेटरहेड पर स्वतः दिखाई देता है।
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Upload Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* File Dropzone */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-6 transition-all text-center relative group">
                <input
                  type="file"
                  id="admin-app-logo-file-input"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleLogoFileChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  disabled={isApplying || isUploading}
                />
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-blue-800 group-hover:scale-105 group-hover:bg-blue-800 group-hover:text-white transition-all">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-800 block">
                      नया मुख्य लोगो फ़ाइल चुनें या यहाँ ड्रैग करें
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      PNG (ट्रांसपेरेंट बैकग्राउंड सर्वोत्तम), JPG, WEBP या SVG (अधिकतम 10MB)
                    </span>
                  </div>
                  {selectedLogoFile && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-900 rounded-xl text-xs font-bold border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>चयनित: {selectedLogoFile.name} ({(selectedLogoFile.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearSelectedLogoFile();
                        }}
                        className="ml-2 px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-[11px] font-black transition cursor-pointer flex items-center gap-1"
                        title="चयनित फ़ाइल हटाएं"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                        <span>हटाएं</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Direct URL Input */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-700" />
                  अथवा सीधा इमेज वेब लिंक पेस्ट करें (Optional Web URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={logoDirectUrlInput}
                    onChange={handleLogoDirectUrlChange}
                    placeholder="https://example.com/images/my-ngo-logo.png"
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                    disabled={isApplying || isUploading}
                  />
                  {logoDirectUrlInput && (
                    <button
                      type="button"
                      onClick={handleClearLogoDirectUrl}
                      className="px-3 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
                      title="URL हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>हटाएं</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Google Drive, Cloudinary, Imgur या अपनी वेबसाइट का सीधा इमेज लिंक दर्ज करें।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyNewLogo}
                  disabled={isApplying || isUploading || (!selectedLogoFile && !logoPreviewUrl && !logoDirectUrlInput)}
                  className="flex-1 min-w-[220px] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying || isUploading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>अपलोड व रीयलटाइम सिंक जारी है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-amber-300" />
                      <span>नया मुख्य लोगो सेव करें व सभी जगह लागू करें</span>
                    </>
                  )}
                </button>

                {isCustomLogoActive && (
                  <button
                    type="button"
                    onClick={handleResetLogoToDefault}
                    disabled={isApplying || isUploading}
                    title="मूल डिफ़ॉल्ट वेक्टर लोगो पर वापस लौटें"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-slate-200"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>डिफ़ॉल्ट लोगो रीसेट</span>
                  </button>
                )}

                <button
                  type="button"
                  id="btn-delete-logo-permanent"
                  onClick={handleDeleteLogoEverywhere}
                  disabled={isApplying || isUploading}
                  title="डेटाबेस, फायरस्टोर और लोकल स्टोरेज से लोगो स्थायी रूप से डिलीट करें"
                  className="flex items-center gap-2 px-4 py-3.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-red-200 shadow-xs"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>डेटाबेस से लोगो स्थायी रूप से डिलीट करें</span>
                </button>
              </div>

              {!isCustomLogoActive && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>स्थायी स्थिति:</strong> सॉफ्टवेयर, डेटाबेस और सभी मेमोरी से लोगो पूरी तरह और स्थायी रूप से डिलीट है। वर्तमान में कोई लोगो प्रदर्शित नहीं हो रहा है।
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Multi-Context Live Preview (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-800" />
                  <span className="font-black text-xs text-slate-800">
                    लाइव संदर्भ पूर्वावलोकन (Main Logo Live Preview)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isCustomLogoActive && (
                    <button
                      type="button"
                      onClick={handleDeleteLogoEverywhere}
                      disabled={isApplying || isUploading}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs"
                      title="सक्रिय मुख्य लोगो को सभी जगह से डिलीट करें"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                      <span>लोगो डिलीट</span>
                    </button>
                  )}
                  <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-1.5 py-0.5 rounded">
                    Real-time
                  </span>
                </div>
              </div>

              {/* Context Selector Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveLogoPreviewTab('navbar')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeLogoPreviewTab === 'navbar' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  नेवबार
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoPreviewTab('certificate')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeLogoPreviewTab === 'certificate' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  प्रमाण पत्र
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoPreviewTab('seal')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeLogoPreviewTab === 'seal' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मुहर (Seal)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoPreviewTab('watermark')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeLogoPreviewTab === 'watermark' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  वॉटरमार्क
                </button>
              </div>

              {/* Preview Canvas */}
              <div className="min-h-[220px] flex items-center justify-center">
                {activeLogoPreviewTab === 'navbar' && (
                  <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
                    <BrandLogo size={46} customLogoUrl={logoPreviewUrl || undefined} className="drop-shadow-xs" />
                    <div>
                      <div className="font-black text-sm text-[#3F2B96] leading-none font-['Cinzel',serif]">
                        JEEVAN JYOTI FOUNDATION
                      </div>
                      <div className="text-[10px] font-bold text-amber-700 leading-tight mt-0.5">
                        जीवन ज्योति फाउंडेशन • ग़ाज़ीपुर, उत्तर प्रदेश, भारत
                      </div>
                    </div>
                  </div>
                )}

                {activeLogoPreviewTab === 'certificate' && (
                  <div className="w-full bg-[#FFFDF8] rounded-2xl p-4 shadow-sm border border-amber-200 text-center space-y-2">
                    <BrandLogo size={60} customLogoUrl={logoPreviewUrl || undefined} className="mx-auto drop-shadow-xs" />
                    <div>
                      <div className="font-black text-xs text-[#8B0000] tracking-wider uppercase">
                        JEEVAN JYOTI FOUNDATION GHAZIPUR
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600">
                        भारत सरकार पंजीकृत एवं अधिकृत संस्था
                      </div>
                    </div>
                  </div>
                )}

                {activeLogoPreviewTab === 'seal' && (
                  <div className="w-full flex flex-col items-center justify-center p-3 gap-3">
                    <RoyalCertificateSeal
                      size={90}
                      showRibbons={true}
                      customSealUrl={content?.certificateSealUrl || undefined}
                      variant={(content?.certificateSealVariant as any) || 'gold-crimson'}
                    />
                    <button
                      type="button"
                      onClick={() => setManagerMode('seal')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5 border border-amber-400"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>सर्टिफिकेट आधिकारिक मुहर बदलें (Edit Seal)</span>
                    </button>
                  </div>
                )}

                {activeLogoPreviewTab === 'watermark' && (
                  <div className="w-full relative h-40 bg-white rounded-2xl p-4 border border-slate-200 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <BrandLogo size={140} watermark opacity={0.12} customLogoUrl={logoPreviewUrl || undefined} />
                    </div>
                    <div className="relative z-10 text-center space-y-1">
                      <span className="text-xs font-black text-slate-800 block">
                        प्रमाण पत्र वॉटरमार्क पृष्ठभूमि
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        दस्तावेज़ की बैकग्राउंड में हल्का वॉटरमार्क
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/60 text-[11px] text-blue-900 leading-relaxed">
                <span className="font-black block">💡 तत्काल सार्वभौमिक अद्यतन (Instant Global Fix):</span>
                जैसे ही आप लोगो सेव करेंगे, वेबसाइट का हर पेज और सभी प्रमाण पत्र बिना पेज रिफ्रेश किए स्वतः नए लोगो से अपडेट हो जाएंगे।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: WEBSITE & APP THUMBNAIL LOGO MANAGER (Requested Feature) */}
      {/* ========================================================================= */}
      {managerMode === 'thumbnail' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Information & Feature Summary */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-950 text-white rounded-3xl p-6 shadow-md border border-purple-400/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>वेबसाइट एवं ऐप थंबनेल लोगो चेंजर (App Thumbnail Logo Changer)</span>
                </div>
                <h4 className="text-lg font-black text-white">
                  सोशल मीडिया शेयर थंबनेल, PWA मोबाइल ऐप आइकन व फेविकॉन
                </h4>
                <p className="text-xs text-purple-100 max-w-2xl leading-relaxed">
                  जब कोई व्यक्ति इस वेबसाइट का लिंक व्हाट्सएप (WhatsApp), फेसबुक, ट्विटर या सोशल मीडिया पर शेयर करेगा — तो यह थंबनेल लोगो कार्ड के रूप में दिखेगा। साथ ही मोबाइल में ऐप इंस्टॉल करने पर यह होम-स्क्रीन ऐप आइकन (PWA Thumbnail) का कार्य करता है।
                </p>
              </div>

              {/* Fast Copy Main Logo Shortcut */}
              <button
                type="button"
                onClick={handleCopyMainLogoToThumbnail}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer shrink-0"
              >
                <Copy className="w-4 h-4" />
                <span>मुख्य लोगो को थंबनेल बनाएं</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Upload Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* File Dropzone */}
              <div className="bg-purple-50/50 border-2 border-dashed border-purple-300 hover:border-purple-600 rounded-3xl p-6 transition-all text-center relative group">
                <input
                  type="file"
                  id="admin-app-thumbnail-file-input"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleThumbFileChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  disabled={isApplying || isUploading}
                />
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-purple-200 flex items-center justify-center text-purple-800 group-hover:scale-105 group-hover:bg-purple-800 group-hover:text-white transition-all">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-800 block">
                      ऐप थंबनेल इमेज फ़ाइल चुनें या ड्रैग करें
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      PNG (512x512 पिक्सल अनुशंसित), JPG, WEBP या SVG (अधिकतम 10MB)
                    </span>
                  </div>
                  {selectedThumbFile && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-950 rounded-xl text-xs font-bold border border-purple-200">
                      <CheckCircle className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>चयनित: {selectedThumbFile.name} ({(selectedThumbFile.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearSelectedThumbFile();
                        }}
                        className="ml-2 px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-[11px] font-black transition cursor-pointer flex items-center gap-1"
                        title="चयनित थंबनेल फ़ाइल हटाएं"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                        <span>हटाएं</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Direct URL Input */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-700" />
                  अथवा सीधा इमेज वेब लिंक दर्ज करें (Image URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={thumbDirectUrlInput}
                    onChange={handleThumbDirectUrlChange}
                    placeholder="https://example.com/images/my-app-thumbnail.png"
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-800"
                    disabled={isApplying || isUploading}
                  />
                  {thumbDirectUrlInput && (
                    <button
                      type="button"
                      onClick={handleClearThumbDirectUrl}
                      className="px-3 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
                      title="URL हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>हटाएं</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Google Drive, Imgur, Cloudinary या अपनी वेबसाइट का सीधा 512x512 इमेज लिंक यहाँ पेस्ट कर सकते हैं।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  id="btn-save-app-thumbnail"
                  onClick={handleApplyAppThumbnail}
                  disabled={isApplying || isUploading || (!selectedThumbFile && !thumbPreviewUrl && !thumbDirectUrlInput)}
                  className="flex-1 min-w-[220px] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-800 via-indigo-900 to-blue-900 hover:from-purple-700 hover:to-indigo-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-purple-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying || isUploading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>थंबनेल अपलोड व मेटा टैग्स सिंक जारी है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-amber-300" />
                      <span>वेबसाइट एवं ऐप थंबनेल सेव करें (Save Thumbnail)</span>
                    </>
                  )}
                </button>

                {isCustomThumbActive && (
                  <button
                    type="button"
                    onClick={handleResetThumbToDefault}
                    disabled={isApplying || isUploading}
                    title="डिफ़ॉल्ट PWA थंबनेल पर वापस लौटें"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-slate-200"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>डिफ़ॉल्ट रीसेट</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDeleteThumbEverywhere}
                  disabled={isApplying || isUploading}
                  title="डेटाबेस और स्टोरेज से थंबनेल हटाएं"
                  className="flex items-center gap-1.5 px-3.5 py-3.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-red-200"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>थंबनेल डिलीट करें</span>
                </button>
              </div>
            </div>

            {/* Right Column: Multi-Device Simulation Preview (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-800" />
                  <span className="font-black text-xs text-slate-800">
                    थंबनेल लाइव सिमुलेशन (Real Live Simulation)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isCustomThumbActive && (
                    <button
                      type="button"
                      onClick={handleDeleteThumbEverywhere}
                      disabled={isApplying || isUploading}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs"
                      title="सक्रिय थंबनेल हटाएं"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                      <span>थंबनेल डिलीट</span>
                    </button>
                  )}
                  <span className="text-[10px] bg-purple-600 text-white font-black px-1.5 py-0.5 rounded">
                    OpenGraph Live
                  </span>
                </div>
              </div>

              {/* Simulation Selector Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveThumbPreviewTab('whatsapp')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeThumbPreviewTab === 'whatsapp' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  व्हाट्सएप शेयर
                </button>
                <button
                  type="button"
                  onClick={() => setActiveThumbPreviewTab('mobile_app')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeThumbPreviewTab === 'mobile_app' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मोबाइल ऐप PWA
                </button>
                <button
                  type="button"
                  onClick={() => setActiveThumbPreviewTab('browser')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeThumbPreviewTab === 'browser' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ब्राउज़र टैब
                </button>
              </div>

              {/* SIMULATION PREVIEW 1: WHATSAPP / SOCIAL MEDIA SHARE CARD */}
              {activeThumbPreviewTab === 'whatsapp' && (
                <div className="bg-[#EFEAE2] rounded-2xl p-3.5 shadow-inner border border-stone-300 space-y-2">
                  <span className="text-[10px] font-bold text-stone-600 block">
                    💬 व्हाट्सएप लिंक शेयरिंग पूर्वावलोकन (WhatsApp Link Card):
                  </span>
                  <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="h-36 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={resolvedThumbDisplay}
                        alt="App Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/pwa-icon-512.png';
                        }}
                      />
                    </div>
                    <div className="p-3 bg-stone-50 border-t border-stone-200">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
                        jeevanjyotifoundation.org
                      </span>
                      <h5 className="text-xs font-black text-slate-900 leading-snug line-clamp-1 mt-0.5">
                        जीवन ज्योति फाउंडेशन ग़ाज़ीपुर | Jeevan Jyoti Foundation
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                        Official NGO platform for Education, Healthcare, Food Distribution & Volunteerism in Ghazipur, UP.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION PREVIEW 2: MOBILE APP HOMESCREEN ICON (PWA) */}
              {activeThumbPreviewTab === 'mobile_app' && (
                <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-center text-white space-y-3 shadow-inner">
                  <span className="text-[10px] font-bold text-purple-200 block">
                    📱 मोबाइल होम-स्क्रीन ऐप आइकन (Mobile App Icon):
                  </span>
                  <div className="inline-block relative">
                    <div className="w-20 h-20 rounded-2xl shadow-2xl bg-white p-1.5 border-2 border-amber-400 mx-auto overflow-hidden flex items-center justify-center">
                      <img
                        src={resolvedThumbDisplay}
                        alt="App Icon"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/pwa-icon-512.png';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">
                      जीवन ज्योति
                    </span>
                    <span className="text-[10px] text-amber-300 block">
                      PWA मोबाइल ऐप
                    </span>
                  </div>
                </div>
              )}

              {/* SIMULATION PREVIEW 3: BROWSER TAB & BOOKMARK */}
              {activeThumbPreviewTab === 'browser' && (
                <div className="bg-slate-200 rounded-2xl p-3 space-y-2 border border-slate-300">
                  <span className="text-[10px] font-bold text-slate-600 block">
                    🌐 ब्राउज़र विंडो टैब पूर्वावलोकन (Browser Favicon):
                  </span>
                  <div className="bg-white rounded-t-xl px-3 py-2 flex items-center gap-2 shadow-xs border border-b-0 border-slate-300">
                    <img
                      src={resolvedThumbDisplay}
                      alt="Favicon"
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-sm object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/pwa-icon-512.png';
                      }}
                    />
                    <span className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]">
                      जीवन ज्योति फाउंडेशन ग़ाज़ीपुर...
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-b-xl border border-slate-300 text-center text-xs text-slate-500">
                    वेबसाइट का नया थंबनेल लोगो ब्राउज़र टैब, फेविकॉन और बुकमार्क में दिखाई देगा।
                  </div>
                </div>
              )}

              {/* Info Note */}
              <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 text-[11px] text-purple-950 leading-relaxed">
                <span className="font-black block">💡 स्वतः रीयलटाइम मेटा-टैग्स अपडेट:</span>
                थंबनेल सेव करते ही HTML के <code className="font-mono bg-purple-100 px-1 rounded">&lt;meta property="og:image"&gt;</code>, Twitter Card तथा PWA आइकन में यह स्वतः तुरंत लाइव हो जाएगा।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: UNIVERSAL OFFICIAL CERTIFICATE SEAL MANAGER                    */}
      {/* ========================================================================= */}
      {managerMode === 'seal' && (
        <div className="animate-fadeIn">
          <CertificateOfficialSealManager />
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-APP CONFIRMATION MODAL (Replaces window.confirm for 100% reliable execution in iframes) */}
      {/* ========================================================================= */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${confirmDialog.isDanger ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                {confirmDialog.isDanger ? <Trash2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {confirmDialog.title}
                </h4>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  आधिकारिक प्रशासनिक पुष्टि (Admin Confirmation)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {confirmDialog.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={async () => {
                  const act = confirmDialog.action;
                  setConfirmDialog(null);
                  if (act) await act();
                }}
                className={`px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 ${
                  confirmDialog.isDanger
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/25'
                    : 'bg-blue-800 hover:bg-blue-900 shadow-blue-800/25'
                }`}
              >
                {confirmDialog.isDanger ? <Trash2 className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                <span>{confirmDialog.confirmLabel}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
