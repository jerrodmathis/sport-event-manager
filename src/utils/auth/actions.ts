"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { loginSchema, signUpSchema } from "./schemas";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string[] };

export async function loginAction(input: unknown): Promise<ActionResult<void>> {
  try {
    const result = loginSchema.parse(input);
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: result.email,
      password: result.password,
    });

    if (error) throw error;

    revalidatePath("/", "layout");
  } catch (err) {
    const errorMessages: string[] = [];
    if (err instanceof z.ZodError) {
      err.issues.forEach((issue) => errorMessages.push(issue.message));
    } else if (err instanceof Error) {
      errorMessages.push(err.message);
    } else {
      errorMessages.push("An unknown error occurred while signing in.");
    }
    return { ok: false, error: errorMessages };
  }

  redirect("/");
}

export async function signUpAction(
  input: unknown,
): Promise<ActionResult<void>> {
  try {
    const result = signUpSchema.parse(input);
    const supabase = await createClient();

    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const { error } = await supabase.auth.signUp({
      email: result.email,
      password: result.password,
      options: {
        data: {
          display_name: result.name,
        },
        emailRedirectTo: `${origin}/`,
      },
    });

    if (error) throw error;

    revalidatePath("/", "layout");
  } catch (err) {
    const errorMessages: string[] = [];
    if (err instanceof z.ZodError) {
      err.issues.forEach((issue) => errorMessages.push(issue.message));
    } else if (err instanceof Error) {
      errorMessages.push(err.message);
    } else {
      errorMessages.push("An unknown error occurred while signing up.");
    }
    return { ok: false, error: errorMessages };
  }

  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
