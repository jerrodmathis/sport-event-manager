"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deleteEventAction } from "@/utils/events/actions";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { UpdateEventDrawer } from "./update-event-drawer";
import { Event } from "@/utils/events/service";
import { useState } from "react";
import { SportType } from "@/utils/sport-types";

export function EventCard({
  event,
  sportTypes,
}: {
  event: Event;
  sportTypes: SportType[];
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const venues = event.event_venues ?? [];
  const venue = venues[0];
  const additionalVenueCount = venues.length - 1;
  const date = new Date(event.starts_at).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const handleDelete = async () => {
    const result = await deleteEventAction({ id: event.id });
    if (!result.ok) {
      toast.error("An error occurred deleting the event", {
        description: result.error.join(", "),
      });
    } else {
      toast.success("Event has been deleted");
    }
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex flex-row justify-between">
          <div>
            <CardTitle>{event.name}</CardTitle>
            <CardDescription>{date}</CardDescription>
            <Badge className="mt-2">
              {sportTypes.find((s) => s.id === event.sport_type_id)?.name}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setDrawerOpen(true)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UpdateEventDrawer
            event={event}
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        {event.description && (
          <div className="text-sm space-y-1">
            <div className="font-bold">Details</div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        )}
        {venue && (
          <div className="text-sm space-y-1">
            <div className="font-bold">Where?</div>
            <div>{venue.name}</div>
            {venue.address_text && (
              <div className="text-muted-foreground">{venue.address_text}</div>
            )}
            {venue.details && (
              <div className="text-muted-foreground">{venue.details}</div>
            )}
            {additionalVenueCount > 0 && (
              <div className="text-xs text-muted-foreground">
                And {additionalVenueCount} more
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
