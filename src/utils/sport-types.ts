import { createClient } from "@/lib/supabase/server";

export interface SportType {
  id: string;
  name: string;
}

export async function getSportTypes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sport_types").select();
  if (error) throw new Error(error.message);
  return data ?? [];
}
