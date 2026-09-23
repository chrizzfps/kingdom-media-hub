import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Browser client for the admin panel. Publishable key only — every write is
 * authorized by RLS (kingdom_is_admin()), never by this code.
 */
export function createClient() {
  client ??= createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  return client;
}
