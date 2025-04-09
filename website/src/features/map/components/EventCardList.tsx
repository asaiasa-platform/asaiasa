import { Event } from "@/lib/types";
import React from "react";
import EventMapCard from "./EventMapCard";
import { cn } from "@/lib/utils";

interface EventCardListProps {
  events: Event[];
  selectedEvent: Event | null;
  handleCardClick: (event: Event) => void;
}

export default function EventCardList({
  events,
  selectedEvent,
  handleCardClick,
}: Readonly<EventCardListProps>) {
  const filteredEvents = events.filter(
    (event) => event.latitude !== null && event.longitude !== null
  );
  return (
    <>
      <p
        className={cn(
          "text-gray-inactive text-sm font-base",
          "transition-all duration-150 delay-150 mb-1"
        )}
      >{`รายการทั้งหมด (${filteredEvents.length})`}</p>
      <div className="flex flex-col gap-1 h-full">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventMapCard
              key={event.id}
              event={event}
              isSelected={selectedEvent?.id === event.id}
              onCardClick={handleCardClick}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-[100px] mb-[150px]">
            <p className="text-2xl font-medium text-gray-600 mb-2">
              ไม่พบอีเว้นท์
            </p>
            {/* <p className="text-gray-500">
            กรุณาลองค้นหาด้วยคำค้นอื่น หรือลองเปลี่ยนตัวกรอง
          </p> */}
          </div>
        )}
      </div>
    </>
  );
}
