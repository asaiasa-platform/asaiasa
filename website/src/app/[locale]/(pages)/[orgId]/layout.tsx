"use client";

import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { DynamicBreadcrumb } from "@/components/layout/sidebar/DynamicBreadCrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getOrgById } from "@/features/organization/api/action";
import { Organization } from "@/features/team-manage/lib/types";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function AdminConsoleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { orgId: string };
}>) {
  const [open, setOpen] = useState(true);
  const [org, setOrg] = useState<Organization>();
  const [isLoading, setIsLoading] = useState(false);
  const orgId = params.orgId;

  useEffect(() => {
    const fetchOrgById = async () => {
      setIsLoading(true);
      const res = await getOrgById(orgId);

      if (res.success) {
        setOrg(res.data);
      } else {
        toast({
          title: "Forbidden",
          description: res.error,
        });
        window.location.href = "/";
      }

      setIsLoading(false);
    };
    fetchOrgById();
  }, [orgId]);
  return (
    <div className="h-screen flex">
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <AppSidebar
          orgId={orgId}
          orgName={org?.name ?? "..."}
          orgPic={org?.picUrl ?? ""}
          isLoading={isLoading}
        />
        <SidebarInset className="flex-1 min-w-0 p-2 bg-sidebar overflow-y-hidden">
          <div className="relative flex flex-col h-full rounded-xl bg-white drop-shadow-sm p-2 border">
            <div className="flex items-center justify-start border-b pb-1">
              <SidebarTrigger />
              <Separator orientation="vertical" className="ml-2 mr-4 h-6" />
              <DynamicBreadcrumb />
            </div>
            <section className="flex-1 min-h-0">
              <div className="w-full break-words h-full">{children}</div>
            </section>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
