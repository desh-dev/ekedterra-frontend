"use client";

import useIsDesktop from "@/hooks/useIsDesktop";
import React from "react";

const TopPadding = () => {
  const { isStandalone, isIOS } = useIsDesktop();
  return (
    <div>
      {isStandalone && isIOS && <div className="safe-padding-top"></div>}
    </div>
  );
};

export default TopPadding;
