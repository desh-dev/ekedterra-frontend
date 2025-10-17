import { useEffect, useState } from "react";
import Cookies from "js-cookie";
interface UseIsDesktop {
  isDesktop: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  isIframe: boolean;
}

export default function useIsDesktop(): UseIsDesktop {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isIOS, setIsIOS] = useState(true);
  const [isStandalone, setIsStandalone] = useState(true);
  const [isIframe, setIsIframe] = useState(true);

  useEffect(() => {
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandaloneApp = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    setIsIframe(window.self !== window.top);
    if (isStandaloneApp) {
      Cookies.set("isStandalone", "true");
    }
    setIsIOS(isIOSDevice);
    setIsStandalone(isStandaloneApp);
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);
  return {
    isDesktop,
    isIOS,
    isStandalone,
    isIframe,
  };
}
