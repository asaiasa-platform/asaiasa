"use server";

import { formatExternalUrl } from "@/lib/utils";

export async function getAllEventsLocation() {
  const apiUrl = formatExternalUrl("/location-map/events");
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();
  console.log(data);

  if (res.ok) {
    return data;
  } else {
    return [];
  }
}

export async function getAllOrgsLocation() {
  const apiUrl = formatExternalUrl("/location-map/orgs");
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    return [];
  }
}
