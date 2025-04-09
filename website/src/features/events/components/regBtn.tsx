"use client";

import { userInteractedWithEvent } from "@/features/statistic/api/action";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface EventRegBtnProps {
  url: string;
  eventId: string;
}

export default function EventRegBtn({
  url,
  eventId,
}: Readonly<EventRegBtnProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleClick = async () => {
    setIsSubmitting(true);

    const result = await userInteractedWithEvent(eventId);

    if (result.success) {
      toast.success("บันทึกการเข้าร่วมกิจกรรมสําเร็จ");
      window.open(url, "_blank");
    } else if (result.status === 401) {
      console.log(result.status);
      console.log(result.error);
      toast.error("กรุณาเข้าสู่ระบบก่อน");
    } else {
      toast.error("ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      console.log(result.status);
      console.log(result.error);
    }

    setIsSubmitting(false);
  };
  return (
    <button
      onClick={handleClick}
      disabled={isSubmitting}
      className={cn(
        "border items-center justify-center flex rounded-[10px] h-[40px]",
        "transition-all duration-150",
        isSubmitting
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-orange-normal text-white hover:bg-orange-dark hover:drop-shadow-md "
      )}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          รอสักครู่
        </>
      ) : (
        "ลงทะเบียนไปที่ฟอร์ม"
      )}
    </button>
  );
}
