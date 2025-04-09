import React from "react";
import { Skeleton } from "../../../components/ui/skeleton";

export default function EventCardSkeleton() {
  return (
    <Skeleton
      className="h-full w-full rounded-[18px] bg-slate-200"
      style={{ aspectRatio: "3 / 4" }}
    ></Skeleton>
  );
}
