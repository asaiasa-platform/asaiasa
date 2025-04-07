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
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function NavUser() {
  const { isMobile } = useSidebar();
  const { userProfile, removeAuthState, loading } = useAuth();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {loading ? (
                <>
                  <div className="h-8 w-8 rounded-full animate-pulse bg-gray-200" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="h-3 w-32 animate-pulse bg-gray-200"></div>
                    <div className="h-2.5 w-24 animate-pulse bg-gray-200 mt-1"></div>
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={userProfile?.picUrl}
                      alt={userProfile?.firstName}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userProfile?.firstName[0] +
                        "" +
                        userProfile?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userProfile?.firstName + " " + userProfile?.lastName}
                    </span>
                    <span className="truncate text-xs">
                      {userProfile?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            className={`w-[--radix-popper-anchor-width] mb-2`}
          >
            <DropdownMenuItem>
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Setting</span>
            </DropdownMenuItem>
            <button onClick={removeAuthState} className="w-full">
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
