"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function usePreviousPath() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = pathname;
    return () => {
      prevPath.current = currentPath;
    };
  }, [pathname]);

  return prevPath.current;
}
