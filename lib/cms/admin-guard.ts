import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Throws unless the current session belongs to an approved Kingdom admin. */
export async function requireAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const { data, error } = await supabase.from("kingdom_admins").select("email").eq("user_id", user.id).maybeSingle();
  if (error || !data) throw new Error("Not an authorized Kingdom admin.");

  return user;
}
