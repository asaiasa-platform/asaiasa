// Environment configuration
export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '82405740112-nquklo3ifkc576a4da2oa3d267j3m7lq.apps.googleusercontent.com',

  // Application Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ASAiASA',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Find ESG Events and Jobs',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',

  // Frontend URLs
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
  ADMIN_URL: import.meta.env.VITE_ADMIN_URL || 'https://ta-mgmt-cons.netlify.app',

  // Default Settings
  DEFAULT_LOCALE: (import.meta.env.VITE_DEFAULT_LOCALE || 'en') as 'en' | 'th',
  SUPPORTED_LOCALES: (import.meta.env.VITE_SUPPORTED_LOCALES || 'en,th').split(','),

  // Feature Flags
  ENABLE_GOOGLE_AUTH: import.meta.env.VITE_ENABLE_GOOGLE_AUTH !== 'false',
  ENABLE_RECOMMENDATIONS: import.meta.env.VITE_ENABLE_RECOMMENDATIONS !== 'false',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',

  // Cookie Configuration
  COOKIE_DOMAIN: import.meta.env.VITE_COOKIE_DOMAIN || 'localhost',
  COOKIE_SECURE: import.meta.env.VITE_COOKIE_SECURE === 'true',
  COOKIE_SAME_SITE: import.meta.env.VITE_COOKIE_SAME_SITE || 'lax',
} as const;

// Type for environment variables
export type Environment = typeof env;
