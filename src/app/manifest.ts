import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    icons: [
      {
        src: "icons/icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "icons/icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "icons/icon512_rounded.png",
        type: "image/png",
      },
      {
        src: "icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "en-US",
    name: "Ekedterra",
    short_name: "Ekedterra",
    theme_color: "#C52C4B",
    background_color: "#FFFFFF",
    screenshots: [
      {
        src: "screenshots/mobile/home-1.png",
        sizes: "379x825",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "screenshots/desktop/home-1.png",
        sizes: "1245x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    start_url: "/",
    scope: "/",
    description: "Simplify your search for real estate",
    id: "/",
  };
}
