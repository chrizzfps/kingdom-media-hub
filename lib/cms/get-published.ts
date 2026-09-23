import { createPublicClient } from "@/lib/supabase/public";
import type { PublishedSnapshot } from "./types";

/**
 * The homepage's single source of truth, read during `npm run build`.
 * Throws on network/query errors so a failed read breaks the build instead of
 * silently shipping stale copy. Returns null only when nothing was ever published.
 */
export async function getPublishedContent(): Promise<PublishedSnapshot | null> {
  const { data, error } = await createPublicClient()
    .from("kingdom_published")
    .select("snapshot")
    .eq("id", true)
    .maybeSingle();
  if (error) throw new Error(`Could not read published CMS content: ${error.message}`);
  return (data?.snapshot as PublishedSnapshot | undefined) ?? null;
}
