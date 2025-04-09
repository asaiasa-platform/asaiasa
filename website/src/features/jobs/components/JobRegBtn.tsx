"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface JobRegBtnProps {
  url: string;
}

export default function JobRegBtn({ url }: Readonly<JobRegBtnProps>) {
  return (
    <Button
      onClick={() => window.open(url, "_blank")}
      className="w-full mb-6 bg-orange-normal hover:bg-orange-normal/80"
    >
      Apply for this position
    </Button>
  );
}
