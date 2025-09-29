import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // Minimal experimental config
  images: {
    domains: ["images.unsplash.com", "a0.muscache.com", "files.edgestore.dev"],
  },
  // i18n: {
  //   locales: [ 'en', 'fr'],
  //   defaultLocale: 'fr',
  // },
  // trailingSlash: false,
};

export default withNextIntl(nextConfig);
