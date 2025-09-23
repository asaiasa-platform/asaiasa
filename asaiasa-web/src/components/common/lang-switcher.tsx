import React from 'react';
import { Button } from '@/components/base/buttons/button';
import { useIntl } from '@/providers/intl-provider';
import { Locale } from '@/i18n/config';

const LangSwitcher: React.FC = () => {
  const { locale, setLocale } = useIntl();

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'en' ? 'th' : 'en';
    setLocale(newLocale);
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50"
    >
      <div className="flex items-center gap-2">
        {locale === 'en' ? (
          <>
            <img src="/icon/en.svg" alt="English" className="w-4 h-3" />
            <span className="text-xs font-medium">EN</span>
          </>
        ) : (
          <>
            <img src="/icon/th.svg" alt="ไทย" className="w-4 h-3" />
            <span className="text-xs font-medium">ไทย</span>
          </>
        )}
      </div>
    </Button>
  );
};

export default LangSwitcher;
