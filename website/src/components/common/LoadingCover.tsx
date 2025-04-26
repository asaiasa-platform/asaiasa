"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export default function LoadingCover() {
  const t = useTranslations("Common.general");
  
  useEffect(() => {
    // Disable scrolling when the component is mounted
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scrolling when the component is unmounted
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 flex flex-col gap-5 items-center justify-center bg-black bg-opacity-70 z-50">
      <span className="global-loader"></span>
      <span className="sr-only">{t("loading")}</span>
    </div>,
    document.body
  );
}
