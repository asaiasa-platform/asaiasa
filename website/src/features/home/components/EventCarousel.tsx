import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EventCard from "@/components/common/EventCard";
import { Event } from "@/lib/types";

interface EventCardProps {
  events: Event[];
}

export default function EventCarousel({ events }: Readonly<EventCardProps>) {
  if (events.length === 0 || !events) return <></>;
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {events.map((event) => (
          <CarouselItem
            key={event.id}
            className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="p-1">
              <EventCard
                title={event.name}
                startDate={event.startDate}
                endDate={event.endDate}
                location={event.locationName}
                imgUrl={event.picUrl}
                orgId={event.organization.id}
                orgName={event.organization.name}
                orgPicUrl={event.organization.picUrl}
                cardId={event.id.toString()}
                categories={event.categories}
                showOrg={false}
                locationType={event.locationType}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-end gap-2 mt-6">
        <CarouselPrevious className="static bg-white border border-orange-normal text-orange-dark hover:bg-orange-50 hover:text-orange-dark h-10 w-10 rounded-full transform transition-transform duration-200 hover:scale-105" />
        <CarouselNext className="static bg-orange-normal hover:bg-orange-dark text-white h-10 w-10 rounded-full transform transition-transform duration-200 hover:scale-105" />
      </div>
    </Carousel>
  );
}
