import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database as DB } from "@/lib/supabase/database.types";
import {
  CreateEventInput,
  DeleteEventInput,
  UpdateEventInput,
} from "./schemas";

type SB = SupabaseClient<DB>;

export type ListEventsParams = {
  search?: string;
  sportTypeId?: string;
  limit?: number;
  offset?: number;
};

export type Event = Awaited<ReturnType<typeof listEvents>>[number];

export async function listEvents(
  supabase: SB,
  userId: string,
  params: ListEventsParams = {},
) {
  let query = supabase
    .from("events")
    .select(
      `
        id, 
        name, 
        starts_at, 
        sport_type_id, 
        description, 
        event_venues ( 
          id, 
          name, 
          address_text, 
          details 
        )
  `,
    )
    .eq("created_by", userId)
    .order("starts_at", { ascending: false });

  const search = params.search?.trim();
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (params.sportTypeId) {
    query = query.eq("sport_type_id", params.sportTypeId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createEvent(
  supabase: SB,
  userId: string,
  data: CreateEventInput,
) {
  const { data: eventRow, error: eventErr } = await supabase
    .from("events")
    .insert({
      created_by: userId,
      name: data.name,
      starts_at: data.startsAt,
      description: data.description ?? null,
      sport_type_id: data.sportTypeId ?? null,
    })
    .select("id")
    .single();

  if (eventErr) throw new Error(eventErr.message);

  const venuesRows = data.venues.map((v) => ({
    event_id: eventRow.id,
    name: v.name,
    address_text: v.address_text,
    details: v.details ?? null,
  }));

  const { error: venuesErr } = await supabase
    .from("event_venues")
    .insert(venuesRows);

  if (venuesErr) {
    await supabase.from("events").delete().eq("id", eventRow.id);
    throw new Error(venuesErr.message);
  }

  return { id: eventRow.id };
}

export async function updateEvent(
  supabase: SB,
  userId: string,
  data: UpdateEventInput,
) {
  const { error: eventErr } = await supabase
    .from("events")
    .update({
      name: data.name,
      starts_at: data.startsAt,
      description: data.description ?? null,
      sport_type_id: data.sportTypeId ?? null,
    })
    .eq("id", data.id)
    .eq("created_by", userId);

  if (eventErr) throw new Error(eventErr.message);

  const { error: delErr } = await supabase
    .from("event_venues")
    .delete()
    .eq("event_id", data.id);

  if (delErr) throw new Error(delErr.message);

  const venuesRows = data.venues.map((v) => ({
    event_id: data.id,
    name: v.name,
    address_text: v.address_text,
    details: v.details ?? null,
  }));

  const { error: venuesErr } = await supabase
    .from("event_venues")
    .insert(venuesRows);

  if (venuesErr) throw new Error(venuesErr.message);

  return { id: data.id };
}

export async function deleteEvent(
  supabase: SB,
  userId: string,
  data: DeleteEventInput,
) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", data.id)
    .eq("created_by", userId);

  if (error) throw new Error(error.message);
  return { id: data.id };
}
