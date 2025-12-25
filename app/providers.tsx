'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import { useChatStore } from '@/lib/store/chatStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { language } = useChatStore();

  useEffect(() => {
    // Sync language changes with i18n
    if (i18n.isInitialized && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

