import JobCard from "@/components/common/JobCard";
import { JobCardProps } from "@/lib/types";
import React from "react";

interface JobShowcaseProps {
  jobs: JobCardProps[];
}

export default function JobShowcase({ jobs }: Readonly<JobShowcaseProps>) {
  if (jobs.length === 0 || !jobs) return <></>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          id={job.id}
          title={job.title}
          description={job.description}
          workType={job.workType}
          workplace={job.workplace}
          careerStage={job.careerStage}
          province={job.province}
          country={job.country}
          salary={job.salary}
          updatedAt={job.updatedAt}
          organization={job.organization}
          categories={job.categories}
        />
      ))}
    </div>
  );
}
