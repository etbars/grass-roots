import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray lockfile in the home dir was being picked up.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
