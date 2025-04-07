import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { th, enUS } from "date-fns/locale";
import { formatDistanceToNow, isSameDay } from "date-fns";
import { Option } from "@/components/ui/MultiSelect";
import { provinces } from "@/components/config/Provinces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInternalUrl(url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Ensure we have a properly formatted URL
  const apiUrl = new URL(url, baseUrl).toString();
  return apiUrl;
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
  if (!clockTimeAt) return "";
  // Get the current date (today) and append the time
  const currentDate = new Date();
  const [hours, minutes] = clockTimeAt.split(":");

  // Set the current date's hours and minutes
  currentDate.setHours(Number(hours), Number(minutes), 0, 0);

  // Return the ISO string (in UTC format)
  return currentDate.toISOString();
}

// convert a date (e.g., "Mon Feb 03 2025 00:00:00 GMT+0700 (Indochina Time)") to ISO string ("2025-02-02T17:00:00.000Z")
// THIS FUNCTION WILL TURN ANY TIME ZONE TO UTC
// export function convertDateToISOString(dateAt: string) {
//   if (!dateAt) return "";
//   const DateTime = new Date(dateAt);
//   return DateTime.toISOString();
// }

export const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });
};

export const formatGroupNumber = (number: number) => {
  return number.toLocaleString("en-US", {
    useGrouping: true,
  });
};

export const alphabeticLength = (value: string) => {
  // Remove HTML tags
  const textWithoutHtml = value.replace(/<[^>]*>/g, "");
  // Remove non-alphabetic characters (including spaces)
  return textWithoutHtml.replace(/[^a-zA-Z]/g, "").length;
};

// 2024-11-16 00:00:00+00 for database
// 2024-11-16T00:00:00.000Z for api call

export function base64ToFile(base64String: string, filename: string): File {
  const arr = base64String.split(",");
  if (arr.length !== 2) {
    throw new Error("Invalid Base64 format");
  }

  const mimeMatch = RegExp(/:(.*?);/).exec(arr[0]);
  if (!mimeMatch) {
    throw new Error("Cannot determine file MIME type");
  }

  const mime = mimeMatch[1]; // Extract MIME type (e.g., image/png, application/pdf)
  const bstr = atob(arr[1]); // Decode Base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export const fetchCategories = async (
  value: string,
  type: "event" | "job"
): Promise<Option[]> => {
  try {
    const apiUrl = formatExternalUrl("/events/categories/list");
    const response = await fetch(apiUrl);
    const data = await response.json();
    let categories = data.categories;
    console.log("before: ", categories);

    // if type is event remove categories value 1, 10-13
    if (type === "event") {
      const excludeVal = [1, 10];
      categories = categories.filter(
        (category: { label: string; value: number }) =>
          !excludeVal.includes(category.value)
      );
    }

    // if type is job only display categories value 1, 10-13
    if (type === "job") {
      const includeVal = [2, 11, 12, 13];
      categories = categories.filter(
        (category: { label: string; value: number }) =>
          includeVal.includes(category.value)
      );
    }

    console.log("after: ", categories);

    if (value) {
      return categories
        .filter((category: { label: string; value: number }) =>
          category.label.toLowerCase().includes(value.toLowerCase())
        )
        .map((category: { label: string; value: number }) => ({
          label: category.label,
          value: category.value,
        }));
    } else {
      return categories.map((category: { label: string; value: number }) => ({
        label: category.label,
        value: category.value,
      }));
    }
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
};

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
