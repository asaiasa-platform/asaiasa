import React from "react";
import { getTranslations } from "next-intl/server";

export default async function TermOfServicePage() {
  const t = await getTranslations("ToS");
  
  return (
    <div className="font-prompt max-w-[1170px] mx-auto px-6 min-h-[80vh] mt-[65px]">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      
      {/* You can add more TOS content with translations here */}
    </div>
  );
}
