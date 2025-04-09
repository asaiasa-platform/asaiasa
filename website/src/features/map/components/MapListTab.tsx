"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const availableTabs = ["org", "event"];

export default function MapListTab() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialTab = availableTabs.includes(searchParams.get("tab") || "")
    ? searchParams.get("tab")
    : "org";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    // Redirect to default tab if it is not in available tabs
    if (!availableTabs.includes(searchParams.get("tab") || "")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("tab", "org");
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [searchParams, pathname, router]);

  const handleTabChange = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);

    setActiveTab(tab);
    router.push(`${pathname}?${newParams.toString()}`);
  };
  return (
    <div className="flex justify-around items-center w-full rounded-md overflow-hidden bg-gray-100 p-1">
      <button
        className={`w-full text-center py-1 px-2 cursor-pointer rounded-sm bg-orange-400 transition-all duration-150 ${
          activeTab === "org"
            ? "bg-opacity-100 text-black"
            : "bg-opacity-0 text-gray-inactive"
        }`}
        onClick={() => handleTabChange("org")}
      >
        องค์กร
      </button>
      <button
        className={`w-full text-center py-1 px-2 cursor-pointer rounded-sm bg-orange-400 transition-all duration-150 ${
          activeTab === "event"
            ? "bg-opacity-100 text-black"
            : "bg-opacity-0 text-gray-inactive"
        }`}
        onClick={() => handleTabChange("event")}
      >
        อีเว้นท์
      </button>
    </div>
  );
}
