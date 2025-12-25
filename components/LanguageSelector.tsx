'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { languages, SupportedLanguage } from '@/lib/utils/language';
import { getLanguageDirection } from '@/lib/utils/language';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { language, setLanguage } = useChatStore();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    setLanguage(lang);
    setIsOpen(false);
    document.documentElement.dir = getLanguageDirection(lang);
    document.documentElement.lang = lang;
    
    // Update i18n language
    try {
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-900 hover:bg-gray-200 transition-colors"
        title="Change Language"
      >
        <Globe className="w-5 h-5" />
        <span className="font-medium">{currentLang?.nativeName || currentLang?.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[200px] z-[101]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  language === lang.code
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{lang.nativeName}</span>
                  <span className="text-xs text-gray-500">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

