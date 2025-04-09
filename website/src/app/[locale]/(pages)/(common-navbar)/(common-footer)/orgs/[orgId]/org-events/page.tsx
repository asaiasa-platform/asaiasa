import EventCard from "@/components/common/EventCard";
import Spinner from "@/components/ui/spinner";
import { getAllOrgsEvents } from "@/features/orgs/api/action";
import { Event } from "@/lib/types";
import React, { Suspense } from "react";

export default async function OrgEventsPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  const events: Event[] = await getAllOrgsEvents(params.orgId);

  return (
    <Suspense fallback={<Spinner />}>
      {events.length > 0 && events ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-12  gap-x-[5%] lg:gap-x-[3%]">
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
              showOrg={false}
              categories={event.categories}
              locationType={event.locationType}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-[60px] mb-[150px] text-center">
          <p className="text-2xl font-medium text-gray-600 mb-2">
            ไม่พบอีเว้นท์
          </p>
          <p className="text-gray-500">
            องค์กรนี้ยังไม่เคยให้ข้อมูลเกี่ยวกับกิจกรรม
            หรือยังไม่เคยจัดกิจกรรมใด ๆ มาก่อน
          </p>
        </div>
      )}
    </Suspense>
  );
}
