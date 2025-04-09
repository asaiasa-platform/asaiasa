import React from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ESGJobCategory } from "@/features/jobs/config/filters";

export default function EsgFilter() {
  return (
    <div className="flex gap-2 sm:gap-4">
      {ESGJobCategory.map((item) => (
        <Label
          key={item.value}
          className="flex items-center space-x-2 cursor-pointer rounded-md"
        >
          <Checkbox id="remote-toggle" />
          <span className="text-xs sm:text-sm font-light text-gray-inactive cursor-pointer">
            {item.label}
          </span>
        </Label>
      ))}
    </div>
  );
}
