"use client";

import { TeamSection as TeamSectionType } from "../types";
import { cn } from "@/lib/utils";
import TeamMemberCard from "@/features/about/components/TeamMemberCard";
import { useTranslations } from "next-intl";

interface Props {
  data: TeamSectionType;
  className?: string;
}

export default function TeamSection({ data, className }: Props) {
  const t = useTranslations("About");
  const { title, description, team_members } = data;

  return (
    <div className={cn("py-12", className)}>
      <h2 className="text-3xl font-bold mb-4">{title || t("team")}</h2>
      {description && <p className="text-lg mb-8">{description}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team_members && team_members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
} 