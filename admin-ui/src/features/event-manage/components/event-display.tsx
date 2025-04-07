import { Button } from "@/components/ui/button";
import StaticMap from "@/components/ui/StaticMap";
import { formatDateRange, formatTimeRange } from "@/lib/utils";
import Image from "next/image";
import {
  IoCalendarSharp,
  IoLocationSharp,
  IoTimeOutline,
} from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { Link } from "@/i18n/routing";
import { Event } from "@/lib/types";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";
import { Organization } from "@/features/team-manage/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventDisplayProps {
  org: Organization | undefined;
  event: Event | undefined;
  forAdmin?: boolean;
}

export default function EventDisplay({
  org,
  event,
  forAdmin,
}: Readonly<EventDisplayProps>) {
  if (!event) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center h-full w-full">
        <span className="text-center">Choose an event</span>
      </div>
    );
  }

  const options: HTMLReactParserOptions = {
    replace(domNode) {
      // Check if domNode is an instance of Element and has attribs
      if (domNode instanceof Element && domNode.attribs) {
        const { name, children } = domNode;

        if (name === "ul") {
          return (
            <ul className="list-disc ml-5">
              {domToReact(children as DOMNode[], options)}
            </ul>
          );
        }

        if (name === "ol") {
          return (
            <ol className="list-decimal ml-5">
              {domToReact(children as DOMNode[], options)}
            </ol>
          );
        }

        if (name === "p") {
          return (
            <p className="mb-4">{domToReact(children as DOMNode[], options)}</p>
          );
        }

        // Add more custom replacements as needed
      }
    },
  };

  return (
    <div className="h-full overflow-y-auto bg-white min-w-[750px]">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur flex justify-between items-center px-4 pb-2">
        <p className="text-xl font-medium text-center mt-2 p-2 border-l-4 border-orange-500">
          ตัวอย่างหน้า
        </p>
        <Link
          href={`${forAdmin ? "/all-events" : "event-management"}/edit/${
            event.id
          }`}
        >
          <Button variant={"outline"} className="border-primary drop-shadow-md">
            <MdOutlineEdit />
            Manage Event
          </Button>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex gap-6 mb-8">
          {/* Left side - Image */}
          <div className="w-[250px] shrink-0">
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md">
              <Image
                className="object-cover w-full h-full"
                src={event.picUrl}
                width={300}
                height={400}
                alt="อีเว้นท์"
              />
            </div>
          </div>

          {/* Right side - Event Details */}
          <div className="flex-1 min-w-0">
            {/* Organization Info */}
            {org && (
              <div className="flex items-center gap-2 mb-4">
                <Avatar className="h-10 w-10 rounded-full border">
                  <AvatarImage src={org.picUrl} alt={org.name} />
                  <AvatarFallback>
                    {org.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">{org.name}</span>
              </div>
            )}
            {/* Event Title */}
            <h1 className="text-2xl font-semibold mb-4 line-clamp-2">
              {event.name}
            </h1>
            {/* Event Details */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <IoCalendarSharp className="text-orange-500 shrink-0 text-xl" />
                <span className="text-sm text-gray-700">
                  {event.startDate
                    ? formatDateRange(event.startDate, event.endDate)
                    : "ไม่ระบุ"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IoTimeOutline className="text-orange-500 shrink-0 text-xl" />
                <span className="text-sm text-gray-700">
                  {event.startTime
                    ? formatTimeRange(event.startTime, event.endTime)
                    : "ไม่ระบุ"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IoLocationSharp className="text-orange-500 shrink-0 text-xl" />
                <span className="text-sm text-gray-700 line-clamp-2">
                  {event.locationName}
                </span>
              </div>
            </div>
            {/* Registration Button - Moved up */}
            {event.registerLink && (
              <div className="mt-6">
                <a
                  href={event.registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 bg-orange-500 text-white text-center py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  ลงทะเบียน
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Description Sections */}
        <div className="space-y-6 border-t pt-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">คำอธิบายกิจกรรม</h2>
            <div>{parse(event.content, options)}</div>
          </div>

          {/* <div>
            <h2 className="text-xl font-semibold mb-2">ไทม์ไลน์</h2>
            <div className="space-y-2">
              {event.timeline.map((item, index) => (
                <div key={index} className="flex gap-4 text-gray-700">
                  <span className="font-medium">{item.date}</span>
                  <span>{item.content}</span>
                </div>
              ))}
            </div>
          </div> */}

          <div>
            <h2 className="text-xl font-semibold mb-2">สถานที่</h2>
            <p className="text-gray-700 mb-2">{`- ${event.locationName}`}</p>
            <div className="w-[700px] h-[400px] rounded-lg mb-2 border">
              {event.latitude !== null && event.longitude !== null && (
                <StaticMap lat={event.latitude} lng={event.longitude} />
              )}
            </div>
          </div>

          {event.contactChannels && (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                ช่องทางติดต่อสอบถาม
              </h2>
              {event.contactChannels.map((item, index) => (
                <div key={index} className="flex gap-2 text-gray-700">
                  <span className="font-medium">{item.media}:</span>
                  {item.mediaLink.includes("http") ? (
                    <a
                      href={item.mediaLink}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-gray-inactive break-words whitespace-normal"
                    >
                      {item.mediaLink}
                    </a>
                  ) : (
                    <span className="break-words whitespace-normal">
                      {item.mediaLink}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
