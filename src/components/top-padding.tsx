"use client";

import useIsDesktop from "@/hooks/useIsDesktop";
import React from "react";

const TopPadding = ({ children }: { children: React.ReactNode }) => {
  const { isStandalone, isIOS } = useIsDesktop();
  return (
    <div
      className={`${
        isStandalone && isIOS ? "h-26 mt-26 border-b border-gray-200" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default TopPadding;
