import { useForm } from "react-hook-form";
import { CreateEventForm } from "./create-event-form";
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
  CreateEventInput,
  createEventInputSchema,
} from "@/utils/events/schemas";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { createEventAction } from "@/utils/events/actions";
import { SportType } from "@/utils/sport-types";

export function CreateEventDrawer({
  open,
  onOpenChange,
  sportTypes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sportTypes: SportType[];
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      sportTypeId: sportTypes[0].id,
      startsAt: new Date().toJSON(),
      venues: [],
    },
    resolver: zodResolver(createEventInputSchema),
  });

  const handleCreateEvent = async (data: CreateEventInput) => {
    console.log(data);
    try {
      const response = await createEventAction(data);
      if (!response.ok) throw new Error(response.error.join(", "));
      onOpenChange(false);
      toast.success(`${data.name} was created successfully`);
      form.reset();
    } catch (err: unknown) {
      console.log(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred creating the event.",
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
          <DrawerTitle>Create Event</DrawerTitle>
        </DrawerHeader>
        <Separator />
        <div className="p-4 overflow-auto">
          <CreateEventForm form={form} sportTypes={sportTypes} />
        </div>
        <DrawerFooter>
          <Button
            onClick={form.handleSubmit(handleCreateEvent, (errors) => {
              console.log("validation errors", errors);
            })}
          >
            {isLoading ? "Creating event..." : "Create event"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
