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
    <div className="flex gap-4">
      <Input
        placeholder="Search events..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateSearchParams("search", e.target.value)}
        className="max-w-sm"
      />
      <Select
        value={searchParams.get("sportType") ?? ""}
        onValueChange={(value) => updateSearchParams("sportType", value)}
      >
        <SelectTrigger className="w-[200px]">
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
