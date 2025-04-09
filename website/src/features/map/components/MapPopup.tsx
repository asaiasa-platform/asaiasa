import React from "react";
import { OrganizationMap, Event } from "@/lib/types";
import Image from "next/image";
import Badge from "@/components/common/Badge";
import { Link } from "@/i18n/routing";

interface CustomPopupProps {
  data: OrganizationMap | Event;
  currentTab: string;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({
  data,
  currentTab,
}) => {
  const handleMapLinkClick = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`,
      "_blank"
    );
  };
  return (
    <div className="font-prompt flex flex-col w-[300px] md:w-[400px] p-4 bg-white rounded-lg shadow-lg">
      <div className="flex gap-2 items-center">
        <Image
          src={
            currentTab === "org"
              ? (data as OrganizationMap).pic_url
              : (data as Event).picUrl
          }
          className="h-full max-w-[60px] object-cover rounded-xl border"
          style={{ aspectRatio: "1 / 1" }}
          height={100}
          width={100}
          alt="org-image"
        />
        <h3 className="text-sm md:text-base font-normal text-gray-900">
          {data.name}
        </h3>
      </div>
      {
        <p className="text-xs md:text-sm font-light text-gray-600 mt-1">
          {currentTab === "org"
            ? (data as OrganizationMap).headline
            : (data as Event).locationName}
        </p>
      }
      {currentTab === "org" ? (
        <div className="inline-flex flex-wrap mt-2 gap-1">
          {(data as OrganizationMap).industries.map((label, i) => (
            <Badge key={i} label={label} />
          ))}
        </div>
      ) : (
        <div className="inline-flex flex-wrap mt-2 gap-1">
          {(data as Event).categories.map((item, i) => (
            <Badge key={i} label={item.label} />
          ))}
        </div>
      )}
      <div className="flex gap-3 justify-end w-full mt-4">
        <Link
          href={
            currentTab === "org"
              ? `/orgs/${data.id}/org-detail`
              : `/events/${data.id}`
          }
          className="inline-flex justify-center items-center py-[6px] px-2 rounded-full w-full border-[1px]
          font-light text-sm md:text-base hover:bg-slate-50 text-black transition-colors duration-150 focus:outline-none"
        >
          <span className="ml-2">ดูรายละเอียด</span>
        </Link>
        <button
          onClick={handleMapLinkClick}
          style={{ aspectRatio: "1 / 1" }}
          className="shrink-0 flex w-10 h-10 justify-center items-center z-10 top-2 right-2 
                bg-white rounded-full border hover:drop-shadow-md"
        >
          <Image
            src="/icon/google-map.png"
            className="h-7 w-auto"
            width={100}
            height={100}
            alt="map-link"
          />
        </button>
      </div>
    </div>
  );
};
