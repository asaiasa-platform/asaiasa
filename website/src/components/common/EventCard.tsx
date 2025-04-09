import { formatDateRange } from "@/lib/utils";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import Badge from "./Badge";
import { Tag } from "lucide-react";

interface EventCardProps {
  title: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  locationType: string;
  imgUrl: string;
  orgId: number;
  orgName: string;
  orgPicUrl: string;
  cardId: string;
  showOrg?: boolean;
  categories: { value: number; label: string }[];
}
export default function EventCard({
  title,
  startDate,
  endDate,
  location,
  locationType,
  imgUrl,
  orgId,
  orgName,
  orgPicUrl,
  cardId,
  showOrg = true,
  categories,
}: Readonly<EventCardProps>) {
  return (
    <div className="flex flex-col gap-1">
      {showOrg && (
        <div className="flex flex-row gap-2 justify-start items-center h-auto w-full pr-3">
          <Link
            href={`/orgs/${orgId}/org-detail`}
            className="h-9 w-9 max-w-[45px] overflow-hidden rounded-full bg-[#F5F5F5] shrink-0"
            style={{ aspectRatio: "1 / 1" }}
          >
            <Image
              className="block h-full w-full object-cover"
              src={orgPicUrl}
              width={300}
              height={300}
              alt="org-profile"
            />
          </Link>
          <div className="font-regular text-xs md:text-sm flex-grow min-w-0 line-clamp-1 break-words ">
            <Link
              href={`/orgs/${orgId}/org-detail`}
              className="hover:text-orange-dark"
            >
              {orgName}
            </Link>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Link href={`/events/${cardId}`} className="flex flex-col items-start">
          <div className="w-full rounded-[8px] overflow-hidden bg-[#F5F5F5] border drop-shadow-md relative">
            <div className="pb-[133%] relative">
              <Image
                className="absolute inset-0 w-full h-full object-cover"
                src={imgUrl}
                width={191}
                height={255}
                alt="อีเว้นท์"
              />
            </div>
          </div>
          <div className="line-clamp-1 text-sm min-h-5 text-gray-500 mt-3">
            {startDate ? formatDateRange(startDate, endDate) : "ไม่ระบุ"}
          </div>
          <div className="font-medium text-base line-clamp-2 mt-1 w-full">
            {title ?? "ไม่ระบุ"}
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Tag className="w-3 h-3 text-orange-dark" />
          <p className="text-xs text-gray-inactive">หมวดหมู่</p>
        </div>
        <div className="inline-flex flex-wrap gap-1">
          {categories?.map((category, index) => (
            <Badge key={index} label={category.label} />
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex min-w-0 break-words justify-start items-center flex-row gap-2">
            <IoLocationSharp className="shrink-0 w-3 h-3 md:w-4 md:h-4 text-orange-dark" />
            <div className="line-clamp-1 font-light text-xs md:text-sm">
              {locationType === "onsite"
                ? location !== ""
                  ? location
                  : "ไม่ระบุ"
                : "ออนไลน์"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
