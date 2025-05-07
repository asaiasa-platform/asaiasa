"use client";

import { WhatWeDoSection as WhatWeDoSectionType } from "../types";
import { cn } from "@/lib/utils";
import { Building, Users, Handshake } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  data: WhatWeDoSectionType;
  className?: string;
}

export default function WhatWeDoSection({ data, className }: Props) {
  const t = useTranslations("About.audiences");
  const { audience_type, description } = data;
  
  const audienceTitle = t(audience_type.toLowerCase());

  return (
    <div className={cn("py-8", className)}>
      <div className="flex items-center gap-4 mb-4">
        {getAudienceIcon(audience_type)}
        <h3 className="text-2xl font-semibold">{audienceTitle}</h3>
      </div>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: description }} 
      />
    </div>
  );
}

function getAudienceIcon(type: WhatWeDoSectionType["audience_type"]) {
  const iconProps = { className: "h-8 w-8 text-primary" };
  
  switch (type) {
    case "Volunteers":
      return <Users {...iconProps} />;
    case "Organizations":
      return <Building {...iconProps} />;
    case "Partners":
      return <Handshake {...iconProps} />;
    default:
      return null;
  }
} 