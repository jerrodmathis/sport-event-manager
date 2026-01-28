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

type EventCardProps = {
  event: {
    id: number;
    name: string;
    starts_at: string;
    description: string | null;
    sport_type_text: string | null;
    event_venues:
      | {
          id: number;
          name: string;
          address_text: string | null;
          details: string | null;
        }[]
      | null;
  };
};

export function EventCard({ event }: EventCardProps) {
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

  const handleUpdate = () => {
    // TODO: Open update dialog/form
    console.log("Update event", event.id);
  };

  const handleDelete = async () => {
    if (confirm(`Delete "${event.name}"?`)) {
      const result = await deleteEventAction({ id: event.id });
      if (!result.ok) {
        alert(result.error.join("\n"));
      }
    }
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex flex-row justify-between">
          <div>
            <CardTitle>{event.name}</CardTitle>
            <CardDescription>{date}</CardDescription>
            {event.sport_type_text && (
              <Badge className="mt-2">{event.sport_type_text}</Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleUpdate}
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
