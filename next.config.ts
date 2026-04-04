import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Ignore ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      // 🔥 STRAPI (DEV - current working)
      {
        protocol: "http",
        hostname: "195.35.20.196",
        pathname: "/uploads/**",
      },

      // 🔥 STRAPI (PRODUCTION - after nginx)
      {
        protocol: "https",
        hostname: "tripmadly.com",
        pathname: "/backend/uploads/**",
      },

      // 🔥 External image sources (safe)
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "image.pollinations.ai",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],

    // ✅ Prevent timeout + improve stability
    unoptimized: true,
  },

  output: "standalone",
  transpilePackages: ["motion"],
};

export default nextConfig;