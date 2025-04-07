import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/routing";
import { FilePlus } from "lucide-react";
import React from "react";
import { IoChevronDown } from "react-icons/io5";
import { LuBuilding } from "react-icons/lu";

interface OrgSwitcherProps {
  orgName: string;
  orgPic: string;
  isLoading: boolean;
  state: "collapsed" | "expanded";
}

export default function OrgSwitcher({
  orgName,
  orgPic,
  state,
  isLoading,
}: Readonly<OrgSwitcherProps>) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="shrink-0 flex aspect-square size-9 items-center justify-center rounded-lg bg-white text-white overflow-hidden">
                {isLoading ? (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                ) : (
                  <Avatar className="rounded-none border-none">
                    <AvatarImage
                      src={orgPic}
                      alt={orgName}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-none border-none">
                      {orgName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                {isLoading ? (
                  <div className="h-4 w-32 animate-pulse bg-gray-200 rounded-sm" />
                ) : (
                  <span className="font-semibold line-clamp-1">{orgName}</span>
                )}
              </div>
              <IoChevronDown className="ml-auto h-4 w-4 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`${
              state === "collapsed"
                ? "w-fit"
                : "w-[--radix-dropdown-menu-trigger-width]"
            }`}
            align="start"
          >
            <Link href="/my-organizations">
              <DropdownMenuItem className="hover:cursor-pointer">
                <LuBuilding className="mr-2 h-4 w-4" />
                <span>Switch Organization</span>
              </DropdownMenuItem>
            </Link>

            <Link href="/org-register">
              <DropdownMenuItem className="hover:cursor-pointer">
                <FilePlus className="mr-2 h-4 w-4" />
                <span>Create Organization</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
