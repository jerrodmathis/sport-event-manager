"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createEventInputSchema,
  deleteEventInputSchema,
  updateEventInputSchema,
} from "./schemas";
import z from "zod";
import { revalidatePath } from "next/cache";
import {
  createEvent,
  deleteEvent,
  listEvents,
  ListEventsParams,
  updateEvent,
} from "./service";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string[] };

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) throw new Error("Not authenticated");
  return { supabase, user: data.user };
}

export async function listEventsAction(
  params: ListEventsParams = {},
): Promise<ActionResult<{ events: Awaited<ReturnType<typeof listEvents>> }>> {
  try {
    const { supabase, user } = await requireUser();
    const events = await listEvents(supabase, user.id, params);
    return { ok: true, data: { events } };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? [err.message]
          : ["An unknown error occured while fetching events."],
    };
  }
}

export async function createEventAction(
  input: unknown,
): Promise<ActionResult<{ id: number }>> {
  try {
    const { supabase, user } = await requireUser();
    const result = createEventInputSchema.parse(input);
    const eventId = await createEvent(supabase, user.id, result);

    revalidatePath("/");
    return { ok: true, data: eventId };
  } catch (err) {
    const errorMessages: string[] = [];
    if (err instanceof z.ZodError) {
      err.issues.map((issue) => errorMessages.push(issue.message));
    } else if (err instanceof Error) {
      errorMessages.push(err.message);
    } else {
      errorMessages.push("An unknown error occured while creating the event.");
    }

    return { ok: false, error: errorMessages };
  }
}

export async function updateEventAction(
  input: unknown,
): Promise<ActionResult<{ id: number }>> {
  try {
    const { supabase, user } = await requireUser();
    const result = updateEventInputSchema.parse(input);
    const eventId = await updateEvent(supabase, user.id, result);

    revalidatePath("/");
    return { ok: true, data: eventId };
  } catch (err) {
    const errorMessages: string[] = [];
    if (err instanceof z.ZodError) {
      err.issues.map((issue) => errorMessages.push(issue.message));
    } else if (err instanceof Error) {
      errorMessages.push(err.message);
    } else {
      errorMessages.push("An unknown error occured while updating the event.");
    }

    return { ok: false, error: errorMessages };
  }
}

export async function deleteEventAction(
  input: unknown,
): Promise<ActionResult<{ id: number }>> {
  try {
    const { supabase, user } = await requireUser();
    const result = deleteEventInputSchema.parse(input);
    const eventId = await deleteEvent(supabase, user.id, result);

    revalidatePath("/");
    return { ok: true, data: eventId };
  } catch (err) {
    const errorMessages: string[] = [];
    if (err instanceof z.ZodError) {
      err.issues.map((issue) => errorMessages.push(issue.message));
    } else if (err instanceof Error) {
      errorMessages.push(err.message);
    } else {
      errorMessages.push("An unknown error occured while deleting the event.");
    }

    return { ok: false, error: errorMessages };
  }
}
