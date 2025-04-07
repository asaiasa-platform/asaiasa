"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllJobsByOrgId } from "@/features/job-manage/api/action";
import JobDisplay from "@/features/job-manage/components/job-display";
import JobList from "@/features/job-manage/components/job-list";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/routing";
import { JobProps } from "@/lib/types";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";

export default function JobManagementPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  const defaultLayout = [35, 65];
  const isMobile = useIsMobile();
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const searchParams = useSearchParams();
  const currentId = searchParams.get("id");
  const orgId = params.orgId;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of events to show per page

  const getPaginatedJobs = (jobs: JobProps[], tabValue: string) => {
    let filteredByTab = jobs;

    // Filter by tab
    if (tabValue === "published") {
      filteredByTab = jobs.filter((e) => e.status === "published") ?? [];
    } else if (tabValue === "draft") {
      filteredByTab = jobs.filter((e) => e.status === "draft") ?? [];
    }

    // console.log("filteredByTab: " + filteredByTab);

    // Calculate pagination
    const totalPages = Math.ceil(filteredByTab.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedJobs = filteredByTab.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      jobs: paginatedJobs,
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
  const { totalPages } = getPaginatedJobs(filteredJobs, activeTab);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const result = await getAllJobsByOrgId(orgId);
        if (!result.success) {
          throw new Error(result.error.message);
        }

        const jobs: JobProps[] = result.data;
        // sort jobs by updatedAt
        jobs.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

        // console.log(jobs);
        setJobs(jobs);
        setFilteredJobs(jobs);
      } catch (error) {
        console.error("Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [orgId]);

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      return job.title.toLowerCase().includes(searchTerms.toLowerCase());
    });
    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when search terms change
  }, [searchTerms, jobs]);

  // set current id to first items in array
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams);
  //   if (jobs.length > 0 && currentId === null) {
  //     params.set("id", jobs[0].id.toString());
  //     window.history.replaceState(null, "", `?${params.toString()}`); //Updates the browser history without reloading
  //   }
  // }, [jobs, searchParams, currentId]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        className="min-w-[350px]"
        defaultSize={defaultLayout[0]}
        minSize={25}
      >
        <div className="h-full overflow-y-auto px-2">
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
                <Link href={`job-management/add`}>
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
            <TabsContent value="all" className="m-0 h-full">
              <JobList
                isLoading={isLoading}
                jobs={getPaginatedJobs(filteredJobs, "all").jobs}
                isMobile={isMobile}
                currentId={currentId}
              />
            </TabsContent>
            <TabsContent value="published" className="m-0 h-full">
              <JobList
                isLoading={isLoading}
                jobs={getPaginatedJobs(filteredJobs, "published").jobs}
                isMobile={isMobile}
                currentId={currentId}
              />
            </TabsContent>
            <TabsContent value="draft" className="m-0 h-full">
              <JobList
                isLoading={isLoading}
                jobs={getPaginatedJobs(filteredJobs, "draft").jobs}
                isMobile={isMobile}
                currentId={currentId}
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
          <JobDisplay job={jobs.find((e) => e.id === Number(currentId))} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
