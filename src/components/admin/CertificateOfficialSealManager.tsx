import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Palette,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { updateCertificateSeal, resetCertificateSeal, uploadMediaFile } from '../../services/adminService';
import { RoyalCertificateSeal } from '../common/RoyalCertificateSeal';
import toast from 'react-hot-toast';

export const CertificateOfficialSealManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { content } = useHomeContent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [directSealUrlInput, setDirectSealUrlInput] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<'gold-crimson' | 'royal-gold' | 'emerald-gold'>(
    (content as any)?.certificateSealVariant || 'gold-crimson'
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const currentSealUrl = content?.certificateSealUrl || '/uploads/jjf_media_1791272687577_76347e15.jpg';
  const currentVariant = (content as any)?.certificateSealVariant || 'gold-crimson';

  useEffect(() => {
    if (content?.certificateSealUrl) {
      setDirectSealUrlInput(content.certificateSealUrl);
    }
    if ((content as any)?.certificateSealVariant) {
      setSelectedVariant((content as any).certificateSealVariant);
    }
  }, [content?.certificateSealUrl, (content as any)?.certificateSealVariant]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('कृपया केवल इमेज फ़ाइल (PNG, JPG, SVG, WebP) चुनें।');
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFilePreviewUrl(objectUrl);
      toast.success(`फ़ाइल "${file.name}" चुनी गई।`);
    }
  };

  const handleClearSelectedFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setSelectedFile(null);
    setFilePreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveSeal = async () => {
    setIsApplying(true);
    try {
      let finalSealUrl = directSealUrlInput.trim();

      if (selectedFile) {
        setIsUploading(true);
        const uploadedUrl = await uploadMediaFile(
          selectedFile,
          'seals',
          (prog) => setUploadProgress(prog)
        );
        finalSealUrl = uploadedUrl;
        setIsUploading(false);
      }

      await updateCertificateSeal(
        finalSealUrl,
        selectedVariant,
        adminProfile?.name || 'व्यवस्थापक',
        adminProfile?.uid || 'admin'
      );

      handleClearSelectedFile();
      toast.success('प्रमाणपत्रों की आधिकारिक मुहर सफलतापूर्वक सुरक्षित व लागू की गई!');
    } catch (err: any) {
      console.error('Error saving seal:', err);
      toast.error(err?.message || 'मुहर सहेजने में त्रुटि आई।');
    } finally {
      setIsApplying(false);
      setIsUploading(false);
    }
  };

  const handleResetSeal = async () => {
    if (!window.confirm('क्या आप प्रमाणपत्र की मुहर को मूल डिफ़ॉल्ट रॉयल मुहर में रीसेट करना चाहते हैं?')) {
      return;
    }

    setIsApplying(true);
    try {
      await resetCertificateSeal(adminProfile?.name || 'व्यवस्थापक', adminProfile?.uid || 'admin');
      handleClearSelectedFile();
      setDirectSealUrlInput('');
      setSelectedVariant('gold-crimson');
      toast.success('मुहर मूल डिफ़ॉल्ट रॉयल एम्बॉस्ड डिज़ाइन में रीसेट हो गई है!');
    } catch (err: any) {
      console.error('Error resetting seal:', err);
      toast.error('मुहर रीसेट करने में त्रुटि आई।');
    } finally {
      setIsApplying(false);
    }
  };

  const activePreviewUrl = filePreviewUrl || directSealUrlInput.trim() || currentSealUrl;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              प्रमाणपत्र आधिकारिक मुहर प्रबंधन
              <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Official Seal
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              स्वयंसेवक सम्मान, दान रसीद एवं सभी आधिकारिक प्रमाणपत्रों पर प्रदर्शित होने वाली मुहर को अनुकूलित करें।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentSealUrl && (
            <button
              type="button"
              onClick={handleResetSeal}
              disabled={isApplying || isUploading}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>डिफ़ॉल्ट रीसेट</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Controls & Upload */}
        <div className="lg:col-span-7 space-y-6">
          {/* File Upload Box */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              1. नई मुहर छवि अपलोड करें (Upload Custom Seal Image)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              पारदर्शी बैकग्राउंड (Transparent PNG / SVG / WebP) सर्वोत्तम परिणाम देता है।
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="seal-upload-input"
            />

            {!selectedFile ? (
              <label
                htmlFor="seal-upload-input"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-300 rounded-2xl bg-white hover:bg-amber-100/40 transition cursor-pointer group"
              >
                <Upload className="w-8 h-8 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">डिवाइस से फ़ाइल चुनें</span>
                <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, SVG, WebP (अधिकतम 10MB)</span>
              </label>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-white border border-amber-300 rounded-xl shadow-xs">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • तैयार
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelectedFile}
                  className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition cursor-pointer"
                  title="फ़ाइल हटाएं"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Direct URL Input */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>2. या सीधा इमेज URL दर्ज करें (Direct Seal URL)</span>
              </label>
              {directSealUrlInput && (
                <button
                  type="button"
                  onClick={() => setDirectSealUrlInput('')}
                  className="text-[11px] text-red-600 hover:text-red-700 font-bold cursor-pointer"
                >
                  हटाएं (Clear)
                </button>
              )}
            </div>
            <input
              type="url"
              value={directSealUrlInput}
              onChange={(e) => setDirectSealUrlInput(e.target.value)}
              placeholder="https://.../official-seal.png"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Seal Ring Color Variant */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>3. मुहर का रंग थीम चुनें (Color Variant)</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'gold-crimson', label: 'शाही गहरा लाल व स्वर्ण', color: 'from-amber-500 to-red-700' },
                { id: 'royal-gold', label: 'शाही स्वर्ण व नीला', color: 'from-amber-400 to-blue-900' },
                { id: 'emerald-gold', label: 'पन्ना हरा व स्वर्ण', color: 'from-amber-400 to-emerald-800' }
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v.id as any)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedVariant === v.id
                      ? 'bg-white border-amber-500 ring-2 ring-amber-400/40 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-3 w-full rounded-md bg-gradient-to-r ${v.color} mb-2`} />
                  <span className="text-[11px] font-bold text-slate-800 block truncate">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSaveSeal}
            disabled={isApplying || isUploading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-700 to-red-700 hover:from-amber-700 hover:to-red-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-amber-700/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isApplying || isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  {isUploading ? `अपलोड हो रहा है (${uploadProgress}%)...` : 'सुरक्षित किया जा रहा है...'}
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>मुहर सहेजें एवं लागू करें (Save Official Seal)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Certificate Seal Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-amber-400/30 shadow-2xl text-white text-center relative overflow-hidden">
          <div className="absolute top-3 left-4 text-[10px] font-black uppercase tracking-wider text-amber-400/80 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>लाइव मुहर पूर्वावलोकन (Live Preview)</span>
          </div>

          <div className="py-10 flex flex-col items-center justify-center">
            <div className="transform hover:scale-105 transition-transform duration-300 drop-shadow-[0_15px_25px_rgba(217,119,6,0.35)]">
              <RoyalCertificateSeal
                size={180}
                variant={selectedVariant}
                customSealUrl={activePreviewUrl}
                showRibbons={true}
              />
            </div>

            <div className="mt-6 max-w-xs space-y-1">
              <p className="text-xs font-bold text-amber-200">
                {activePreviewUrl ? 'कस्टम मुहर सक्रिय है' : 'मूल डिफ़ॉल्ट राजकीय मुहर'}
              </p>
              <p className="text-[11px] text-slate-400">
                यह मुहर सभी 80G दान पावती रसीदों और स्वयंसेवक सेवा प्रमाणपत्रों पर डिजिटल प्रमाणीकरण के रूप में मुद्रित होगी।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateOfficialSealManager;
