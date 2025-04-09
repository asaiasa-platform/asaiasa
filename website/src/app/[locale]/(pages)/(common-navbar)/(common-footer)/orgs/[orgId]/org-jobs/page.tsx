import JobCard from "@/components/common/JobCard";
import Spinner from "@/components/ui/spinner";
import { getAllOrgsJobs } from "@/features/orgs/api/action";
import { JobCardProps } from "@/lib/types";
import React, { Suspense } from "react";

export default async function OrgJobsPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  const jobs: JobCardProps[] = await getAllOrgsJobs(params.orgId);
  console.log(jobs);

  return (
    <Suspense fallback={<Spinner />}>
      {jobs.length > 0 && jobs ? (
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
            ไม่พบตำแหน่งงาน
          </p>
          <p className="text-gray-500">
            องค์กรนี้ยังไม่มีการเปิดรับสมัครงานในขณะนี้
            กรุณาตรวจสอบอีกครั้งในภายหลัง
          </p>
        </div>
      )}
    </Suspense>
  );
}
