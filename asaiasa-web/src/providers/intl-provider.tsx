import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntlProvider } from 'next-intl';
import { Locale, defaultLocale, getMessages } from '@/i18n/config';

interface IntlContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

interface IntlProviderWrapperProps {
  children: ReactNode;
}

export function IntlProviderWrapper({ children }: IntlProviderWrapperProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['en', 'th'].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    async function loadMessages() {
      setIsLoading(true);
      try {
        const msgs = await getMessages(locale);
        setMessages(msgs);
        localStorage.setItem('locale', locale);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [locale]);

  const contextValue: IntlContextType = {
    locale,
    setLocale,
  };

  if (isLoading || !messages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <IntlContext.Provider value={contextValue}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
}

export function useIntl() {
  const context = useContext(IntlContext);
  if (context === undefined) {
    throw new Error('useIntl must be used within an IntlProviderWrapper');
  }
  return context;
}
