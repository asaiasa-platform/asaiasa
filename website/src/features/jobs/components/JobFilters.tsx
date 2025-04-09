"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaChevronDown } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  CareerStageEnum,
  ESGJobCategory,
  WorkTypeEnum,
} from "../config/filters";
import LoadingCover from "@/components/common/LoadingCover";
import { useJobFilters } from "../hook/useJobFilter";

interface JobFiltersProps {
  onClose?: () => void;
}

export default function JobFilters({ onClose }: Readonly<JobFiltersProps>) {
  const {
    filters,
    updateFilter,
    applyFilters,
    clearFilters,
    isPending,
    // getActiveFiltersCount,
  } = useJobFilters();

  const [isOpen, setIsOpen] = useState(false);
  // const isOpen = true;

  const [salaryError, setSalaryError] = useState("");

  const validateSalaryRange = (min: number, max: number) => {
    if (min < 0 || max < 0) {
      setSalaryError("กรุณากรอกเงินเดือนให้ถูกต้อง");
      return false;
    }
    if (min && max && min > max) {
      setSalaryError("เงินเดือนขั้นต่ำต้องน้อยกว่าเงินเดือนสูงสุด");
      return false;
    }
    setSalaryError("");
    return true;
  };

  const handleSalaryChange = (
    field: "minSalary" | "maxSalary",
    value: number
  ) => {
    const min = field === "minSalary" ? value : filters.minSalary;
    const max = field === "maxSalary" ? value : filters.maxSalary;

    if (validateSalaryRange(min, max)) {
      updateFilter(field, value);
    }
  };

  const handleClearFilters = () => {
    // if (getActiveFiltersCount() === 0) return;
    clearFilters();
    onClose?.();
  };

  const handleApplyFilters = () => {
    // if (getActiveFiltersCount() === 0) return;
    applyFilters();
    onClose?.();
  };

  return (
    <div className="sticky top-20 left-0">
      <p className="text-xl font-semibold mb-3">ตัวกรอง</p>
      <div className="flex flex-col gap-4">
        {/* <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-semibold">ตัวกรอง</p>
        <button
          onClick={handleClearFilters}
          className="border rounded-md p-2 group hover:bg-slate-100"
        >
          <RiResetRightFill className="text-xl" />
        </button>
      </div> */}

        <div
          className="rounded-full bg-orange-normal/50 p-1 border-2 
      border-orange-dark shadow-lg hover:shadow-orange-300/50 transition-shadow"
        >
          <Select
            onValueChange={(value) => updateFilter("esgJobCategory", value)}
            value={filters.esgJobCategory}
          >
            <SelectTrigger
              className="w-full bg-white text-orange-950 
                 rounded-full px-4 transition-colors shadow-sm"
              id="job-esg"
            >
              <SelectValue placeholder="เลือกหมวดหมู่ ESG" />
            </SelectTrigger>
            <SelectContent className="bg-white border-orange-500 rounded-lg shadow-lg">
              {ESGJobCategory.map((x) => (
                <SelectItem
                  key={x.value}
                  value={x.value}
                  className="text-orange-950 focus:bg-orange-500/10 hover:bg-orange-500/10 focus:text-orange-700 
                   cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {x.icon && <x.icon className="w-5 h-5" />}
                    <span>{x.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-normal" htmlFor="location-search">
            สถานที่
          </Label>
          <Input
            id="location-search"
            placeholder="ระบุสถานที่"
            className="placeholder:font-light placeholder:text-sm"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
          />
          <div className="flex items-center space-x-2 mt-4">
            <Label className="flex items-center space-x-2">
              <Checkbox
                id="remote-toggle"
                checked={filters.remote}
                onCheckedChange={(checked) => updateFilter("remote", checked)}
              />
              <span className="text-sm font-light text-gray-inactive cursor-pointer">
                ทำงานระยะไกล (Remote)
              </span>
            </Label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex justify-end items-center gap-1 text-sm font-light text-gray-inactive 
        hover:text-gray-700 transition-colors mt-1 w-fit py-1"
          >
            ตัวเลือกเพิ่มเติม
            <FaChevronDown
              className={`mt-[2px] transform transition-transform duration-150 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {/* Extra menu */}
        <div
          className={`overflow-hidden transition-all duration-150 ease-in-out ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="flex justify-start items-center">
                {"เงินเดือน (บาท)"}
              </p>
              <div className="flex gap-2">
                <div>
                  <Label
                    className="text-sm font-light text-gray-inactive"
                    htmlFor="salary-min"
                  >
                    เริ่มต้น
                  </Label>
                  <Input
                    id="salary-min"
                    type="number"
                    value={filters.minSalary || ""}
                    min={0}
                    onChange={(e) => {
                      updateFilter("minSalary", Number(e.target.value));
                      handleSalaryChange("minSalary", Number(e.target.value));
                    }}
                  />
                </div>
                <div>
                  <Label
                    className="text-sm font-light text-gray-inactive"
                    htmlFor="salary-max"
                  >
                    ถึง
                  </Label>
                  <Input
                    id="salary-max"
                    type="number"
                    min={0}
                    value={filters.maxSalary || ""}
                    onChange={(e) => {
                      updateFilter("maxSalary", Number(e.target.value));
                      handleSalaryChange("maxSalary", Number(e.target.value));
                    }}
                  />
                </div>
              </div>
              {salaryError && (
                <span className="text-sm text-red-500">{salaryError}</span>
              )}
            </div>

            <div>
              <Label className="text-base font-normal" htmlFor="job-type">
                ประเภทการจ้างงาน
              </Label>
              <Select
                value={filters.workType}
                onValueChange={(value) => updateFilter("workType", value)}
              >
                <SelectTrigger className="w-full" id="job-type">
                  <SelectValue placeholder="เลือกประเภทการจ้างงาน" />
                </SelectTrigger>
                <SelectContent>
                  {WorkTypeEnum.map((x) => (
                    <SelectItem key={x.value} value={x.value}>
                      {x.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base font-normal" htmlFor="career-stage">
                ระดับขั้น
              </Label>
              <Select
                value={filters.careerStage}
                onValueChange={(value) => updateFilter("careerStage", value)}
              >
                <SelectTrigger className="w-full" id="career-stage">
                  <SelectValue placeholder="เลือกระดับขั้น" />
                </SelectTrigger>
                <SelectContent>
                  {CareerStageEnum.map((x) => (
                    <SelectItem key={x.value} value={x.value}>
                      {x.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex-1"
          >
            ล้างตัวกรอง
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="w-[50%] bg-orange-normal hover:bg-orange-normal/80 text-base"
            disabled={!!salaryError}
          >
            ค้นหา
          </Button>
        </div>
        {isPending && <LoadingCover />}
      </div>
    </div>
  );
}
