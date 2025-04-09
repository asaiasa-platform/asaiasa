import { SlidersHorizontal } from "lucide-react";
import React from "react";
import Badge from "./Badge";

interface FilterBtnProps {
  getActiveFiltersCount: () => number;
  canShorten?: boolean;
}

export default function FilterBtn({
  getActiveFiltersCount,
  canShorten = true,
}: Readonly<FilterBtnProps>) {
  return (
    <button
      className="flex justify-center items-center gap-1 border bg-white 
      hover:drop-shadow-md border-gray-stroke rounded-[10px] h-[40px] md:h-[48px] px-3 md:px-4 
      text-gray-btngray relative"
    >
      <SlidersHorizontal className="h-[18px] w-[18px]" />
      <span
        className={`text-sm font-medium ${canShorten ? "hidden md:block" : ""}`}
      >
        ตัวกรอง
      </span>
      {getActiveFiltersCount() > 0 && (
        <Badge
          className="bg-orange-normal"
          label={getActiveFiltersCount().toString()}
        />
      )}
    </button>
  );
}
