"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import useIsDesktop from "@/hooks/useIsDesktop";

const InstallPrompt = () => {
  const { isIOS, isStandalone, isIframe } = useIsDesktop();

  useEffect(() => {
    if (!isStandalone && !isIframe) {
      const message = isIOS
        ? 'Tap the share button and then "Add to Home Screen" to install the app'
        : "Install this web app on your device for a better experience";

      toast(message, {
        duration: 10000,
        position: "bottom-center",
        icon: "📱",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  }, [isIOS, isStandalone, isIframe]);

  if (isStandalone || isIframe) {
    return null;
  }

  return (
    <div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default InstallPrompt;
