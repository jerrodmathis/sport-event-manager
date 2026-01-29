"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser, getSession, getUserWithSession } from "./service";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string[] };

export async function getUserAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof getUser>>>
> {
  try {
    const supabase = await createClient();
    const user = await getUser(supabase);
    return { ok: true, data: user };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? [err.message]
          : ["An unknown error occurred while fetching user."],
    };
  }
}

export async function getSessionAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof getSession>>>
> {
  try {
    const supabase = await createClient();
    const session = await getSession(supabase);
    return { ok: true, data: session };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? [err.message]
          : ["An unknown error occurred while fetching session."],
    };
  }
}

export async function getUserWithSessionAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof getUserWithSession>>>
> {
  try {
    const supabase = await createClient();
    const result = await getUserWithSession(supabase);
    return { ok: true, data: result };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? [err.message]
          : ["An unknown error occurred while fetching user and session."],
    };
  }
}
