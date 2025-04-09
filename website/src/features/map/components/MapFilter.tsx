"use client";

import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import { provinces } from "../config/SelectInputObj";
import MultipleSelector, { Option } from "@/components/ui/MultiSelector";
import { useSearchParams } from "next/navigation";

export function MapFiltersContent() {
  const searchParam = useSearchParams();
  const currentTab = searchParam.get("tab");
  const DefaultVal: Option[] = [];
  return (
    <div className="flex flex-col gap-4">
      <p>{currentTab === "org" ? "องค์กร" : "กิจกรรม"}</p>
      {/* <div>
        <Label className="text-base font-normal" htmlFor="location-search">
          สถานที่
        </Label>
        <Select>
          <SelectTrigger className="placeholder:font-light placeholder:text-sm">
            <SelectValue
              className="font-light placeholder:font-light [&:not(:placeholder-shown)]:font-normal"
              placeholder="สถานที่"
            />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(provinces).map(([region, provinceList]) => (
              <SelectGroup key={region}>
                <SelectLabel className="bg-gray-50 text-center text-sm">
                  {region}
                </SelectLabel>

                {provinceList.map((province) => (
                  <SelectItem
                    className="text-sm"
                    key={province}
                    value={province}
                  >
                    {province}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <div>
        <Label className="text-base font-normal" htmlFor="keyword-search">
          ค้นหาจากคีย์เวิร์ด
        </Label>
        <MultipleSelector
          value={DefaultVal}
          defaultOptions={DefaultVal}
          className="input-outline"
          placeholder="พิมพ์คีย์เวิร์ด และกด Enter"
          creatable
          hidePlaceholderWhenSelected
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
              ไม่พบข้อมูล
            </p>
          }
          onChange={(DefaultVal) => console.dir(DefaultVal)}
        />
      </div>
    </div>
  );
}
