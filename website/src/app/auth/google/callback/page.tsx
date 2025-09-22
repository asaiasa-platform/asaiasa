"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get all search parameters
    const params = new URLSearchParams(searchParams);
    
    // Redirect to the locale-specific callback page
    // Default to 'en' locale, but you could also detect user's preferred locale
    const locale = localStorage.getItem('preferred-locale') || 'en';
    const redirectUrl = `/${locale}/auth/google/callback?${params.toString()}`;
    
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Redirecting...
        </h2>
        <p className="text-gray-500">Please wait</p>
      </div>
    </div>
  );
}