"use client";

import { Link } from "@/i18n/routing";
import {
  cn,
  formatDateRange,
  formatRelativeTime,
  getProvinceNameByCode,
} from "@/lib/utils";
import React from "react";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Event } from "@/lib/types";
import Spinner from "@/components/ui/spinner";

interface EventListProps {
  events: Event[] | undefined;
  isMobile: boolean;
  currentId?: string | null;
  isLoading?: boolean;
}

export default function EventList({
  events,
  isMobile,
  currentId,
  isLoading,
}: Readonly<EventListProps>) {
  const locale = useLocale();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center mt-[200px] w-full">
        <Spinner />
        <span className="text-center">Loading...</span>
      </div>
    );
  }

  if (events === undefined || events.length === 0) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center mt-[200px] w-full">
        <span className="text-center">No events found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {events.map((event) => (
        <div key={event.id}>
          <Link
            href={isMobile ? `event-management/edit/${event.id}` : `?id=${event.id}`}
            className={cn(
              "block border rounded-md p-3 hover:bg-slate-50",
              currentId === `${event.id}` && "bg-gray-200 hover:bg-gray-200"
            )}
          >
            <div className="flex gap-3 items-start">
              <div
                style={{ aspectRatio: "3 / 4" }}
                className="w-auto h-[100px] rounded-sm overflow-hidden bg-cover bg-center shrink-0"
              >
                <Image
                  src={event.picUrl}
                  alt={event.name}
                  width={75}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left w-full">
                {event.updatedAt && (
                  <p className="text-xs font-base text-muted-foreground line-clamp-1">
                    {"แก้ไขล่าสุด " +
                      formatRelativeTime(event.updatedAt, locale)}
                  </p>
                )}
                <h3 className="text-sm font-medium mt-0.5 line-clamp-2">
                  {event.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600">
                  <Calendar className="shrink-0 w-3 h-3" />
                  <p className="line-clamp-1">
                    {event.startDate
                      ? formatDateRange(event.startDate, event.endDate)
                      : "ไม่ระบุ"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600">
                  <MapPin className="shrink-0 w-3 h-3" />
                  <p className="line-clamp-2">
                    {event.locationName +
                      ", " +
                      getProvinceNameByCode(event.province, locale)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
