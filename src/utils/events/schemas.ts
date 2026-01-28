import { z } from "zod";

export const venueInputSchema = z.object({
  name: z.string().trim().min(1).max(255),
  address_text: z.string().trim().min(1).max(500),
  details: z.string().max(500).optional(),
});

export const createEventInputSchema = z.object({
  name: z.string().trim().min(1).max(255),
  startsAt: z.iso.datetime(),
  description: z.string().optional(),
  sportTypeId: z.number().int().positive().nullish(),
  sportTypeText: z.string().trim().min(1).max(80),
  venues: z.array(venueInputSchema).min(1),
});

export const updateEventInputSchema = createEventInputSchema.extend({
  id: z.number().int().positive(),
});

export const deleteEventInputSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;
export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;
export type DeleteEventInput = z.infer<typeof deleteEventInputSchema>;
