"use server";

import { formatExternalUrl } from "@/lib/utils";

export async function getAllOrgs() {
  const apiUrl = formatExternalUrl(`/orgs-paginate`);
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    return [];
  }
}

export async function getOrgsDescription(orgId: string) {
  const apiUrl = formatExternalUrl(`/orgs/get/${orgId}`);
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();
  // console.log(data);

  if (res.ok) {
    return data;
  } else {
    return null;
  }
}

export async function getAllOrgsJobs(orgId: string) {
  const apiUrl = formatExternalUrl(`/orgs/${orgId}/jobs/list`);
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();
  // console.log(data);

  if (res.ok && data) {
    return data;
  } else {
    return [];
  }
}

export async function getAllOrgsEvents(orgId: string) {
  const apiUrl = formatExternalUrl(`/orgs/${orgId}/events`);
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();
  // console.log(data[0].categories);

  if (res.ok && data) {
    return data;
  } else {
    return [];
  }
}
