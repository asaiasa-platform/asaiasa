import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  manifest: "/manifest.json",
  disable: false, // Enable PWA in production
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production deployment
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        pathname: "/**",
        hostname: "proptabucket.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        pathname: "/**",
        hostname: "anda-daf-bridge.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        pathname: "/**",
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET1,
      },
      {
        protocol: "https",
        pathname: "/**",
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET2,
      },
      {
        protocol: "https",
        pathname: "/**",
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET3,
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
  
  // Redirects for better SEO and UX
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en/home',
        permanent: false,
      },
      {
        source: '/home',
        destination: '/en/home',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/en/login',
        permanent: false,
      },
    ];
  },
};

export default withPWA(withNextIntl(nextConfig));
