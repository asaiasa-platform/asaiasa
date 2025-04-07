"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/lib/types";

interface DatePickerWithRangeProps {
  form: UseFormReturn<EventFormValues>;
  errMsg: string;
  className?: string;
}

export function DatePickerWithRange({
  form,
  className,
  errMsg,
}: Readonly<DatePickerWithRangeProps>) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  // pre populate form value when the component mounts or form update
  useEffect(() => {
    const formStartDate = form.getValues("startDate");
    const formEndDate = form.getValues("endDate");
    const startDate = formStartDate ? new Date(formStartDate) : undefined;
    const endDate = formEndDate ? new Date(formEndDate) : undefined;
    setDate({ from: startDate, to: endDate });
  }, [form]);

  useEffect(() => {
    // Register startDate
    form.register("startDate", {
      required: errMsg,
    });

    // Register endDate (optional)
    form.register("endDate");
  }, [form, errMsg]);

  // Set startDate and endDate
  useEffect(() => {
    if (date?.from) {
      // Set the start date as ISO / UTC
      const formattedDate = format(date?.from, "yyyy-MM-dd");
      form.setValue("startDate", formattedDate, {
        shouldValidate: true,
      });
    }

    if (date?.to) {
      // Set the end date as ISO / UTC
      const formattedDate = format(date?.to, "yyyy-MM-dd");
      form.setValue("endDate", formattedDate, {
        shouldValidate: true,
      });
    }
  }, [date, form]);

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date); // this will trigger the useEffect but useEffect will update only non undefined value
    // for undefined value handle below
    if (!date?.from) {
      form.setValue("startDate", "", {
        shouldValidate: true,
      });
    }
    if (!date?.to) {
      form.setValue("endDate", "", {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <p className="text-base font-medium">Date Range</p>
        <div className="flex gap-4 min-w-0">
          <div className="flex flex-col w-full min-w-0">
            <Label
              htmlFor="start-date"
              className="text-xs text-muted-foreground"
            >
              Start Date
            </Label>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal hover:bg-white hover:text-muted-foreground",
                  !date?.from && "text-black"
                )}
                onClick={() => setIsOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  <span>{format(date.from, "LLL dd, y")}</span>
                ) : (
                  <span>Pick start date</span>
                )}
              </Button>
            </PopoverTrigger>
            {form.formState.errors.startDate && (
              <p className="error-msg">
                {form.formState.errors.startDate.message}
              </p>
            )}
          </div>
          {/* <div className="text-lg translate-y-2">-</div> */}
          <div className="flex flex-col w-full min-w-0">
            <Label htmlFor="end-date" className="text-xs text-muted-foreground">
              <span>End Date</span>
              <span className="text-xs text-muted-foreground font-light">
                {" (optional)"}
              </span>
            </Label>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal hover:bg-white  hover:text-muted-foreground",
                  !date?.to && "text-black"
                )}
                onClick={() => setIsOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.to ? (
                  <span>{format(date.to, "LLL dd, y")}</span>
                ) : (
                  <span>Pick end date</span>
                )}
              </Button>
            </PopoverTrigger>
            {form.formState.errors.endDate && (
              <p className="error-msg">
                {form.formState.errors.endDate.message}
              </p>
            )}
          </div>
        </div>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
