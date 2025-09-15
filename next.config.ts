import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for Replit production environment
  output: "standalone",
  // Minimal experimental config
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
