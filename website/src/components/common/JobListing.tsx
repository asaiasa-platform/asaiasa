import React from "react";
import JobCard from "./JobCard";
import { JobCardProps } from "@/lib/types";
import ListPagination from "./ListPagination";

interface JobListProps {
  jobs: JobCardProps[];
  totalPages: number;
}

export default function JobListing({
  jobs,
  totalPages,
}: Readonly<JobListProps>) {
  console.log("jobs: ", jobs);
  // console.log("job length: ", jobs.length);
  // console.log("total pages: ", totalPages);
  return (
    <div>
      {(jobs && jobs.length > 0) ? (
        <>
          <div className="flex flex-col gap-5 w-full">
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
          <div className="flex justify-center items-center mt-[50px]">
            {totalPages > 1 && (
              <ListPagination totalPages={totalPages} type="jobs" />
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-[100px] mb-[150px]">
          <p className="text-2xl font-medium text-gray-600 mb-2">
            ไม่พบตำแหน่งงาน
          </p>
          <p className="text-gray-500">
            กรุณาลองค้นหาด้วยคำค้นอื่น หรือลองเปลี่ยนตัวกรอง
          </p>
        </div>
      )}
    </div>
  );
}
