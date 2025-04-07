"use client";

import { AppSidebarAdmin } from "@/components/layout/sidebar/app-sidebar-admin";
import { DynamicBreadcrumb } from "@/components/layout/sidebar/DynamicBreadCrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";

export default function AdminConsoleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { orgId: string };
}>) {
  const [open, setOpen] = useState(true);
  return (
    <div className="h-screen flex">
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <AppSidebarAdmin orgId={params.orgId} />
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
