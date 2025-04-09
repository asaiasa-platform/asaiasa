import { Event } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { IoLocationSharp } from "react-icons/io5";

interface EventMapCardProp {
  event: Event;
  isSelected: boolean;
  onCardClick: (event: Event) => void;
}

export default function EventMapCard({
  event,
  isSelected,
  onCardClick,
}: Readonly<EventMapCardProp>) {
  return (
    <button
      onClick={() => onCardClick(event)}
      className={`flex justify-between items-center gap-4 rounded-md h-[106px] py-2 pr-2 pl-4 
           hover:bg-slate-100 transition-colors duration-150 
           ${isSelected ? "bg-slate-100" : ""}`}
    >
      <div className="inline-flex flex-col gap-[3px] text-left">
        <span className="text-sm font-medium line-clamp-1">{event.name}</span>
        <span className="text-xs lg:text-sm font-light line-clamp-1">
          {event.startDate
            ? formatDateRange(event.startDate, event.endDate)
            : "ไม่ระบุ"}
        </span>
        <span className="flex justify-start items-center gap-1 text-xs lg:text-sm font-light line-clamp-1">
          <IoLocationSharp className="shrink-0 w-3 h-3 text-black" />
          {event.locationName !== "" ? event.locationName : "ไม่ระบุ"}
        </span>
      </div>
      <div className="h-full shrink-0">
        <Image
          src={event.picUrl}
          className="h-full max-w-[60px] object-cover border"
          style={{ aspectRatio: "3 / 4" }}
          height={100}
          width={100}
          alt="org-image"
        />
      </div>
    </button>
  );
}
