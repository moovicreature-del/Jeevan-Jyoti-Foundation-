// Script to generate 50 quotes for each of the 8 categories
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../src/data/quotes');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. EDUCATIONAL QUOTES (50)
const educationalQuotes = [
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
  {
    id: 'edu-21',
    category: 'educational',
    quoteHi: 'एक बच्चे, एक शिक्षक, एक किताब और एक कलम से पूरी दुनिया को बदला जा सकता है।',
    quoteEn: 'One child, one teacher, one book, and one pen can change the world.',
    author: 'मलाला यूसुफजई',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-22',
    category: 'educational',
    quoteHi: 'विद्या मनुष्य का सर्वोत्तम आभूषण और गुप्त धन है, जो कभी नष्ट नहीं होता।',
    quoteEn: 'Education is man’s supreme ornament and concealed treasure that never perishes.',
    author: 'भर्तृहरि (नीतिशतकम्)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-23',
    category: 'educational',
    quoteHi: 'शिक्षा केवल सूचनाएं बटोरने का नाम नहीं है, वह तो जीवन को दिशा देने वाला प्रकाशपुंज है।',
    quoteEn: 'Education is not merely gathering facts, but a guiding light for life.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-24',
    category: 'educational',
    quoteHi: 'सच्चा शिक्षक वह है जो आपको सोचना सिखाता है, न कि यह बताता है कि क्या सोचना है।',
    quoteEn: 'A true teacher teaches you how to think, not what to think.',
    author: 'जिद्दू कृष्णमूर्ति',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-25',
    category: 'educational',
    quoteHi: 'स्त्री शिक्षा समाज के सर्वांगीण विकास की पहली और सबसे अनिवार्य शर्त है।',
    quoteEn: 'Women education is the first and foremost foundation of societal progress.',
    author: 'क्रांतिज्योति सावित्रीबाई फुले',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-26',
    category: 'educational',
    quoteHi: 'बिना ज्ञान के मनुष्य अंधकार में भटकते हुए उस मुसाफिर की भांति है जिसके पास कोई नक्शा नहीं होता।',
    quoteEn: 'Without knowledge, a person wanders in darkness like a traveler without a map.',
    author: 'ईश्वरचंद्र विद्यासागर',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-27',
    category: 'educational',
    quoteHi: 'जो विद्यार्थी आज प्रश्न पूछने में हिचकिचाता है, वह कल अज्ञान का बोझ ढोने को विवश होता है।',
    quoteEn: 'The student who hesitates to ask today carries the burden of ignorance tomorrow.',
    author: 'चीनी नीतिवचन',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-28',
    category: 'educational',
    quoteHi: 'ज्ञान वह अमृत है जो मनुष्य को अजर-अमर बना देता है और उसके विचारों को युगों तक जीवित रखता है।',
    quoteEn: 'Wisdom is the nectar that renders human thoughts immortal across generations.',
    author: 'ऋषि वेदव्यास',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-29',
    category: 'educational',
    quoteHi: 'यदि आप एक वर्ष के लिए योजना बनाते हैं तो बीज बोइए; यदि 100 वर्ष के लिए तो शिक्षा दीजिए।',
    quoteEn: 'If planning for a year, sow seed; if planning for a century, educate minds.',
    author: 'कन्फ्यूशियस (Confucius)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-30',
    category: 'educational',
    quoteHi: 'पुस्तकालय वह तीर्थस्थल है जहां ज्ञान के देवता साक्षात वास करते हैं।',
    quoteEn: 'A library is a sacred sanctum where the deities of wisdom dwell.',
    author: 'महामना मदन मोहन मालवीय',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-31',
    category: 'educational',
    quoteHi: 'सच्ची शिक्षा का परिणाम सहनशीलता, सहिष्णुता और मानवता की भावना में दिखना चाहिए।',
    quoteEn: 'The highest result of education is tolerance, empathy, and humanity.',
    author: 'हेलेन केलर (Helen Keller)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-32',
    category: 'educational',
    quoteHi: 'ज्ञान की प्राप्ति के लिए एकाग्रता सबसे बड़ा साधन है; एकाग्र मन से कोई भी विद्या असाध्य नहीं।',
    quoteEn: 'Concentration is the supreme instrument of learning; nothing is impossible to a focused mind.',
    author: 'स्वामी विवेकानंद',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-33',
    category: 'educational',
    quoteHi: 'जो ज्ञान आचरण में न उतरे, वह केवल मस्तिष्क पर लदा हुआ व्यर्थ का बोझ है।',
    quoteEn: 'Knowledge that does not translate into noble conduct is merely an idle burden on the mind.',
    author: 'महात्मा गांधी',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-34',
    category: 'educational',
    quoteHi: 'ज्ञान दीपक है और अज्ञान अंधकार; ज्ञान की एक किरण भी अज्ञान के घने अंधकार को मिटा देती है।',
    quoteEn: 'Knowledge is light and ignorance is darkness; a single ray of wisdom banishes gloom.',
    author: 'उपनिषद सूत्र',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-35',
    category: 'educational',
    quoteHi: 'हर बच्चा अपने भीतर एक विलक्षण प्रतिभा लेकर जन्म लेता है, शिक्षा का कार्य उसे पहचानना है।',
    quoteEn: 'Every child is born with genius; true education uncovers and nurtures it.',
    author: 'रवींद्रनाथ टैगोर',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-36',
    category: 'educational',
    quoteHi: 'सीखने की कोई उम्र नहीं होती; जो सीखने की इच्छा रखता है, वह सदैव युवा रहता है।',
    quoteEn: 'Learning knows no age; whoever preserves the urge to learn remains forever young.',
    author: 'हेनरी फोर्ड',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-37',
    category: 'educational',
    quoteHi: 'विज्ञान मानवता को तर्क देता है और साहित्य मानवता को संवेदना; दोनों मिलकर पूर्ण शिक्षा बनाते हैं।',
    quoteEn: 'Science grants reason and literature grants empathy; together they complete education.',
    author: 'डॉ. सर्वपल्ली राधाकृष्णन',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-38',
    category: 'educational',
    quoteHi: 'विद्या धन ऐसा खजाना है जिसे न चोर चुरा सकता है और न ही राजा छीन सकता है।',
    quoteEn: 'The wealth of knowledge is that treasure which no thief can steal and no king can confiscate.',
    author: 'चाणक्य नीति',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-39',
    category: 'educational',
    quoteHi: 'अध्ययन बिना सोचे-समझे करना व्यर्थ है, और सोचना बिना अध्ययन किए जोखिम भरा है।',
    quoteEn: 'Learning without thought is labor lost; thought without learning is perilous.',
    author: 'कन्फ्यूशियस',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-40',
    category: 'educational',
    quoteHi: 'शिक्षा का सबसे बड़ा पुरस्कार यह है कि वह आपको अपने पैरों पर खड़े होने का आत्मबल देती है।',
    quoteEn: 'The supreme gift of education is the inner strength to stand on your own feet.',
    author: 'स्वामी दयानंद सरस्वती',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-41',
    category: 'educational',
    quoteHi: 'जब तक आप सीखना बंद नहीं करते, तब तक आपकी प्रगति को कोई रोक नहीं सकता।',
    quoteEn: 'As long as you do not stop learning, nothing in the universe can halt your growth.',
    author: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-42',
    category: 'educational',
    quoteHi: 'किताबें वो खिड़कियां हैं जिनसे हम पूरी दुनिया की महान आत्माओं से संवाद कर सकते हैं।',
    quoteEn: 'Books are windows through which we converse with the greatest souls of the universe.',
    author: 'विक्टर ह्यूगो',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-43',
    category: 'educational',
    quoteHi: 'सच्ची विद्या वही है जो मनुष्य के मन को शांत, दृष्टि को व्यापक और हृदय को विशाल बनाए।',
    quoteEn: 'True wisdom is that which calms the mind, broadens vision, and enlarges the heart.',
    author: 'श्री अरविन्द',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-44',
    category: 'educational',
    quoteHi: 'ज्ञान की प्यास ही मनुष्य को साधारण से असाधारण की श्रेणी में ले जाती है।',
    quoteEn: 'The thirst for knowledge elevates a mortal from ordinary to extraordinary.',
    author: 'सुकरात',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-45',
    category: 'educational',
    quoteHi: 'एक शिक्षित समाज ही अपराध, कुरीतियों और गरीबी से वास्तविक मुक्ति पा सकता है।',
    quoteEn: 'Only an educated society can achieve true liberation from crime, dogma, and poverty.',
    author: 'डॉ. भीमराव अंबेडकर',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-46',
    category: 'educational',
    quoteHi: 'विद्या से विनय, विनय से पात्रता, पात्रता से धन और धर्म तथा उससे सुख की प्राप्ति होती है।',
    quoteEn: 'From learning comes humility, from humility worthiness, from worthiness righteousness and joy.',
    author: 'नीति शतक',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-47',
    category: 'educational',
    quoteHi: 'जो समय स्वाध्याय और सद्ग्रंथों के पठन में बीतता है, वह जीवन का सबसे पवित्र समय है।',
    quoteEn: 'Time spent in self-study and reading noble scriptures is the most sacred phase of life.',
    author: 'लोकमान्य बाल गंगाधर तिलक',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-48',
    category: 'educational',
    quoteHi: 'अध्यापक राष्ट्र के भाग्य विधाता होते हैं; वे कक्षा की चारदीवारी में भारत का भविष्य गढ़ते हैं।',
    quoteEn: 'Teachers are architects of the nation; they shape the destiny of India in classrooms.',
    author: 'डॉ. सर्वपल्ली राधाकृष्णन',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-49',
    category: 'educational',
    quoteHi: 'अज्ञानता के अंधकार में जीने से बेहतर है कि ज्ञान की खोज में जीवन न्यौछावर कर दिया जाए।',
    quoteEn: 'Better to spend life pursuing wisdom than to exist comfortably in the shadows of ignorance.',
    author: 'प्लेटो (Plato)',
    suggestedThemeIndex: 0
  },
  {
    id: 'edu-50',
    category: 'educational',
    quoteHi: 'शिक्षा समाज का वह नेत्र है जिसके बिना मनुष्य का कल्याण और देश का विकास असंभव है।',
    quoteEn: 'Education is the eye of society without which neither human welfare nor national progress is possible.',
    author: 'पंडित मदन मोहन मालवीय',
    suggestedThemeIndex: 0
  }
];

fs.writeFileSync(
  path.join(targetDir, 'educationalQuotes.ts'),
  `import { MotivationalQuote } from '../motivationalQuotesData';\n\nexport const EDUCATIONAL_QUOTES: MotivationalQuote[] = ${JSON.stringify(educationalQuotes, null, 2)};\n`
);

console.log("Created educationalQuotes.ts with 50 quotes");
