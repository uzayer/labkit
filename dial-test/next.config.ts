import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Without this, Next blocks /_next/* dev resources when the site is opened
  // from another device on the LAN, so no JS loads and the page is inert.
  allowedDevOrigins: ["192.168.0.180", "*.local"],
  // Placeholder photography until DIAL's own images are collected.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "deifkwefumgah.cloudfront.net" },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
