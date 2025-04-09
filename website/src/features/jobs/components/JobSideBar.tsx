import React from "react";
import JobFilters from "./JobFilters";

export default function JobSideBar() {
  return (
    <div className="flex flex-col gap-6 w-full border-r border-gray-stroke pr-4 h-full">
      <JobFilters />
    </div>
  );
}
