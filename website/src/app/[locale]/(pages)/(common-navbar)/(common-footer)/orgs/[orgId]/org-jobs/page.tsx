"use client";

import JobCard from "@/components/common/JobCard";
import Spinner from "@/components/ui/spinner";
import { getAllOrgsJobs } from "@/features/orgs/api/action";
import { JobCardProps } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouteProtection } from "@/hooks/useRouteProtection";

// Note: For CSR with static export, dynamic routes will be handled client-side

export default function OrgJobsPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  const pathname = usePathname();
  useRouteProtection(pathname);
  
  const [jobs, setJobs] = useState<JobCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Organizations.orgDetail");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsData: JobCardProps[] = await getAllOrgsJobs(params.orgId);
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [params.orgId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <JobCard
              id={job.id}
              key={job.id}
              title={job.title}
              description={job.description}
              workType={job.workType}
              workplace={job.workplace}
              careerStage={job.careerStage}
              province={job.province}
              country={job.country}
              salary={job.salary}
              organization={job.organization}
              categories={job.categories}
              updatedAt={job.updatedAt}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-[100px] mb-[150px] text-center">
          <p className="text-2xl font-medium text-gray-600 mb-2">
            {t("noJobs")}
          </p>
          <p className="text-gray-500">
            {t("noJobsMessage")}
          </p>
        </div>
      )}
    </>
  );
}
