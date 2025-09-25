import { useEffect, useState } from "react";

interface UseIsDesktop {
  isDesktop: boolean;
}

export default function useIsDesktop(): UseIsDesktop {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);
  return {
    isDesktop,
  };
}
