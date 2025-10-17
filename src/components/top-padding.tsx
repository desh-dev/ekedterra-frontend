"use client";

import useIsDesktop from "@/hooks/useIsDesktop";
import React from "react";

const TopPadding = ({ children }: { children: React.ReactNode }) => {
  const { isStandalone, isIOS } = useIsDesktop();
  return (
    <div>
      {isStandalone && isIOS && <div className="h-20 mt-60"></div>}
      {children}
    </div>
  );
};

export default TopPadding;
