"use server";

import { cookies } from "next/headers";
import { formatExternalUrl } from "@/lib/utils";

export async function createEvent(orgId: string, body: FormData) {
  console.log("create event");
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/events/create`);
  console.log(body);
  const res = await fetch(apiUrl, {
    method: "POST",
    body: body,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  console.log("created event res", res);
  if (res.ok) {
    const data = await res.json();
    return { success: true, message: data.message, status: res.status };
  } else {
    const data = await res.json();
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function updateEvent(
  orgId: string,
  eventId: string,
  body: FormData
) {
  console.log("update event");
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/events/${eventId}`);
  console.log(apiUrl);
  console.log(body);
  const res = await fetch(apiUrl, {
    method: "PUT",
    body: body,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  console.log("updated event res", res);
  if (res.ok) {
    const data = await res.json();
    return { success: true, message: data.message, status: res.status };
  } else {
    const data = await res.json();
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function getAllEventsByOrgId(orgId: string | null) {
  if (orgId === null) return { success: false, error: "orgId is null" };

  const cookieStore = cookies();
  // console.log("cookies: ", JSON.stringify(cookies));
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/events`);
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await res.json();

  if (res.ok) {
    if (data) {
      return { success: true, data: data, status: res.status };
    }
    return { success: true, data: [], status: res.status };
  } else {
    console.error("API Error:", data);
    return { success: false, error: data.error, status: res.status };
  }
}

export async function getOrgEventById(orgId: string, eventId: string) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/events/${eventId}`);
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

export async function deleteEvent(orgId: string, eventId: string) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/admin/orgs/${orgId}/events/${eventId}`);
  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
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
