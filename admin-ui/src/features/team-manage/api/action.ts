"use server";

import { cookies } from "next/headers";
import { formatExternalUrl } from "@/lib/utils";

export async function fetchOrgMembers(orgId: string) {
  const cookieStore = cookies();
  console.log("get org members");
  const apiUrl = formatExternalUrl(`/admin/roles/orgs/${orgId}/all`);

  const response = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data.users_with_role;
  } else {
    const data = await response.json();
    console.error("API Error:", data);
    throw new Error(data.error || "Failed to fetch org members");
  }
}

export async function editUserRole(
  orgId: string,
  body: { user_id: string; role: string }
) {
  console.log("edit user role");
  const cookieStore = cookies();
  console.log(cookieStore.toString());

  const apiUrl = formatExternalUrl(`/admin/roles/orgs/${orgId}`);
  console.log(apiUrl);
  console.log(body);

  const res = await fetch(apiUrl, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const data = await res.json();
    return { success: true, message: data.success, status: res.status };
  } else {
    const data = await res.json();
    console.log(res.status);
    console.error("API Error:", data);
    return {
      success: false,
      error: data.error ?? data.msg,
      status: res.status,
    };
  }
}

export async function inviteUser(orgId: string, body: { email: string }) {
  console.log("invite user");
  const cookieStore = cookies();
  console.log(cookieStore.toString());

  const apiUrl = formatExternalUrl(`/admin/roles/orgs/${orgId}/invitation`);
  console.log(apiUrl);

  const res = await fetch(apiUrl, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const data = await res.json();
    return { success: true, message: data, status: res.status };
  } else {
    const data = await res.json();
    console.log(res.status);
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function removeMember(orgId: string, body: { user_id: string }) {
  console.log("remove member");
  const cookieStore = cookies();
  console.log(cookieStore.toString());

  const apiUrl = formatExternalUrl(`/admin/roles/orgs/${orgId}`);
  console.log(apiUrl);
  console.log(body);

  const res = await fetch(apiUrl, {
    cache: "no-store",
    method: "DELETE",
    body: JSON.stringify(body),
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
  });

  console.log("remove member res", res);
  if (res.ok) {
    const data = await res.json();
    return { success: true, message: data.message, status: res.status };
  } else {
    const data = await res.json();
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function inviteCallback(token: string) {
  const apiUrl = formatExternalUrl(`/callback-invitation?token=${token}`);
  console.log(apiUrl);
  const res = await fetch(apiUrl, {
    cache: "no-store",
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return { success: true, status: res.status };
  } else {
    const data = await res.json();
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}
