import { createClient } from "@/lib/supabase/client";
import { buildLocaleContent } from "./build-snapshot";
import type { FieldValueRow, ItemRow, Locale, PublishedSnapshot, SectionRow } from "./types";

// Runs in the browser with the admin's own session. Authorization is enforced
// by RLS (kingdom_is_admin()) and the storage bucket's own type/size limits —
// the checks here only exist to give clear error messages.

type ActionResult = { ok: true } | { ok: false; error: string };

function fail(error: unknown): ActionResult {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message: unknown }).message)
        : "Unexpected error.";
  return { ok: false, error: message };
}

const now = () => new Date().toISOString();

async function currentUserId() {
  const { data } = await createClient().auth.getUser();
  if (!data.user) throw new Error("Tu sesión expiró. Vuelve a entrar.");
  return data.user.id;
}

// ------------------------------------------------------------------ auth --

export async function signIn(email: string, password: string): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { ok: false, error: "Email o contraseña incorrectos." } : { ok: true };
}

export async function signOut() {
  await createClient().auth.signOut();
}

/** Returns the admin's email, or null when signed out / not an approved admin. */
export async function getAdminStatus(): Promise<
  { state: "signed-out" } | { state: "not-admin"; email: string } | { state: "admin"; email: string }
> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { state: "signed-out" };

  const { data: admin } = await supabase
    .from("kingdom_admins")
    .select("email")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return admin
    ? { state: "admin", email: admin.email }
    : { state: "not-admin", email: data.user.email ?? "" };
}

// ----------------------------------------------------------------- reads --

export async function getSections(): Promise<SectionRow[]> {
  const { data, error } = await createClient()
    .from("kingdom_sections")
    .select("*")
    .order("section_group", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as SectionRow[];
}

/** Section row plus every field value and item (hidden ones included), for editing. */
export async function getSectionDraft(key: string): Promise<{
  section: SectionRow | null;
  fields: FieldValueRow[];
  items: ItemRow[];
}> {
  const supabase = createClient();

  const [{ data: section, error: e1 }, { data: items, error: e2 }, { data: sectionFields, error: e3 }] =
    await Promise.all([
      supabase.from("kingdom_sections").select("*").eq("key", key).maybeSingle(),
      supabase.from("kingdom_items").select("*").eq("section_key", key).order("sort_order", { ascending: true }),
      supabase.from("kingdom_field_values").select("*").eq("owner_type", "section").eq("owner_id", key),
    ]);
  if (e1) throw e1;
  if (e2) throw e2;
  if (e3) throw e3;

  const itemIds = (items as ItemRow[]).map((i) => i.id);
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
    section: section as SectionRow | null,
    fields: [...(sectionFields as FieldValueRow[]), ...itemFields],
    items: items as ItemRow[],
  };
}

export async function getPublishHistory(): Promise<
  Array<{ id: number; note: string | null; published_at: string }>
> {
  const { data, error } = await createClient()
    .from("kingdom_publish_log")
    .select("id, note, published_at")
    .order("published_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data;
}

/** PostgREST caps each response (1000 rows by default), so read in pages. */
async function fetchAllFieldValues(): Promise<FieldValueRow[]> {
  const PAGE = 1000;
  const rows: FieldValueRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await createClient()
      .from("kingdom_field_values")
      .select("*")
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...(data as FieldValueRow[]));
    if (data.length < PAGE) return rows;
  }
}

async function buildDraftSnapshot(): Promise<PublishedSnapshot> {
  const supabase = createClient();
  const [{ data: sections, error: e1 }, { data: items, error: e2 }, f] = await Promise.all([
    supabase.from("kingdom_sections").select("*").order("sort_order", { ascending: true }),
    supabase.from("kingdom_items").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
    fetchAllFieldValues(),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;

  const s = sections as SectionRow[];
  const i = items as ItemRow[];
  return {
    en: buildLocaleContent(s, i, f, "en"),
    es: buildLocaleContent(s, i, f, "es"),
    sections: s.map((row) => ({
      key: row.key,
      label: row.label,
      group: row.section_group,
      sortOrder: row.sort_order,
      isVisible: row.is_visible,
      isHideable: row.is_hideable,
      isReorderable: row.is_reorderable,
    })),
  };
}

export const getPreviewSnapshot = buildDraftSnapshot;

// ---------------------------------------------------------------- fields --

export async function saveFieldValue(input: {
  ownerType: "section" | "item";
  ownerId: string;
  fieldKey: string;
  locale: Locale;
  value: string;
}): Promise<ActionResult> {
  try {
    const userId = await currentUserId();
    const { error } = await createClient().from("kingdom_field_values").upsert(
      {
        owner_type: input.ownerType,
        owner_id: input.ownerId,
        field_key: input.fieldKey,
        locale: input.locale,
        value: input.value,
        updated_by: userId,
        updated_at: now(),
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
  sortOrder: number;
  flags?: Record<string, unknown>;
}): Promise<{ ok: true; item: ItemRow } | { ok: false; error: string }> {
  try {
    const userId = await currentUserId();
    const { data, error } = await createClient()
      .from("kingdom_items")
      .insert({
        section_key: input.sectionKey,
        parent_item_id: input.parentItemId,
        group_key: input.groupKey,
        item_key: `item-${Date.now()}`,
        sort_order: input.sortOrder,
        flags: input.flags ?? {},
        updated_by: userId,
      })
      .select("*")
      .single();
    if (error) throw error;
    return { ok: true, item: data as ItemRow };
  } catch (e) {
    const r = fail(e);
    return { ok: false, error: r.ok ? "" : r.error };
  }
}

export async function deleteItem(id: string): Promise<ActionResult> {
  try {
    const { error } = await createClient().from("kingdom_items").delete().eq("id", id);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

async function updateItem(id: string, patch: Partial<ItemRow>): Promise<ActionResult> {
  try {
    const userId = await currentUserId();
    const { error } = await createClient()
      .from("kingdom_items")
      .update({ ...patch, updated_by: userId, updated_at: now() })
      .eq("id", id);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export const setItemVisibility = (id: string, isVisible: boolean) => updateItem(id, { is_visible: isVisible });
export const setItemFlags = (id: string, flags: Record<string, unknown>) => updateItem(id, { flags });

/** Reorders a group of sibling items to match the given id order. */
export async function reorderItems(ids: string[]): Promise<ActionResult> {
  for (let i = 0; i < ids.length; i++) {
    const res = await updateItem(ids[i], { sort_order: i });
    if (!res.ok) return res;
  }
  return { ok: true };
}

// -------------------------------------------------------------- sections --

async function updateSection(key: string, patch: Partial<SectionRow>): Promise<ActionResult> {
  try {
    const userId = await currentUserId();
    const { error } = await createClient()
      .from("kingdom_sections")
      .update({ ...patch, updated_by: userId, updated_at: now() })
      .eq("key", key);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export const setSectionVisibility = (key: string, isVisible: boolean) => updateSection(key, { is_visible: isVisible });

/** Reorders the homepage sections to match the given key order. */
export async function reorderSections(keys: string[]): Promise<ActionResult> {
  for (let i = 0; i < keys.length; i++) {
    const res = await updateSection(keys[i], { sort_order: i + 1 });
    if (!res.ok) return res;
  }
  return { ok: true };
}

// ---------------------------------------------------------------- images --

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

const MAX_VIDEO_BYTES = 20 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4"]);

export async function uploadItemImage(
  itemId: string,
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false, error: "Formato no permitido. Usa PNG, JPG, WEBP, GIF o SVG." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "La imagen pesa más de 5 MB." };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `items/${itemId}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("kingdom-media")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (upErr) return { ok: false, error: upErr.message };

  const { data: pub } = supabase.storage.from("kingdom-media").getPublicUrl(path);
  const res = await updateItem(itemId, { image_url: pub.publicUrl });
  return res.ok ? { ok: true, url: pub.publicUrl } : res;
}

/**
 * Uploads a file (image or video) into an item's `flags` object instead of
 * the dedicated `image_url` column — used for fields that don't fit that
 * column, e.g. an optional hero background video or a mobile-crop image.
 * Only uploads to storage; the caller persists the returned URL via
 * `setItemFlags` so there's a single write path for the flags object.
 */
export async function uploadItemFlagFile(
  itemId: string,
  flagKey: string,
  file: File,
  kind: "image" | "video",
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const allowed = kind === "video" ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
  const maxBytes = kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (!allowed.has(file.type)) {
    return {
      ok: false,
      error: kind === "video" ? "Formato no permitido. Usa MP4." : "Formato no permitido. Usa PNG, JPG, WEBP, GIF o SVG.",
    };
  }
  if (file.size > maxBytes) {
    return { ok: false, error: `El archivo pesa más de ${maxBytes / (1024 * 1024)} MB.` };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `items/${itemId}-${flagKey}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("kingdom-media")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (upErr) return { ok: false, error: upErr.message };

  const { data: pub } = supabase.storage.from("kingdom-media").getPublicUrl(path);
  return { ok: true, url: pub.publicUrl };
}

// -------------------------------------------------------------- publish --

async function setPublished(snapshot: unknown, note: string | null): Promise<ActionResult> {
  try {
    const userId = await currentUserId();
    const supabase = createClient();

    const { data: log, error: logErr } = await supabase
      .from("kingdom_publish_log")
      .insert({ snapshot, note, published_by: userId })
      .select("id")
      .single();
    if (logErr) throw logErr;

    const { error: pubErr } = await supabase
      .from("kingdom_published")
      .upsert({ id: true, snapshot, log_id: log.id, updated_at: now() });
    if (pubErr) throw pubErr;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function publishDraft(note?: string): Promise<ActionResult> {
  try {
    const snapshot = await buildDraftSnapshot();
    return setPublished(snapshot, note || null);
  } catch (e) {
    return fail(e);
  }
}

/** Restores a previous published snapshot. Recorded as a new log entry — history is append-only. */
export async function rollbackToLog(logId: number): Promise<ActionResult> {
  try {
    const { data, error } = await createClient()
      .from("kingdom_publish_log")
      .select("snapshot")
      .eq("id", logId)
      .single();
    if (error) throw error;
    return setPublished(data.snapshot, `Restaurada la versión #${logId}`);
  } catch (e) {
    return fail(e);
  }
}
