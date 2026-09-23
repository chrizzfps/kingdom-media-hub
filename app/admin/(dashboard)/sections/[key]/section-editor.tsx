"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createItem,
  deleteItem,
  reorderItems,
  setItemFlags,
  setItemVisibility,
  setSectionVisibility,
  uploadItemImage,
} from "@/lib/cms/actions";
import { humanizeFieldKey, humanizeGroupKey } from "@/lib/cms/format";
import type { FieldValueRow, ItemRow, SectionRow } from "@/lib/cms/types";
import { FieldInput } from "./field-input";

export function SectionEditor({
  section,
  initialFields,
  initialItems,
}: {
  section: SectionRow;
  initialFields: FieldValueRow[];
  initialItems: ItemRow[];
}) {
  const [items, setItems] = useState(initialItems);
  const [visible, setVisible] = useState(section.is_visible);
  const [pending, startTransition] = useTransition();

  const sectionFields = useMemo(
    () =>
      initialFields
        .filter((f) => f.owner_type === "section")
        .reduce<Record<string, { en?: string; es?: string }>>((acc, f) => {
          acc[f.field_key] ??= {};
          acc[f.field_key][f.locale] = f.value;
          return acc;
        }, {}),
    [initialFields],
  );

  const fieldsByItem = useMemo(() => {
    const map = new Map<string, { en?: string; es?: string; fieldKey: string }[]>();
    for (const f of initialFields) {
      if (f.owner_type !== "item") continue;
      if (!map.has(f.owner_id)) map.set(f.owner_id, []);
      const list = map.get(f.owner_id)!;
      let entry = list.find((e) => e.fieldKey === f.field_key);
      if (!entry) {
        entry = { fieldKey: f.field_key };
        list.push(entry);
      }
      entry[f.locale] = f.value;
    }
    return map;
  }, [initialFields]);

  const topGroups = useMemo(() => {
    const groups = new Map<string, ItemRow[]>();
    for (const it of items) {
      if (it.parent_item_id) continue;
      if (!groups.has(it.group_key)) groups.set(it.group_key, []);
      groups.get(it.group_key)!.push(it);
    }
    for (const list of groups.values()) list.sort((a, b) => a.sort_order - b.sort_order);
    return groups;
  }, [items]);

  function childrenOf(parentId: string) {
    return items.filter((i) => i.parent_item_id === parentId).sort((a, b) => a.sort_order - b.sort_order);
  }

  function toggleSectionVisible() {
    const next = !visible;
    setVisible(next);
    startTransition(() => { void setSectionVisibility(section.key, next); });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{section.label}</h1>
          <p className="mt-0.5 text-xs text-gray-400">Sección: {section.key}</p>
        </div>
        {section.is_hideable && (
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={visible} onChange={toggleSectionVisible} disabled={pending} />
            Visible en la web
          </label>
        )}
      </div>

      {Object.keys(sectionFields).length > 0 && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Textos</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(sectionFields).map(([fieldKey, byLocale]) => (
              <div key={fieldKey} className="grid gap-3 sm:grid-cols-2">
                <FieldInput
                  ownerType="section"
                  ownerId={section.key}
                  fieldKey={fieldKey}
                  locale="en"
                  initialValue={byLocale.en ?? ""}
                  label={`${humanizeFieldKey(fieldKey)} (EN)`}
                />
                <FieldInput
                  ownerType="section"
                  ownerId={section.key}
                  fieldKey={fieldKey}
                  locale="es"
                  initialValue={byLocale.es ?? ""}
                  label={`${humanizeFieldKey(fieldKey)} (ES)`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {[...topGroups.entries()].map(([groupKey, groupItems]) => (
        <ItemGroup
          key={groupKey}
          sectionKey={section.key}
          groupKey={groupKey}
          parentItemId={null}
          items={groupItems}
          fieldsByItem={fieldsByItem}
          childrenOf={childrenOf}
          onItemsChange={setItems}
        />
      ))}
    </div>
  );
}

function ItemGroup({
  sectionKey,
  groupKey,
  parentItemId,
  items,
  fieldsByItem,
  childrenOf,
  onItemsChange,
}: {
  sectionKey: string;
  groupKey: string;
  parentItemId: string | null;
  items: ItemRow[];
  fieldsByItem: Map<string, { en?: string; es?: string; fieldKey: string }[]>;
  childrenOf: (parentId: string) => ItemRow[];
  onItemsChange: React.Dispatch<React.SetStateAction<ItemRow[]>>;
}) {
  const [pending, startTransition] = useTransition();

  function move(id: string, dir: -1 | 1) {
    const ids = items.map((i) => i.id);
    const idx = ids.indexOf(id);
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= ids.length) return;
    [ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]];
    onItemsChange((prev) => {
      const byId = new Map(prev.map((p) => [p.id, p]));
      ids.forEach((id, i) => {
        const it = byId.get(id);
        if (it) it.sort_order = i;
      });
      return [...prev];
    });
    startTransition(() => { void reorderItems(ids); });
  }

  function remove(id: string) {
    if (!confirm("¿Eliminar este elemento?")) return;
    onItemsChange((prev) => prev.filter((p) => p.id !== id && p.parent_item_id !== id));
    startTransition(() => { void deleteItem(id); });
  }

  function toggleVisible(item: ItemRow) {
    const next = !item.is_visible;
    onItemsChange((prev) => prev.map((p) => (p.id === item.id ? { ...p, is_visible: next } : p)));
    startTransition(() => { void setItemVisibility(item.id, next); });
  }

  async function addItem() {
    const flags = groupKey === "plans" ? { popular: false } : {};
    const res = await createItem({ sectionKey, parentItemId, groupKey, flags });
    if (res.ok) {
      onItemsChange((prev) => [
        ...prev,
        {
          id: res.id,
          section_key: sectionKey,
          parent_item_id: parentItemId,
          group_key: groupKey,
          item_key: `item-${Date.now()}`,
          sort_order: items.length,
          is_visible: true,
          image_url: null,
          flags,
        },
      ]);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">{humanizeGroupKey(groupKey)}</h2>
        <button onClick={addItem} className="text-xs font-medium text-cyan-600 hover:underline">
          + Añadir
        </button>
      </div>

      <ul className="mt-4 space-y-4">
        {items.map((item, i) => (
          <li key={item.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button disabled={i === 0 || pending} onClick={() => move(item.id, -1)} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                  ↑
                </button>
                <button
                  disabled={i === items.length - 1 || pending}
                  onClick={() => move(item.id, 1)}
                  className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 text-gray-600">
                  <input type="checkbox" checked={item.is_visible} onChange={() => toggleVisible(item)} disabled={pending} />
                  Visible
                </label>
                <button onClick={() => remove(item.id)} className="text-red-500 hover:underline">
                  Eliminar
                </button>
              </div>
            </div>

            <ItemFields item={item} fields={fieldsByItem.get(item.id) ?? []} />
            <ItemFlags item={item} />
            <ItemImage item={item} />

            {childrenOf(item.id).length > 0 || ["plans"].includes(groupKey) ? (
              <div className="ml-4 mt-4 border-l border-gray-200 pl-4">
                <NestedGroup
                  sectionKey={sectionKey}
                  parentItemId={item.id}
                  items={childrenOf(item.id)}
                  fieldsByItem={fieldsByItem}
                  childrenOf={childrenOf}
                  onItemsChange={onItemsChange}
                />
              </div>
            ) : null}
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-400">Sin elementos.</li>}
      </ul>
    </div>
  );
}

function NestedGroup(props: {
  sectionKey: string;
  parentItemId: string;
  items: ItemRow[];
  fieldsByItem: Map<string, { en?: string; es?: string; fieldKey: string }[]>;
  childrenOf: (parentId: string) => ItemRow[];
  onItemsChange: React.Dispatch<React.SetStateAction<ItemRow[]>>;
}) {
  const groupKey = props.items[0]?.group_key ?? "features";
  return (
    <ItemGroup
      sectionKey={props.sectionKey}
      groupKey={groupKey}
      parentItemId={props.parentItemId}
      items={props.items}
      fieldsByItem={props.fieldsByItem}
      childrenOf={props.childrenOf}
      onItemsChange={props.onItemsChange}
    />
  );
}

function ItemFields({
  item,
  fields,
}: {
  item: ItemRow;
  fields: { en?: string; es?: string; fieldKey: string }[];
}) {
  if (fields.length === 0) return null;
  // A single "value" field means this is a plain string item (a bullet, a logo) — no label needed.
  const isSimpleValue = fields.length === 1 && fields[0].fieldKey === "value";
  return (
    <div className="mt-3 space-y-3">
      {fields.map((f) => (
        <div key={f.fieldKey} className="grid gap-3 sm:grid-cols-2">
          <FieldInput
            ownerType="item"
            ownerId={item.id}
            fieldKey={f.fieldKey}
            locale="en"
            initialValue={f.en ?? ""}
            label={isSimpleValue ? "EN" : `${humanizeFieldKey(f.fieldKey)} (EN)`}
          />
          <FieldInput
            ownerType="item"
            ownerId={item.id}
            fieldKey={f.fieldKey}
            locale="es"
            initialValue={f.es ?? ""}
            label={isSimpleValue ? "ES" : `${humanizeFieldKey(f.fieldKey)} (ES)`}
          />
        </div>
      ))}
    </div>
  );
}

function ItemFlags({ item }: { item: ItemRow }) {
  const [flags, setFlags] = useState(item.flags);
  const [, startTransition] = useTransition();
  const keys = Object.keys(flags);
  if (keys.length === 0) return null;

  function update(k: string, v: unknown) {
    const next = { ...flags, [k]: v };
    setFlags(next);
    startTransition(() => { void setItemFlags(item.id, next); });
  }

  return (
    <div className="mt-3 flex flex-wrap gap-4">
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
                className="w-20 rounded border border-gray-300 px-1.5 py-0.5 text-xs"
              />
            </label>
          );
        }
        return null;
      })}
    </div>
  );
}

function ItemImage({ item }: { item: ItemRow }) {
  const [url, setUrl] = useState(item.image_url);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    startTransition(async () => {
      const res = await uploadItemImage(item.id, file);
      if (res.ok) setUrl(res.url);
      else setError(res.error);
    });
  }

  return (
    <div className="mt-3 flex items-center gap-3">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-gray-200" />
      )}
      <label className="text-xs text-cyan-600 hover:underline">
        {pending ? "Subiendo…" : url ? "Reemplazar imagen" : "Añadir imagen"}
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={onFile} className="hidden" />
      </label>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
