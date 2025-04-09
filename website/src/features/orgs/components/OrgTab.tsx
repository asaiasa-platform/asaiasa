"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, usePathname } from "@/i18n/routing";

export default function OrgTab() {
  const pathname = usePathname();

  // Map URL paths to tab values
  const getTabValueFromPath = () => {
    if (pathname.includes("org-detail")) return "org-detail";
    if (pathname.includes("org-jobs")) return "org-jobs";
    if (pathname.includes("org-events")) return "org-events";
    return "org-detail"; // Default tab
  };

  return (
    <Tabs defaultValue={getTabValueFromPath()} className="w-full">
      <TabsList
        className="flex justify-center sm:justify-start px-0 w-full border-b 
    border-border h-12 bg-transparent space-x-8 rounded-none"
      >
        <Link href="org-detail">
          <TabsTrigger value="org-detail" className={tabStyle}>
            เกี่ยวกับองค์กร
          </TabsTrigger>
        </Link>
        <Link href="org-jobs">
          <TabsTrigger value="org-jobs" className={tabStyle}>
            รับสมัครงาน
          </TabsTrigger>
        </Link>
        <Link href="org-events">
          <TabsTrigger value="org-events" className={tabStyle}>
            อีเว้นท์
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}

const tabStyle = `text-sm sm:text-base font-normal text-black  data-[state=active]:shadow-none relative h-12 bg-transparent px-0
          after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:border-b-[3px] after:border-orange-dark after:content-[''] 
          after:opacity-0 after:transition-opacity data-[state=active]:text-orange-dark data-[state=active]:after:opacity-100`;
