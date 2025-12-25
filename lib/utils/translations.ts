import { SupportedLanguage } from './language';

type TranslationKey = 
  | 'greeting'
  | 'leave.apply'
  | 'leave.balance'
  | 'payslip.download'
  | 'hierarchy.view'
  | 'appraisal.status'
  | 'policies.browse'
  | 'salary.details'
  | 'approvals.pending'
  | 'contact.hr'
  | 'chat.placeholder'
  | 'chat.send'
  | 'chat.thinking'
  | 'error.generic'
  | 'error.auth'
  | 'success.leave.submitted'
  | 'success.payslip.downloaded';

const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  en: {
    greeting: 'Hello! I\'m your HR Assistant.',
    'leave.apply': 'Apply for Leave',
    'leave.balance': 'Leave Balance',
    'payslip.download': 'Download Payslip',
    'hierarchy.view': 'View Hierarchy',
    'appraisal.status': 'Check Appraisal Status',
    'policies.browse': 'Browse Policies',
    'salary.details': 'Salary Details',
    'approvals.pending': 'My Approvals',
    'contact.hr': 'Contact HR',
    'chat.placeholder': 'Ask me anything about HR...',
    'chat.send': 'Send',
    'chat.thinking': 'Thinking...',
    'error.generic': 'Something went wrong. Please try again.',
    'error.auth': 'Please sign in to continue.',
    'success.leave.submitted': 'Leave application submitted successfully!',
    'success.payslip.downloaded': 'Payslip downloaded successfully!',
  },
  ar: {
    greeting: 'مرحباً! أنا مساعدك في الموارد البشرية.',
    'leave.apply': 'طلب إجازة',
    'leave.balance': 'رصيد الإجازات',
    'payslip.download': 'تحميل قسيمة الراتب',
    'hierarchy.view': 'عرض التسلسل الهرمي',
    'appraisal.status': 'حالة التقييم',
    'policies.browse': 'تصفح السياسات',
    'salary.details': 'تفاصيل الراتب',
    'approvals.pending': 'موافقاتي المعلقة',
    'contact.hr': 'اتصل بالموارد البشرية',
    'chat.placeholder': 'اسألني أي شيء عن الموارد البشرية...',
    'chat.send': 'إرسال',
    'chat.thinking': 'جاري التفكير...',
    'error.generic': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    'error.auth': 'يرجى تسجيل الدخول للمتابعة.',
    'success.leave.submitted': 'تم إرسال طلب الإجازة بنجاح!',
    'success.payslip.downloaded': 'تم تحميل قسيمة الراتب بنجاح!',
  },
  hi: {
    greeting: 'नमस्ते! मैं आपका HR सहायक हूं।',
    'leave.apply': 'छुट्टी के लिए आवेदन करें',
    'leave.balance': 'छुट्टी का बैलेंस',
    'payslip.download': 'पेस्लिप डाउनलोड करें',
    'hierarchy.view': 'पदानुक्रम देखें',
    'appraisal.status': 'मूल्यांकन स्थिति जांचें',
    'policies.browse': 'नीतियां ब्राउज़ करें',
    'salary.details': 'वेतन विवरण',
    'approvals.pending': 'मेरी अनुमोदन',
    'contact.hr': 'HR से संपर्क करें',
    'chat.placeholder': 'HR के बारे में कुछ भी पूछें...',
    'chat.send': 'भेजें',
    'chat.thinking': 'सोच रहा हूं...',
    'error.generic': 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
    'error.auth': 'कृपया जारी रखने के लिए साइन इन करें।',
    'success.leave.submitted': 'छुट्टी का आवेदन सफलतापूर्वक जमा किया गया!',
    'success.payslip.downloaded': 'पेस्लिप सफलतापूर्वक डाउनलोड की गई!',
  },
  ur: {
    greeting: 'ہیلو! میں آپ کا HR اسسٹنٹ ہوں۔',
    'leave.apply': 'چھٹی کے لیے درخواست دیں',
    'leave.balance': 'چھٹی کا بیلنس',
    'payslip.download': 'پے سلپ ڈاؤن لوڈ کریں',
    'hierarchy.view': 'ہائیرارکی دیکھیں',
    'appraisal.status': 'تشخیص کی حیثیت چیک کریں',
    'policies.browse': 'پالیسیاں براؤز کریں',
    'salary.details': 'تنخواہ کی تفصیلات',
    'approvals.pending': 'میری منظوریاں',
    'contact.hr': 'HR سے رابطہ کریں',
    'chat.placeholder': 'HR کے بارے میں کچھ بھی پوچھیں...',
    'chat.send': 'بھیجیں',
    'chat.thinking': 'سوچ رہا ہوں...',
    'error.generic': 'کچھ غلط ہوا۔ براہ کرم دوبارہ کوشش کریں۔',
    'error.auth': 'براہ کرم جاری رکھنے کے لیے سائن ان کریں۔',
    'success.leave.submitted': 'چھٹی کی درخواست کامیابی سے جمع کر دی گئی!',
    'success.payslip.downloaded': 'پے سلپ کامیابی سے ڈاؤن لوڈ ہو گئی!',
  },
  tl: {
    greeting: 'Kumusta! Ako ang iyong HR Assistant.',
    'leave.apply': 'Mag-apply ng Leave',
    'leave.balance': 'Leave Balance',
    'payslip.download': 'I-download ang Payslip',
    'hierarchy.view': 'Tingnan ang Hierarchy',
    'appraisal.status': 'Tingnan ang Appraisal Status',
    'policies.browse': 'Browse ang Policies',
    'salary.details': 'Salary Details',
    'approvals.pending': 'Aking Approvals',
    'contact.hr': 'Makipag-ugnayan sa HR',
    'chat.placeholder': 'Tanungin mo ako tungkol sa HR...',
    'chat.send': 'Ipadala',
    'chat.thinking': 'Nag-iisip...',
    'error.generic': 'May nangyaring mali. Pakisubukan muli.',
    'error.auth': 'Mangyaring mag-sign in upang magpatuloy.',
    'success.leave.submitted': 'Matagumpay na naipasa ang leave application!',
    'success.payslip.downloaded': 'Matagumpay na na-download ang payslip!',
  },
  ml: {
    greeting: 'ഹലോ! ഞാൻ നിങ്ങളുടെ HR അസിസ്റ്റന്റ് ആണ്.',
    'leave.apply': 'ലീവ് അപേക്ഷിക്കുക',
    'leave.balance': 'ലീവ് ബാലൻസ്',
    'payslip.download': 'പേസ്ലിപ്പ് ഡൗൺലോഡ് ചെയ്യുക',
    'hierarchy.view': 'ഹൈറാർക്കി കാണുക',
    'appraisal.status': 'അപ്രെയ്സൽ സ്റ്റാറ്റസ് പരിശോധിക്കുക',
    'policies.browse': 'പോളിസികൾ ബ്രൗസ് ചെയ്യുക',
    'salary.details': 'സാലറി വിശദാംശങ്ങൾ',
    'approvals.pending': 'എന്റെ അനുമോദനങ്ങൾ',
    'contact.hr': 'HR-യെ സമീപിക്കുക',
    'chat.placeholder': 'HR-നെക്കുറിച്ച് എന്തും ചോദിക്കുക...',
    'chat.send': 'അയയ്ക്കുക',
    'chat.thinking': 'ചിന്തിക്കുന്നു...',
    'error.generic': 'എന്തോ തെറ്റ് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
    'error.auth': 'തുടരാൻ ദയവായി സൈൻ ഇൻ ചെയ്യുക.',
    'success.leave.submitted': 'ലീവ് അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു!',
    'success.payslip.downloaded': 'പേസ്ലിപ്പ് വിജയകരമായി ഡൗൺലോഡ് ചെയ്തു!',
  },
  ta: {
    greeting: 'வணக்கம்! நான் உங்கள் HR உதவியாளர்.',
    'leave.apply': 'விடுப்பு விண்ணப்பிக்க',
    'leave.balance': 'விடுப்பு இருப்பு',
    'payslip.download': 'பேஸ்லிப் பதிவிறக்க',
    'hierarchy.view': 'படிநிலை காண்க',
    'appraisal.status': 'மதிப்பீட்டு நிலையை சரிபார்க்க',
    'policies.browse': 'கொள்கைகளை உலாவ',
    'salary.details': 'சம்பள விவரங்கள்',
    'approvals.pending': 'எனது அனுமதிகள்',
    'contact.hr': 'HR-ஐ தொடர்பு கொள்ள',
    'chat.placeholder': 'HR பற்றி எதையும் கேளுங்கள்...',
    'chat.send': 'அனுப்ப',
    'chat.thinking': 'சிந்திக்கிறது...',
    'error.generic': 'ஏதோ தவறு நடந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
    'error.auth': 'தொடர தயவுசெய்து உள்நுழையவும்.',
    'success.leave.submitted': 'விடுப்பு விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
    'success.payslip.downloaded': 'பேஸ்லிப் வெற்றிகரமாக பதிவிறக்கப்பட்டது!',
  },
  ne: {
    greeting: 'नमस्ते! म तपाईंको HR सहायक हुँ।',
    'leave.apply': 'छुट्टीको लागि आवेदन गर्नुहोस्',
    'leave.balance': 'छुट्टीको बाँकी',
    'payslip.download': 'तलब पर्ची डाउनलोड गर्नुहोस्',
    'hierarchy.view': 'पदानुक्रम हेर्नुहोस्',
    'appraisal.status': 'मूल्याङ्कनको स्थिति जाँच गर्नुहोस्',
    'policies.browse': 'नीतिहरू ब्राउज गर्नुहोस्',
    'salary.details': 'तलबको विवरण',
    'approvals.pending': 'मेरो स्वीकृतिहरू',
    'contact.hr': 'HR लाई सम्पर्क गर्नुहोस्',
    'chat.placeholder': 'HR को बारेमा केहि पनि सोध्नुहोस्...',
    'chat.send': 'पठाउनुहोस्',
    'chat.thinking': 'सोच्दै...',
    'error.generic': 'केहि गलत भयो। कृपया पुनः प्रयास गर्नुहोस्।',
    'error.auth': 'कृपया जारी राख्न साइन इन गर्नुहोस्।',
    'success.leave.submitted': 'छुट्टीको आवेदन सफलतापूर्वक पेश गरियो!',
    'success.payslip.downloaded': 'तलब पर्ची सफलतापूर्वक डाउनलोड भयो!',
  },
};

export function t(key: TranslationKey, lang: SupportedLanguage = 'en'): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

