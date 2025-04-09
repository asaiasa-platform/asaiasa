"use client";

import { cn } from "@/lib/utils";
import { Leaf, Users, Building2 } from "lucide-react";

export default function Badge({
  label,
  className,
}: Readonly<{ label: string; className?: string }>) {
  // Determine which icon to show based on the label
  const getIcon = () => {
    if (label.toLowerCase() === "environment")
      return <Leaf className="w-3 h-3 mr-1" />;
    if (label.toLowerCase() === "social")
      return <Users className="w-3 h-3 mr-1" />;
    if (label.toLowerCase() === "governance")
      return <Building2 className="w-3 h-3 mr-1" />;
    return null;
  };

  return (
    <div
      className={cn(
        "capitalize flex justify-center items-center text-gray-800 text-[12px] rounded-full px-[9px] py-[2px] bg-[#e2e8f0]",
        label.toLowerCase() === "environment" && "bg-green-500 text-white shadow-md shadow-green-500/50",
        label.toLowerCase() === "social" && "bg-yellow-500 text-white shadow-md shadow-yellow-500/50",
        label.toLowerCase() === "governance" && "bg-blue-500 text-white shadow-md shadow-blue-500/50",
        className
      )}
    >
      {getIcon()}
      {label}
    </div>
  );
}
