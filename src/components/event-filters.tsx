"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SportType } from "@/utils/sport-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function EventFilters({ sportTypes }: { sportTypes: SportType[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2 min-w-0 flex-1">
      <Input
        placeholder="Search events..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateSearchParams("search", e.target.value)}
        className="w-full lg:min-w-0 lg:flex-1 lg:max-w-[240px]"
      />
      <Select
        value={searchParams.get("sportType") ?? ""}
        onValueChange={(value) => updateSearchParams("sportType", value)}
      >
        <SelectTrigger className="w-full lg:w-auto lg:min-w-[120px]">
          <SelectValue placeholder="All sports" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sports</SelectItem>
          {sportTypes.map((sportType) => (
            <SelectItem key={sportType.id} value={sportType.name}>
              {sportType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
