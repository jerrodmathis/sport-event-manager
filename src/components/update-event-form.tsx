import { UpdateEventInput } from "@/utils/events/schemas";
import { X } from "lucide-react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "./ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldContent,
  FieldSet,
  FieldLegend,
} from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SportType } from "@/utils/sport-types";
import { DateTimePicker } from "./ui/datetime-picker";

export function UpdateEventForm({
  form,
  sportTypes,
}: {
  form: UseFormReturn<UpdateEventInput>;
  sportTypes: SportType[];
}) {
  const {
    fields: venueFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "venues",
  });

  return (
    <FieldGroup className="space-y-0">
      <FieldSet className="gap-4">
        <FieldLegend className="legend">Event Details</FieldLegend>
        <FieldGroup className="gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="event-name" aria-required>
                  Name
                </FieldLabel>
                <Input
                  {...field}
                  id="event-name"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="event-description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="event-description"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="startsAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="startsAt">Date/Time</FieldLabel>
                <DateTimePicker
                  id="startsAt"
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="sportTypeId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="email">Sport</FieldLabel>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="update-event-form-select-sport-type"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {sportTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
      <FieldSet className="gap-4">
        <FieldLegend variant="legend">Venue(s)</FieldLegend>
        <FieldDescription>Add location(s) for your event</FieldDescription>
        <FieldGroup className="gap-4">
          {venueFields.map((f, idx) => (
            <FieldSet key={f.id} className="gap-2">
              <FieldLegend
                variant="legend"
                className="w-full bg-muted rounded-md"
              >
                <div className="flex flex-row items-center justify-between p-1">
                  <span>Venue {idx}</span>
                  {venueFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(idx)}
                      disabled={venueFields.length <= 0}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              </FieldLegend>
              <FieldGroup className="gap-2">
                <Controller
                  name={`venues.${idx}.name`}
                  control={form.control}
                  render={({ field: venueNameField, fieldState }) => (
                    <Field className="px-6" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="venue-name">Name</FieldLabel>
                      <Input
                        {...venueNameField}
                        id="venue-name"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`venues.${idx}.address_text`}
                  control={form.control}
                  render={({ field: venueNameField, fieldState }) => (
                    <Field className="px-6" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="venue-address">Address</FieldLabel>
                      <Input
                        {...venueNameField}
                        id="venue-address"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`venues.${idx}.details`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="px-6" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="venue-details">Details</FieldLabel>
                      <Textarea
                        {...field}
                        id="venue-details"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", address_text: "", details: "" })}
            disabled={venueFields.length >= 5}
          >
            Add Venue
          </Button>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
