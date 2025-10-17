"use client";

import useIsDesktop from "@/hooks/useIsDesktop";
import React from "react";

const TopPadding = ({ children }: { children: React.ReactNode }) => {
  const { isStandalone, isIOS } = useIsDesktop();
  return (
    <div>
      {isStandalone && isIOS && (
        <div className="h-26 relative top-0 pt-20 border-b border-t border-gray-200"></div>
      )}
      {children}
    </div>
  );
};

export default TopPadding;
