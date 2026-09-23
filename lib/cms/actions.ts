"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./admin-guard";
import { buildLocaleContent } from "./build-snapshot";
import type { FieldValueRow, ItemRow, Locale, PublishedSnapshot, SectionRow } from "./types";

type ActionResult = { ok: true } | { ok: false; error: string };

function fail(error: unknown): ActionResult {
  return { ok: false, error: error instanceof Error ? error.message : "Unexpected error." };
}

// ---------------------------------------------------------------- fields --

export async function saveFieldValue(input: {
  ownerType: "section" | "item";
  ownerId: string;
  fieldKey: string;
  locale: Locale;
  value: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);
    const { error } = await supabase.from("kingdom_field_values").upsert(
      {
        owner_type: input.ownerType,
        owner_id: input.ownerId,
        field_key: input.fieldKey,
        locale: input.locale,
        value: input.value,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "owner_type,owner_id,field_key,locale" },
    );
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ----------------------------------------------------------------- items --

export async function createItem(input: {
  sectionKey: string;
  parentItemId: string | null;
  groupKey: string;
  flags?: Record<string, unknown>;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);

    let siblingsQuery = supabase
      .from("kingdom_items")
      .select("sort_order")
      .eq("section_key", input.sectionKey)
      .eq("group_key", input.groupKey);
    siblingsQuery =
      input.parentItemId === null
        ? siblingsQuery.is("parent_item_id", null)
        : siblingsQuery.eq("parent_item_id", input.parentItemId);
    const { data: siblings, error: sErr } = await siblingsQuery.order("sort_order", { ascending: false }).limit(1);
    if (sErr) throw sErr;
    const nextOrder = siblings && siblings.length > 0 ? siblings[0].sort_order + 1 : 0;

    const id = randomUUID();
    const { error } = await supabase.from("kingdom_items").insert({
      id,
      section_key: input.sectionKey,
      parent_item_id: input.parentItemId,
      group_key: input.groupKey,
      item_key: `item-${Date.now()}`,
      sort_order: nextOrder,
      flags: input.flags ?? {},
      updated_by: user.id,
    });
    if (error) throw error;
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unexpected error." };
  }
}

export async function deleteItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    await requireAdmin(supabase);
    const { error } = await supabase.from("kingdom_items").delete().eq("id", id);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setItemVisibility(id: string, isVisible: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);
    const { error } = await supabase
      .from("kingdom_items")
      .update({ is_visible: isVisible, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setItemFlags(id: string, flags: Record<string, unknown>): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);
    const { error } = await supabase
      .from("kingdom_items")
      .update({ flags, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Reorders a group of sibling items to match the given id order. */
export async function reorderItems(ids: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);
    for (let i = 0; i < ids.length; i++) {
      const { error } = await supabase
        .from("kingdom_items")
        .update({ sort_order: i, updated_by: user.id, updated_at: new Date().toISOString() })
        .eq("id", ids[i]);
      if (error) throw error;
    }
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// -------------------------------------------------------------- sections --

export async function setSectionVisibility(key: string, isVisible: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);
    const { data: section, error: sErr } = await supabase
      .from("kingdom_sections")
      .select("is_hideable")
      .eq("key", key)
      .single();
    if (sErr) throw sErr;
    if (!section.is_hideable && !isVisible) throw new Error("This section can't be hidden.");

    const { error } = await supabase
      .from("kingdom_sections")
      .update({ is_visible: isVisible, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Reorders the reorderable homepage sections to match the given key order. */
export async function reorderSections(keys: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);
    for (let i = 0; i < keys.length; i++) {
      const { error } = await supabase
        .from("kingdom_sections")
        .update({ sort_order: i + 1, updated_by: user.id, updated_at: new Date().toISOString() })
        .eq("key", keys[i])
        .eq("is_reorderable", true);
      if (error) throw error;
    }
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------- images --

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

export async function uploadItemImage(
  itemId: string,
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const supabase = await createClient();
  try {
    await requireAdmin(supabase);

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("File is larger than 5MB.");
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const path = `items/${itemId}-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from("kingdom-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from("kingdom-media").getPublicUrl(path);

    const user = await requireAdmin(supabase);
    const { error } = await supabase
      .from("kingdom_items")
      .update({ image_url: pub.publicUrl, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq("id", itemId);
    if (error) throw error;

    return { ok: true, url: pub.publicUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unexpected error." };
  }
}

// -------------------------------------------------------------- publish --

async function fetchAllDraft(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [{ data: sections, error: e1 }, { data: items, error: e2 }, { data: fields, error: e3 }] = await Promise.all([
    supabase.from("kingdom_sections").select("*").order("sort_order", { ascending: true }),
    supabase.from("kingdom_items").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
    supabase.from("kingdom_field_values").select("*"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  if (e3) throw e3;
  return {
    sections: sections as SectionRow[],
    items: items as ItemRow[],
    fields: fields as FieldValueRow[],
  };
}

function buildSnapshot(sections: SectionRow[], items: ItemRow[], fields: FieldValueRow[]): PublishedSnapshot {
  return {
    en: buildLocaleContent(sections, items, fields, "en"),
    es: buildLocaleContent(sections, items, fields, "es"),
    sections: sections.map((s) => ({
      key: s.key,
      label: s.label,
      group: s.section_group,
      sortOrder: s.sort_order,
      isVisible: s.is_visible,
      isHideable: s.is_hideable,
      isReorderable: s.is_reorderable,
    })),
  };
}

export async function publishDraft(note?: string): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);
    const { sections, items, fields } = await fetchAllDraft(supabase);
    const snapshot = buildSnapshot(sections, items, fields);

    const { data: log, error: logErr } = await supabase
      .from("kingdom_publish_log")
      .insert({ snapshot: snapshot as unknown as object, note: note ?? null, published_by: user.id })
      .select("id")
      .single();
    if (logErr) throw logErr;

    const { error: pubErr } = await supabase.from("kingdom_published").upsert({
      id: true,
      snapshot: snapshot as unknown as object,
      log_id: log.id,
      updated_at: new Date().toISOString(),
    });
    if (pubErr) throw pubErr;

    revalidatePath("/en");
    revalidatePath("/es");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function getPublishHistory(): Promise<
  Array<{ id: number; note: string | null; published_at: string; published_by: string | null }>
> {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const { data, error } = await supabase
    .from("kingdom_publish_log")
    .select("id, note, published_at, published_by")
    .order("published_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data;
}

/** Restores a previous published snapshot. Recorded as a new log entry — history is append-only. */
export async function rollbackToLog(logId: number): Promise<ActionResult> {
  const supabase = await createClient();
  try {
    const user = await requireAdmin(supabase);
    const { data: log, error: logErr } = await supabase
      .from("kingdom_publish_log")
      .select("snapshot")
      .eq("id", logId)
      .single();
    if (logErr) throw logErr;

    const { data: newLog, error: insErr } = await supabase
      .from("kingdom_publish_log")
      .insert({ snapshot: log.snapshot, note: `Rollback to version #${logId}`, published_by: user.id })
      .select("id")
      .single();
    if (insErr) throw insErr;

    const { error: pubErr } = await supabase.from("kingdom_published").upsert({
      id: true,
      snapshot: log.snapshot,
      log_id: newLog.id,
      updated_at: new Date().toISOString(),
    });
    if (pubErr) throw pubErr;

    revalidatePath("/en");
    revalidatePath("/es");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function getPreviewSnapshot(): Promise<PublishedSnapshot> {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const [{ data: sections, error: e1 }, { data: items, error: e2 }, { data: fields, error: e3 }] = await Promise.all([
    supabase.from("kingdom_sections").select("*").order("sort_order", { ascending: true }),
    supabase.from("kingdom_items").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
    supabase.from("kingdom_field_values").select("*"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  if (e3) throw e3;
  return buildSnapshot(sections as SectionRow[], items as ItemRow[], fields as FieldValueRow[]);
}
