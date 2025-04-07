import createNextIntlPlugin from "next-intl/plugin";

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
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET1,
      },
      {
        protocol: "https",
        pathname: "/**", // This allows any path under the bucket
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET2,
      },
    ],
  },
};

export default withNextIntl(nextConfig);
