"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createItem,
  deleteItem,
  reorderItems,
  setItemFlags,
  setItemVisibility,
  setSectionVisibility,
  uploadItemFlagFile,
  uploadItemImage,
} from "@/lib/cms/actions";
import { humanizeFieldKey, humanizeGroupKey } from "@/lib/cms/format";
import type { FieldValueRow, ItemRow, SectionRow } from "@/lib/cms/types";
import { useAdminSections } from "../../admin-shell";
import { FieldInput } from "./field-input";

type LocalizedValue = { en?: string; es?: string };
/** itemId -> fieldKey -> { en, es } */
type FieldsByItem = Map<string, Map<string, LocalizedValue>>;

const IMAGE_ALT = "imageAlt";

export function SectionEditor({
  section,
  initialFields,
  initialItems,
}: {
  section: SectionRow;
  initialFields: FieldValueRow[];
  initialItems: ItemRow[];
}) {
  const { refresh } = useAdminSections();
  const [items, setItems] = useState(initialItems);
  const [visible, setVisible] = useState(section.is_visible);
  const [pending, startTransition] = useTransition();

  const sectionFields = useMemo(() => {
    const map = new Map<string, LocalizedValue>();
    for (const f of initialFields) {
      if (f.owner_type !== "section") continue;
      const entry = map.get(f.field_key) ?? {};
      entry[f.locale] = f.value;
      map.set(f.field_key, entry);
    }
    return map;
  }, [initialFields]);

  const fieldsByItem = useMemo<FieldsByItem>(() => {
    const map: FieldsByItem = new Map();
    for (const f of initialFields) {
      if (f.owner_type !== "item") continue;
      const byKey = map.get(f.owner_id) ?? new Map<string, LocalizedValue>();
      const entry = byKey.get(f.field_key) ?? {};
      entry[f.locale] = f.value;
      byKey.set(f.field_key, entry);
      map.set(f.owner_id, byKey);
    }
    return map;
  }, [initialFields]);

  // Structure of each repeatable group as loaded, so a group emptied by
  // deletions stays on screen and new items keep the right fields.
  const templates = useMemo(() => {
    const map: Templates = new Map();
    for (const [groupKey, list] of groupItems(initialItems)) {
      map.set(groupKey, { fieldKeys: templateFieldKeys(list, fieldsByItem), flags: templateFlags(list) });
    }
    return map;
  }, [initialItems, fieldsByItem]);

  const topLevelGroupKeys = useMemo(
    () => [...new Set(initialItems.filter((i) => !i.parent_item_id).map((i) => i.group_key))],
    [initialItems],
  );

  const topGroups = useMemo(() => {
    const groups = groupItems(items.filter((i) => !i.parent_item_id));
    for (const key of topLevelGroupKeys) if (!groups.has(key)) groups.set(key, []);
    return groups;
  }, [items, topLevelGroupKeys]);

  function toggleSectionVisible() {
    const next = !visible;
    setVisible(next);
    startTransition(async () => {
      await setSectionVisibility(section.key, next);
      refresh();
    });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{section.label}</h1>
          <p className="mt-0.5 text-xs text-gray-400">
            Los cambios se guardan como borrador al salir de cada campo.
          </p>
        </div>
        {section.is_hideable && (
          <label className="flex shrink-0 items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={visible} onChange={toggleSectionVisible} disabled={pending} />
            Visible en la web
          </label>
        )}
      </div>

      {sectionFields.size > 0 && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Textos</h2>
          <div className="mt-4 space-y-4">
            {[...sectionFields].map(([fieldKey, byLocale]) => (
              <LocalizedPair
                key={fieldKey}
                ownerType="section"
                ownerId={section.key}
                fieldKey={fieldKey}
                value={byLocale}
                label={humanizeFieldKey(fieldKey)}
              />
            ))}
          </div>
        </div>
      )}

      {[...topGroups].map(([groupKey, groupList]) => (
        <ItemGroup
          key={groupKey}
          sectionKey={section.key}
          groupKey={groupKey}
          parentItemId={null}
          items={groupList}
          allItems={items}
          fieldsByItem={fieldsByItem}
          templates={templates}
          onItemsChange={setItems}
        />
      ))}
    </div>
  );
}

type Templates = Map<string, { fieldKeys: string[]; flags: Record<string, unknown> }>;

function groupItems(list: ItemRow[]) {
  const groups = new Map<string, ItemRow[]>();
  for (const it of list) {
    const g = groups.get(it.group_key) ?? [];
    g.push(it);
    groups.set(it.group_key, g);
  }
  for (const g of groups.values()) g.sort((a, b) => a.sort_order - b.sort_order);
  return groups;
}

/** Field keys the items in a group use, so a brand-new item gets the same inputs as its siblings. */
function templateFieldKeys(siblings: ItemRow[], fieldsByItem: FieldsByItem): string[] {
  const keys = new Set<string>();
  for (const s of siblings) for (const k of fieldsByItem.get(s.id)?.keys() ?? []) if (k !== IMAGE_ALT) keys.add(k);
  return [...keys];
}

/** Same shape as the siblings' flags, reset to neutral values. */
function templateFlags(siblings: ItemRow[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(siblings[0]?.flags ?? {})) {
    out[k] = typeof v === "boolean" ? false : typeof v === "number" ? 0 : v;
  }
  return out;
}

function ItemGroup({
  sectionKey,
  groupKey,
  parentItemId,
  items,
  allItems,
  fieldsByItem,
  templates,
  onItemsChange,
}: {
  sectionKey: string;
  groupKey: string;
  parentItemId: string | null;
  items: ItemRow[];
  allItems: ItemRow[];
  fieldsByItem: FieldsByItem;
  templates: Templates;
  onItemsChange: React.Dispatch<React.SetStateAction<ItemRow[]>>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const template = templates.get(groupKey);
  const siblingKeys = templateFieldKeys(items, fieldsByItem);
  const fieldKeys = siblingKeys.length > 0 ? siblingKeys : template?.fieldKeys.length ? template.fieldKeys : ["value"];
  // Nested groups the siblings have (e.g. a pricing plan's features), so new items get them too.
  const childGroupKeys = [
    ...new Set(allItems.filter((c) => items.some((s) => s.id === c.parent_item_id)).map((c) => c.group_key)),
  ];

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (!res.ok) setError(res.error ?? "Error inesperado.");
    });
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const ids = items.map((i) => i.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    const order = new Map(ids.map((id, i) => [id, i]));
    onItemsChange((prev) => prev.map((p) => (order.has(p.id) ? { ...p, sort_order: order.get(p.id)! } : p)));
    run(() => reorderItems(ids));
  }

  function remove(id: string) {
    if (!confirm("¿Eliminar este elemento? No se puede deshacer.")) return;
    onItemsChange((prev) => prev.filter((p) => p.id !== id && p.parent_item_id !== id));
    run(() => deleteItem(id));
  }

  function toggleVisible(item: ItemRow) {
    const next = !item.is_visible;
    onItemsChange((prev) => prev.map((p) => (p.id === item.id ? { ...p, is_visible: next } : p)));
    run(() => setItemVisibility(item.id, next));
  }

  function add() {
    run(async () => {
      const res = await createItem({
        sectionKey,
        parentItemId,
        groupKey,
        sortOrder: items.length,
        flags: items.length > 0 ? templateFlags(items) : (template?.flags ?? {}),
      });
      if (res.ok) onItemsChange((prev) => [...prev, res.item]);
      return res;
    });
  }

  return (
    <div className={parentItemId ? "mt-4" : "mt-6 rounded-2xl border border-gray-200 bg-white p-6"}>
      <div className="flex items-center justify-between">
        <h2 className={parentItemId ? "text-xs font-semibold text-gray-700" : "text-sm font-semibold text-gray-900"}>
          {humanizeGroupKey(groupKey)} <span className="font-normal text-gray-400">({items.length})</span>
        </h2>
        <button onClick={add} disabled={pending} className="text-xs font-medium text-cyan-600 hover:underline">
          + Añadir
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <ul className="mt-3 space-y-3">
        {items.map((item, i) => {
          const children = groupItems(allItems.filter((c) => c.parent_item_id === item.id));
          for (const key of childGroupKeys) if (!children.has(key)) children.set(key, []);
          return (
            <li
              key={item.id}
              className={`rounded-xl border border-gray-100 p-4 ${item.is_visible ? "bg-gray-50/60" : "bg-gray-50/30 opacity-60"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-400">
                  <button
                    aria-label="Subir"
                    disabled={i === 0 || pending}
                    onClick={() => move(i, -1)}
                    className="px-1 hover:text-gray-700 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    aria-label="Bajar"
                    disabled={i === items.length - 1 || pending}
                    onClick={() => move(i, 1)}
                    className="px-1 hover:text-gray-700 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <span className="ml-1 text-xs">#{i + 1}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 text-gray-600">
                    <input type="checkbox" checked={item.is_visible} onChange={() => toggleVisible(item)} />
                    Visible
                  </label>
                  <button onClick={() => remove(item.id)} className="text-red-500 hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {fieldKeys.map((fieldKey) => (
                  <LocalizedPair
                    key={fieldKey}
                    ownerType="item"
                    ownerId={item.id}
                    fieldKey={fieldKey}
                    value={fieldsByItem.get(item.id)?.get(fieldKey) ?? {}}
                    label={fieldKey === "value" ? "" : humanizeFieldKey(fieldKey)}
                  />
                ))}
              </div>
              <ItemFlags item={item} />
              <ItemImage item={item} alt={fieldsByItem.get(item.id)?.get(IMAGE_ALT) ?? {}} />

              {children.size > 0 && (
                <div className="ml-2 mt-2 border-l border-gray-200 pl-4">
                  {[...children].map(([childKey, childList]) => (
                    <ItemGroup
                      key={childKey}
                      sectionKey={sectionKey}
                      groupKey={childKey}
                      parentItemId={item.id}
                      items={childList}
                      allItems={allItems}
                      fieldsByItem={fieldsByItem}
                      templates={templates}
                      onItemsChange={onItemsChange}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
        {items.length === 0 && <li className="text-sm text-gray-400">Sin elementos.</li>}
      </ul>
    </div>
  );
}

function LocalizedPair({
  ownerType,
  ownerId,
  fieldKey,
  value,
  label,
}: {
  ownerType: "section" | "item";
  ownerId: string;
  fieldKey: string;
  value: LocalizedValue;
  label: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["en", "es"] as const).map((locale) => (
        <FieldInput
          key={locale}
          ownerType={ownerType}
          ownerId={ownerId}
          fieldKey={fieldKey}
          locale={locale}
          initialValue={value[locale] ?? ""}
          label={label ? `${label} (${locale.toUpperCase()})` : locale.toUpperCase()}
        />
      ))}
    </div>
  );
}

// String flags whose value is a file URL get an upload control instead of a
// text input. The value type (image vs video) is inferred from the key name.
const FILE_FLAG_KINDS: Record<string, "image" | "video"> = {
  videoUrl: "video",
  mobileImageUrl: "image",
};

// Matches the hero section's flat fallback background (--color-dark).
const DEFAULT_BACKGROUND_COLOR = "#0f172a";

function ItemFlags({ item }: { item: ItemRow }) {
  const [flags, setFlags] = useState(item.flags);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const keys = Object.keys(flags);
  if (keys.length === 0) return null;

  async function update(k: string, v: unknown) {
    const next = { ...flags, [k]: v };
    setFlags(next);
    const res = await setItemFlags(item.id, next);
    setError(res.ok ? null : res.error);
  }

  async function onFlagFile(k: string, kind: "image" | "video", e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setPendingKey(k);
    const res = await uploadItemFlagFile(item.id, k, file, kind);
    setPendingKey(null);
    if (res.ok) await update(k, res.url);
    else setError(res.error);
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-4">
      {keys.map((k) => {
        const v = flags[k];
        if (typeof v === "boolean") {
          return (
            <label key={k} className="flex items-center gap-1.5 text-xs text-gray-600">
              <input type="checkbox" checked={v} onChange={(e) => update(k, e.target.checked)} />
              {humanizeFieldKey(k)}
            </label>
          );
        }
        if (typeof v === "number") {
          return (
            <label key={k} className="flex items-center gap-1.5 text-xs text-gray-600">
              {humanizeFieldKey(k)}
              <input
                type="number"
                value={v}
                onChange={(e) => update(k, Number(e.target.value))}
                className="w-24 rounded border border-gray-300 px-1.5 py-0.5 text-xs"
              />
            </label>
          );
        }
        if (typeof v === "string" && k === "focus") {
          return (
            <label key={k} className="flex items-center gap-1.5 text-xs text-gray-600">
              {humanizeFieldKey(k)}
              <select
                value={v || "center"}
                onChange={(e) => update(k, e.target.value)}
                className="rounded border border-gray-300 px-1.5 py-0.5 text-xs"
              >
                <option value="top">Arriba</option>
                <option value="center">Centro</option>
                <option value="bottom">Abajo</option>
              </select>
            </label>
          );
        }
        if (typeof v === "string" && k === "backgroundColor") {
          return (
            <div key={k} className="flex items-center gap-2 text-xs text-gray-600">
              <span>{humanizeFieldKey(k)}</span>
              <input
                type="color"
                value={v || DEFAULT_BACKGROUND_COLOR}
                onChange={(e) => update(k, e.target.value)}
                className="h-7 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
              />
              <span className="font-mono text-[11px] text-gray-400">
                {v || `${DEFAULT_BACKGROUND_COLOR} (por defecto)`}
              </span>
              {v && (
                <button type="button" onClick={() => update(k, "")} className="text-red-500 hover:underline">
                  Restablecer
                </button>
              )}
            </div>
          );
        }
        if (typeof v === "string" && k in FILE_FLAG_KINDS) {
          const kind = FILE_FLAG_KINDS[k];
          const isPending = pendingKey === k;
          return (
            <div key={k} className="flex items-center gap-2 text-xs text-gray-600">
              <span>{humanizeFieldKey(k)}</span>
              {v && <span className="max-w-[9rem] truncate text-gray-400">{v.split("/").pop()}</span>}
              <label className="cursor-pointer text-cyan-600 hover:underline">
                {isPending ? "Subiendo…" : v ? "Reemplazar" : "Añadir"}
                <input
                  type="file"
                  accept={kind === "video" ? "video/mp4" : "image/png,image/jpeg,image/webp,image/gif,image/svg+xml"}
                  onChange={(e) => onFlagFile(k, kind, e)}
                  className="hidden"
                />
              </label>
              {v && !isPending && (
                <button type="button" onClick={() => update(k, "")} className="text-red-500 hover:underline">
                  Quitar
                </button>
              )}
              <span className="text-[10px] text-gray-400">
                {kind === "video" ? "MP4 · máx. 20 MB" : "Imagen · máx. 5 MB"}
              </span>
            </div>
          );
        }
        return null;
      })}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function ItemImage({ item, alt }: { item: ItemRow; alt: LocalizedValue }) {
  const [url, setUrl] = useState(item.image_url);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    startTransition(async () => {
      const res = await uploadItemImage(item.id, file);
      if (res.ok) setUrl(res.url);
      else setError(res.error);
    });
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt.es || alt.en || ""}
            className="h-12 w-12 rounded-lg object-cover ring-1 ring-gray-200"
          />
        )}
        <label className="cursor-pointer text-xs text-cyan-600 hover:underline">
          {pending ? "Subiendo…" : url ? "Reemplazar imagen" : "Añadir imagen"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={onFile}
            className="hidden"
          />
        </label>
        <span className="text-[11px] text-gray-400">PNG, JPG, WEBP, GIF o SVG · máx. 5 MB</span>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      {url && (
        <div className="mt-3">
          <LocalizedPair ownerType="item" ownerId={item.id} fieldKey={IMAGE_ALT} value={alt} label="Texto alternativo" />
        </div>
      )}
    </div>
  );
}
