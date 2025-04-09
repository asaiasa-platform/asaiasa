"use server";

import { formatExternalUrl } from "@/lib/utils";

export async function getEventDescription(eventId: string) {
  const apiUrl = formatExternalUrl(`/events/${eventId}`);
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    return null;
  }
}

interface EventsPaginateProps {
  page: string;
  search: string;
  category: string;
  dateRange: string;
  location: string;
  audience: string;
  price: string;
  maxEventsPerPage: number;
}

export async function fetchAllEvents({
  page,
  search,
  category,
  dateRange,
  location,
  audience,
  price,
  maxEventsPerPage,
}: EventsPaginateProps) {
  // /events-paginate/search?q=uilds&category=all&price=free&dateRange=thisMonth&audience=general&page=1&offset=12
  const apiUrl = formatExternalUrl(
    `/events-paginate/search?q=${search ?? ""}&page=${page ?? ""}&offset=${
      maxEventsPerPage ?? ""
    }&categories=${category ?? ""}&dateRange=${dateRange ?? ""}&location=${
      location ?? ""
    }&audience=${audience ?? ""}&price=${price ?? ""}`
  );
  console.log(apiUrl);

  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();
  // console.log(data);

  if (res.ok) {
    return {
      events: data.events,
      totalEvents: data.total_events,
    };
  } else {
    console.error("API call failed fetch All Events:", res.status);
    return {
      events: [],
      totalEvents: 0,
    };
  }
}
