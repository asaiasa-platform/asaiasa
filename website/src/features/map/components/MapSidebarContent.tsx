"use client";

// import { useState } from "react";
// import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapFiltersContent } from "@/features/map/components/MapFilter";
import { OrganizationMap, Event } from "@/lib/types";
import MapSearchBar from "./MapSearchBar";
import MapListTab from "./MapListTab";
import OrgCardList from "./OrgCardList";
// import { useSearchParams } from "next/navigation";
import EventCardList from "./EventCardList";
import Spinner from "@/components/ui/spinner";

interface MapSidebarContentProps {
  data: OrganizationMap[] | Event[];
  selectedItem: OrganizationMap | Event | null;
  handleCardClick: (organization: OrganizationMap | Event) => void;
  defaultValue: string;
  currentTab: string;
  isLoading: boolean;
}

export default function MapSidebarContent({
  data,
  selectedItem,
  handleCardClick,
  defaultValue,
  currentTab,
  isLoading,
}: Readonly<MapSidebarContentProps>) {
  // const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const isFilterSidebarOpen = false;

  return (
    <>
      <div className={cn("mb-4")}>
        <MapListTab />
      </div>
      <div className="flex justify-between items-center gap-4 mb-4 h-[42px]">
        {isFilterSidebarOpen ? (
          <p className="text-xl font-semibold">ตัวกรอง</p>
        ) : (
          <MapSearchBar defaultValue={defaultValue} />
        )}
        {/* <button
          onClick={() => setIsFilterSidebarOpen((prev) => !prev)}
          className={cn(
            "shrink-0 border-gray-stroke rounded-[10px] text-gray-btngray  flex items-center justify-center",
            isFilterSidebarOpen
              ? "bg-gray-200 text-gray-600 rounded-full h-[32px] w-[32px]"
              : "bg-white border h-[42px] w-[42px] hover:drop-shadow-md"
          )}
        >
          {isFilterSidebarOpen ? (
            <X className="h-[16px] w-[16px]" />
          ) : (
            <SlidersHorizontal className="h-[18px] w-[18px]" />
          )}
        </button> */}
      </div>

      <div className="relative flex flex-col h-full">
        {/* Filter sidebar */}
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-full bg-white z-20 transform transition-transform duration-150",
            isFilterSidebarOpen ? "translate-x-0" : "-translate-x-[400px]"
          )}
        >
          <MapFiltersContent />
        </div>

        {/* list of data */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center mt-[100px]">
            <Spinner />
            Loading...
          </div>
        ) : (
          <div
            className={cn(
              "h-[85%] overflow-y-auto min-h-0 pr-2",
              "transition-all duration-150 delay-150",
              isFilterSidebarOpen
                ? "opacity-0 cursor-not-allowed"
                : "opacity-100"
            )}
          >
            {currentTab === "org" ? (
              <OrgCardList
                organizations={data as OrganizationMap[]}
                selectedOrg={selectedItem as OrganizationMap}
                handleCardClick={handleCardClick}
              />
            ) : (
              <EventCardList
                events={data as Event[]}
                selectedEvent={selectedItem as Event}
                handleCardClick={handleCardClick}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
