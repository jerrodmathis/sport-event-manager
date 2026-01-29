import { z } from "zod";

export const venueInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Must be at least 1 character" })
    .max(255, { error: "Must be less than 255 characters" }),
  address_text: z.string().trim().min(1, { error: "Must include an address" }),
  details: z
    .string()
    .max(500, { error: "Must be less than 500 characters" })
    .optional(),
});

export const createEventInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Must be at least 1 character" })
    .max(255, { error: "Must be less than 255 characters" }),
  startsAt: z.iso
    .datetime({ offset: true })
    .refine((val) => new Date(val) > new Date(), {
      error: "Event must occur in the future.",
    }),
  description: z.string().optional(),
  sportTypeId: z.uuid(),
  venues: z
    .array(venueInputSchema)
    .min(1, { error: "Add at least one venue" })
    .max(5, { error: "You can add up to 5 venues" }),
});

export const updateEventInputSchema = createEventInputSchema.extend({
  id: z.number().int().positive(),
  startsAt: z.iso.datetime({ offset: true }),
});

export const deleteEventInputSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;
export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;
export type DeleteEventInput = z.infer<typeof deleteEventInputSchema>;
