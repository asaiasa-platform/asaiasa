"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEventsByOrgId } from "@/features/event-manage/api/action";
import EventDisplay from "@/features/event-manage/components/event-display";
import EventList from "@/features/event-manage/components/event-list";
import { getOrgById } from "@/features/organization/api/action";
import type { Organization } from "@/features/team-manage/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/routing";
import type { Event } from "@/lib/types";
import { isBefore } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";

export default function EventManagementPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  const defaultLayout = [35, 65];
  const isMobile = useIsMobile();
  const [org, setOrg] = useState<Organization>();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const searchParams = useSearchParams();
  const currentId = searchParams.get("id");
  const orgId = params.orgId;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of events to show per page

  useEffect(() => {
    const fetchOrgById = async () => {
      const res = await getOrgById(orgId);
      if (res.success) {
        setOrg(res.data);
      }
    };
    fetchOrgById();
  }, [orgId]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const result = await getAllEventsByOrgId(orgId);
        if (!result.success) {
          throw new Error(result.error.message);
        }

        const events: Event[] = result.data;
        
        // sort events by updatedAt
        events.sort(
          (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
        );

        console.log(events);
        setEvents(events);
        setFilteredEvents(events);
      } catch (error) {
        console.error("Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [orgId]);

  useEffect(() => {
    const filtered = events.filter((event) => {
      return event.name.toLowerCase().includes(searchTerms.toLowerCase());
    });
    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when search terms change
  }, [searchTerms, events]);

  // Calculate pagination
  const getPaginatedEvents = (events: Event[], tabValue: string) => {
    let filteredByTab = events;

    // Filter by tab
    if (tabValue === "past") {
      filteredByTab =
        events.filter((e) => isBefore(new Date(e.endDate), new Date())) ?? [];
    } else if (tabValue === "published") {
      filteredByTab = events.filter((e) => e.status === "published") ?? [];
    } else if (tabValue === "draft") {
      filteredByTab = events.filter((e) => e.status === "draft") ?? [];
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredByTab.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEvents = filteredByTab.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      events: paginatedEvents,
      totalPages,
      totalItems: filteredByTab.length,
    };
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const [activeTab, setActiveTab] = useState("all");
  const { totalPages } = getPaginatedEvents(filteredEvents, activeTab);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        className="min-w-[350px]"
        defaultSize={defaultLayout[0]}
        minSize={25}
      >
        <div className="flex flex-col h-full">
          <Tabs
            defaultValue="all"
            className="flex flex-col h-full"
            onValueChange={(value) => {
              setActiveTab(value);
              setCurrentPage(1); // Reset to first page when changing tabs
            }}
          >
            <div className="flex flex-col justify-start items-start gap-2 pt-4 mb-2 px-2">
              <div className="flex justify-between items-center gap-2 w-full">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Name"
                    className="pl-8"
                    onChange={(e) => setSearchTerms(e.target.value)}
                  />
                </div>
                <Link href={`event-management/add`}>
                  <Button>
                    <BiEdit />
                    Create
                  </Button>
                </Link>
              </div>

              <div className="flex justify-between items-center w-full">
                <div className="flex items-center w-fit">
                  <TabsList className="flex-1">
                    <TabsTrigger
                      value="all"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="published"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Live
                    </TabsTrigger>
                    <TabsTrigger
                      value="draft"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Draft
                    </TabsTrigger>
                    <TabsTrigger
                      value="past"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Past
                    </TabsTrigger>
                  </TabsList>
                </div>
                {/* Pagination Controls */}
                <div className="flex items-center ml-2 gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs mx-1">
                    {currentPage}/{Math.max(1, totalPages)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              <TabsContent value="all" className="m-0 h-full">
                <EventList
                  events={getPaginatedEvents(filteredEvents, "all").events}
                  isLoading={isLoading}
                  currentId={currentId}
                  isMobile={isMobile}
                />
              </TabsContent>
              <TabsContent value="published" className="m-0 h-full">
                <EventList
                  events={
                    getPaginatedEvents(filteredEvents, "published").events
                  }
                  isLoading={isLoading}
                  currentId={currentId}
                  isMobile={isMobile}
                />
              </TabsContent>
              <TabsContent value="draft" className="m-0 h-full">
                <EventList
                  events={getPaginatedEvents(filteredEvents, "draft").events}
                  isLoading={isLoading}
                  currentId={currentId}
                  isMobile={isMobile}
                />
              </TabsContent>
              <TabsContent value="past" className="m-0 h-full">
                <EventList
                  events={getPaginatedEvents(filteredEvents, "past").events}
                  isLoading={isLoading}
                  currentId={currentId}
                  isMobile={isMobile}
                />
              </TabsContent>
            </div>
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
          <EventDisplay
            event={events.find((e) => e.id === Number(currentId))}
            org={org}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
