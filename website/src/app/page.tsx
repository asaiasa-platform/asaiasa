"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Get user's preferred language or default to English
    const getPreferredLocale = () => {
      // Check if user has a stored preference
      const storedLocale = localStorage.getItem('preferred-locale');
      if (storedLocale && ['en', 'th'].includes(storedLocale)) {
        return storedLocale;
      }
      
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('th')) {
        return 'th';
      }
      
      // Default to English as requested
      return 'en';
    };

    const locale = getPreferredLocale();
    // Redirect to /{locale}/home when accessing the root path
    router.replace(`/${locale}/home`);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
    </div>
  );
}
