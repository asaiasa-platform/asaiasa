"use client";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function NavMain({
  label,
  items,
  orgId,
}: Readonly<{
  orgId: string;
  label: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}>) {
  const path = usePathname();
  const renderMenuItem = (item: (typeof items)[0]) => {
    // Single menu item without submenu
    if (!item.items?.length) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            className="h-12"
            size="lg"
          >
            <Link
              href={`/${orgId}/${item.url}`}
              className={cn(
                "flex items-center justify-start group-data-[collapsible=icon]:justify-center",
                " w-full h-[42px] border-transparent",
                "hover:shadow-sm hover:bg-white border-2",
                path.includes(item.url) && "bg-white border-gray-stroke"
              )}
            >
              {item.icon && <item.icon className="size-6 shrink-0" />}
              <span className="group-data-[collapsible=icon]:hidden">
                {item.title}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    // Collapsible menu item with submenu
    return (
      <Collapsible key={item.title} asChild className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className="flex items-center justify-start h-[42px] hover:bg-white border-2 border-transparent 
              hover:border-gray-stroke hover:shadow-sm"
            >
              {item.icon && <item.icon />}
              <span className="group-data-[collapsible=icon]:hidden">
                {item.title}
              </span>
              <ChevronRight
                className="ml-auto transition-transform duration-200 
              group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title} className="h-9">
                  <SidebarMenuSubButton className="h-full" asChild>
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>{items.map(renderMenuItem)}</SidebarMenu>
    </SidebarGroup>
  );
}
