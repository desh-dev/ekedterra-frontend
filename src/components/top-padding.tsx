"use client";

import useIsDesktop from "@/hooks/useIsDesktop";
import React from "react";

const TopPadding = ({ children }: { children: React.ReactNode }) => {
  const { isStandalone, isIOS } = useIsDesktop();
  return (
    <div>
      {isStandalone && isIOS && (
        <div className="mt-26 border-b border-gray-200"></div>
      )}
      {children}
    </div>
  );
};

export default TopPadding;
