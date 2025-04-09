"use client";

import React from "react";
import { MapFiltersContent } from "./MapFilter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import MapSearchBar from "./MapSearchBar";
import MapListTab from "./MapListTab";

export default function MapMobileFilterSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={cn(
            "shrink-0 rounded-full text-black flex items-center justify-center shadow-md",
            "bg-white hover:drop-shadow-md hover:-translate-y-1 h-[36px] w-[36px] transition-all duration-150"
          )}
        >
          <SlidersHorizontal className="h-[16px] w-[16px]" />
        </button>
      </SheetTrigger>
      <SheetContent className="font-prompt md:hidden">
        <SheetHeader>
          <SheetTitle className="sr-only">ตัวกรอง</SheetTitle>
          <SheetDescription className="sr-only">เลือกตัวกรอง</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-5">
          <div>
            <MapListTab />
          </div>
          <div>
            <MapSearchBar defaultValue="" />
          </div>
          <div>
            <p className="font-medium text-lg mb-2">ตัวกรอง</p>
            <MapFiltersContent />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
