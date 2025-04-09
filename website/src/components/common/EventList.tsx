import EventCard from "@/components/common/EventCard";
import ListPagination from "@/components/common/ListPagination";
import React from "react";
import { Event } from "@/lib/types";

interface EventListProps {
  events: Event[];
  totalPages: number;
}

export default async function EventList({
  events,
  totalPages,
}: Readonly<EventListProps>) {
  return (
    <>
      {events.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-[5%] lg:gap-x-[3%] mt-[25px]">
            {events.map((event) => (
              <EventCard
                key={event.id}
                cardId={event.id.toString()}
                title={event.name}
                startDate={event.startDate}
                endDate={event.endDate}
                startTime={event.startTime}
                endTime={event.endTime}
                location={event.locationName}
                imgUrl={event.picUrl}
                orgId={event.organization.id}
                orgName={event.organization.name}
                orgPicUrl={event.organization.picUrl}
                categories={event.categories}
                locationType={event.locationType}
              />
            ))}
          </div>
          <div className="flex justify-center items-center mt-[50px]">
            {totalPages > 1 && (
              <ListPagination totalPages={totalPages} type="events" />
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-[100px] mb-[150px]">
          <p className="text-2xl font-medium text-gray-600 mb-2">
            ไม่พบอีเว้นท์
          </p>
          <p className="text-gray-500">
            กรุณาลองค้นหาด้วยคำค้นอื่น หรือลองเปลี่ยนตัวกรอง
          </p>
        </div>
      )}
    </>
  );
}
