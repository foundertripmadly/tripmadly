import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ ADD THIS BLOCK
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: [
      "picsum.photos",
      "image.pollinations.ai",
      "i.pravatar.cc",
      "images.unsplash.com",
      "195.35.20.196",
    ],

    remotePatterns: [
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

    unoptimized: false,
  },

  output: "standalone",
  transpilePackages: ["motion"],
};

export default nextConfig;