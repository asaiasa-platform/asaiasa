"use server";

import { UserStat } from "@/lib/types";
import { formatExternalUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export async function userInteractedWithEvent(eventId: string) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl(`/users/interact/events/${eventId}`);
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const data = await res.json();

  if (res.ok) {
    return { success: true, message: data.message, status: res.status };
  } else {
    return { success: false, error: data.error, status: res.status };
  }
}

export async function getUserStatistic() {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl("/interact/categories/");
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const data: UserStat = await res.json();

  if (res.ok) {
    return data;
  } else {
    return null;
  }
}
