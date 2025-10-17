"use client";

import useIsDesktop from "@/hooks/useIsDesktop";
import React from "react";

const TopPadding = () => {
  const { isStandalone, isIOS } = useIsDesktop();
  return <div>{isStandalone && isIOS && <div className="pt-18"></div>}</div>;
};

export default TopPadding;
