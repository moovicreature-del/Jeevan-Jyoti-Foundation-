// ============================================================================
// JEEVAN JYOTI FOUNDATION - MOTIVATIONAL QUOTES & POSTER STUDIO DATA
// जीवन ज्योति फाउंडेशन - प्रेरक सुविचार संग्रह एवं पोस्टर पृष्ठभूमि शैलियां
// ============================================================================

export type QuoteCategoryKey =
  | 'educational'
  | 'career'
  | 'devotional'
  | 'humanity'
  | 'family'
  | 'friends'
  | 'life'
  | 'patriotism';

export interface MotivationalQuote {
  id: string;
  category: QuoteCategoryKey;
  quoteHi: string;
  quoteEn?: string;
  author: string;
  source?: string;
  tags?: string[];
  suggestedThemeIndex?: number;
}

export interface PosterThemePreset {
  id: string;
  name: string;
  nameHi: string;
  category: QuoteCategoryKey | 'universal';
  bgGradient: string; // CSS linear/radial gradient
  canvasBg: string; // canvas fillStyle
  cardBg: string; // card container styling
  textColor: string;
  quoteColor: string;
  authorColor: string;
  accentColor: string;
  borderGlow: string;
  badgeBg: string;
  badgeText: string;
  patternType: 'dots' | 'sacred' | 'mandala' | 'geometric' | 'leaves' | 'stars' | 'subtle';
  mood: string;
  isLight?: boolean;
  headerColor?: string;
  subHeaderColor?: string;
  cardTextColor?: string;
  cardSubTextColor?: string;
}

export interface QuoteCategoryMeta {
  key: QuoteCategoryKey;
  labelHi: string;
  labelEn: string;
  icon: string; // emoji or icon identifier
  taglineHi: string;
  description: string;
  defaultThemeId: string;
}

export const QUOTE_CATEGORIES: QuoteCategoryMeta[] = [
  {
    key: 'educational',
    labelHi: 'शिक्षा एवं ज्ञान',
    labelEn: 'Educational & Knowledge',
    icon: '📚',
    taglineHi: 'शिक्षा वह सबसे शक्तिशाली हथियार है जिससे आप दुनिया बदल सकते हैं।',
    description: 'ज्ञान, स्वाध्याय, निरंतर सीखने और बौद्धिक विकास के प्रेरक विचार',
    defaultThemeId: 'theme-edu-wisdom'
  },
  {
    key: 'career',
    labelHi: 'करियर एवं सफलता',
    labelEn: 'Career & Ambition',
    icon: '💼',
    taglineHi: 'सपनों को पाने के लिए समझदार नहीं, थोड़ा जिद्दी होना पड़ता है।',
    description: 'कड़ा परिश्रम, आत्मनिर्भरता, उद्यमिता, लक्ष्य निर्धारण और सफलता के नियम',
    defaultThemeId: 'theme-career-gold'
  },
  {
    key: 'devotional',
    labelHi: 'भक्ति एवं आध्यात्म',
    labelEn: 'Devotional & Spiritual',
    icon: '🕉️',
    taglineHi: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन • मन शांत तो हर मार्ग सुगम।',
    description: 'श्रीमद्भगवद्गीता, संतों के उपदेश, ईश्वर भक्ति, शांति और आध्यात्मिक ऊर्जा',
    defaultThemeId: 'theme-devo-saffron'
  },
  {
    key: 'humanity',
    labelHi: 'मानवता एवं परोपकार',
    labelEn: 'Humanity & Service',
    icon: '🤝',
    taglineHi: 'परोपकाराय फलन्ति वृक्षाः • दूसरों के चेहरे पर मुस्कान ही सच्ची मानवता है।',
    description: 'निःस्वार्थ सेवा, करुणा, रक्तदान, शिक्षा दान और गरीबों की सहायता',
    defaultThemeId: 'theme-humanity-emerald'
  },
  {
    key: 'family',
    labelHi: 'परिवार एवं संस्कार',
    labelEn: 'Family & Heritage',
    icon: '🏡',
    taglineHi: 'माता-पिता का आशीर्वाद ही जीवन की सबसे बड़ी पूंजी और ढाल है।',
    description: 'माता-पिता का आदर, पारिवारिक एकता, संस्कार और अपनों का अटूट संबल',
    defaultThemeId: 'theme-family-terracotta'
  },
  {
    key: 'friends',
    labelHi: 'मित्रता एवं भाईचारा',
    labelEn: 'Friends & Brotherhood',
    icon: '👥',
    taglineHi: 'एक सच्चा मित्र पूरे संसार की दौलत से भी कहीं अधिक अनमोल होता है।',
    description: 'सच्ची दोस्ती, निष्कपट साथी, विश्वास और सुख-दुःख की साझेदारी',
    defaultThemeId: 'theme-friends-teal'
  },
  {
    key: 'life',
    labelHi: 'जीवन दर्शन एवं प्रेरणा',
    labelEn: 'Life & Philosophy',
    icon: '🌿',
    taglineHi: 'जिंदगी को समझने से ज्यादा, जिंदगी को सकारात्मकता के साथ जीना जरूरी है।',
    description: 'आत्मविश्वास, मानसिक शांति, समय का सम्मान, धैर्य और जीवन संघर्ष',
    defaultThemeId: 'theme-life-serene'
  },
  {
    key: 'patriotism',
    labelHi: 'राष्ट्रसेवा एवं युवा शक्ति',
    labelEn: 'Patriotism & Youth',
    icon: '🔥',
    taglineHi: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।',
    description: 'देशभक्ति, युवा शक्ति, समाज निर्माण और राष्ट्र के प्रति कर्तव्यबोध',
    defaultThemeId: 'theme-patriot-tricolor'
  }
];

import { EXTRA_QUOTES_PART1 } from './extraQuotesPart1';
import { EXTRA_QUOTES_PART2 } from './extraQuotesPart2';

const BASE_MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  // ==========================================================================
  // 1. EDUCATIONAL & KNOWLEDGE (शिक्षा एवं ज्ञान) - TOP 20 QUOTES
  // ==========================================================================
  {
    id: 'edu-1',
    category: 'educational',
    quoteHi: 'शिक्षा सबसे शक्तिशाली हथियार है, जिससे आप पूरी दुनिया को बदल सकते हैं।',
    quoteEn: 'Education is the most powerful weapon which you can use to change the world.',
    author: 'नेल्सन मंडेला (Nelson Mandela)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-2',
    category: 'educational',
    quoteHi: 'सीखने की प्रक्रिया में कभी अहंकार मत आने दो, और सिखाने की प्रक्रिया में कभी धैर्य मत खोओ।',
    quoteEn: 'In learning, never let ego intervene; in teaching, never lose patience.',
    author: 'डॉ. सर्वपल्ली राधाकृष्णन',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-3',
    category: 'educational',
    quoteHi: 'सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।',
    quoteEn: 'Dreams are not what you see in sleep, they are what do not let you sleep.',
    author: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-4',
    category: 'educational',
    quoteHi: 'विद्या ददाति विनयं विनयाद्याति पात्रताम्। ज्ञान से ही विनम्रता और विनम्रता से योग्यता आती है।',
    quoteEn: 'Knowledge bestows humility, and from humility comes worthiness.',
    author: 'हितोपदेश / चाणक्य नीति',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-5',
    category: 'educational',
    quoteHi: 'ज्ञान ही एकमात्र ऐसा धन है जिसे जितना अधिक बांटोगे, वह उतना ही ज्यादा बढ़ता है।',
    quoteEn: 'Knowledge is the only treasure that grows exponentially when shared.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-6',
    category: 'educational',
    quoteHi: 'किताबें और अच्छे विचार इंसान के सबसे सच्चे और निष्ठावान मार्गदर्शक होते हैं।',
    quoteEn: 'Books and noble thoughts are a person’s truest, most faithful mentors.',
    author: 'महात्मा गांधी',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-7',
    category: 'educational',
    quoteHi: 'शिक्षा का उद्देश्य केवल आजीविका कमाना नहीं, बल्कि चरित्र का निर्माण और स्वतंत्र चिंतन का विकास है।',
    quoteEn: 'The purpose of education is not merely a livelihood, but character building and free inquiry.',
    author: 'रवींद्रनाथ टैगोर',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-8',
    category: 'educational',
    quoteHi: 'जिसने कभी कोई गलती नहीं की, उसने कभी जीवन में कुछ नया सीखने का प्रयास ही नहीं किया।',
    quoteEn: 'Anyone who has never made a mistake has never tried anything new.',
    author: 'अल्बर्ट आइंस्टीन (Albert Einstein)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-9',
    category: 'educational',
    quoteHi: 'अज्ञानी होना उतनी शर्म की बात नहीं है, जितना कि नई विद्या सीखने के लिए तैयार न होना।',
    quoteEn: 'Being ignorant is not so much a shame, as being unwilling to learn.',
    author: 'बेंजामिन फ्रैंकलिन',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-10',
    category: 'educational',
    quoteHi: 'ज्ञान और अध्ययन में किया गया निवेश जीवन भर सबसे सर्वोत्तम और अविनाशी ब्याज देता है।',
    quoteEn: 'An investment in knowledge pays the best interest for a lifetime.',
    author: 'बेंजामिन फ्रैंकलिन',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-11',
    category: 'educational',
    quoteHi: 'शिक्षा जीवन की केवल तैयारी नहीं है; शिक्षा स्वयं जीवन जीने का सबसे जागरूक मार्ग है।',
    quoteEn: 'Education is not preparation for life; education is life itself.',
    author: 'जॉन डीवी (John Dewey)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-12',
    category: 'educational',
    quoteHi: 'यदि आप समाज को सुंदर विचारों वाला बनाना चाहते हैं, तो इसमें माता, पिता और शिक्षक की भूमिका सर्वोपरि है।',
    quoteEn: 'If a society is to be pure and beautiful, parents and teachers play the most decisive role.',
    author: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-13',
    category: 'educational',
    quoteHi: 'जिज्ञासा ही ज्ञान की जननी है। जो प्रश्न पूछता है वह आगे बढ़ता है, जो संकोच करता है वह पीछे रह जाता है।',
    quoteEn: 'Curiosity is the mother of wisdom. One who inquires flourishes; one who hesitates lingers.',
    author: 'प्राच्य सुभाषित',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-14',
    category: 'educational',
    quoteHi: 'सा विद्या या विमुक्तये — सच्ची विद्या वही है जो मनुष्य को अज्ञान, भय और संकीर्णता के बंधनों से मुक्त करे।',
    quoteEn: 'True education is that which liberates human spirit from ignorance and fear.',
    author: 'विष्णु पुराण',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-15',
    category: 'educational',
    quoteHi: 'ज्ञान उस दीपक के समान है, जो खुद प्रकाशवान होकर अनगिनत अन्य दीपकों को भी प्रज्वलित कर सकता है।',
    quoteEn: 'Wisdom is like a sacred lamp that lights countless torches without losing its own glow.',
    author: 'संत कबीर दास',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-16',
    category: 'educational',
    quoteHi: 'मनुष्य की बुद्धि पत्थर पर धार की तरह है, निरंतर स्वाध्याय और चिंतन से ही उसमें पैनापन आता है।',
    quoteEn: 'The mind is like a blade; continuous study and reflection keep it sharp.',
    author: 'सुकरात (Socrates)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-17',
    category: 'educational',
    quoteHi: 'शिक्षा ऐसी होनी चाहिए जो मनुष्य को आत्मनिर्भर बनाए और उसमें समाज के प्रति कर्तव्यबोध जगाए।',
    quoteEn: 'Education must empower individuals to be self-reliant and socially conscientious.',
    author: 'स्वामी दयानंद सरस्वती',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-18',
    category: 'educational',
    quoteHi: 'शिक्षा की जड़ें भले ही कड़वे परिश्रम से सींची जाती हों, लेकिन इसका फल सदैव अत्यंत मीठा होता है।',
    quoteEn: 'The roots of education are bitter, but the fruit is sweet and everlasting.',
    author: 'अरस्तू (Aristotle)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-19',
    category: 'educational',
    quoteHi: 'गुरु गोविंद दोऊ खड़े, काके लागूं पांय। बलिहारी गुरु आपने, गोविंद दियो बताय॥',
    quoteEn: 'Teacher and God stand before me; I bow first to the teacher who revealed God to me.',
    author: 'संत कबीर',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-20',
    category: 'educational',
    quoteHi: 'शिक्षित बनो, संगठित रहो और अपने आत्मसम्मान तथा समाज के उत्थान के लिए निरंतर संघर्ष करो।',
    quoteEn: 'Educate, Agitate, Organize — stand tall for self-respect and the upliftment of humanity.',
    author: 'डॉ. भीमराव अंबेडकर',
    suggestedThemeIndex: 0
  },

  // ==========================================================================
  // 2. CAREER & AMBITION (करियर एवं सफलता) - TOP 20 QUOTES
  // ==========================================================================
  {
    id: 'car-1',
    category: 'career',
    quoteHi: 'मेहनत इतनी खामोशी से करो कि तुम्हारी सफलता खुद ब खुद शोर मचा दे।',
    quoteEn: 'Work hard in silence, let your success be your noise.',
    author: 'अज्ञात (भारतीय नीति वचन)',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-2',
    category: 'career',
    quoteHi: 'मैदान में हारा हुआ इंसान फिर से जीत सकता है, लेकिन मन से हारा हुआ इंसान कभी नहीं जीत सकता।',
    quoteEn: 'One defeated on the field can rise again, but one defeated in mind never can.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-3',
    category: 'career',
    quoteHi: 'सफलता की कुंजी भाग्य के भरोसे बैठना नहीं, बल्कि निरंतर सही दिशा में कर्म करते रहना है।',
    quoteEn: 'The secret of success lies not in relying on luck, but in relentless right action.',
    author: 'आचार्य चाणक्य',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-4',
    category: 'career',
    quoteHi: 'यदि आप सूरज की तरह चमकना चाहते हैं, तो पहले सूरज की तरह जलना सीखिए।',
    quoteEn: 'If you want to shine like a sun, first burn like a sun.',
    author: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-5',
    category: 'career',
    quoteHi: 'हर छोटा बदलाव बड़ी सफलता की शुरुआत होता है। आज का एक सही कदम कल का भविष्य है।',
    quoteEn: 'Every small positive shift is the genesis of monumental triumph.',
    author: 'जीवन सूत्र',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-6',
    category: 'career',
    quoteHi: 'कठिन परिश्रम का कोई विकल्प नहीं होता, और लगन से किया गया प्रयास कभी व्यर्थ नहीं जाता।',
    quoteEn: 'There is no substitute for hard work; heartfelt dedication never goes in vain.',
    author: 'थॉमस अल्वा एडिसन',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-7',
    category: 'career',
    quoteHi: 'सफलता अंतिम नहीं है, असफलता घातक नहीं है: आगे बढ़ते रहने का अदम्य साहस ही सबसे ज्यादा मायने रखता है।',
    quoteEn: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'विंस्टन चर्चिल',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-8',
    category: 'career',
    quoteHi: 'रास्ते कभी खत्म नहीं होते, बस लोग हिम्मत हार जाते हैं। तैरना सीखना है तो पानी में उतरना ही होगा।',
    quoteEn: 'Paths never end; travelers only lose nerve. To learn swimming, you must dive in.',
    author: 'प्रेरणा सूत्र',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-9',
    category: 'career',
    quoteHi: 'जो अपने कदमों की काबिलियत पर विश्वास रखते हैं, वही अक्सर अपनी मंजिल तक पहुंचते हैं।',
    quoteEn: 'Those who believe in the strength of their own strides invariably reach their destiny.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-10',
    category: 'career',
    quoteHi: 'अवसर की प्रतीक्षा मत कीजिए, आज का दिन और वर्तमान का क्षण ही आपका सबसे बड़ा अवसर है।',
    quoteEn: 'Do not wait for extraordinary opportunity; seize common occasions and make them great.',
    author: 'जॉर्ज बर्नार्ड शॉ',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-11',
    category: 'career',
    quoteHi: 'सफलता पाने के लिए हमें पहले अपने भीतर यह अटूट विश्वास जगाना होगा कि हम इसे पा सकते हैं।',
    quoteEn: 'In order to succeed, we must first believe that we can.',
    author: 'निकोस कज़ांतज़ाकिस',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-12',
    category: 'career',
    quoteHi: 'बड़ा सोचो, जल्दी सोचो, आगे सोचो। विचारों पर किसी एक इंसान का एकाधिकार नहीं होता।',
    quoteEn: 'Think big, think fast, think ahead. Ideas are no one’s monopoly.',
    author: 'धीरूभाई अंबानी',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-13',
    category: 'career',
    quoteHi: 'हार तब नहीं होती जब आप गिर जाते हैं, हार तब होती है जब आप दोबारा उठकर लड़ने से इनकार कर देते हैं।',
    quoteEn: 'It is not whether you get knocked down; it is whether you get back up.',
    author: 'विंस लोम्बार्डी',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-14',
    category: 'career',
    quoteHi: 'अनुशासन ही वह मजबूत पुल है जो आपके सपनों को वास्तविक उपलब्धियों में बदलता है।',
    quoteEn: 'Discipline is the bridge between goals and accomplishment.',
    author: 'जिम रोन (Jim Rohn)',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-15',
    category: 'career',
    quoteHi: 'मुश्किल और पथरीली राहें ही अक्सर सबसे खूबसूरत और गौरवशाली मंजिलों तक ले जाती हैं।',
    quoteEn: 'Difficult roads often lead to the most beautiful destinations.',
    author: 'सफलता नीति',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-16',
    category: 'career',
    quoteHi: 'कामयाब लोग अपने फैसलों से दुनिया बदल देते हैं, जबकि नाकाम लोग दुनिया के डर से फैसले बदलते हैं।',
    quoteEn: 'Successful people change the world with decisions; the fearful change decisions for the world.',
    author: 'प्रेरणा अमृत',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-17',
    category: 'career',
    quoteHi: 'यदि आपके पास समय का अनुशासन और स्पष्ट लक्ष्य है, तो कोई भी रुकावट आपको रोक नहीं सकती।',
    quoteEn: 'With clear goals and disciplined execution, no obstacle can ever halt you.',
    author: 'ब्रायन ट्रेसी (Brian Tracy)',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-18',
    category: 'career',
    quoteHi: 'जितना कठिन और लंबा संघर्ष होगा, आपकी विजय उतनी ही ज्यादा गौरवशाली और अमर होगी।',
    quoteEn: 'The harder the conflict, the more glorious the triumph.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-19',
    category: 'career',
    quoteHi: 'सिर्फ किनारे खड़े होकर पानी को निहारने से आप कभी विशाल समंदर पार नहीं कर सकते।',
    quoteEn: 'You cannot cross the sea merely by standing and staring at the water.',
    author: 'रवींद्रनाथ टैगोर',
    suggestedThemeIndex: 1
  },
  {
    id: 'car-20',
    category: 'career',
    quoteHi: 'महान कार्य करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे सच्चा प्रेम करें।',
    quoteEn: 'The only way to do great work is to love what you do.',
    author: 'स्टीव जॉब्स (Steve Jobs)',
    suggestedThemeIndex: 1
  },

  // ==========================================================================
  // 3. DEVOTIONAL & SPIRITUAL (भक्ति एवं आध्यात्म) - TOP 20 QUOTES
  // ==========================================================================
  {
    id: 'dev-1',
    category: 'devotional',
    quoteHi: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। अपना कर्तव्य पूरी निष्ठा से करो, फल की चिंता परमात्मा पर छोड़ दो।',
    quoteEn: 'You have a right to perform your prescribed duties, but not to the fruits thereof.',
    author: 'श्रीमद्भगवद्गीता (अध्याय 2, श्लोक 47)',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-2',
    category: 'devotional',
    quoteHi: 'जिसके हृदय में प्रभु का वास और सत्य की ज्योति है, उसे किसी भी संकट में भयभीत होने की आवश्यकता नहीं।',
    quoteEn: 'Whoever bears divine presence and truth within needs fear no storm.',
    author: 'संत कबीर दास',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-3',
    category: 'devotional',
    quoteHi: 'ईश्वर न तो मूर्तियों में सीमित हैं और न केवल तीर्थों में, वे प्रत्येक प्राणी की सेवा और प्रेम में विराजमान हैं।',
    quoteEn: 'God resides not merely in stones, but in compassionate service to every soul.',
    author: 'रामकृष्ण परमहंस',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-4',
    category: 'devotional',
    quoteHi: 'परहित सरिस धरम नहिं भाई, परपीड़ा सम नहिं अधमाई। सेवा ही सबसे बड़ी भक्ति और पूजा है।',
    quoteEn: 'There is no higher dharma than helping others; no greater sin than harming another.',
    author: 'गोस्वामी तुलसीदास (रामचरितमानस)',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-5',
    category: 'devotional',
    quoteHi: 'मन को शांत करो, ईश्वर पर विश्वास रखो। समय आने पर हर अंधेरी रात सुनहरी सुबह में बदल जाती है।',
    quoteEn: 'Quiet your mind, keep steadfast faith; in due time, every dark night turns to dawn.',
    author: 'आध्यात्मिक अमृतवाणी',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-6',
    category: 'devotional',
    quoteHi: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। धर्म और सत्य के पक्ष में खड़े रहने वाले का ईश्वर सदैव साथ देता है।',
    quoteEn: 'Whenever righteousness wanes, the divine manifests to protect goodness and truth.',
    author: 'श्रीमद्भगवद्गीता (अध्याय 4, श्लोक 7)',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-7',
    category: 'devotional',
    quoteHi: 'चिंता मत करो, प्रभु पर विश्वास रखो; जिस परमात्मा ने जीवन दिया है, वह संभालना भी जानता है।',
    quoteEn: 'Cast away anxiety and surrender in faith; the Divine who grants life sustains it with grace.',
    author: 'संत तुकाराम महाराज',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-8',
    category: 'devotional',
    quoteHi: 'मन ही मनुष्य के बंधन और मोक्ष का मूल कारण है। शुद्ध और शांत मन ही परम शांति का द्वार है।',
    quoteEn: 'The mind alone is the cause of bondage and liberation. A serene mind opens divine joy.',
    author: 'अमृतबिंदु उपनिषद',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-9',
    category: 'devotional',
    quoteHi: 'माला फेरत जुग भया, फिरा न मन का फेर। कर का मनका डारि दे, मन का मनका फेर॥',
    quoteEn: 'Ages passed turning rosary beads without inner change; cast worldly beads and purify the heart.',
    author: 'संत कबीर',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-10',
    category: 'devotional',
    quoteHi: 'सत्य ही ईश्वर है और ईश्वर ही परम सत्य है। सत्य के पावन मार्ग पर चलने वाला कभी नहीं भटकता।',
    quoteEn: 'Truth is God and God is Truth; one who treads the path of truth never loses the way.',
    author: 'महात्मा गांधी',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-11',
    category: 'devotional',
    quoteHi: 'प्रभु का सुमिरन सांसों की माला से करो, जहां अहंकार मिटता है वहीं परमात्मा का साक्षात अवतरण होता है।',
    quoteEn: 'Remember the Lord with every breath; where ego dissolves, the Divine awakens.',
    author: 'गुरु नानक देव जी',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-12',
    category: 'devotional',
    quoteHi: 'जाकी रही भावना जैसी, प्रभु मूरति तिन देखी तैसी। अंतःकरण की शुद्धता ही प्रभु मिलन का वास्तविक मार्ग है।',
    quoteEn: 'As is a devotee’s inner disposition, so the Divine reveals Himself to them.',
    author: 'गोस्वामी तुलसीदास',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-13',
    category: 'devotional',
    quoteHi: 'शांति बाहर खोजने से नहीं मिलती, यह तो अंतरात्मा की पवित्रता, करुणा और संतोष में उपजती है।',
    quoteEn: 'Peace comes from within; do not seek it outside in transient treasures.',
    author: 'भगवान बुद्ध',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-14',
    category: 'devotional',
    quoteHi: 'भक्ति का अर्थ पलायन नहीं, बल्कि ईश्वर को साक्षी मानकर अपने सांसारिक कर्तव्यों को निष्ठा से निभाना है।',
    quoteEn: 'Devotion is not escapism, but fulfilling worldly responsibilities with divine presence.',
    author: 'स्वामी चिन्मयानंद',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-15',
    category: 'devotional',
    quoteHi: 'ईश्वर जो भी करता है, वह मनुष्य के कल्याण के लिए ही करता है—बस धैर्य और अटूट श्रद्धा बनाए रखिए।',
    quoteEn: 'Whatever the Lord orchestrates serves your ultimate good; hold steadfast in faith.',
    author: 'संत ज्ञानेश्वर महाराज',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-16',
    category: 'devotional',
    quoteHi: 'अहिंसा परमो धर्मः, दया ही धर्म का मूल है। जीव मात्र पर करुणा ही ईश्वर की सबसे सच्ची आराधना है।',
    quoteEn: 'Non-violence is the supreme virtue; compassion towards all living beings is true worship.',
    author: 'भगवान महावीर',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-17',
    category: 'devotional',
    quoteHi: 'सब अंधकार मिट जाता है जब अंतःकरण में ज्ञान और भक्ति का पावन दीपक प्रज्वलित होता है।',
    quoteEn: 'All darkness dissolves once the holy lamp of wisdom and devotion is ignited inside.',
    author: 'आदि शंकराचार्य',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-18',
    category: 'devotional',
    quoteHi: 'प्रार्थना केवल मांगने का नाम नहीं, बल्कि अपने जीवन और कर्मों को परमात्मा के चरणों में समर्पित करने का भाव है।',
    quoteEn: 'Prayer is not begging, but offering one’s entire life and actions at the feet of the Divine.',
    author: 'स्वामी शिवानंद',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-19',
    category: 'devotional',
    quoteHi: 'तू दयालु दीन हौं, तू दानि हौं भिखारी। ईश्वर के चरणों में निश्छल समर्पण ही जीवन का पूर्ण आनंद है।',
    quoteEn: 'You are merciful and I am humble; pure devotion and surrender bring complete fulfillment.',
    author: 'भक्त सूरदास जी',
    suggestedThemeIndex: 2
  },
  {
    id: 'dev-20',
    category: 'devotional',
    quoteHi: 'आत्मदीपो भव — अपने भीतर की दिव्य ज्योति को पहचानो और स्वयं अपना प्रकाश बनो।',
    quoteEn: 'Be a light unto yourself; discover the eternal divine flame shining within.',
    author: 'तथागत बुद्ध',
    suggestedThemeIndex: 2
  },

  // ==========================================================================
  // 4. HUMANITY & SERVICE (मानवता एवं परोपकार) - TOP 20 QUOTES
  // ==========================================================================
  {
    id: 'hum-1',
    category: 'humanity',
    quoteHi: 'अकेले हम बहुत कम कर सकते हैं; साथ मिलकर हम अकल्पनीय बदलाव ला सकते हैं।',
    quoteEn: 'Alone we can do so little; together we can do so much.',
    author: 'हेलेन केलर (Helen Keller)',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-2',
    category: 'humanity',
    quoteHi: 'किसी भूखे को भोजन कराना और किसी बेसहारा को सहारा देना, ईश्वर की सबसे सच्ची इबादत है।',
    quoteEn: 'Feeding the hungry and embracing the shelterless is the purest worship of God.',
    author: 'मदर टेरेसा (Mother Teresa)',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-3',
    category: 'humanity',
    quoteHi: 'परोपकाराय सतां विभूतयः। सज्जनों का जीवन और सामर्थ्य केवल दूसरों के कल्याण के लिए होता है।',
    quoteEn: 'The wealth and strength of the righteous is meant exclusively for the welfare of others.',
    author: 'संस्कृत सुभाषित',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-4',
    category: 'humanity',
    quoteHi: 'दीपक की तरह जलो, जो खुद जलकर दूसरों की राह में प्रकाश फैलाता है। यही जीवन की सार्थकता है।',
    quoteEn: 'Shine like a lamp that burns gently to illuminate the path for others.',
    author: 'जीवन ज्योति प्रेरणा',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-5',
    category: 'humanity',
    quoteHi: 'दान केवल धन का नहीं होता; समय, मुस्कान, प्रेम और सहानुभूति का दान सबसे महान दान है।',
    quoteEn: 'Charity is not merely coins; sharing time, kindness, and solace is the supreme donation.',
    author: 'महात्मा बुद्ध',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-6',
    category: 'humanity',
    quoteHi: 'यदि आप एक साथ सौ लोगों की मदद नहीं कर सकते, तो बस किसी एक की मदद से शुरुआत कीजिए।',
    quoteEn: 'If you cannot feed a hundred people, then feed just one.',
    author: 'मदर टेरेसा',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-7',
    category: 'humanity',
    quoteHi: 'मानवता ही सबसे बड़ा धर्म है, और करुणा से बढ़कर संसार में कोई दूसरा सुंदर आभूषण नहीं है।',
    quoteEn: 'Humanity is our true religion, and compassion is its most radiant ornament.',
    author: 'दलाई लामा (Dalai Lama)',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-8',
    category: 'humanity',
    quoteHi: 'रक्तदान महादान और जीवनदान है—आपके द्वारा दिया गया रक्त किसी परिवार के चिराग को बुझने से बचाता है।',
    quoteEn: 'Blood donation is life donation—your noble gift rekindles life in a struggling family.',
    author: 'जीवन ज्योति सेवा संकल्प',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-9',
    category: 'humanity',
    quoteHi: 'दूसरों की मदद करने के लिए आपके पास बहुत धन होना जरूरी नहीं, बस एक संवेदनशील हृदय चाहिए।',
    quoteEn: 'To serve others, you need no boundless fortune; only a deeply compassionate heart.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-10',
    category: 'humanity',
    quoteHi: 'संसार में वही जीवन धन्य है जो औरों के आंसू पोंछने और उनके चेहरे पर मुस्कान लाने के काम आए।',
    quoteEn: 'Blessed is the life dedicated to wiping away tears and igniting smiles on weary faces.',
    author: 'महात्मा गांधी',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-11',
    category: 'humanity',
    quoteHi: 'तरुवर फल नहिं खात है, सरवर पियहिं न पान। कहि रहीम पर काज हित, संपति सचहिं सुजान॥',
    quoteEn: 'Trees do not eat their own fruits, lakes do not drink their own water; noble souls live for others.',
    author: 'कवि रहीम दास',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-12',
    category: 'humanity',
    quoteHi: 'जब तक समाज के अंतिम व्यक्ति के जीवन में खुशहाली और सम्मान न आए, तब तक हमारा कर्तव्य अधूरा है।',
    quoteEn: 'Until the last person in our community feels dignity and happiness, our duty remains unfinished.',
    author: 'पंडित दीनदयाल उपाध्याय (अंत्योदय)',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-13',
    category: 'humanity',
    quoteHi: 'सेवा वही सार्थक है जो निस्वार्थ भाव से की जाए, जिसमें नाम, प्रशंसा या पुरस्कार की कोई चाह न हो।',
    quoteEn: 'True service is selfless action performed without craving praise, prestige, or reward.',
    author: 'संत एकनाथ',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-14',
    category: 'humanity',
    quoteHi: 'इंसानियत का तकाजा है कि हम गिरने वाले का हाथ थामें, उसे गिराने वाले पत्थर कभी न बनें।',
    quoteEn: 'True humanity calls upon us to uplift those who stumble, never to become a stumbling block.',
    author: 'मानवता संदेश',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-15',
    category: 'humanity',
    quoteHi: 'एक जरूरतमंद और निर्धन बच्चे की शिक्षा का प्रबंध करना, सहस्रों तीर्थ यात्राओं से भी अधिक पुण्यकारी है।',
    quoteEn: 'Sponsoring a child’s education is far nobler and sacred than thousands of pilgrimages.',
    author: 'डॉ. सर्वपल्ली राधाकृष्णन',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-16',
    category: 'humanity',
    quoteHi: 'जो हाथ सेवा के लिए उठते हैं, वे उन होठों से कहीं अधिक पावन हैं जो केवल प्रार्थना करते हैं।',
    quoteEn: 'Hands that help are far holier than lips that only pray.',
    author: 'सत्य साईं बाबा',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-17',
    category: 'humanity',
    quoteHi: 'दयालुता वह सार्वभौमिक भाषा है जिसे बहरे सुन सकते हैं और दृष्टिहीन भी आसानी से महसूस कर सकते हैं।',
    quoteEn: 'Kindness is the language which the deaf can hear and the blind can see.',
    author: 'मार्क ट्वेन (Mark Twain)',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-18',
    category: 'humanity',
    quoteHi: 'समाज और प्रकृति से हमने बहुत कुछ पाया है, अब हमारा धर्म है कि हम सेवा भाव से समाज को कुछ लौटाएं।',
    quoteEn: 'Society has given us abundance; it is our sacred responsibility to return it in service.',
    author: 'जीवन ज्योति संकल्प',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-19',
    category: 'humanity',
    quoteHi: 'किसी रोते हुए को हंसा देना और किसी भटकते हुए को सही राह दिखा देना ही दुनिया की सबसे बड़ी पूजा है।',
    quoteEn: 'Bringing laughter to the weeping and guiding the lost is the highest worship on Earth.',
    author: 'कबीर वाणी',
    suggestedThemeIndex: 3
  },
  {
    id: 'hum-20',
    category: 'humanity',
    quoteHi: 'अयं निजः परो वेति गणना लघुचेतसाम्। उदारचरितानां तु वसुधैव कुटुम्बकम्॥ पूरी वसुधा ही हमारा परिवार है।',
    quoteEn: 'Narrow minds divide by "mine" and "theirs"; to the noble-hearted, the entire earth is family.',
    author: 'महा उपनिषद',
    suggestedThemeIndex: 3
  },

  // ==========================================================================
  // 5. FAMILY & VALUES (परिवार एवं संस्कार) - TOP 20 QUOTES
  // ==========================================================================
  {
    id: 'fam-1',
    category: 'family',
    quoteHi: 'माता-पिता का साया सिर पर होना, दुनिया के सबसे बड़े सुरक्षा कवच और ईश्वरीय वरदान के समान है।',
    quoteEn: 'Having the blessing of parents is the greatest shield and divine gift in this world.',
    author: 'पारिवारिक संस्कार वचन',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-2',
    category: 'family',
    quoteHi: 'परिवार वो पवित्र बगिया है जहां प्यार कभी कम नहीं होता और खुशियां बांटने से दोगुनी हो जाती हैं।',
    quoteEn: 'Family is the sanctuary where love never diminishes and joys multiply when shared.',
    author: 'जीवन ज्योति संस्कार',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-3',
    category: 'family',
    quoteHi: 'संस्कारों से ही परिवार बनता है और पारिवारिक एकता से ही एक सशक्त समाज और राष्ट्र का निर्माण होता है।',
    quoteEn: 'Values form a home, and unified families build a formidable society and nation.',
    author: 'भारतीय संस्कृति चिंतन',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-4',
    category: 'family',
    quoteHi: 'जब पूरा संसार आपका साथ छोड़ दे, तब भी परिवार बिना किसी शर्त के आपकी ढाल बनकर खड़ा रहता है।',
    quoteEn: 'When the world turns its back, family stands unconditionally as your fortress.',
    author: 'अनुभव वाणी',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-5',
    category: 'family',
    quoteHi: 'मातृ देवो भव, पितृ देवो भव। माता-पिता की निस्वार्थ सेवा ही संसार का सबसे बड़ा और पावन तीर्थ है।',
    quoteEn: 'Honor mother and father as divine; serving them is the holiest pilgrimage of human life.',
    author: 'तैत्तिरीय उपनिषद',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-6',
    category: 'family',
    quoteHi: 'घर ईंट और पत्थरों की दीवारों से नहीं, बल्कि सदस्यों के आपसी प्रेम, सम्मान और विश्वास से बनता है।',
    quoteEn: 'A house is built with bricks and stones, but a home is created with love and trust.',
    author: 'संस्कार सूत्र',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-7',
    category: 'family',
    quoteHi: 'पिता वह वटवृक्ष है जो स्वयं धूप और आंधी सहकर पूरे परिवार को शीतल छांव और सुरक्षा प्रदान करता है।',
    quoteEn: 'A father is like a banyan tree who braves the scorching heat to shelter the entire household.',
    author: 'पितृ वंदना',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-8',
    category: 'family',
    quoteHi: 'मां वह अनुपम देवी है जिसके आंचल की छांव में दुनिया के सारे दुख, चिंताएं और भय मिट जाते हैं।',
    quoteEn: 'A mother is that divine angel in whose embrace all worldly sorrows and anxieties dissolve.',
    author: 'मातृ महिमा',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-9',
    category: 'family',
    quoteHi: 'जिस घर में बुजुर्गों का यथोचित सम्मान और बच्चों को उत्तम संस्कार मिलते हैं, वहां साक्षात ईश्वर बसते हैं।',
    quoteEn: 'Where elders are cherished and children are nurtured with values, God Himself resides.',
    author: 'चाणक्य नीति',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-10',
    category: 'family',
    quoteHi: 'दौलत तो कोई भी कमा सकता है, लेकिन एक सुखी, संतुष्ट और संस्कारवान परिवार कमाना सबसे बड़ी उपलब्धि है।',
    quoteEn: 'Anyone can amass material riches; earning a harmonious and virtuous family is true wealth.',
    author: 'जीवन दर्शन',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-11',
    category: 'family',
    quoteHi: 'परिवार की एकता ही वह शक्ति है जो बड़े से बड़े आर्थिक व मानसिक संकट को भी तिनके की तरह उड़ा देती है।',
    quoteEn: 'Family cohesion is a fortress that weathers any financial or emotional tempest with grace.',
    author: 'पारिवारिक नीति',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-12',
    category: 'family',
    quoteHi: 'बच्चों को केवल धन-संपत्ति देने से बेहतर है कि उन्हें अच्छे संस्कार दें; संस्कार ही उनकी असली विरासत हैं।',
    quoteEn: 'Instead of leaving vast inheritance, give children deep values and virtues; that is eternal wealth.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-13',
    category: 'family',
    quoteHi: 'सच्चा परिवार वही है जहां गलतियों पर ताने नहीं, बल्कि एक-दूसरे को समझने और संवारने का अवसर मिले।',
    quoteEn: 'A loving family does not reproach flaws, but offers warmth, forgiveness, and guidance.',
    author: 'परिवार वाणी',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-14',
    category: 'family',
    quoteHi: 'घर की दहलीज लांघते समय जब माता-पिता की दुआएं साथ होती हैं, तो रास्ते की कोई रुकावट रोक नहीं सकती।',
    quoteEn: 'With parental blessings resting upon your forehead, no hindrance in the world can obstruct you.',
    author: 'लोक विचार',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-15',
    category: 'family',
    quoteHi: 'भाई-बहन का रिश्ता बचपन की मीठी यादों और जीवन भर के अटूट विश्वास तथा स्नेह की डोर से बंधा होता है।',
    quoteEn: 'The sibling bond is woven with cherished childhood laughter and lifelong unconditional faith.',
    author: 'संस्कार विचार',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-16',
    category: 'family',
    quoteHi: 'परिवार के साथ बिताया गया हर एक पल जीवन की सबसे अनमोल पूंजी है, इसे काम की भागदौड़ में न खोएं।',
    quoteEn: 'Every shared moment with family is irreplaceable; never trade it away in life’s busy bustle.',
    author: 'पारिवारिक सूत्र',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-17',
    category: 'family',
    quoteHi: 'जिस वृक्ष की जड़ें गहरी होती हैं वह कभी आंधी में नहीं उखड़ता, वैसे ही संस्कारों से जुड़ा परिवार कभी बिखरता नहीं।',
    quoteEn: 'Deep-rooted trees survive the fiercest gale; virtue-anchored families never crumble.',
    author: 'नीति वचन',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-18',
    category: 'family',
    quoteHi: 'परिवार में विनम्रता और क्षमा वह अमृत हैं जो हर रिश्ते को हर मौसम में सदैव हरा-भरा बनाए रखते हैं।',
    quoteEn: 'Humility and forgiveness are elixirs that keep bonds thriving across every season of life.',
    author: 'जीवन सीख',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-19',
    category: 'family',
    quoteHi: 'माता-पिता के चेहरे पर संतोष और गर्व की मुस्कान देखना ही किसी संतान के जीवन की सबसे बड़ी सफलता है।',
    quoteEn: 'Seeing a proud, peaceful smile on parents’ faces is the ultimate pinnacle of personal success.',
    author: 'प्रेरणा वचन',
    suggestedThemeIndex: 4
  },
  {
    id: 'fam-20',
    category: 'family',
    quoteHi: 'एकता में ही परिवार का बल है; साथ बैठकर भोजन करना और सुख-दुःख बांटना ही घर को स्वर्ग बनाता है।',
    quoteEn: 'Unity is the heartbeat of a family; dining together and sharing tears or joys turns a home into heaven.',
    author: 'गृहस्थ सूत्र',
    suggestedThemeIndex: 4
  },

  // ==========================================================================
  // 6. FRIENDS & BROTHERHOOD (मित्रता एवं भाईचारा) - TOP 20 QUOTES
  // ==========================================================================
  {
    id: 'fri-1',
    category: 'friends',
    quoteHi: 'सच्चा मित्र वही है जो तब भी आपका हाथ थामे रहता है, जब पूरी दुनिया आपका हाथ छोड़ चुकी हो।',
    quoteEn: 'A true friend is one who walks in when the rest of the world walks out.',
    author: 'वाल्टर विंचेल (Walter Winchell)',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-2',
    category: 'friends',
    quoteHi: 'दोस्ती चेहरे की चमक या अमीरी देखकर नहीं, दिल की सच्चाई और संकट में साथ निभाने से पहचानी जाती है।',
    quoteEn: 'Friendship is measured not by pleasant days, but by steadfast loyalty through storms.',
    author: 'चाणक्य नीति',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-3',
    category: 'friends',
    quoteHi: 'मित्रता एक ऐसी मधुर छांव है जो जीवन के कठिन से कठिन धूप वाले सफर को भी आसान और सुखद बना देती है।',
    quoteEn: 'Friendship is a soothing shade that makes life’s harshest journey sweet and easy.',
    author: 'कवि रसखान प्रेरणा',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-4',
    category: 'friends',
    quoteHi: 'एक अच्छी किताब सौ दोस्तों के बराबर हो सकती है, लेकिन एक सच्चा दोस्त पूरी लाइब्रेरी के समान होता है।',
    quoteEn: 'One good book equals a hundred good friends, but one good friend equals a library.',
    author: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-5',
    category: 'friends',
    quoteHi: 'कृष्ण और सुदामा जैसी मित्रता ही आदर्श है, जहां न धन की कोई दीवार हो और न ही पद का कोई अभिमान।',
    quoteEn: 'The friendship of Krishna and Sudama is timeless—free from disparities of status or wealth.',
    author: 'श्रीमद्भागवत कथा',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-6',
    category: 'friends',
    quoteHi: 'सच्चा मित्र आपकी गलतियों पर आपको अकेले में समझाता है और भरी महफिल में आपका मान-सम्मान बढ़ाता है।',
    quoteEn: 'A genuine friend counsels you privately in your faults and champions your honor in public.',
    author: 'हितोपदेश',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-7',
    category: 'friends',
    quoteHi: 'मित्रता कोई नफे-नुकसान का सौदा नहीं, यह तो दो आत्मीय हृदयों के बीच का एक पवित्र और निश्छल संगम है।',
    quoteEn: 'Friendship is no transaction of profit and loss; it is a sacred meeting of two pure hearts.',
    author: 'मुंशी प्रेमचंद',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-8',
    category: 'friends',
    quoteHi: 'सच्चे दोस्तों की संगत इत्र की उस दुकान जैसी है, जहां कुछ न भी खरीदें तो भी सुगंध मुफ्त मिल जाती है।',
    quoteEn: 'Good companionship is like a perfume shop; even without buying, you walk away fragrant.',
    author: 'प्रेरक सुभाषित',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-9',
    category: 'friends',
    quoteHi: 'दोस्ती में कोई औपचारिकता नहीं होती; बस एक-दूसरे की खुशी में खिलखिलाना और गम में साथ देना ही काफी है।',
    quoteEn: 'Friendship needs no formalities; rejoicing in each other’s joys and sharing sorrows is everything.',
    author: 'मित्रता सूत्र',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-10',
    category: 'friends',
    quoteHi: 'सच्चा दोस्त वही है जो आपकी खामोशी और अनकहे दर्द को भी उतनी ही गहराई से समझ ले जितना आपके शब्दों को।',
    quoteEn: 'A true friend hears the silent ache in your quiet soul as clearly as spoken words.',
    author: 'अमृत वचन',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-11',
    category: 'friends',
    quoteHi: 'जीवन की राह में कांटे चाहे जितने हों, अगर सच्चा और विश्वासपात्र दोस्त साथ हो तो हर सफर आसान हो जाता है।',
    quoteEn: 'No matter how thorny the trail, a loyal friend makes every stride effortless and cheerful.',
    author: 'जीवन दर्शन',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-12',
    category: 'friends',
    quoteHi: 'मित्र वह निर्मल दर्पण है जो आपके दोषों को छिपाता नहीं, और आपकी अच्छाइयों को कभी घटाता नहीं।',
    quoteEn: 'A true friend is a pristine mirror that neither conceals your faults nor diminishes your virtues.',
    author: 'कबीर अमृतवाणी',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-13',
    category: 'friends',
    quoteHi: 'वक्त और परिस्थितियां बदलती रहती हैं, लेकिन जो कभी नहीं बदलता वह है सच्चे दोस्त का निष्कपट प्रेम।',
    quoteEn: 'Circumstances fluctuate with time, but a sincere friend’s warmth remains constant as the northern star.',
    author: 'अनुभव सूत्र',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-14',
    category: 'friends',
    quoteHi: 'दोस्ती उम्र, जाति या हैसियत की मोहताज नहीं होती; यह तो केवल दिलों की आत्मीयता से महकती है।',
    quoteEn: 'Friendship transcends age, creed, and status; it blossoms purely through soul kinship.',
    author: 'मित्रता संदेश',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-15',
    category: 'friends',
    quoteHi: 'एक सच्चा दोस्त परमात्मा का वह वरदान है जो हमारी खुशियों का पहरेदार और दुखों का साथी बनकर रहता है।',
    quoteEn: 'A faithful friend is a divine blessing, standing guard over our peace and sharing all sorrows.',
    author: 'राल्फ वाल्डो एमर्सन',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-16',
    category: 'friends',
    quoteHi: 'मुसीबत के समय जो हाथ बिना मांगे सहारा देने आगे आ जाए, वही इंसान आपके जीवन का सबसे अनमोल दोस्त है।',
    quoteEn: 'The hand that extends support without being asked in adversity is your greatest companion.',
    author: 'आचार्य चाणक्य',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-17',
    category: 'friends',
    quoteHi: 'दोस्ती का रिश्ता इसलिए सबसे खास है क्योंकि बाकी रिश्ते जन्म से मिलते हैं, पर दोस्त हम खुद चुनते हैं।',
    quoteEn: 'Friendship is sacred because while other relations come by birth, friends are chosen by our heart.',
    author: 'प्रेरणा विचार',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-18',
    category: 'friends',
    quoteHi: 'मित्र की उन्नति पर कभी ईर्ष्या न करें, बल्कि उसकी कामयाबी को अपनी जीत मानकर उल्लास के साथ मनाएं।',
    quoteEn: 'Never envy a friend’s elevation; celebrate their triumph as if it were your very own victory.',
    author: 'सुभाषित वचन',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-19',
    category: 'friends',
    quoteHi: 'दोस्त वो नहीं जो सिर्फ रोशनी की महफिलों में साथ हों, दोस्त वो है जो घनघोर अंधेरों में भी दीया बनकर साथ चले।',
    quoteEn: 'A true friend is not one who feasts in bright pavilions, but walks as a torch through darkest nights.',
    author: 'सूफी सूत्र',
    suggestedThemeIndex: 5
  },
  {
    id: 'fri-20',
    category: 'friends',
    quoteHi: 'सच्ची मित्रता जीवन की सबसे गुणकारी औषधि है, जो हर तनाव, थकान और निराशा को क्षण भर में दूर कर देती है।',
    quoteEn: 'True friendship is life’s most healing medicine, dispersing anxiety and despair in an instant.',
    author: 'अरस्तू (Aristotle)',
    suggestedThemeIndex: 5
  },

  // ==========================================================================
  // 7. LIFE & PHILOSOPHY (जीवन दर्शन एवं प्रेरणा) - TOP 20 QUOTES
  // ==========================================================================
  {
    id: 'lif-1',
    category: 'life',
    quoteHi: 'जीवन कठिन परिस्थितियों से नहीं, बल्कि उन परिस्थितियों के प्रति आपके दृष्टिकोण से निर्धारित होता है।',
    quoteEn: 'Life is 10% what happens to you and 90% how you react to it.',
    author: 'चार्ल्स आर. स्विंडॉल',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-2',
    category: 'life',
    quoteHi: 'कल को बदला नहीं जा सकता, लेकिन आज का सही फैसला आपके आने वाले कल को सुनहरा बना सकता है।',
    quoteEn: 'Yesterday cannot be rewritten, but today’s wise resolve creates tomorrow’s victory.',
    author: 'जीवन दर्शन सूत्र',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-3',
    category: 'life',
    quoteHi: 'धैर्य और आत्मविश्वास वो दो पंख हैं जिनकी बदौलत इंसान किसी भी भयंकर तूफ़ान को पार कर सकता है।',
    quoteEn: 'Patience and self-belief are wings that carry the human spirit across any tempest.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-4',
    category: 'life',
    quoteHi: 'समय सबसे बड़ा शिक्षक है; यह बिना किसी शब्द के हर मनुष्य को सच्चाई और यथार्थ का पाठ पढ़ा देता है।',
    quoteEn: 'Time is the greatest maestro; without words, it reveals every profound truth.',
    author: 'संत कबीर दास',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-5',
    category: 'life',
    quoteHi: 'मुस्कुराइए, क्योंकि आपकी एक छोटी सी मुस्कान किसी उदास इंसान के मन में आशा की नई किरण जगा सकती है।',
    quoteEn: 'Smile, for your gentle smile can rekindle hope in a weary heart.',
    author: 'सकारात्मक जीवन सूत्र',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-6',
    category: 'life',
    quoteHi: 'जीवन में गिरने से मत डरिए; गिरना तो उस पेड़ के सूखे पत्ते जैसा है जो नई हरी कोपलों का मार्ग बनाता है।',
    quoteEn: 'Fear not stumbling; falling is like an autumn leaf making room for fresh spring blossoms.',
    author: 'जीवन ज्योति प्रेरणा',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-7',
    category: 'life',
    quoteHi: 'शांति का कोई बाहर रास्ता नहीं है; अपने भीतर शांत और संतुलित रहना ही स्वयं सबसे श्रेष्ठ मार्ग है।',
    quoteEn: 'There is no way to peace; peace is the way.',
    author: 'महात्मा गांधी',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-8',
    category: 'life',
    quoteHi: 'जो बीत गया उस पर पछतावा मत करो, जो पास है उसका सम्मान करो और जो आने वाला है उसका स्वागत करो।',
    quoteEn: 'Regret not the past, honor the present, and welcome the unfolding future with open arms.',
    author: 'ओशो (Osho)',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-9',
    category: 'life',
    quoteHi: 'जिंदगी छोटी नहीं होती, दरअसल हम ही इसे सजगता और कृतज्ञता के साथ जीना बहुत देर से शुरू करते हैं।',
    quoteEn: 'Life is not brief; we merely delay living it with mindfulness and gratitude.',
    author: 'मुंशी प्रेमचंद',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-10',
    category: 'life',
    quoteHi: 'पूरी दुनिया को जीतने से पहले स्वयं के चंचल मन पर विजय प्राप्त करना सबसे बड़ी और सच्ची विजय है।',
    quoteEn: 'Conquering oneself is a far greater victory than conquering thousands in battle.',
    author: 'भगवान बुद्ध',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-11',
    category: 'life',
    quoteHi: 'यदि आपके मन में कृतज्ञता और संतोष का भाव है, तो आपके पास जो भी है वह आनंद के लिए पर्याप्त है।',
    quoteEn: 'He is a wise man who does not grieve for things which he has not, but rejoices for those he has.',
    author: 'एपिक्टेटस (Epictetus)',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-12',
    category: 'life',
    quoteHi: 'हवाओं के रुख से नाव का रास्ता तय नहीं होता, पतवार थामने वाले नाविक के अदम्य हौसले से मंजिल मिलती है।',
    quoteEn: 'Winds do not dictate the voyage; the courage of the helmsman charts the destination.',
    author: 'प्रेरक जीवन विचार',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-13',
    category: 'life',
    quoteHi: 'क्रोध में लिया गया निर्णय और अभिमान में कही गई बात जीवन भर पश्चाताप का कारण बनती है।',
    quoteEn: 'Decisions taken in anger and words uttered in vanity invariably breed lifelong remorse.',
    author: 'चाणक्य नीति',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-14',
    category: 'life',
    quoteHi: 'हर सुबह एक नया जन्म है; आज आप क्या सोचते हैं और क्या करते हैं, यही सबसे अधिक मायने रखता है।',
    quoteEn: 'Each morning we are born again; what we do today matters most of all.',
    author: 'तथागत बुद्ध',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-15',
    category: 'life',
    quoteHi: 'परिवर्तन संसार का अटल नियम है; जो समय के साथ सकारात्मक बदलाव को स्वीकारता है, वही प्रगति करता है।',
    quoteEn: 'Change is the unchanging law of nature; those who embrace renewal ascend to true heights.',
    author: 'श्रीमद्भगवद्गीता',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-16',
    category: 'life',
    quoteHi: 'जीवन बांसुरी की तरह है, जिसमें कई छेद हैं; फिर भी यदि बजाना आ जाए तो उससे मधुर संगीत निकलता है।',
    quoteEn: 'Life is like a flute riddled with holes; master the art and it produces enchanting harmony.',
    author: 'जीवन अमृत',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-17',
    category: 'life',
    quoteHi: 'खुद पर विश्वास रखना सीखिए; संशय अक्सर उन अवसरों को मार देता है जिन्हें प्रयास जीवित कर सकता था।',
    quoteEn: 'Our doubts are traitors, making us lose the good we oft might win by fearing to attempt.',
    author: 'विलियम शेक्सपियर',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-18',
    category: 'life',
    quoteHi: 'खुशी कोई बनी-बनाई वस्तु नहीं है; यह तो आपके अपने कर्मों, दृष्टिकोण और संतोष की उपज होती है।',
    quoteEn: 'Happiness is not something ready-made; it comes from your own purposeful actions.',
    author: 'दलाई लामा',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-19',
    category: 'life',
    quoteHi: 'पवित्र नदी की तरह निरंतर बहते रहिए; रुका हुआ पानी सड़ जाता है और ठहरा हुआ मनुष्य अपनी शक्ति खो देता है।',
    quoteEn: 'Keep flowing like a river; stagnant water rots and an idle human mind loses vitality.',
    author: 'जीवन दर्शन',
    suggestedThemeIndex: 6
  },
  {
    id: 'lif-20',
    category: 'life',
    quoteHi: 'जिंदगी को इतना सार्थक और सुंदर बनाओ कि जब तुम जाओ तो दुनिया कहे कि कोई रोशन चिराग चला गया।',
    quoteEn: 'Live with such grace and dignity that when you depart, the world remembers a radiant light.',
    author: 'जीवन गौरव सूत्र',
    suggestedThemeIndex: 6
  },

  // ==========================================================================
  // 8. PATRIOTISM & YOUTH (राष्ट्रसेवा एवं युवा शक्ति) - TOP 20 QUOTES
  // ==========================================================================
  {
    id: 'pat-1',
    category: 'patriotism',
    quoteHi: 'जिंदगी तो सिर्फ अपने दम पर जी जाती है, दूसरों के कंधों पर तो सिर्फ जनाजे उठाए जाते हैं।',
    quoteEn: 'Life is lived on one’s own terms; upon others’ shoulders, only biers are borne.',
    author: 'शहीद भगत सिंह',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-2',
    category: 'patriotism',
    quoteHi: 'उठो, जागो और तब तक मत रुको जब तक कि लक्ष्य प्राप्त न हो जाए। युवा शक्ति ही राष्ट्र की आत्मा है।',
    quoteEn: 'Arise, awake, and stop not till the goal is reached. Youth is the soul of the nation.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-3',
    category: 'patriotism',
    quoteHi: 'देश सेवा कोई पद या उपाधि नहीं, यह तो अंतरात्मा की वह पुकार है जो समाज के उत्थान के लिए समर्पित होती है।',
    quoteEn: 'National service is no title; it is a sacred call to uplift our fellow citizens.',
    author: 'नेताजी सुभाष चंद्र बोस',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-4',
    category: 'patriotism',
    quoteHi: 'दुश्मन की गोलियों का हम सामना करेंगे, आजाद ही रहे हैं, आजाद ही रहेंगे।',
    quoteEn: 'We shall face the enemy’s bullets with pride; free we have lived, free we shall forever be.',
    author: 'चंद्रशेखर आजाद',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-5',
    category: 'patriotism',
    quoteHi: 'सरफरोशी की तमन्ना अब हमारे दिल में है, देखना है जोर कितना बाजु-ए-कातिल में है।',
    quoteEn: 'The desire for sacrifice beats within our chest; let us witness the might of the oppressor.',
    author: 'राम प्रसाद बिस्मिल',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-6',
    category: 'patriotism',
    quoteHi: 'जय जवान, जय किसान! देश की सीमा पर डटा जवान और खेत में अन्न उपजाता किसान ही राष्ट्र के असली नायक हैं।',
    quoteEn: 'Hail the Soldier, Hail the Farmer! Those on the frontier and in the soil are the nation’s heroes.',
    author: 'लाल बहादुर शास्त्री',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-7',
    category: 'patriotism',
    quoteHi: 'राष्ट्र की उन्नति तभी संभव है जब युवा केवल अपने स्वार्थ के लिए नहीं, बल्कि देशहित के लिए कर्म करें।',
    quoteEn: 'A nation’s greatness unfolds when youth dedicate their intellect to collective progress.',
    author: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-8',
    category: 'patriotism',
    quoteHi: 'स्वराज मेरा जन्मसिद्ध अधिकार है और मैं इसे लेकर रहूंगा। स्वाभिमान ही राष्ट्र की शक्ति है।',
    quoteEn: 'Swaraj is my birthright and I shall have it. Self-respect is the bedrock of a nation.',
    author: 'लोकमान्य बाल गंगाधर तिलक',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-9',
    category: 'patriotism',
    quoteHi: 'कठिन परिश्रम, अनुशासन और अटूट एकता से ही हम भारत को विश्व पटल पर सर्वोच्च गौरव दिला सकते हैं।',
    quoteEn: 'Only unyielding discipline, hard work, and unity can restore India to paramount global glory.',
    author: 'सरदार वल्लभभाई पटेल (लौह पुरुष)',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-10',
    category: 'patriotism',
    quoteHi: 'शिक्षा, समता और बंधुत्व ही वह मजबूत आधारशिला है जिस पर एक अखंड और समृद्ध राष्ट्र का निर्माण होता है।',
    quoteEn: 'Education, equality, and fraternity form the unshakable foundation of a glorious nation.',
    author: 'डॉ. बी. आर. अंबेडकर',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-11',
    category: 'patriotism',
    quoteHi: 'जब तक देश के अंतिम गांव में एक भी व्यक्ति अशिक्षित या वंचित है, तब तक हमारी स्वतंत्रता अधूरी है।',
    quoteEn: 'As long as one person remains unlettered or deprived, our independence is not yet fulfilled.',
    author: 'महात्मा गांधी',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-12',
    category: 'patriotism',
    quoteHi: 'मेरा रंग दे बसंती चोला—मातृभूमि की सेवा और रक्षा के लिए सर्वस्व न्योछावर करना ही सबसे बड़ा सौभाग्य है।',
    quoteEn: 'To dedicate every breath and drop of blood to the motherland is the supreme honor.',
    author: 'अमर शहीद भगत सिंह',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-13',
    category: 'patriotism',
    quoteHi: 'सच्चा युवा वही है जो अतीत के गौरवशाली संस्कारों को सहेजते हुए नए प्रगतिशील भारत की मशाल जलाए।',
    quoteEn: 'True youth cherishes noble heritage while igniting progressive flames for a renewed nation.',
    author: 'रवींद्रनाथ टैगोर',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-14',
    category: 'patriotism',
    quoteHi: 'राष्ट्र सर्वोपरि है; व्यक्तिगत मतभेद चाहे जो हों, देश की संप्रभुता और सम्मान से कभी समझौता नहीं हो सकता।',
    quoteEn: 'The nation stands supreme; personal differences vanish before our motherland’s integrity.',
    author: 'अटल बिहारी वाजपेयी',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-15',
    category: 'patriotism',
    quoteHi: 'जननी जन्मभूमिश्च स्वर्गादपि गरीयसी। जननी और जन्मभूमि का स्थान स्वर्ग से भी कहीं अधिक ऊंचा और पूज्य है।',
    quoteEn: 'Mother and motherland are far superior and more revered than the heavens themselves.',
    author: 'महर्षि वाल्मीकि (रामायण)',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-16',
    category: 'patriotism',
    quoteHi: 'कर्तव्यनिष्ठा ही सबसे सच्ची देशभक्ति है; अपने दैनिक कार्य को पूरी ईमानदारी और लगन से करना भी राष्ट्रसेवा है।',
    quoteEn: 'Steadfast duty is patriotism; executing daily work with total integrity is true national service.',
    author: 'जीवन ज्योति संदेश',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-17',
    category: 'patriotism',
    quoteHi: 'भारत की वास्तविक शक्ति उसकी विविधता में एकता और उसके कर्मठ युवाओं के अदम्य संकल्प में निहित है।',
    quoteEn: 'India’s true prowess reposes in unity in diversity and the undaunted resolve of our youth.',
    author: 'डॉ. सर्वपल्ली राधाकृष्णन',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-18',
    category: 'patriotism',
    quoteHi: 'चलो जलाएं दीप वहां जहां अभी भी अंधेरा है—देश के हर निर्धन गांव में ज्ञान और खुशहाली लाना हमारा धर्म है।',
    quoteEn: 'Let us illuminate every dark corner—bringing education and prosperity to every village is our dharma.',
    author: 'युवा राष्ट्र संकल्प',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-19',
    category: 'patriotism',
    quoteHi: 'क्रांति की तलवार विचारों की सान पर तेज होती है। देश को आगे ले जाने के लिए प्रगतिशील विचारों को अपनाएं।',
    quoteEn: 'The sword of revolution is sharpened on the whetstone of ideas.',
    author: 'शहीद भगत सिंह',
    suggestedThemeIndex: 7
  },
  {
    id: 'pat-20',
    category: 'patriotism',
    quoteHi: 'हम जिएंगे तो इस देश के लिए और पुरुषार्थ करेंगे तो इस देश के लिए; तिरंगे का मान सदैव सर्वोच्च रहेगा।',
    quoteEn: 'We shall live for this sacred land and toil for its glory; the Tricolor shall fly forever high.',
    author: 'राष्ट्र गौरव सूत्र',
    suggestedThemeIndex: 7
  }
];

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  ...BASE_MOTIVATIONAL_QUOTES,
  ...EXTRA_QUOTES_PART1,
  ...EXTRA_QUOTES_PART2
];

export const POSTER_THEMES: PosterThemePreset[] = [
  // 0. Educational Wisdom (Light Solar Ivory & Amber Gold)
  {
    id: 'theme-edu-wisdom',
    name: 'Academic Knowledge (Light)',
    nameHi: 'ज्ञान प्रभात (Solar Ivory & Amber Gold)',
    category: 'educational',
    bgGradient: 'linear-gradient(135deg, #fffdf0 0%, #fef9c3 35%, #fef08a 70%, #fffbeb 100%)',
    canvasBg: '#fffdf0',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#0f172a',
    quoteColor: '#0f172a',
    authorColor: '#b45309',
    accentColor: '#d97706',
    borderGlow: 'rgba(217, 119, 6, 0.25)',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    patternType: 'geometric',
    mood: 'intellectual',
    isLight: true,
    headerColor: '#78350f',
    subHeaderColor: '#92400e',
    cardTextColor: '#0f172a',
    cardSubTextColor: '#475569'
  },

  // 1. Career Ambition (Fresh Mint Dew & Emerald Jade)
  {
    id: 'theme-career-gold',
    name: 'Career & Victory (Light)',
    nameHi: 'सफलता एवं समृद्धि (Mint Fresh & Emerald)',
    category: 'career',
    bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 35%, #bbf7d0 70%, #ecfdf5 100%)',
    canvasBg: '#f0fdf4',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#064e3b',
    quoteColor: '#022c22',
    authorColor: '#047857',
    accentColor: '#059669',
    borderGlow: 'rgba(5, 150, 105, 0.25)',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    patternType: 'geometric',
    mood: 'triumphant',
    isLight: true,
    headerColor: '#064e3b',
    subHeaderColor: '#047857',
    cardTextColor: '#022c22',
    cardSubTextColor: '#047857'
  },

  // 2. Devotional Saffron (Sacred Sandalwood & Saffron Dawn)
  {
    id: 'theme-devo-saffron',
    name: 'Divine Saffron (Light)',
    nameHi: 'दिव्य भगवा प्रभात (Sacred Sandalwood & Saffron)',
    category: 'devotional',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 35%, #fed7aa 70%, #fef3c7 100%)',
    canvasBg: '#fff7ed',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#431407',
    quoteColor: '#451a03',
    authorColor: '#c2410c',
    accentColor: '#ea580c',
    borderGlow: 'rgba(234, 88, 12, 0.25)',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    patternType: 'mandala',
    mood: 'sacred',
    isLight: true,
    headerColor: '#7c2d12',
    subHeaderColor: '#9a3412',
    cardTextColor: '#431407',
    cardSubTextColor: '#7c2d12'
  },

  // 3. Humanity Compassion (Celestial Azure & Mint Breeze)
  {
    id: 'theme-humanity-emerald',
    name: 'Compassion & Service (Light)',
    nameHi: 'करुणा एवं परोपकार (Celestial Azure & Mint)',
    category: 'humanity',
    bgGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 35%, #bae6fd 70%, #ecfeff 100%)',
    canvasBg: '#f0f9ff',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#082f49',
    quoteColor: '#0c2340',
    authorColor: '#0284c7',
    accentColor: '#0284c7',
    borderGlow: 'rgba(2, 132, 199, 0.25)',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    patternType: 'leaves',
    mood: 'compassionate',
    isLight: true,
    headerColor: '#0c2340',
    subHeaderColor: '#0369a1',
    cardTextColor: '#0c2340',
    cardSubTextColor: '#0284c7'
  },

  // 4. Family Warmth (Blossom Rose & Soft Ochre)
  {
    id: 'theme-family-terracotta',
    name: 'Family Warmth (Light)',
    nameHi: 'पारिवारिक स्नेह (Blossom Rose & Soft Ochre)',
    category: 'family',
    bgGradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 35%, #fce7f3 70%, #fff7ed 100%)',
    canvasBg: '#fff1f2',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#4a044e',
    quoteColor: '#3b0764',
    authorColor: '#be185d',
    accentColor: '#db2777',
    borderGlow: 'rgba(219, 39, 119, 0.25)',
    badgeBg: '#fce7f3',
    badgeText: '#831843',
    patternType: 'subtle',
    mood: 'warm',
    isLight: true,
    headerColor: '#4a044e',
    subHeaderColor: '#831843',
    cardTextColor: '#4a044e',
    cardSubTextColor: '#701a75'
  },

  // 5. Friends Teal (Breeze Aqua & Morning Milk)
  {
    id: 'theme-friends-teal',
    name: 'Friends & Brotherhood (Light)',
    nameHi: 'मित्रता एवं उल्लास (Breeze Aqua & Morning Milk)',
    category: 'friends',
    bgGradient: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 40%, #e0f2fe 75%, #f0fdf4 100%)',
    canvasBg: '#ecfeff',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#083344',
    quoteColor: '#042f2e',
    authorColor: '#0891b2',
    accentColor: '#06b6d4',
    borderGlow: 'rgba(6, 182, 212, 0.25)',
    badgeBg: '#cffafe',
    badgeText: '#0e7490',
    patternType: 'dots',
    mood: 'friendly',
    isLight: true,
    headerColor: '#083344',
    subHeaderColor: '#0e7490',
    cardTextColor: '#083344',
    cardSubTextColor: '#0e7490'
  },

  // 6. Life & Serene Nature (Zen Pearl Marble & Rose Aura)
  {
    id: 'theme-life-serene',
    name: 'Zen Nature (Light)',
    nameHi: 'जीवन दर्शन (Zen Pearl Marble & Rose Aura)',
    category: 'life',
    bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 40%, #e2e8f0 75%, #ffffff 100%)',
    canvasBg: '#f8fafc',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#0f172a',
    quoteColor: '#09090b',
    authorColor: '#475569',
    accentColor: '#e11d48',
    borderGlow: 'rgba(225, 29, 72, 0.25)',
    badgeBg: '#f1f5f9',
    badgeText: '#334155',
    patternType: 'stars',
    mood: 'philosophical',
    isLight: true,
    headerColor: '#09090b',
    subHeaderColor: '#334155',
    cardTextColor: '#09090b',
    cardSubTextColor: '#475569'
  },

  // 7. Patriotism Tricolor (Tricolor Dawn - केसरिया, धवल व हरित)
  {
    id: 'theme-patriot-tricolor',
    name: 'Tricolor Valor (Light)',
    nameHi: 'राष्ट्र गौरव (Tricolor Dawn - केसरिया, धवल व हरित)',
    category: 'patriotism',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #f0fdf4 75%, #ecfdf5 100%)',
    canvasBg: '#fff7ed',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#0f172a',
    quoteColor: '#172554',
    authorColor: '#c2410c',
    accentColor: '#f97316',
    borderGlow: 'rgba(249, 115, 22, 0.25)',
    badgeBg: '#ffedd5',
    badgeText: '#1e3a8a',
    patternType: 'mandala',
    mood: 'patriotic',
    isLight: true,
    headerColor: '#172554',
    subHeaderColor: '#c2410c',
    cardTextColor: '#172554',
    cardSubTextColor: '#047857'
  },

  // 8. Universal Royal JJF Signature (Imperial Alabaster & Gold)
  {
    id: 'theme-royal-maroon',
    name: 'JJF Signature Royal (Light)',
    nameHi: 'जीवन ज्योति शाही धवल व स्वर्ण (Imperial Gold & Maroon)',
    category: 'universal',
    bgGradient: 'linear-gradient(135deg, #fffdf5 0%, #fef9c3 35%, #fef3c7 70%, #ffffff 100%)',
    canvasBg: '#fffdf5',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textColor: '#450a0a',
    quoteColor: '#450a0a',
    authorColor: '#7f1d1d',
    accentColor: '#d97706',
    borderGlow: 'rgba(217, 119, 6, 0.3)',
    badgeBg: '#fef3c7',
    badgeText: '#7f1d1d',
    patternType: 'mandala',
    mood: 'regal',
    isLight: true,
    headerColor: '#450a0a',
    subHeaderColor: '#78350f',
    cardTextColor: '#450a0a',
    cardSubTextColor: '#78350f'
  },

  // 9. Classic Night Royal Maroon (Alternative Dark Option)
  {
    id: 'theme-dark-maroon',
    name: 'Classic Dark Maroon',
    nameHi: 'शाही रात्रि महरून (Royal Dark Maroon)',
    category: 'universal',
    bgGradient: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 40%, #831843 75%, #3b0764 100%)',
    canvasBg: '#450a0a',
    cardBg: 'rgba(127, 29, 29, 0.85)',
    textColor: '#ffffff',
    quoteColor: '#fef08a',
    authorColor: '#fecdd3',
    accentColor: '#eab308',
    borderGlow: 'rgba(234, 179, 8, 0.45)',
    badgeBg: '#7f1d1d',
    badgeText: '#fef9c3',
    patternType: 'mandala',
    mood: 'regal',
    isLight: false
  }
];

export interface PosterRatioConfig {
  id: 'whatsapp-status' | 'square-post' | 'facebook-portrait' | 'facebook-landscape';
  labelHi: string;
  labelEn: string;
  iconName: string;
  width: number;
  height: number;
  aspectClass: string;
  description: string;
  badge: string;
}

export const POSTER_RATIO_CONFIGS: PosterRatioConfig[] = [
  {
    id: 'square-post',
    labelHi: 'व्हाट्सएप DP / फेसबुक पोस्ट (1:1)',
    labelEn: 'Square (1:1) - 1080x1080',
    iconName: 'Square',
    width: 1080,
    height: 1080,
    aspectClass: 'aspect-square',
    description: 'WhatsApp DP, Facebook Feed, Instagram Post',
    badge: 'Universal'
  },
  {
    id: 'whatsapp-status',
    labelHi: 'व्हाट्सएप स्टेटस / स्टोरी (9:16)',
    labelEn: 'WhatsApp Status / Story (9:16) - 1080x1920',
    iconName: 'Smartphone',
    width: 1080,
    height: 1920,
    aspectClass: 'aspect-[9/16]',
    description: 'WhatsApp Status, Instagram Story, Reels cover',
    badge: 'Trending'
  },
  {
    id: 'facebook-portrait',
    labelHi: 'फेसबुक पोर्ट्रेट फीड (4:5)',
    labelEn: 'Facebook Portrait (4:5) - 1080x1350',
    iconName: 'Smartphone',
    width: 1080,
    height: 1350,
    aspectClass: 'aspect-[4/5]',
    description: 'फेसबुक मोबाइल फीड में सर्वाधिक दृश्यता',
    badge: 'Best for FB'
  },
  {
    id: 'facebook-landscape',
    labelHi: 'फेसबुक बैनर / लैंडस्केप (16:9)',
    labelEn: 'Facebook Banner (16:9) - 1200x675',
    iconName: 'Monitor',
    width: 1200,
    height: 675,
    aspectClass: 'aspect-video',
    description: 'Facebook Cover, Landscape पोस्ट, YouTube Thumbnail',
    badge: 'Landscape'
  }
];
