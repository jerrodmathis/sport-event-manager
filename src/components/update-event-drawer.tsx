import { useForm } from "react-hook-form";
import { UpdateEventForm } from "./update-event-form";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Separator } from "./ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateEventInput,
  updateEventInputSchema,
} from "@/utils/events/schemas";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { updateEventAction } from "@/utils/events/actions";
import { SportType } from "@/utils/sport-types";
import { type Event } from "@/utils/events/service";

export function UpdateEventDrawer({
  event,
  open,
  onOpenChange,
  sportTypes,
}: {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sportTypes: SportType[];
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      id: event.id,
      name: event.name,
      description: event.description ?? "",
      sportTypeId: event.sport_type_id,
      startsAt: event.starts_at,
      venues: event.event_venues.map((v) => ({
        name: v.name,
        address_text: v.address_text,
        details: v.details ?? "",
      })),
    },
    resolver: zodResolver(updateEventInputSchema),
  });

  const handleUpdateEvent = async (data: UpdateEventInput) => {
    console.log(data);
    try {
      const response = await updateEventAction(data);
      if (!response.ok) throw new Error(response.error.join(", "));
      onOpenChange(false);
      toast.success(`${data.name} was updated successfully`);
    } catch (err: unknown) {
      console.log(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred updating the event.",
        {
          description: "Please try again.",
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent direction="right">
        <DrawerHeader>
          <DrawerTitle>Update Event</DrawerTitle>
        </DrawerHeader>
        <Separator />
        <div className="p-4 overflow-auto">
          <UpdateEventForm form={form} sportTypes={sportTypes} />
        </div>
        <DrawerFooter>
          <Button onClick={form.handleSubmit(handleUpdateEvent)}>
            {isLoading ? "Updating event..." : "Update event"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
