"use client";

import { useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UseFormReturn, Controller } from "react-hook-form";
import { EventFormValues } from "@/lib/types";

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      options.push(`${formattedHour}:${formattedMinute}:00`);
    }
  }
  return options;
};

const removeSeconds = (time: string) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

const timeOptions = generateTimeOptions();

interface TimeRangePickerProps {
  form: UseFormReturn<EventFormValues>;
  className?: string;
  errMsgStartTime: string;
  errMsgEndTime: string;
}

export default function TimeRangePicker({
  form,
  className,
  errMsgStartTime,
  errMsgEndTime,
}: Readonly<TimeRangePickerProps>) {
  const { control, watch } = form;

  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // Convert UTC time to local time format
  // const convertToSimpleFormat = (utcTime: string) => {
  //   const date = new Date(utcTime);
  //   const hours = date.getHours().toString().padStart(2, "0");
  //   const minutes = date.getMinutes().toString().padStart(2, "0");
  //   return `${hours}:${minutes}`;
  // };

  const validEndTimes = useMemo(() => {
    if (!startTime) return timeOptions;
    const startIndex = timeOptions.indexOf(startTime);
    return timeOptions.slice(startIndex + 1);
  }, [startTime]);

  // // Convert local time to UTC
  // const convertToUTCTime = (localTime: string) => {
  //   const [hours, minutes] = localTime.split(":");
  //   const date = new Date();
  //   date.setHours(
  //     Number.parseInt(hours, 10),
  //     Number.parseInt(minutes, 10),
  //     0,
  //     0
  //   );
  //   return date.toISOString();
  // };

  useEffect(() => {
    if (startTime && endTime) {
      const startIndex = timeOptions.indexOf(startTime);
      const endIndex = timeOptions.indexOf(endTime);
      if (endIndex <= startIndex) {
        form.setValue("endTime", "");
      }
    }
  }, [startTime, endTime, form]);

  return (
    <div className={className}>
      <div className="text-base font-medium">
        <span>Time Range</span>
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <Label htmlFor="start-time" className="text-xs text-muted-foreground">
            Start Time
          </Label>
          <Controller
            name="startTime"
            control={control}
            rules={{ required: errMsgStartTime }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  console.log(value);
                  field.onChange(value);
                }}
                value={startTime ? field.value : undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                {form.formState.errors.startTime && (
                  <span className="error-msg">
                    {form.formState.errors.startTime.message}
                  </span>
                )}
                <SelectContent className="h-[200px]">
                  {timeOptions.map((time) => (
                    <SelectItem key={`start-${time}`} value={time}>
                      {removeSeconds(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="w-full">
          <Label htmlFor="end-time" className="text-xs text-muted-foreground">
            End Time
          </Label>
          <Controller
            name="endTime"
            control={control}
            rules={{ required: errMsgEndTime }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  console.log(value);
                  field.onChange(value);
                }}
                value={endTime ? field.value : undefined}
                disabled={!startTime}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                {form.formState.errors.endTime && (
                  <span className="error-msg">
                    {form.formState.errors.endTime.message}
                  </span>
                )}
                <SelectContent className="h-[200px]">
                  {validEndTimes.map((time) => (
                    <SelectItem key={`end-${time}`} value={time}>
                      {removeSeconds(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
