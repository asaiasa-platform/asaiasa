import EventCardSkeleton from "./EventCardSkeleton";

export function EventListSkeleton({
  maxEventsPerPage,
}: Readonly<{ maxEventsPerPage: number }>) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-[5%] lg:gap-x-[3%] mt-[25px]">
      {Array.from({ length: maxEventsPerPage }).map((_, index) => (
        <div key={index}>
          <EventCardSkeleton />
        </div>
      ))}
    </div>
  );
}
