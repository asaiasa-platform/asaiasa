"use client";

import React from "react";
import Image from "next/image";
import { OrganizationMap } from "@/lib/types";

interface OrgMapCardProp {
  organization: OrganizationMap;
  isSelected: boolean;
  onCardClick: (organization: OrganizationMap) => void;
}

export default function OrgMapCard({
  organization,
  isSelected,
  onCardClick,
}: Readonly<OrgMapCardProp>) {
  return (
    <button
      onClick={() => onCardClick(organization)}
      className={`flex justify-between items-center gap-2 sm:gap-10 md:gap-2 rounded-[20px] h-[106px] py-2 pr-2 pl-4 
        hover:bg-slate-100 transition-colors duration-150 
        ${isSelected ? "bg-slate-100" : ""}`}
    >
      <div className="inline-flex flex-col gap-[3px] text-left">
        <span className="text-sm font-medium line-clamp-1">
          {organization.name}
        </span>
        <span className="text-xs lg:text-sm font-light line-clamp-2 ">
          {organization.headline}
        </span>
      </div>
      <div className="h-full shrink-0">
        <Image
          src={organization.pic_url}
          className="h-full max-w-[88px] object-cover rounded-[17px] border shrink-0"
          style={{ aspectRatio: "1 / 1" }}
          height={100}
          width={100}
          alt="org-image"
        />
      </div>
    </button>
  );
}
