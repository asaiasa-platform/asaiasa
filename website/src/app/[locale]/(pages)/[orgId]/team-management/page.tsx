import { TeamManagement } from "@/features/team-manage/components/team-management";
import React from "react";

export default function TeamManagementPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-6">Team Member Management</h1>
      <TeamManagement orgId={params.orgId} />
    </div>
  );
}
