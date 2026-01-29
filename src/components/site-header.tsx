"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Plus } from "lucide-react";
import { useState } from "react";
import { CreateEventDrawer } from "./create-event-drawer";
import { SportType } from "@/utils/sport-types";
import { EventFilters } from "./event-filters";

export function SiteHeader({ sportTypes }: { sportTypes: SportType[] }) {
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) py-2">
        <div className="flex w-full items-center gap-1 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-6"
          />
          <h1 className="text-base font-medium">Events</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* Mobile: Popover filters */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <EventFilters sportTypes={sportTypes} />
              </PopoverContent>
            </Popover>

            {/* Desktop: Inline filters */}
            <div className="hidden lg:flex">
              <EventFilters sportTypes={sportTypes} />
            </div>

            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-6"
            />
            <Button
              variant="default"
              size="sm"
              onClick={() => setCreateDrawerOpen(true)}
            >
              <Plus />
              <span className="hidden sm:inline">Create event</span>
            </Button>
          </div>
        </div>
      </header>

      <CreateEventDrawer
        sportTypes={sportTypes}
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
      />
    </>
  );
}
