"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDisplay from "@/features/event-manage/components/event-display";
import EventList from "@/features/event-manage/components/event-list";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/routing";
import { Event } from "@/lib/types";
import { formatExternalUrl } from "@/lib/utils";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";

export default function FullEventsManagementPage() {
  const defaultLayout = [35, 65];
  const isMobile = useIsMobile();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const currentId = searchParams.get("id");
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const apiUrl = formatExternalUrl("/events");
        const response = await fetch(apiUrl, {});
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const job = await response.json();
        console.log(job);
        setEvents(job);
      } catch (error) {
        console.error("Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // set current id to first items in array
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (events.length > 0 && currentId === null) {
      params.set("id", events[0].id.toString());
      window.history.replaceState(null, "", `?${params.toString()}`); //Updates the browser history without reloading
    }
  }, [events, searchParams, currentId]);
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        className="min-w-[250px]"
        defaultSize={defaultLayout[0]}
        minSize={25}
      >
        <div className="h-full overflow-y-auto px-2">
          <Tabs defaultValue="all">
            <div className="flex flex-col justify-start items-start gap-2 pt-4 mb-2">
              <div className="flex justify-between items-center gap-2 w-full">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8 " />
                </div>
                <Link href={`/all-events/add`}>
                  <Button>
                    <BiEdit />
                    Create
                  </Button>
                </Link>
              </div>

              <TabsList>
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="live"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Live
                </TabsTrigger>
                <TabsTrigger
                  value="unpublished"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Draft
                </TabsTrigger>
                <TabsTrigger
                  value="Past"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Past
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="m-0">
              <EventList
                events={events}
                isLoading={isLoading}
                currentId={currentId}
                isMobile={isMobile}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <EventList
                events={events}
                isLoading={isLoading}
                currentId={currentId}
                isMobile={isMobile}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className={isMobile ? "hidden" : ""} />
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        minSize={30}
        className={isMobile ? "hidden" : ""}
      >
        <div className="h-full overflow-y-auto p-2">
          <EventDisplay org={undefined} event={undefined} forAdmin />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
