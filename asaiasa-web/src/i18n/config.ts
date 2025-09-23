export type Locale = 'en' | 'th';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'th'];

export async function getMessages(locale: Locale) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to English
    return (await import(`../../messages/en.json`)).default;
  }
}
