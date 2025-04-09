import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, isSameDay } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { provinces } from "@/features/map/config/SelectInputObj";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { BiNetworkChart } from "react-icons/bi";
import {
  HiOutlineLightBulb,
  HiOutlinePresentationChartBar,
} from "react-icons/hi";
import { CgDisplayGrid } from "react-icons/cg";
import { GrWorkshop } from "react-icons/gr";
import { MdOutlinedFlag } from "react-icons/md";
import { Leaf, Users, Building2, X } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatExternalUrl(url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_GO_API_URL;

  // Ensure we have a properly formatted URL
  const apiUrl = new URL(url, baseUrl).toString();
  return apiUrl;
}

export const formatRelativeTime = (
  dateString: string,
  locale: string
): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale === "th" ? th : enUS,
  });
};

// Utility function to format date range
export const formatDateRange = (
  startDate: string,
  endDate?: string
): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : "";

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      year: "2-digit",
      month: "short",
      timeZone: "UTC",
    });
  };

  if (end === "" || isSameDay(start, end)) {
    return formatDate(start);
  }

  return `${formatDate(start)} - ${formatDate(end)}`;
};

export const formatTimeRange = (
  startTime: string,
  endTime?: string
): string => {
  const formatTime = (isoTime: string): string => {
    const date = new Date(`1970-01-01T${isoTime}Z`); // Prepend date to ensure valid parsing

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC", // Keep it in UTC to prevent unwanted timezone shifts
    });
  };

  return endTime
    ? `${formatTime(startTime)} - ${formatTime(endTime)}`
    : formatTime(startTime);
};

// convert clock time (e.g., "17:00:00") to ISO string ("0001-01-01T17:00:00.000Z")
export function convertTimeToISOString(clockTimeAt: string) {
  const clockTime = new Date(`0001-01-01T${clockTimeAt}Z`);
  return clockTime.toISOString();
}

// convert a date (e.g., "2015-03-25") to ISO string ("2015-03-25T00:00:00.000Z")
export function convertDateToISOString(dateAt: string) {
  const DateTime = new Date(dateAt);
  return DateTime.toISOString();
}

// 2024-11-16 00:00:00+00 for database
// 2024-11-16T00:00:00.000Z for api call

export function getProvinceNameByCode(
  code: string,
  locale: string
): string | undefined {
  const province = provinces.find((province) => province.code === code);

  if (!province) {
    return undefined;
  }

  return province[locale as keyof typeof province];
}

export const getCategoryIcon = (label: string) => {
  switch (label) {
    case "incubation":
      return HiOutlineRocketLaunch;
    case "networking":
      return BiNetworkChart;
    case "forum":
      return HiOutlinePresentationChartBar;
    case "exhibition":
      return CgDisplayGrid;
    case "competition":
      return HiOutlineLightBulb;
    case "workshop":
      return GrWorkshop;
    case "campaign":
      return MdOutlinedFlag;
    case "environment":
      return Leaf;
    case "social":
      return Users;
    case "governance":
      return Building2;
    default:
      return X;
  }
};

export const getCategoryName = (label: string) => {
  switch (label) {
    case "incubation":
      return "บ่มเพาะธุรกิจ";
    case "networking":
      return "สร้างเครือข่าย";
    case "forum":
      return "สัมมนา ฟอรัม";
    case "exhibition":
      return "นิทรรศการจัดแสดง";
    case "competition":
      return "การแข่งขัน";
    case "workshop":
      return "เวิร์คชอปให้ความรู้";
    case "campaign":
      return "แคมเปญ";
    case "environment":
      return "Environment";
    case "social":
      return "Social";
    case "governance":
      return "Governance";
    default:
      return "...";
  }
};
