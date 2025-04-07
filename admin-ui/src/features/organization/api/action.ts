"use server";

import { cookies } from "next/headers";
import { formatExternalUrl } from "@/lib/utils";

export async function createOrg(body: FormData) {
  console.log("create org");
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl("/admin/orgs/create");
  console.log(body);
  const res = await fetch(apiUrl, {
    method: "POST",
    body: body,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  console.log("created org res", res);
  if (res.ok) {
    const data = await res.json();
    return { success: true, message: data.message, status: res.status };
  } else {
    const data = await res.json();
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function getMyOrgs() {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl("/admin/my-orgs");
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await res.json();

  if (res.ok) {
    return data.organizations;
  } else {
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function getOrgById(orgId: string) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/get/${orgId}`);
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await res.json();

  if (res.ok) {
    return { success: true, data: data, status: res.status };
  } else {
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}
