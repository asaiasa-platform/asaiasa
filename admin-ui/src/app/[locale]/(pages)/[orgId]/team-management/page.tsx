import { TeamManagement } from "@/features/team-manage/components/team-management";
import React from "react";
import { useTranslations } from "next-intl";

export default function TeamManagementPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  const t = useTranslations("TeamManagement");
  
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <TeamManagement orgId={params.orgId} />
    </div>
  );
}
