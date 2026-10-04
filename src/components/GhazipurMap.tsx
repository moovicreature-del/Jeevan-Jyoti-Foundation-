import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Users,
  School,
  HeartPulse,
  Utensils,
  Home,
  ExternalLink,
  Copy,
  Check,
  Compass,
  Building2,
  ShieldCheck,
  Sparkles,
  X,
  Layers,
  Map as MapIcon,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { GHAZIPUR_LOCATIONS } from '../data/locationData';
import { FOUNDATION_INFO } from '../data/foundationData';
import { LocationItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

// Normalized visual positioning for pins across Ghazipur District geography
interface PinMapPosition {
  xPercent: number; // percentage from left (0 to 100)
  yPercent: number; // percentage from top (0 to 100)
  tooltipAlign: 'left' | 'right';
  zoneHindi: string;
  zoneEnglish: string;
}

const PIN_MAP_POSITIONS: Record<string, PinMapPosition> = {
  'miranpur-hq': {
    xPercent: 81,
    yPercent: 32,
    tooltipAlign: 'left',
    zoneHindi: 'मोहम्मदाबाद (मीरानपुर मुख्यालय)',
    zoneEnglish: 'Mohammadabad (Miranpur HQ)'
  },
  'mohammadabad-health': {
    xPercent: 71,
    yPercent: 20,
    tooltipAlign: 'left',
    zoneHindi: 'मोहम्मदाबाद (तहसील चौक)',
    zoneEnglish: 'Mohammadabad (Tehsil Chowk)'
  },
  'sadar-shiksha': {
    xPercent: 33,
    yPercent: 36,
    tooltipAlign: 'right',
    zoneHindi: 'गाज़ीपुर सदर (गंगा घाट)',
    zoneEnglish: 'Ghazipur Sadar (Ganga Ghat)'
  },
  'zamania-annapurna': {
    xPercent: 27,
    yPercent: 75,
    tooltipAlign: 'right',
    zoneHindi: 'जमानिया (स्टेशन रोड)',
    zoneEnglish: 'Zamania (Station Road)'
  }
};

export const GhazipurMap: React.FC = () => {
  const { t, isHindi } = useLanguage();
  const [selectedLoc, setSelectedLoc] = useState<LocationItem>(GHAZIPUR_LOCATIONS[0]);
  const [viewMode, setViewMode] = useState<'interactive_map' | 'google_map' | 'hub_details'>('interactive_map');
  const [copiedLink, setCopiedLink] = useState(false);

  // Pin hover and click/pinned states
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [pinnedLoc, setPinnedLoc] = useState<LocationItem | null>(null);

  const officialGmapsUrl = 'https://maps.app.goo.gl/72kFrETKbmiKA3gv7';

  // The active location shown in the interactive tooltip (pinned takes priority over hovered)
  const activeTooltipLoc = pinnedLoc || (hoveredPinId ? GHAZIPUR_LOCATIONS.find((l) => l.id === hoveredPinId) : null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'school':
        return <School className="w-4 h-4 text-blue-600" />;
      case 'health_camp':
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'food_center':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      default:
        return <Home className="w-4 h-4 text-orange-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'headquarters':
        return isHindi ? 'मुख्य कार्यालय व कौशल केंद्र' : 'Headquarters & Skill Center';
      case 'school':
        return isHindi ? 'निःशुल्क बाल पाठशाला' : 'Child Literacy Center';
      case 'health_camp':
        return isHindi ? 'स्वास्थ्य व दवा वितरण केंद्र' : 'Mobile Health Mission';
      case 'food_center':
        return isHindi ? 'अन्नपूर्णा भोजन सेवा केंद्र' : 'Annapurna Food Seva Hub';
      default:
        return isHindi ? 'सेवा केंद्र' : 'Service Hub';
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'headquarters':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'school':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'health_camp':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'food_center':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getPinMarkerColor = (type: string) => {
    switch (type) {
      case 'headquarters':
        return {
          bg: 'bg-gradient-to-tr from-orange-600 to-amber-500',
          ring: 'border-orange-300 ring-orange-500/30',
          pulse: 'bg-orange-500',
          glow: 'shadow-orange-500/50'
        };
      case 'school':
        return {
          bg: 'bg-gradient-to-tr from-blue-600 to-cyan-500',
          ring: 'border-blue-300 ring-blue-500/30',
          pulse: 'bg-blue-500',
          glow: 'shadow-blue-500/50'
        };
      case 'health_camp':
        return {
          bg: 'bg-gradient-to-tr from-rose-600 to-red-500',
          ring: 'border-rose-300 ring-rose-500/30',
          pulse: 'bg-rose-500',
          glow: 'shadow-rose-500/50'
        };
      case 'food_center':
        return {
          bg: 'bg-gradient-to-tr from-amber-600 to-yellow-500',
          ring: 'border-amber-300 ring-amber-500/30',
          pulse: 'bg-amber-500',
          glow: 'shadow-amber-500/50'
        };
      default:
        return {
          bg: 'bg-gradient-to-tr from-slate-700 to-slate-500',
          ring: 'border-slate-300 ring-slate-500/30',
          pulse: 'bg-slate-500',
          glow: 'shadow-slate-500/50'
        };
    }
  };

  const handleCopyGmapsLink = () => {
    navigator.clipboard.writeText(officialGmapsUrl);
    setCopiedLink(true);
    toast.success('गूगल मैप लोकेशन लिंक कॉपी हो गया!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Google Maps embed URL based on selected location
  const getEmbedMapUrl = () => {
    return `https://maps.google.com/maps?q=${selectedLoc.coordinates.lat},${selectedLoc.coordinates.lng}&hl=hi&z=15&output=embed`;
  };

  // Pin click handler
  const handlePinClick = (loc: LocationItem) => {
    setSelectedLoc(loc);
    if (pinnedLoc?.id === loc.id) {
      setPinnedLoc(null);
    } else {
      setPinnedLoc(loc);
      toast.success(`${loc.nameHindi} पिन चयनित!`, { icon: '📍' });
    }
  };

  return (
    <section id="ghazipur-map" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-black uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>
              {t(
                'map.badge',
                'आधिकारिक गूगल मैप एवं सेवा केंद्र (Official Google Map & Service Hubs)',
                'Official Google Map & Active Service Hubs'
              )}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {t(
              'map.title',
              'गूगल मैप पर जीवन ज्योति फाउंडेशन (ग़ाज़ीपुर, उत्तर प्रदेश, भारत) की लोकेशन',
              'Jeevan Jyoti Foundation (Ghazipur, Uttar Pradesh, India) on Google Maps'
            )}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {t(
              'map.sub',
              'मीरानपुर (मोहम्मदाबाद), ग़ाज़ीपुर मुख्य कार्यालय सहित समस्त सेवा केंद्रों की लाइव गूगल मैप लोकेशन देखें, पिन पर होवर/क्लिक कर शाखा विवरण देखें एवं सीधे दिशा-निर्देश (Directions) प्राप्त करें।',
              'View live Google Map locations for our Miranpur Head Office and regional hubs. Hover or click any pin to view branch details, address, and instant Directions.'
            )}
          </p>

          {/* Quick Direct Google Map Link Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-2 bg-white rounded-2xl border border-orange-200 shadow-sm">
            <a
              href={officialGmapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>गूगल मैप में खोलें (Open in Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              onClick={handleCopyGmapsLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-300"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'लिंक कॉपी हुआ' : 'मैप लिंक कॉपी करें'}</span>
            </button>

            <span className="text-[11px] font-mono text-slate-500 hidden md:inline px-2">
              maps.app.goo.gl/72kFrETKbmiKA3gv7
            </span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: List of Centers (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                सेवा केंद्र चयन (Select Center)
              </span>
              <span className="text-[11px] text-orange-600 font-bold">
                {GHAZIPUR_LOCATIONS.length} सक्रिय केंद्र (पिन)
              </span>
            </div>

            {GHAZIPUR_LOCATIONS.map((loc) => {
              const isSelected = selectedLoc.id === loc.id;
              const isHq = loc.id === 'miranpur-hq';
              const isPinned = pinnedLoc?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handlePinClick(loc)}
                  onMouseEnter={() => setHoveredPinId(loc.id)}
                  onMouseLeave={() => setHoveredPinId(null)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isSelected || isPinned
                      ? 'border-orange-500 bg-white shadow-lg ring-2 ring-orange-400/20'
                      : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/30 shadow-xs'
                  }`}
                >
                  {isHq && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
                      मुख्य कार्यालय (HQ)
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 ${
                        isSelected
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {getTypeIcon(loc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {isHindi ? loc.nameHindi : loc.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {loc.address}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600 font-semibold">
                        <span className="flex items-center gap-1 text-orange-700">
                          <Users className="w-3.5 h-3.5" />
                          {loc.beneficiaries.toLocaleString('en-IN')}+ {t('events.citizens', 'लाभांवित', 'Beneficiaries')}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">
                          {loc.activeVolunteers} {t('impact.vols', 'स्वयंसेवक', 'Volunteers')}
                        </span>
                      </div>

                      {/* Quick Directions Link right on the card */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          GPS: {loc.coordinates.lat.toFixed(3)}, {loc.coordinates.lng.toFixed(3)}
                        </span>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>दिशा-निर्देश (Directions)</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Official HQ Address Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md border border-slate-700 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>पंजीकृत मुख्य पता (Registered Address)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-700/80">
                <span>पिन कोड: <strong className="text-white font-mono">{FOUNDATION_INFO.pincode} (DIGIPIN 2J6T226CL2)</strong></span>
                <span>हेल्पलाइन: <strong className="text-amber-300 font-mono">{FOUNDATION_INFO.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map with Pins & Tooltips (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            {/* Map Action Top Bar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-black text-white truncate">
                    {isHindi ? selectedLoc.nameHindi : selectedLoc.name}
                  </h3>
                  <span className="text-[11px] text-orange-300 font-mono block">
                    GPS: {selectedLoc.coordinates.lat.toFixed(4)}° N, {selectedLoc.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>

              {/* View Switcher & External Button */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setViewMode('interactive_map')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'interactive_map'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>इंटरैक्टिव पिन मैप</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('google_map')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'google_map'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>लाइव गूगल मैप</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('hub_details')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'hub_details'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>केंद्र विवरण</span>
                  </button>
                </div>

                <a
                  href={selectedLoc.googleMapsUrl || officialGmapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Open live location in Google Maps App"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Main Interactive Display Area */}
            {viewMode === 'interactive_map' ? (
              /* VIEW 1: INTERACTIVE VECTOR DISTRICT MAP WITH GEOGRAPHIC PINS & TOOLTIPS */
              <div
                className="relative w-full h-[520px] bg-slate-900 overflow-hidden select-none"
                onClick={() => {
                  // Clicking anywhere on map background dismisses pinned tooltip
                  setPinnedLoc(null);
                }}
              >
                {/* SVG Geographical Ghazipur District Map Canvas */}
                <svg
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  viewBox="0 0 800 480"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="districtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="gangaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
                    </linearGradient>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
                    </pattern>
                  </defs>

                  {/* Grid background */}
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Ghazipur District Stylized Contour Boundary */}
                  <path
                    d="M 120 110 C 220 70, 360 80, 520 90 C 650 95, 740 140, 770 240 C 780 340, 680 410, 560 430 C 430 440, 280 450, 160 430 C 90 410, 60 330, 70 230 C 80 150, 90 120, 120 110 Z"
                    fill="url(#districtGradient)"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    opacity="0.8"
                  />

                  {/* Sacred River Ganga Curving through Ghazipur */}
                  <path
                    d="M 30 420 Q 150 370 230 280 T 360 250 T 540 290 T 700 270 T 800 280"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeOpacity="0.25"
                  />
                  <path
                    d="M 30 420 Q 150 370 230 280 T 360 250 T 540 290 T 700 270 T 800 280"
                    fill="none"
                    stroke="url(#gangaGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 30 420 Q 150 370 230 280 T 360 250 T 540 290 T 700 270 T 800 280"
                    fill="none"
                    stroke="#e0f2fe"
                    strokeWidth="2"
                    strokeDasharray="6 8"
                    strokeLinecap="round"
                    opacity="0.7"
                  />

                  {/* River Ganga Label */}
                  <text x="440" y="278" fill="#7dd3fc" fontSize="11" fontWeight="700" letterSpacing="2" opacity="0.85">
                    ~ पवित्र गंगा नदी (Holy River Ganga) ~
                  </text>

                  {/* Major Expressways & Highways */}
                  {/* Purvanchal Expressway */}
                  <path
                    d="M 30 160 Q 260 140 500 130 T 780 110"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeDasharray="8 4"
                    opacity="0.5"
                  />
                  <text x="320" y="125" fill="#fcd34d" fontSize="9" fontWeight="600" opacity="0.7">
                    पूर्वांचल एक्सप्रेसवे (Purvanchal Expressway)
                  </text>

                  {/* NH-31 Ghazipur - Mohammadabad - Ballia Road */}
                  <path
                    d="M 230 230 L 460 210 L 640 180 L 780 190"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                    opacity="0.5"
                  />
                  <text x="490" y="195" fill="#cbd5e1" fontSize="9" fontWeight="500" opacity="0.6">
                    NH-31 (गाज़ीपुर - मोहम्मदाबाद मार्ग)
                  </text>

                  {/* Zamania - Ghazipur Ganga Bridge Link */}
                  <path
                    d="M 216 360 L 264 240"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    opacity="0.6"
                  />
                  <text x="248" y="300" fill="#94a3b8" fontSize="8" fontWeight="600" opacity="0.6" transform="rotate(-65 248 300)">
                    गंगा सेतु (Ganga Bridge)
                  </text>

                  {/* Boundary Direction Indicators */}
                  <text x="30" y="240" fill="#64748b" fontSize="10" fontWeight="bold">
                    ◀ वाराणसी / चंदौली
                  </text>
                  <text x="700" y="220" fill="#64748b" fontSize="10" fontWeight="bold">
                    बलिया / बक्सर ▶
                  </text>
                  <text x="380" y="45" fill="#64748b" fontSize="10" fontWeight="bold">
                    ▲ मऊ / आज़मगढ़
                  </text>
                </svg>

                {/* Compass & Scale Overlay */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-white text-[11px] flex items-center gap-2 pointer-events-none z-10">
                  <Compass className="w-4 h-4 text-orange-400 animate-spin-slow" />
                  <span className="font-mono font-bold text-amber-300">N</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-[10px] text-slate-300">जिला गाज़ीपुर (उ.प्र.)</span>
                </div>

                {/* Instructions Hint Banner */}
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-[11px] flex items-center gap-2 pointer-events-none z-10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>पिन पर होवर या क्लिक करें (Hover/Click Pin for Details & Directions)</span>
                </div>

                {/* Interactive Pins on the Map */}
                {GHAZIPUR_LOCATIONS.map((loc) => {
                  const pos = PIN_MAP_POSITIONS[loc.id] || {
                    xPercent: 50,
                    yPercent: 50,
                    tooltipAlign: 'right',
                    zoneHindi: loc.nameHindi,
                    zoneEnglish: loc.name
                  };
                  const isSelected = selectedLoc.id === loc.id;
                  const isHovered = hoveredPinId === loc.id;
                  const isPinned = pinnedLoc?.id === loc.id;
                  const isHq = loc.id === 'miranpur-hq';
                  const markerColors = getPinMarkerColor(loc.type);

                  return (
                    <div
                      key={loc.id}
                      style={{
                        left: `${pos.xPercent}%`,
                        top: `${pos.yPercent}%`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      {/* Interactive Pin Marker Container */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinClick(loc);
                        }}
                        onMouseEnter={() => setHoveredPinId(loc.id)}
                        onMouseLeave={() => setHoveredPinId(null)}
                        className={`relative group cursor-pointer transition-transform duration-200 ${
                          isSelected || isPinned || isHovered ? 'scale-125 z-30' : 'hover:scale-115'
                        }`}
                      >
                        {/* Radar Ping Animation */}
                        <div
                          className={`absolute -inset-2.5 rounded-full ${markerColors.pulse} opacity-40 animate-ping`}
                        />

                        {/* Outer Glow Ring */}
                        <div
                          className={`w-10 h-10 rounded-full ${markerColors.bg} border-2 ${markerColors.ring} ${markerColors.glow} shadow-lg flex items-center justify-center text-white relative transition-all`}
                        >
                          {getTypeIcon(loc.type)}

                          {isHq && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border border-slate-950 flex items-center justify-center text-[8px] font-black text-slate-950">
                              ★
                            </span>
                          )}
                        </div>

                        {/* Permanent Name Label Below Pin */}
                        <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 backdrop-blur-xs border border-slate-700/80 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md pointer-events-none flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isHq ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                          />
                          <span>{pos.zoneHindi.split('(')[0]}</span>
                        </div>
                      </div>

                      {/* Interactive Tooltip Popover (Anchored to this pin) */}
                      {activeTooltipLoc?.id === loc.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute z-40 w-[290px] sm:w-[320px] max-w-[85vw] ${
                            pos.tooltipAlign === 'left'
                              ? 'right-full mr-3 -top-16 sm:-top-20'
                              : 'left-full ml-3 -top-16 sm:-top-20'
                          } animate-in fade-in zoom-in-95 duration-150`}
                        >
                          <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-orange-500/40 p-4 text-slate-800 text-left pointer-events-auto">
                            {/* Tooltip Arrow Pointer */}
                            <div
                              className={`absolute top-20 w-3 h-3 bg-white rotate-45 border-orange-500/40 ${
                                pos.tooltipAlign === 'left'
                                  ? '-right-1.5 border-t-2 border-r-2'
                                  : '-left-1.5 border-b-2 border-l-2'
                              }`}
                            />

                            {/* Header */}
                            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-xl border shrink-0 ${getTypeBadgeStyle(loc.type)}`}>
                                  {getTypeIcon(loc.type)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                                      {getTypeLabel(loc.type)}
                                    </span>
                                    {isHq && (
                                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                                        JJF HQ
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-sm font-black text-slate-900 leading-snug mt-0.5 truncate">
                                    {isHindi ? loc.nameHindi : loc.name}
                                  </h4>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPinnedLoc(null);
                                  setHoveredPinId(null);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
                                title="टूलटिप बंद करें (Close)"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Branch Details */}
                            <div className="py-2.5 space-y-2 text-xs">
                              {/* Specific Address */}
                              <div className="flex items-start gap-1.5 text-slate-600">
                                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                                <span className="leading-snug text-[11px] font-medium text-slate-700">
                                  {loc.address}
                                </span>
                              </div>

                              {/* Lead Person & Contact Phone */}
                              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <div>
                                  <span className="text-slate-400 block text-[10px]">प्रभारी (Lead):</span>
                                  <strong className="text-slate-800 truncate block font-bold">
                                    {loc.leadPerson}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">हेल्पलाइन (Phone):</span>
                                  <a
                                    href={`tel:${loc.phone.replace(/\s+/g, '')}`}
                                    className="text-orange-600 font-bold hover:underline font-mono"
                                  >
                                    {loc.phone}
                                  </a>
                                </div>
                              </div>

                              {/* Beneficiaries & Volunteers Metrics */}
                              <div className="flex items-center justify-between text-[11px] pt-0.5">
                                <span className="text-amber-700 font-bold flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {loc.beneficiaries.toLocaleString('en-IN')}+ लाभांवित
                                </span>
                                <span className="text-emerald-700 font-bold">
                                  {loc.activeVolunteers} सक्रिय स्वयंसेवक
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons: Directions Link & Google Maps Link */}
                            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                                title="गूगल मैप्स पर दिशा-निर्देश प्राप्त करें"
                              >
                                <Navigation className="w-3.5 h-3.5 shrink-0" />
                                <span>दिशा-निर्देश (Directions)</span>
                              </a>

                              <a
                                href={loc.googleMapsUrl || officialGmapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2 px-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                                title="Google Maps में खोलें"
                              >
                                <span>Google Maps</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Bottom Left Branch Pin Selector Strip */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 overflow-x-auto p-1.5 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-700/80 z-20">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 pl-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>शाखा पिन:</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {GHAZIPUR_LOCATIONS.map((loc) => {
                      const isSelected = selectedLoc.id === loc.id;
                      const isPinned = pinnedLoc?.id === loc.id;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => handlePinClick(loc)}
                          onMouseEnter={() => setHoveredPinId(loc.id)}
                          onMouseLeave={() => setHoveredPinId(null)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer border ${
                            isSelected || isPinned
                              ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {getTypeIcon(loc.type)}
                          <span>{isHindi ? loc.nameHindi.split(' ')[0] : loc.name.split(' ')[0]}</span>
                          {loc.id === 'miranpur-hq' && <span className="text-[9px] text-amber-300 font-mono">(HQ)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : viewMode === 'google_map' ? (
              /* VIEW 2: LIVE EMBEDDED GOOGLE MAP WITH FLOATING PIN TOOLTIPS */
              <div className="relative w-full h-[520px] bg-slate-100">
                {/* Embedded Live Google Map iFrame */}
                <iframe
                  title={`Google Map - ${selectedLoc.name}`}
                  src={getEmbedMapUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />

                {/* Floating Navigation Overlay Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-200 text-xs text-slate-800 max-w-xs pointer-events-auto z-20">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>सत्यापित सेवा केंद्र ({selectedLoc.nameHindi})</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{selectedLoc.address}</p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLoc.coordinates.lat},${selectedLoc.coordinates.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>दिशा-निर्देश (Directions)</span>
                    </a>

                    <a
                      href={selectedLoc.googleMapsUrl || officialGmapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Floating Pin Selectors across top right */}
                <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-1 z-20">
                  {GHAZIPUR_LOCATIONS.map((loc) => {
                    const isSelected = selectedLoc.id === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => handlePinClick(loc)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-300 hover:text-white'
                        }`}
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{loc.id === 'miranpur-hq' ? 'मीरानपुर HQ' : loc.nameHindi.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* VIEW 3: FULL CENTER DETAILS VIEW */
              <div className="p-6 sm:p-8 space-y-6 bg-slate-900 text-white min-h-[520px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>सक्रिय सामाजिक सेवा केंद्र • {getTypeLabel(selectedLoc.type)}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">
                    {isHindi ? selectedLoc.nameHindi : selectedLoc.name}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedLoc.address}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <p className="text-xs text-slate-400 font-medium">
                        {t('map.beneficiaries', 'कुल लाभांवित नागरिक', 'Total Citizens Benefited')}
                      </p>
                      <p className="text-2xl font-black text-yellow-400 mt-1">
                        {selectedLoc.beneficiaries.toLocaleString('en-IN')}+
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <p className="text-xs text-slate-400 font-medium">
                        {t('map.vol_team', 'सक्रिय सेवा दल', 'Active Volunteer Team')}
                      </p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">
                        {selectedLoc.activeVolunteers} Volunteers
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-400 font-medium">
                        {t('map.lead', 'केंद्र प्रभारी (Lead)', 'Center In-Charge')}
                      </p>
                      <p className="text-sm font-bold text-white mt-1">{selectedLoc.leadPerson}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                  <a
                    href={`tel:${selectedLoc.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-orange-400" />
                    <span>
                      {t('map.contact', 'केंद्र संपर्क', 'Center Contact')}:{' '}
                      <strong className="text-white font-mono">{selectedLoc.phone}</strong>
                    </span>
                  </a>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLoc.coordinates.lat},${selectedLoc.coordinates.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>दिशा-निर्देश (Directions)</span>
                    </a>

                    <a
                      href={selectedLoc.googleMapsUrl || officialGmapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Bar with Coordinates, Address & Instant 'Directions' Link */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 min-w-0">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="truncate font-medium">
                  {selectedLoc.address}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Dedicated 'Directions' Link as requested */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLoc.coordinates.lat},${selectedLoc.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="गूगल मैप्स पर टर्न-बाय-टर्न दिशा निर्देश"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>दिशा-निर्देश (Directions)</span>
                </a>

                <a
                  href={selectedLoc.googleMapsUrl || officialGmapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>गूगल मैप खोलें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GhazipurMap;
