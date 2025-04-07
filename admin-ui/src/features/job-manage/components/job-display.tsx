"use client";

import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  // Clock,
  DollarSign,
  Briefcase,
  Users,
  BookOpen,
} from "lucide-react";
import { MdOutlineEdit } from "react-icons/md";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { JobProps } from "@/lib/types";

interface JobDisplayProps {
  job: JobProps | undefined;
  forAdmin?: boolean;
  currentId?: string | null;
}

export default function JobDisplay({
  job,
  forAdmin,
}: Readonly<JobDisplayProps>) {
  const locale = useLocale();
  if (!job) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center h-full w-full">
        <span className="text-center">Choose a job</span>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto bg-white min-w-[750px]">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur flex justify-between items-center px-4 pb-2">
        <p className="text-xl font-medium text-center mt-2 p-2 border-l-4 border-orange-500">
          Job Details
        </p>
        <Link
          href={`${forAdmin ? "all-jobs" : "job-management"}/edit/${job.id}`}
        >
          <Button variant="outline" className="border-primary drop-shadow-md">
            <MdOutlineEdit className="mr-2" />
            Manage Job
          </Button>
        </Link>
      </div>

      <div className="p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-4">{job.title}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">
                {job.workType} - {job.careerStage}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">
                {job.workplace || "Not specified"}
              </span>
            </div>
            {/* <div className="flex items-center gap-3">
              <Clock className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">
                {job.hoursPerDay} hours/day
              </span>
            </div> */}
            <div className="flex items-center gap-3">
              <Calendar className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">{job.period}</span>
            </div>
            {job.salary > 0 && job.workType !== "volunteer" && (
              <div className="flex items-center gap-3">
                <DollarSign className="text-primary shrink-0" />
                <span className="text-sm text-gray-700">
                  {job.salary
                    ? `$${job.salary.toLocaleString()}/year`
                    : "Not specified"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Users className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">
                {job.quantity} position{job.quantity > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          {job.categories && job.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {job.categories.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {item.label}
                </span>
              ))}
            </div>
          )}

          <Button
            onClick={() => {
              window.open(job.registerLink, "_blank");
            }}
            className="w-full bg-orange-500 hover:bg-orange-500/80"
          >
            Apply for this position
          </Button>
        </div>

        {/* Description Sections */}
        <div className="space-y-6 border-t pt-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Job Scope</h2>
            <p className="text-gray-700">{job.scope}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Qualifications</h2>
            <p className="text-gray-700">{job.qualifications}</p>
          </div>

          {/* <div>
            <h2 className="text-xl font-semibold mb-2">Benefits</h2>
            <p className="text-gray-700">{job.benefits}</p>
          </div> */}

          {job.prerequisite && job.prerequisite.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Prerequisite Courses
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {job.prerequisite.map((course, index) => (
                  <Link href={course.link} key={index} className="bg-white">
                    <div className="h-full flex flex-col justify-between border rounded-lg p-4 hover:shadow-md">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="text-primary shrink-0" />
                        <p className="text-lg font-medium line-clamp-1">
                          {course.title}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {course.link}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {job.updatedAt && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Last Updated</h2>
              <p className="text-gray-700">
                {formatRelativeTime(job.updatedAt, locale)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
