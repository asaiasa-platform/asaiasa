"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

interface MapSearchProps {
  defaultValue: string;
}

export default function MapSearchBar({
  defaultValue,
}: Readonly<MapSearchProps>) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  // Set the search term on input change
  const handleInputChange = (term: string) => {
    setSearchTerm(term);
  };

  // Perform search on Enter key
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     handleSearchRedirect(searchTerm); // Perform search on Enter key
  //   }
  // };

  // Clear the search input only when search term is active
  const handleClearInput = () => {
    setSearchTerm("");
    // if (defaultValue) {
    //   handleSearchRedirect("");
    // }
  };
  return (
    <div className={cn("relative w-full")}>
      <Input
        className="rounded-full  h-[42px] hover:shadow-md pl-9 placeholder:font-light 
              placeholder:text-sm text-sm md:text-base bg-white border-gray-stroke"
        type="text"
        id="name-search"
        placeholder="ค้นหาจากชื่อ"
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-inactive" />
      {searchTerm && (
        <button
          onClick={handleClearInput}
          className="absolute top-1/2 transform -translate-y-1/2 right-[10px] h-[30px] w-[30px] 
              flex items-center justify-center bg-white"
        >
          <X className="h-[18px] w-[18px] text-gray-inactive" />
        </button>
      )}
    </div>
  );
}
