export type SupportedLanguage = 'en' | 'ar' | 'hi' | 'ur' | 'tl' | 'ml' | 'ta' | 'ne';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const languages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', rtl: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', rtl: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', rtl: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', rtl: false },
  { code: 'ne', name: 'Nepalese', nativeName: 'नेपाली', rtl: false },
];

export function detectLanguage(text: string): SupportedLanguage {
  // Simple detection based on character ranges
  const arabicPattern = /[\u0600-\u06FF]/;
  const devanagariPattern = /[\u0900-\u097F]/; // Used by Hindi and Nepalese
  const urduPattern = /[\u0600-\u06FF]/; // Shares Arabic script
  const tamilPattern = /[\u0B80-\u0BFF]/;
  const malayalamPattern = /[\u0D00-\u0D7F]/;
  
  if (arabicPattern.test(text)) {
    // Could be Arabic or Urdu - default to Arabic
    return 'ar';
  }
  if (devanagariPattern.test(text)) {
    // Could be Hindi or Nepalese - default to Hindi (can be refined)
    return 'hi';
  }
  if (tamilPattern.test(text)) {
    return 'ta';
  }
  if (malayalamPattern.test(text)) {
    return 'ml';
  }
  
  return 'en'; // Default
}

export function getLanguageDirection(lang: SupportedLanguage): 'ltr' | 'rtl' {
  return languages.find(l => l.code === lang)?.rtl ? 'rtl' : 'ltr';
}

