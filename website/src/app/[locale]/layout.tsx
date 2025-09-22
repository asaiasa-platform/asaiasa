import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { LanguageCode } from "@/lib/types";
import GoogleAuthProvider from "@/context/GoogleOAuthProvider";
import { LoadingProvider } from "@/context/LoadingContext";
import { notFound } from "next/navigation";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as LanguageCode)) {
    notFound();
  }

  // Load messages on the server
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages:', error);
    // Fallback to English
    try {
      messages = (await import(`../../../messages/en.json`)).default;
    } catch (fallbackError) {
      console.error('Failed to load fallback messages:', fallbackError);
      messages = {};
    }
  }

  return (
    <html lang={locale} className="font-prompt">
      <head>
        <title>ASAiASA</title>
        <meta name="description" content="Find ESG Events and Jobs" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className="bg-cream-bg">
        <NextIntlClientProvider messages={messages}>
          <LoadingProvider>
            <Toaster />
            <GoogleAuthProvider>
              <AuthProvider>
                <ClientLayoutWrapper>
                  {children}
                </ClientLayoutWrapper>
              </AuthProvider>
            </GoogleAuthProvider>
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
