/**
 * API configuration settings
 */

// Strapi API base URL - adjust as needed for different environments
export const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

// Helper function to create full Strapi API URLs
export function getStrapiApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${STRAPI_API_URL}/api/${cleanPath}`;
} 