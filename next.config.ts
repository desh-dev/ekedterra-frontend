import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // Minimal experimental config
  images: {
    domains: [
      "images.unsplash.com",
      "a0.muscache.com",
      "files.edgestore.dev",
      "www.facebook.com",
      "m.media-amazon.com",
    ],
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline", // fallback for pages
    // image: '/offline-image.png', // optional fallback for images
    // audio: '/offline-audio.mp3', // optional fallback for audio
    // video: '/offline-video.mp4', // optional fallback for video
  },
});

export default withPWA(withNextIntl(nextConfig));
