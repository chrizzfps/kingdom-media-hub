"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type FormResult = { error: string } | undefined;

/**
 * Signs in an existing admin, or completes a pending invite: any email
 * pre-approved in kingdom_admins can create its own password here — a
 * trigger on auth.users links the account automatically. Everyone else
 * gets an account with no admin rights (harmless, RLS blocks all writes).
 */
export async function signInOrRegister(_prev: FormResult, formData: FormData): Promise<FormResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (!signInError) redirect("/admin");

  // No existing account with these credentials — try creating one. This only
  // grants admin access if the email was pre-approved via kingdom_admins.
  const { error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) return { error: "Invalid credentials." };

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return { error: "Account created. Check your email to confirm it, then sign in." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
