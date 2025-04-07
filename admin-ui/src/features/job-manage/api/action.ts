"use server";

import { cookies } from "next/headers";
import { formatExternalUrl } from "@/lib/utils";
import { JobFormValues } from "@/lib/types";

export async function createJob(orgId: string, body: JobFormValues) {
  console.log("create job");
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/jobs/create`);
  console.log(body);
  const res = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
  });
  console.log("created job res", res);
  if (res.ok) {
    const data = await res.json();
    return { success: true, message: data.message, status: res.status };
  } else {
    const data = await res.json();
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function getAllJobsByOrgId(orgId: string | null) {
  if (orgId === null) return { success: false, error: "orgId is null" };

  const cookieStore = cookies();
  // console.log("cookies: ", cookieStore.toString());
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/jobs/list`);
  // console.log(apiUrl);
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await res.json();
  console.log("sever action data: " + data);

  if (res.ok) {
    if (data) {
      return { success: true, data: data, status: res.status };
    }
    return { success: false, data: [], status: res.status };
  } else {
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function getOrgJobById(orgId: string, jobId: string) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/jobs/get/${jobId}`);
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await res.json();
  console.log("sever action data: " + data);

  if (res.ok) {
    return { success: true, data: data, status: res.status };
  } else {
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function deleteJob(orgId: string, jobId: string) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/jobs/delete/${jobId}`);
  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (res.ok) {
    const data = await res.json();
    console.log("deleted job res", res);
    return { success: true, message: data.message, status: res.status };
  } else {
    const data = await res.json();
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function updateJob(
  orgId: string,
  jobId: string,
  body: JobFormValues
) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/jobs/update/${jobId}`);
  // console.log(apiUrl);
  const res = await fetch(apiUrl, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
  });
  if (res.ok) {
    const data = await res.json();
    return { success: true, message: data.message, status: res.status };
  } else {
    const data = await res.json();
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}
