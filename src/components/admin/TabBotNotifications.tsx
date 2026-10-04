// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB: TELEGRAM & SLACK BOT NOTIFICATIONS
// जीवन ज्योति फाउंडेशन - रियल-टाइम प्रशासनिक बॉट अलर्ट प्रबंधन
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Send,
  Bell,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Hash,
  ToggleLeft,
  ToggleRight,
  Clock,
  Sparkles,
  Check,
  Info,
  Smartphone,
  Users,
  Award,
  CreditCard,
  Trash2,
  HelpCircle,
  Copy
} from 'lucide-react';
import {
  getStoredBotConfig,
  saveBotConfig,
  getServerBotConfig,
  getBotNotificationHistory,
  sendBotTestPing,
  BotConfig,
  BotNotificationHistoryItem
} from '../../services/adminBotNotificationService';
import toast from 'react-hot-toast';

export const TabBotNotifications: React.FC = () => {
  const [config, setConfig] = useState<BotConfig>(() => getStoredBotConfig());
  const [history, setHistory] = useState<BotNotificationHistoryItem[]>(() => getBotNotificationHistory());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [serverStatus, setServerStatus] = useState<{
    serverTelegramConfigured: boolean;
    serverTelegramChatId?: string;
    serverSlackConfigured: boolean;
    serverSlackWebhook?: string;
  }>({
    serverTelegramConfigured: false,
    serverSlackConfigured: false
  });

  useEffect(() => {
    getServerBotConfig().then(status => {
      setServerStatus(status);
    });
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    saveBotConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('✓ बॉट सेटिंग्स सफलतापूर्वक सुरक्षित की गईं!');
    }, 400);
  };

  const handleSendTest = async (channel: 'telegram' | 'slack' | 'both') => {
    setIsTesting(true);
    const toastId = toast.loading('बॉट टेस्ट अलर्ट भेजा जा रहा है...');
    try {
      saveBotConfig(config);
      const res = await sendBotTestPing(channel);
      setIsTesting(false);
      setHistory(getBotNotificationHistory());

      if (res.success && (res.telegram?.success || res.slack?.success || res.simulated)) {
        toast.success('✓ टेस्ट अलर्ट सफलतापूर्वक भेजा गया! अपना Telegram / Slack चेक करें।', { id: toastId });
      } else {
        toast.error('⚠️ टेस्ट अलर्ट नहीं जा सका। कृपया बॉट टोकन / वेबहुक URL की जांच करें।', { id: toastId });
      }
    } catch (err: any) {
      setIsTesting(false);
      toast.error(`त्रुटि: ${err.message}`, { id: toastId });
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('jjf_admin_bot_history_v1');
    setHistory([]);
    toast.success('अलर्ट इतिहास साफ़ कर दिया गया।');
  };

  const isAnyConfigured = Boolean(
    (config.telegramEnabled && (config.telegramBotToken || serverStatus.serverTelegramConfigured)) ||
    (config.slackEnabled && (config.slackWebhookUrl || serverStatus.serverSlackConfigured))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Admin Bot Alerts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              टेलीग्राम एवं स्लैक बॉट प्रशासनिक अलर्ट
            </h2>
            <p className="text-sm text-blue-200 max-w-2xl font-normal leading-relaxed">
              वेबसाइट पर जैसे ही कोई नागरिक नया स्वयंसेवक पंजीकरण करेगा या प्रमाण पत्र आवेदन जमा करेगा, आपको तुरंत अपने मोबाइल टेलीग्राम या स्लैक चैनल पर रियल-टाइम नोटिफिकेशन प्राप्त होगा।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => handleSendTest('both')}
              disabled={isTesting}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm transition-all shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
            >
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>टेस्ट अलर्ट भेजें (Send Test)</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-blue-50 active:scale-95 text-blue-950 font-black text-sm transition-all shadow-lg cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>सेटिंग्स सुरक्षित करें</span>
            </button>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-200">
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isAnyConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {isAnyConfigured ? 'बॉट सर्विस सक्रिय (Live Connected)' : 'कॉन्फ़िगरेशन प्रतीक्षारत (Setup Needed)'}
          </span>
          <span>•</span>
          <span>Telegram Bot: {config.telegramEnabled && (config.telegramBotToken || serverStatus.serverTelegramConfigured) ? 'सक्रिय (Active)' : 'बंद / अप्राप्य'}</span>
          <span>•</span>
          <span>Slack Webhook: {config.slackEnabled && (config.slackWebhookUrl || serverStatus.serverSlackConfigured) ? 'सक्रिय (Active)' : 'बंद / अप्राप्य'}</span>
        </div>
      </div>

      {/* Grid of Two Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================================================================
            1. TELEGRAM BOT INTEGRATION
        ================================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs border border-sky-100">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Telegram Bot</span>
                    {serverStatus.serverTelegramConfigured && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                        ENV Ready
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">टेलीग्राम डायरेक्ट मैसेज या ग्रुप अलर्ट</p>
                </div>
              </div>

              {/* Enable Toggle */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, telegramEnabled: !config.telegramEnabled })}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {config.telegramEnabled ? (
                  <ToggleRight className="w-9 h-9 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-400" />
                )}
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telegram Bot Token (HTTP API)
                </label>
                <input
                  type="password"
                  placeholder="e.g. 7123456789:AAH_XxXxXxXxXxXx..."
                  value={config.telegramBotToken}
                  onChange={(e) => setConfig({ ...config, telegramBotToken: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm font-mono text-slate-800 transition-all outline-hidden"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Telegram में <b>@BotFather</b> से <code>/newbot</code> बनाकर प्राप्त करें।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telegram Chat ID / Group ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789 (Personal) or -1001234567890 (Group)"
                  value={config.telegramChatId}
                  onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm font-mono text-slate-800 transition-all outline-hidden"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  अपनी यूजर आईडी जानने के लिए Telegram में <b>@userinfobot</b> देखें।
                </p>
              </div>
            </div>

            {/* Quick Step-by-Step Guide */}
            <div className="bg-sky-50/70 border border-sky-200/70 rounded-2xl p-4 text-xs text-sky-950 space-y-2">
              <div className="font-extrabold flex items-center gap-1.5 text-sky-900">
                <Info className="w-4 h-4 text-sky-600" />
                <span>3 आसान चरणों में टेलीग्राम बॉट सेटअप करें:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-700 leading-relaxed text-[11.5px]">
                <li>Telegram खोलें और <b>@BotFather</b> सर्च करें।</li>
                <li><code>/newbot</code> भेजकर अपने बॉट का नाम दें और <b>Token</b> कॉपी करें।</li>
                <li>बॉट को स्टार्ट करें (या अपने एडमिन ग्रुप में जोड़ें) और ऊपर <b>Chat ID</b> भरें।</li>
              </ol>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              स्टेटस: {config.telegramBotToken ? 'कस्टम टोकन सेट' : (serverStatus.serverTelegramConfigured ? 'सर्वर ENV सक्रिय' : 'अप्रयुक्त')}
            </span>
            <button
              onClick={() => handleSendTest('telegram')}
              disabled={isTesting || (!config.telegramBotToken && !serverStatus.serverTelegramConfigured)}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer"
            >
              Test Telegram
            </button>
          </div>
        </div>

        {/* ================================================================
            2. SLACK BOT / WEBHOOK INTEGRATION
        ================================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs border border-amber-100">
                  <Hash className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Slack Webhook</span>
                    {serverStatus.serverSlackConfigured && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                        ENV Ready
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">स्लैक वर्कस्पेस चैनल डायरेक्ट वेबहुक अलर्ट</p>
                </div>
              </div>

              {/* Enable Toggle */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, slackEnabled: !config.slackEnabled })}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {config.slackEnabled ? (
                  <ToggleRight className="w-9 h-9 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-400" />
                )}
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Slack Incoming Webhook URL
                </label>
                <input
                  type="password"
                  placeholder="https://hooks.slack.com/services/T.../B.../..."
                  value={config.slackWebhookUrl}
                  onChange={(e) => setConfig({ ...config, slackWebhookUrl: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm font-mono text-slate-800 transition-all outline-hidden"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Slack App Directory से <b>Incoming WebHooks</b> जोड़कर प्राप्त करें।
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                <span className="font-bold text-slate-800">लक्ष्य चैनल (Target Channel):</span>{' '}
                अलर्ट्स स्वचालित रूप से आपके चुने हुए स्लैक चैनल (उदा. <code>#jjf-admin-alerts</code>) में पोस्ट होंगे।
              </div>
            </div>

            {/* Quick Step-by-Step Guide */}
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
                <Info className="w-4 h-4 text-amber-600" />
                <span>स्लैक वेबहुक कैसे प्राप्त करें:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-700 leading-relaxed text-[11.5px]">
                <li>अपने Slack Workspace में <b>Apps &gt; Incoming Webhooks</b> खोजें।</li>
                <li>एडमिन अलर्ट के लिए चैनल चुनें (उदा. <code>#general</code> या नया चैनल)।</li>
                <li><b>Add Incoming WebHooks Integration</b> पर क्लिक कर URL यहाँ पेस्ट करें।</li>
              </ol>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              स्टेटस: {config.slackWebhookUrl ? 'कस्टम URL सेट' : (serverStatus.serverSlackConfigured ? 'सर्वर ENV सक्रिय' : 'अप्रयुक्त')}
            </span>
            <button
              onClick={() => handleSendTest('slack')}
              disabled={isTesting || (!config.slackWebhookUrl && !serverStatus.serverSlackConfigured)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer"
            >
              Test Slack
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================
          3. EVENT TRIGGERS SELECTION
      ================================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            अलर्ट ट्रिगर प्राथमिकताएं (Notification Event Triggers)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            चुनें कि किन घटनाओं पर एडमिन को टेलीग्राम या स्लैक पर तुरंत बॉट अलर्ट भेजा जाना चाहिए:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Volunteer Trigger */}
          <div
            onClick={() => setConfig({ ...config, alertOnVolunteer: !config.alertOnVolunteer })}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              config.alertOnVolunteer
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-200 hover:border-slate-300 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">नया स्वयंसेवक पंजीकरण</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                जब भी कोई नागरिक स्वयंसेवक फॉर्म भरेगा, नाम, मोबाइल व क्षेत्र का अलर्ट आएगा।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
              <span className={config.alertOnVolunteer ? 'text-blue-700' : 'text-slate-400'}>
                {config.alertOnVolunteer ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}
              </span>
              {config.alertOnVolunteer ? (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
              )}
            </div>
          </div>

          {/* Certificate Trigger */}
          <div
            onClick={() => setConfig({ ...config, alertOnCertificate: !config.alertOnCertificate })}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              config.alertOnCertificate
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-slate-200 hover:border-slate-300 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">प्रमाण पत्र आवेदन</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                उत्कृष्ट सेवा सम्मान व प्रमाण पत्र जारी होने पर तुरंत आईडी सहित अलर्ट।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
              <span className={config.alertOnCertificate ? 'text-emerald-700' : 'text-slate-400'}>
                {config.alertOnCertificate ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}
              </span>
              {config.alertOnCertificate ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
              )}
            </div>
          </div>

          {/* Staff Trigger */}
          <div
            onClick={() => setConfig({ ...config, alertOnStaff: !config.alertOnStaff })}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              config.alertOnStaff
                ? 'border-purple-500 bg-purple-50/50'
                : 'border-slate-200 hover:border-slate-300 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">स्टाफ व पदाधिकारी आवेदन</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                नए स्टाफ या ब्लॉक कोऑर्डिनेटर नियुक्ति आवेदन पर अनुमोदन हेतु अलर्ट।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
              <span className={config.alertOnStaff ? 'text-purple-700' : 'text-slate-400'}>
                {config.alertOnStaff ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}
              </span>
              {config.alertOnStaff ? (
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
              )}
            </div>
          </div>

          {/* Donation Trigger */}
          <div
            onClick={() => setConfig({ ...config, alertOnDonation: !config.alertOnDonation })}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              config.alertOnDonation
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-slate-200 hover:border-slate-300 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">नया दान सहयोग</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                UPI या बैंक द्वारा दान राशि प्राप्त होने पर रसीद व राशि विवरण अलर्ट।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
              <span className={config.alertOnDonation ? 'text-amber-700' : 'text-slate-400'}>
                {config.alertOnDonation ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}
              </span>
              {config.alertOnDonation ? (
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          4. RECENT NOTIFICATION DISPATCH HISTORY
      ================================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-600" />
              <span>हालिया अलर्ट इतिहास (Recent Dispatched Alerts)</span>
            </h3>
            <p className="text-xs text-slate-500">
              बॉट द्वारा हाल ही में भेजे गए अलर्ट्स का ऑडिट लॉग:
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>इतिहास हटाएं</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">अभी तक कोई बॉट अलर्ट रिकॉर्ड नहीं है।</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              ऊपर "टेस्ट अलर्ट भेजें" बटन पर क्लिक करके पहला टेस्ट अलर्ट भेज सकते हैं।
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {history.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                      item.type === 'volunteer'
                        ? 'bg-blue-100 text-blue-700'
                        : item.type === 'certificate'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.type === 'staff'
                        ? 'bg-purple-100 text-purple-700'
                        : item.type === 'donation'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.type === 'volunteer' && 'VOL'}
                    {item.type === 'certificate' && 'CERT'}
                    {item.type === 'staff' && 'STF'}
                    {item.type === 'donation' && 'DON'}
                    {item.type === 'test' && 'TST'}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-800">{item.title}</h5>
                    <p className="text-slate-500 text-[11px]">{item.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div className="text-[11px] text-slate-400 font-mono">{item.timestamp}</div>
                  <div className="flex items-center gap-1.5">
                    {item.channels.telegram && (
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">
                        Telegram
                      </span>
                    )}
                    {item.channels.slack && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Slack
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        item.status === 'sent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'partial'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'simulated'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
