import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  manifest: "/manifest.json", // Add leading slash
  // disable: process.env.NODE_ENV === "development",
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Allow images from Google Profile
      },
      {
        protocol: "https",
        pathname: "/**", // This allows any path under the bucket
        hostname: "proptabucket.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        pathname: "/**", // This allows any path under the bucket
        hostname: "anda-daf-bridge.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        pathname: "/**", // This allows any path under the bucket
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET1,
      },
      {
        protocol: "https",
        pathname: "/**", // This allows any path under the bucket
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET2,
      },
      {
        protocol: "https",
        pathname: "/**", // This allows any path under the bucket
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET3,
      },
      {
        protocol: "https",
        hostname: "**", // Allow any external domain
      },
      {
        protocol: "http",
        hostname: "**", // Allow any external domain with http
      },
    ], // Allow images from Google Drive
  },
};

export default withPWA(withNextIntl(nextConfig));
