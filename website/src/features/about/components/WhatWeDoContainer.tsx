"use client";

import { WhatWeDoSection as WhatWeDoSectionType } from "../types";
import WhatWeDoSection from "./WhatWeDoSection";
import { useTranslations } from "next-intl";

interface Props {
  sections: WhatWeDoSectionType[];
}

export default function WhatWeDoContainer({ sections }: Props) {
  const t = useTranslations("About.sections");
  
  if (!sections || sections.length === 0) return null;
  
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold mb-8">{t("whatWeDo")}</h2>
      <div className="space-y-8">
        {sections.map((section) => (
          <WhatWeDoSection 
            key={section.id} 
            data={section} 
            className="bg-gray-50 rounded-lg p-6"
          />
        ))}
      </div>
    </div>
  );
} 