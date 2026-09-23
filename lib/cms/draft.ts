import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { FieldValueRow, ItemRow, SectionRow } from "./types";

export async function getSections(): Promise<SectionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kingdom_sections")
    .select("*")
    .order("section_group", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as SectionRow[];
}

export async function getSection(key: string): Promise<SectionRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("kingdom_sections").select("*").eq("key", key).maybeSingle();
  if (error) throw error;
  return data as SectionRow | null;
}

/** Every field value and item (including hidden ones) belonging to a section, for editing. */
export async function getSectionDraft(sectionKey: string): Promise<{
  fields: FieldValueRow[];
  items: ItemRow[];
}> {
  const supabase = await createClient();

  const { data: items, error: itemsError } = await supabase
    .from("kingdom_items")
    .select("*")
    .eq("section_key", sectionKey)
    .order("group_key", { ascending: true })
    .order("sort_order", { ascending: true });
  if (itemsError) throw itemsError;

  const itemIds = (items as ItemRow[]).map((i) => i.id);
  const { data: sectionFields, error: sfError } = await supabase
    .from("kingdom_field_values")
    .select("*")
    .eq("owner_type", "section")
    .eq("owner_id", sectionKey);
  if (sfError) throw sfError;

  let itemFields: FieldValueRow[] = [];
  if (itemIds.length > 0) {
    const { data, error } = await supabase
      .from("kingdom_field_values")
      .select("*")
      .eq("owner_type", "item")
      .in("owner_id", itemIds);
    if (error) throw error;
    itemFields = data as FieldValueRow[];
  }

  return {
    fields: [...(sectionFields as FieldValueRow[]), ...itemFields],
    items: items as ItemRow[],
  };
}
