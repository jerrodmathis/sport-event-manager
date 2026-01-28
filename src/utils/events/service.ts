import { SupabaseClient } from "@supabase/supabase-js";
import {
  CreateEventInput,
  DeleteEventInput,
  UpdateEventInput,
} from "./schemas";
import { Database } from "@/lib/supabase/database.types";

type DatabaseClient = SupabaseClient<Database>;

export async function createEvent(
  supabase: DatabaseClient,
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
      sport_type_text: data.sportTypeText,
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
  supabase: DatabaseClient,
  _userId: string,
  data: UpdateEventInput,
) {
  const { error: eventErr } = await supabase
    .from("events")
    .update({
      name: data.name,
      starts_at: data.startsAt,
      description: data.description ?? null,
      sport_type_id: data.sportTypeId ?? null,
      sport_type_text: data.sportTypeText,
    })
    .eq("id", data.id);

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
  supabase: DatabaseClient,
  _userId: string,
  data: DeleteEventInput,
) {
  const { error } = await supabase.from("events").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { id: data.id };
}
