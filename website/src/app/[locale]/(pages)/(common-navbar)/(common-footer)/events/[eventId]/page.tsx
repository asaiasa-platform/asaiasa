import StaticMap from "@/components/ui/StaticMap";
import { formatDateRange, formatTimeRange } from "@/lib/utils";
import {
  IoCalendarSharp,
  IoLocationSharp,
  IoTimeOutline,
} from "react-icons/io5";
import Image from "next/image";
import React from "react";
import { EventDescriptionProps } from "@/lib/types";
import EventRegBtn from "@/features/events/components/regBtn";
import { getEventDescription } from "@/features/events/api/action";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";
import { Link } from "@/i18n/routing";
import NotFoundSVG from "@/components/page/NotFound";
import SocialContactButton from "@/components/common/SocialContactBtn";

export default async function EventDescription({
  params,
}: Readonly<{
  params: { eventId: string }; // Accept event ID from URL params
}>) {
  const { eventId } = params;
  const data: EventDescriptionProps = await getEventDescription(eventId);
  console.log(data);

  if (!data) {
    return <NotFoundSVG />;
  }

  const {
    // id,
    name,
    content,
    startDate,
    endDate,
    startTime,
    endTime,
    picUrl,
    locationName,
    latitude,
    longitude,
    contactChannels,
    registerLink,
  } = data;

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
    <section className="font-prompt relative h-full w-full mt-[60px]">
      <div className="relative flex justify-center items-center h-[425px]">
        <Image
          className="absolute blur-md opacity-45 h-full w-full object-cover duration-100 -z-10 bg-white"
          src={picUrl}
          width={100}
          height={150}
          alt="event-blur"
        />
        {/* Tablet and PC Poster */}
        <div className="flex justify-center items-center h-full lg:w-[90%] xl:w-[80%] mx-auto px-4 py-4 drop-shadow-lg">
          <div className="hidden md:flex flex-col gap-3 justify-center  h-full md:max-w-[50%] rounded-l-[10px] px-3 md:px-6 lg:px-10 md:bg-white">
            {(data.organization.name || data.organization.picUrl) && (
              <div className="flex justify-start items-center gap-2">
                <Link
                  href={`/orgs/${data.organization.id}/org-detail`}
                  className="inline-flex justify-start items-center gap-2"
                >
                  <div
                    className="inline-flex h-auto max-w-[40px] overflow-hidden rounded-full"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <Image
                      className="shrink-0 h-full w-full object-cover"
                      src={data.organization.picUrl}
                      width={60}
                      height={60}
                      alt="org-profile"
                    />
                  </div>
                  <span className="line-clamp-1 text-base hover:text-orange-dark">
                    {data.organization.name}
                  </span>
                </Link>
              </div>
            )}
            <p className="font-medium text-2xl lg:text-3xl line-clamp-2">
              {name}
            </p>
            <div className="inline-flex flex-col justify-start items-start gap-4 ">
              <div className="flex justify-start items-center flex-row gap-3">
                <IoCalendarSharp className="shrink-0 text-orange-dark text-lg" />
                <p className="line-clamp-2 font-normal sm:text-base md:text-lg">
                  {startDate ? formatDateRange(startDate, endDate) : "ไม่ระบุ"}
                </p>
              </div>
              <div className="inline-flex justify-start items-center flex-row gap-3">
                <IoTimeOutline className="shrink-0 text-orange-dark text-lg" />
                <p className="line-clamp-2 font-normal sm:text-base md:text-lg">
                  {startTime ? formatTimeRange(startTime, endTime) : "ไม่ระบุ"}
                </p>
              </div>
              <div className="inline-flex justify-start items-center flex-row gap-3">
                <IoLocationSharp className="shrink-0 text-orange-dark text-lg" />
                <p className="line-clamp-2 font-normal sm:text-base md:text-lg">
                  {locationName !== "" ? locationName : "ไม่ระบุ"}
                </p>
              </div>
            </div>
          </div>
          <div className="shrink-0 h-full md:rounded-r-[10px] overflow-hidden">
            <div className="h-full rounded-[5px] md:rounded-none drop-shadow-md md:drop-shadow-none overflow-hidden ">
              <Image
                className="object-cover h-full w-auto"
                src={picUrl}
                width={300}
                height={500}
                alt="อีเว้นท์"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Event Poster */}
      <div className="md:hidden w-full mt-[15px]">
        <div
          className="flex flex-col gap-3 justify-center items-center  h-full md:max-w-[50%] 
          rounded-l-[10px] px-3 md:px-6 lg:px-10 md:bg-white"
        >
          {(data.organization.name || data.organization.picUrl) && (
            <div className="flex justify-start items-center gap-2">
              <Link
                href={`/orgs/${data.organization.id}/org-detail`}
                className="inline-flex justify-start items-center gap-2"
              >
                <div
                  className="inline-flex h-auto max-w-[40px] overflow-hidden rounded-full"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <Image
                    className="shrink-0 h-full w-full object-cover"
                    src={data.organization.picUrl}
                    width={60}
                    height={60}
                    alt="org-profile"
                  />
                </div>
                <span className="line-clamp-1 text-base hover:text-orange-dark">
                  {data.organization.name}
                </span>
              </Link>
            </div>
          )}
          <p className="font-medium text-lg line-clamp-1">{name}</p>
          <div className="inline-flex flex-col justify-start items-center gap-2 ">
            <div className="flex justify-start items-center flex-row gap-3">
              <IoCalendarSharp className="shrink-0 text-orange-dark text-base" />
              <p className="line-clamp-2 font-normal text-sm">
                {startDate ? formatDateRange(startDate, endDate) : "ไม่ระบุ"}
              </p>
            </div>
            <div className="inline-flex justify-start items-center flex-row gap-3">
              <IoTimeOutline className="shrink-0 text-orange-dark text-lg" />
              <p className="line-clamp-2 font-normal text-sm">
                {startTime ? formatTimeRange(startTime, endTime) : "ไม่ระบุ"}
              </p>
            </div>
            <div className="inline-flex justify-start items-center flex-row gap-3">
              <IoLocationSharp className="shrink-0 text-orange-dark text-lg" />
              <p className="line-clamp-2 font-normal text-sm">
                {locationName !== "" ? locationName : "ไม่ระบุ"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-[90%] xl:w-[80%] mx-auto px-3 md:px-10 lg:px-14">
        <p className="font-semibold text-xl md:text-2xl mt-[32px]">
          รายละเอียด
        </p>
        <div className="w-full mt-[8px] mb-[16px]" />
        <div className="flex flex-col gap-[32px] md:gap-[4%] md:flex-row justify-between">
          <div className="flex flex-col gap-[30px] w-full">
            {content && (
              <div className="flex flex-col gap-[10px]">
                <p className="font-semibold text-xl md:text-2xl">
                  คำอธิบายกิจกรรม
                </p>
                <div className="font-prompt text-base font-normal whitespace-pre-wrap break-words">
                  {parse(content, options)}
                </div>
              </div>
            )}

            {locationName && (
              <div className="flex flex-col gap-[10px] w-full">
                <p className="font-semibold text-xl md:text-2xl mt-[16px]">
                  สถานที่
                </p>
                <p className="text-base font-normal">
                  {locationName ?? "ไม่ระบุ"}
                </p>
                {latitude !== null &&
                  longitude !== null &&
                  latitude !== 0 &&
                  longitude !== 0 && (
                    <div
                      className="w-full md:w-[80%] rounded-[10px] max-w-[519px] bg-slate-500 overflow-hidden"
                      style={{ aspectRatio: "519 / 365" }}
                    >
                      <StaticMap lat={latitude} lng={longitude} />
                    </div>
                  )}
              </div>
            )}
            {contactChannels && contactChannels.length > 0 && (
              <div className="flex flex-col gap-[10px]">
                <p className="font-semibold text-xl md:text-2xl mt-[16px]">
                  ช่องทางติดต่อสอบถาม
                </p>
                <div className="flex flex-row gap-2 flex-wrap">
                  {contactChannels.map((item, index) => {
                    return (
                      <SocialContactButton
                        key={index}
                        mediaType={item.media}
                        mediaLink={item.mediaLink}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {registerLink && (
            <div className="shrink-0 md:w-[35%]">
              <div
                className="md:sticky top-[80px] flex flex-col justify-center items-center gap-4 
              w-full h-auto pt-[20px] pb-[30px] px-[5%] border rounded-[10px] drop-shadow-lg bg-white"
              >
                <p className="text-left text-xl font-medium w-full">
                  ลงทะเบียน
                </p>
                <div className="flex flex-col gap-5 w-full">
                  <EventRegBtn url={registerLink} eventId={eventId} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
