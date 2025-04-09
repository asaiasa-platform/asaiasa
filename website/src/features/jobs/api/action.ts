"use server";

import { formatExternalUrl } from "@/lib/utils";

export async function getJobs(searchParams: Record<string, string>) {
  // Extract and map query parameters
  const queryParams = new URLSearchParams({
    q: searchParams.search || "",
    categories: searchParams.esgJobCategory || "",
    salaryLowerBound: searchParams.minSalary || "",
    salaryUpperBound: searchParams.maxSalary || "",
    worktype: searchParams.workType || "",
    workplace: searchParams.remote === "true" ? "remote" : "",
  });

  // Construct the full API URL
  const apiUrl = formatExternalUrl(`/jobs-paginate/search?${queryParams}`);
  // console.log(apiUrl);

  const res = await fetch(apiUrl, { cache: "no-store" });

  const data = await res.json();
  const jobs = data.jobs;
  const totalJobs = data.total_jobs;

  if (res.ok) {
    return { success: true, data: { jobs, totalJobs }, status: res.status };
  } else {
    return { success: false, error: data.error, status: res.status };
  }
}

export async function getJobDescription(jobId: string) {
  const apiUrl = formatExternalUrl(`/jobs/get/${jobId}`);
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();
  console.log(data);

  if (res.ok && data) {
    return data;
  } else {
    return null;
  }
}
