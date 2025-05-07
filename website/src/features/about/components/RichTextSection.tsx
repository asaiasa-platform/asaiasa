"use client";

import { RichTextSection as RichTextSectionType } from "../types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  data: RichTextSectionType;
  className?: string;
}

export default function RichTextSection({ data, className }: Props) {
  const t = useTranslations("About.sections");
  const { section_type, content } = data;

  const sectionTitle = t(section_type.charAt(0).toLowerCase() + section_type.slice(1));

  return (
    <div className={cn("py-12", className)}>
      <h2 className="text-3xl font-bold mb-6">{sectionTitle}</h2>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
}