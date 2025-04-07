"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import NavUser from "./nav-user";
import { NavMain } from "./nav-main";
import { adminLabel, adminMenu } from "./config/admin-config";

export function AppSidebarAdmin({ orgId }: Readonly<{ orgId: string }>) {
  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" className="border-none">
        <SidebarHeader className="flex items-center gap-4 mt-2 sr-only"></SidebarHeader>
        <SidebarContent>
          <NavMain items={adminMenu} label={adminLabel} orgId={orgId} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
