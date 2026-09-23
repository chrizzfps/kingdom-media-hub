import { createPublicClient } from "@/lib/supabase/public";
import type { PublishedSnapshot } from "./types";

/**
 * The public homepage's single source of truth. Cached for a minute (ISR)
 * and force-refreshed on publish via revalidatePath — see lib/cms/publish.ts.
 */
export async function getPublishedContent(): Promise<PublishedSnapshot | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("kingdom_published").select("snapshot").eq("id", true).maybeSingle();

  if (error || !data) return null;
  return data.snapshot as PublishedSnapshot;
}
