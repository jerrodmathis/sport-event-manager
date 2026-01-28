import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database as DB } from "@/lib/supabase/database.types";

type SB = SupabaseClient<DB>;

export type { User };

export async function getUser(supabase: SB) {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data.user;
}

export async function getSession(supabase: SB) {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function getUserWithSession(supabase: SB) {
  const [user, session] = await Promise.all([
    getUser(supabase),
    getSession(supabase),
  ]);
  return { user, session };
}
