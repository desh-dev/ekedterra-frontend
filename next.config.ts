import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for Replit environment
  experimental: {
    serverComponentsExternalPackages: [],
  }
};

export default nextConfig;
