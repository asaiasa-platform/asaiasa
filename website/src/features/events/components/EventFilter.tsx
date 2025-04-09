"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import LoadingCover from "@/components/common/LoadingCover";
import FilterBtn from "@/components/common/FilterBtn";
import useEventFilter from "../hook/useEventFilter";

export function EventFilter() {
  const {
    filters,
    updateFilter,
    applyFilters,
    clearFilters,
    isPending,
    getActiveFiltersCount,
  } = useEventFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilters = () => {
    // if (getActiveFiltersCount() === 0) return;
    applyFilters();
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    // if (getActiveFiltersCount() === 0) return;
    clearFilters();
    setIsFilterOpen(false);
  };

  return (
    <>
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <div>
            <FilterBtn getActiveFiltersCount={getActiveFiltersCount} />
          </div>
        </SheetTrigger>
        <SheetContent className="font-prompt">
          <SheetHeader>
            <SheetTitle className="font-prompt">ตัวกรอง</SheetTitle>
            <SheetDescription className="sr-only">
              เลือกตัวกรอง
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-5">
            {/* Date Range Filter */}
            <div className="space-y-3">
              <Label>ช่วงเวลา</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => updateFilter("dateRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกช่วงเวลา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:bg-slate-100" value="today">
                    วันนี้
                  </SelectItem>
                  <SelectItem className="hover:bg-slate-100" value="tomorrow">
                    พรุ่งนี้
                  </SelectItem>
                  <SelectItem className="hover:bg-slate-100" value="thisWeek">
                    สัปดาห์นี้
                  </SelectItem>
                  <SelectItem className="hover:bg-slate-100" value="thisMonth">
                    เดือนนี้
                  </SelectItem>
                  <SelectItem className="hover:bg-slate-100" value="nextMonth">
                    เดือนหน้า
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-3">
              <Label>สถานที่</Label>
              <Select
                value={filters.location}
                onValueChange={(value) => updateFilter("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานที่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:bg-slate-100" value="online">
                    ออนไลน์
                  </SelectItem>
                  <SelectItem className="hover:bg-slate-100" value="onsite">
                    ออนไซต์
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audience Filter */}
            <div className="space-y-3">
              <Label>ประเภทผู้ชม</Label>
              <RadioGroup
                value={filters.audience}
                onValueChange={(value) => updateFilter("audience", value)}
                className="grid grid-cols-2 gap-y-[15px]"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="r1" />
                  <Label
                    htmlFor="r1"
                    className="font-normal hover:cursor-pointer"
                  >
                    ทั่วไป
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professionals" id="r3" />
                  <Label
                    htmlFor="r3"
                    className="font-normal hover:cursor-pointer"
                  >
                    มืออาชีพ
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <Label>ราคา</Label>
              <Select
                value={filters.price}
                onValueChange={(value) => updateFilter("price", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกราคา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:bg-slate-100" value="free">
                    ฟรี
                  </SelectItem>
                  <SelectItem className="hover:bg-slate-100" value="paid">
                    มีค่าใช้จ่าย
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex-1"
              >
                ล้างตัวกรอง
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-orange-normal hover:bg-orange-normal/80 "
              >
                ใช้ตัวกรอง
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {isPending && <LoadingCover />}
    </>
  );
}
