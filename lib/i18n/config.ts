import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SupportedLanguage } from '@/lib/utils/language';

import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import hiTranslations from './locales/hi.json';
import urTranslations from './locales/ur.json';
import tlTranslations from './locales/tl.json';
import mlTranslations from './locales/ml.json';
import taTranslations from './locales/ta.json';
import neTranslations from './locales/ne.json';

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  hi: { translation: hiTranslations },
  ur: { translation: urTranslations },
  tl: { translation: tlTranslations },
  ml: { translation: mlTranslations },
  ta: { translation: taTranslations },
  ne: { translation: neTranslations },
};

// Initialize i18n if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      debug: process.env.NODE_ENV === 'development',
    });
}

export default i18n;

