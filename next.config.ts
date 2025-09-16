import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Configure for Replit production environment
  output: "standalone",
  // Minimal experimental config
  images: {
    domains: ["images.unsplash.com"],
  },
  // i18n: {
  //   locales: [ 'en', 'fr'],
  //   defaultLocale: 'fr',
  // },
  // trailingSlash: false,
};

export default withNextIntl(nextConfig);
