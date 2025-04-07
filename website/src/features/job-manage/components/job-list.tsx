"use client";

import { Link } from "@/i18n/routing";
import { cn, formatRelativeTime } from "@/lib/utils";
import React from "react";
import {
  Briefcase,
  Calendar,
  // Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import { useLocale } from "next-intl";
import Spinner from "@/components/ui/spinner";
import { JobProps } from "@/lib/types";

interface JobListProps {
  jobs: JobProps[];
  isMobile: boolean;
  currentId?: string | null;
  isLoading?: boolean;
}

export default function JobList({
  jobs,
  isMobile,
  currentId,
  isLoading,
}: Readonly<JobListProps>) {
  const locale = useLocale();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center mt-[200px] w-full">
        <Spinner />
        <span className="text-center">Loading...</span>
      </div>
    );
  }

  if (jobs === undefined || jobs.length === 0) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center mt-[200px] w-full">
        <span className="text-center">No jobs found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <div key={job.id}>
          <Link
            href={isMobile ? `job-management/edit/${job.id}` : `?id=${job.id}`}
            className={cn(
              "block border rounded-md p-4 hover:bg-slate-50 transition-colors",
              currentId === `${job.id}` && "bg-gray-200 hover:bg-gray-200"
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                {job.updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    {"แก้ไขล่าสุด " + formatRelativeTime(job.updatedAt, locale)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {job.description}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Briefcase className="shrink-0 w-4 h-4" />
                  <p>
                    {job.workType} - {job.careerStage}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <MapPin className="shrink-0 w-4 h-4 " />
                  <p>{job.workplace || "ไม่ระบุ"}</p>
                </div>
                {/* <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="shrink-0 w-4 h-4" />
                  <p>{job.hoursPerDay} hours/day</p>
                </div> */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Calendar className="shrink-0 w-4 h-4" />
                  <p>{job.period}</p>
                </div>
                {(job.salary > 0 && job.workType !== "volunteer") && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <DollarSign className="shrink-0 w-4 h-4" />
                    <p>
                      {job.salary
                        ? `$${job.salary.toLocaleString()}/year`
                        : "Not specified"}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Users className="shrink-0 w-4 h-4" />
                  <p>
                    {job.quantity} position{job.quantity > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {job.categories && job.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.categories.map((sector, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                    >
                      {sector.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
