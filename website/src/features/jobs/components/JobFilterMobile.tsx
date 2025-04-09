"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterBtn from "@/components/common/FilterBtn";
import { useState } from "react";
import JobFilters from "./JobFilters";
import { useJobFilters } from "../hook/useJobFilter";

export default function JobFilterMobile() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { getActiveFiltersCount } = useJobFilters();

  const handleCloseSheet = () => {
    setIsFilterOpen(false);
  };

  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetTrigger asChild>
        <div className="flex justify-end">
          <FilterBtn getActiveFiltersCount={getActiveFiltersCount} />
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto pt-5 pb-20">
        <SheetHeader className="sr-only">
          <SheetTitle className="font-prompt">ตัวกรอง</SheetTitle>
          <SheetDescription className="sr-only">เลือกตัวกรอง</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <JobFilters onClose={handleCloseSheet} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
