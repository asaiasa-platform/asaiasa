"use server";

import { Event, JobCardProps, OrganizationBrief } from "@/lib/types";
import { formatExternalUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export async function getRecentJobs(): Promise<JobCardProps[]> {
  const apiUrl = formatExternalUrl("/orgs/jobs/jobs-paginate");
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    return [];
  }
}

export async function getRecentOrgs(): Promise<OrganizationBrief[]> {
  const apiUrl = formatExternalUrl("/orgs-paginate");
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    return [];
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const apiUrl = formatExternalUrl("/events-paginate");
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    return [];
  }
}

export async function getRecommendedEvents(): Promise<Event[]> {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl("/recommendation");
  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    return [];
  }
}
