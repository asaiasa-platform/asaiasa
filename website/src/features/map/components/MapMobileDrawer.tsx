import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { OrganizationMap, Event } from "@/lib/types";
import MapSearchBar from "./MapSearchBar";
import OrgCardList from "./OrgCardList";
import EventCardList from "./EventCardList";
import MapListTab from "./MapListTab";

interface MapMobileDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: OrganizationMap[] | Event[];
  selectedItem: OrganizationMap | Event | null;
  handleCardClick: (org: OrganizationMap | Event) => void;
  currentTab: string;
}

export default function MapMobileDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  data,
  selectedItem,
  handleCardClick,
  currentTab,
}: Readonly<MapMobileDrawerProps>) {
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };
  return (
    <div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger
          className="hover:drop-shadow-md hover:-translate-y-1
      bg-white text-black rounded-full py-2 px-4 shadow-md transition-all duration-150
      flex items-center justify-center"
        >
          <span className="text-sm font-medium">{`รายการทั้งหมด (${data.length})`}</span>
        </DrawerTrigger>
        <DrawerContent className="p-4 bg-white md:hidden">
          <DrawerHeader>
            <DrawerTitle>{`รายการทั้งหมด (${data.length})`}</DrawerTitle>
          </DrawerHeader>
          <div className="mb-4">
            <MapListTab />
          </div>
          <div className="mb-4">
            <MapSearchBar defaultValue="" />
          </div>
          <div
            className="h-[50vh] overflow-y-auto"
            onPointerDown={handlePointerDown}
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
          <DrawerFooter className="mt-4">
            <DrawerClose>
              <Button variant="outline" className="w-full">
                ปิด
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
