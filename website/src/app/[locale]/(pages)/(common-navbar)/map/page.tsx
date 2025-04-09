"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Coordinate, OrganizationMap, Event } from "@/lib/types";
import MapComponent from "@/features/map/components/Map";
import MapSidebarContent from "@/features/map/components/MapSidebarContent";
import MapMobileDrawer from "@/features/map/components/MapMobileDrawer";
import { cn } from "@/lib/utils";
import { ChevronLeft, Locate } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getAllEventsLocation,
  getAllOrgsLocation,
} from "@/features/map/api/action";

export default function MapPage({
  // params,
  searchParams,
}: Readonly<{
  params: { page: string; locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const [organizations, setOrganizations] = useState<OrganizationMap[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const currentTab = searchParams.tab?.toString() ?? "org";
  const search = searchParams.search?.toString() ?? "";
  const [selectedItem, setSelectedItem] = useState<
    OrganizationMap | Event | null
  >(null);
  const [flyToTrigger, setFlyToTrigger] = useState(0); // Add a trigger value to force map to fly even when selecting the same org
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinate>();
  const [flyToUserTrigger, setFlyToUserTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsLoading(true);
      const orgs: OrganizationMap[] = await getAllOrgsLocation();
      // filter out orgs that have no lat long it lat lon = 0
      const filteredOrgs = orgs.filter(
        (org) =>
          org.latitude !== null &&
          org.longitude !== null &&
          org.latitude !== 0 &&
          org.longitude !== 0
      );
      setOrganizations(filteredOrgs);

      const events: Event[] = await getAllEventsLocation();
      // filter out events that have no lat long it lat lon = 0
      const filteredEvents = events.filter(
        (event) =>
          event.latitude !== null &&
          event.longitude !== null &&
          event.latitude !== 0 &&
          event.longitude !== 0
      );
      setEvents(filteredEvents);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const data: OrganizationMap[] | Event[] =
    currentTab === "org" ? organizations : events;

  const handleCardClick = useCallback((item: OrganizationMap | Event) => {
    setSelectedItem(item);
    setIsDrawerOpen(false); // Close the drawer
    setFlyToTrigger((prev) => prev + 1);
  }, []);

  const handleFocusUser = () => {
    if (userLocation) {
      setFlyToUserTrigger((prev) => prev + 1);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Handle successful location retrieval
          // console.log(latitude, longitude);
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          // Handle location error
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <TooltipProvider>
      <div className="relative mx-auto overflow-hidden">
        <div
          className={cn(
            "absolute z-10 pt-[90px] top-0 h-full w-[43%] lg:w-[50%] max-w-[420px] bg-white shadow-lg pb-[65px] pl-[15px] lg:pl-[30px] pr-[15px] hidden md:block transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <MapSidebarContent
            isLoading={isLoading}
            data={data}
            selectedItem={selectedItem}
            handleCardClick={handleCardClick}
            defaultValue={search}
            currentTab={currentTab}
          />
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="absolute top-[50%] -right-6 bg-white rounded-r-md py-3 drop-shadow-md z-10"
              >
                <ChevronLeft
                  className={cn(
                    "w-6 h-6",
                    isSidebarOpen ? "rotate-0" : "rotate-180"
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white" side="right">
              <p>{isSidebarOpen ? "ปิดเมนู" : "เปิดเมนู"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* list of organizations (for mobile) */}
        <div
          className="fixed z-10 bottom-5 left-1/2 md:hidden transform -translate-x-1/2 flex 
           justify-center items-center gap-4"
        >
          <MapMobileDrawer
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            data={data}
            selectedItem={selectedItem}
            handleCardClick={handleCardClick}
            currentTab={currentTab}
          />
          {/* <MapMobileFilterSheet /> */}
        </div>

        <MapComponent
          data={data}
          flyToTrigger={flyToTrigger}
          selectedItem={selectedItem}
          handleCardClick={handleCardClick}
          userLocation={userLocation}
          flyToUserTrigger={flyToUserTrigger}
          currentTab={currentTab}
          isLoading={isLoading}
        />
        <div className="fixed z-10 bottom-3 right-1 flex justify-center items-center gap-4">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleFocusUser}
                className="absolute flex justify-center items-center bottom-12 md:bottom-8 right-2 md:right-4 rounded-full drop-shadow-lg shadow-md
              w-[40px] h-[40px] bg-orange-normal hover:bg-orange-dark transition-all duration-150"
              >
                <Locate className="w-[20px] h-[20px] text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white" side="left">
              <p>ไปที่ตําแหน่งปัจจุบัน</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
