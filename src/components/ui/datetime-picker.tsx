"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  id,
  "aria-invalid": ariaInvalid,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = value ? new Date(value) : undefined;

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const get12Hour = (hours: number) => {
    if (hours === 0) return 12;
    if (hours > 12) return hours - 12;
    return hours;
  };

  const getPeriod = (hours: number) => (hours >= 12 ? "PM" : "AM");

  const roundToNearest5 = (min: number) => Math.round(min / 5) * 5;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange?.("");
      return;
    }

    const currentDate = date || new Date();
    selectedDate.setHours(currentDate.getHours());
    selectedDate.setMinutes(currentDate.getMinutes());

    onChange?.(selectedDate.toISOString());
  };

  const handleTimeChange = (type: "hours" | "minutes", timeValue: string) => {
    if (!date) return;

    const newDate = new Date(date);
    if (type === "hours") {
      const hours12 = parseInt(timeValue) || 12;
      const isPM = getPeriod(date.getHours()) === "PM";
      let hours24 = hours12;

      if (hours12 === 12) {
        hours24 = isPM ? 12 : 0;
      } else {
        hours24 = isPM ? hours12 + 12 : hours12;
      }

      newDate.setHours(hours24);
    } else {
      newDate.setMinutes(parseInt(timeValue) || 0);
    }

    onChange?.(newDate.toISOString());
  };

  const handlePeriodChange = (period: string) => {
    if (!date) return;

    const newDate = new Date(date);
    const currentHours = newDate.getHours();
    const current12Hour = get12Hour(currentHours);
    const isPM = period === "PM";

    let hours24 = current12Hour;
    if (current12Hour === 12) {
      hours24 = isPM ? 12 : 0;
    } else {
      hours24 = isPM ? current12Hour + 12 : current12Hour;
    }

    newDate.setHours(hours24);
    onChange?.(newDate.toISOString());
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          disabled={disabled}
          aria-invalid={ariaInvalid}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP 'at' p")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <Select
              value={date ? get12Hour(date.getHours()).toString() : "12"}
              onValueChange={(val) => handleTimeChange("hours", val)}
              disabled={!date}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {hours.map((h) => (
                  <SelectItem key={h} value={h.toString()}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>:</span>
            <Select
              value={date ? roundToNearest5(date.getMinutes()).toString() : "0"}
              onValueChange={(val) => handleTimeChange("minutes", val)}
              disabled={!date}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="item-aligned"
                className="w-[var(--radix-select-trigger-width)]"
              >
                {minutes.map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {m.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={date ? getPeriod(date.getHours()) : "AM"}
              onValueChange={handlePeriodChange}
              disabled={!date}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
