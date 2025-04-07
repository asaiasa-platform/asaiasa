"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import OrgSwitcher from "./org-switcher";
import NavUser from "./nav-user";
import { NavMain } from "./nav-main";
import { mainLabel, mainMenu } from "./config/main-config";

interface AppSidebarProps {
  orgName: string;
  orgPic: string;
  isLoading: boolean;
  orgId: string;
}

export function AppSidebar({
  orgId,
  orgName,
  orgPic,
  isLoading,
}: Readonly<AppSidebarProps>) {
  const { state } = useSidebar();
  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" className="border-none">
        <SidebarHeader className="flex items-end gap-4 mt-2">
          <OrgSwitcher
            orgName={orgName}
            state={state}
            orgPic={orgPic}
            isLoading={isLoading}
          />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={mainMenu} label={mainLabel} orgId={orgId} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
