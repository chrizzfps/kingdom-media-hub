import type { FieldValueRow, ItemRow, LocaleContent, Locale, SectionRow } from "./types";

function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (typeof cur[key] !== "object" || cur[key] === null) cur[key] = {};
    cur = cur[key] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

function buildItemNode(
  item: ItemRow,
  fieldsByItem: Map<string, FieldValueRow[]>,
  itemsByParent: Map<string, ItemRow[]>,
): unknown {
  const fields = fieldsByItem.get(item.id) ?? [];
  const children = itemsByParent.get(item.id) ?? [];

  // A "string item" (e.g. a bullet point, a client logo) has exactly one
  // field named 'value' and nothing nested under it — it renders as a bare
  // string in the array, matching the original messages/*.json shape.
  const textFields = fields.filter((f) => f.field_key !== "imageAlt");
  if (children.length === 0 && textFields.length === 1 && textFields[0].field_key === "value") {
    return textFields[0].value;
  }

  const node: Record<string, unknown> = { id: item.item_key, ...item.flags };
  if (item.image_url) node.imageUrl = item.image_url;
  for (const f of fields) setPath(node, f.field_key, f.value);

  const byGroup = new Map<string, ItemRow[]>();
  for (const child of children) {
    if (!byGroup.has(child.group_key)) byGroup.set(child.group_key, []);
    byGroup.get(child.group_key)!.push(child);
  }
  for (const [groupKey, groupItems] of byGroup) {
    groupItems.sort((a, b) => a.sort_order - b.sort_order);
    setPath(
      node,
      groupKey,
      groupItems.map((gi) => buildItemNode(gi, fieldsByItem, itemsByParent)),
    );
  }
  return node;
}

/**
 * Reconstructs the messages/*.json-shaped content object for one locale from
 * the CMS's normalized draft tables. Inverse of the seed migration's walker.
 * Only visible items are included; hidden sections are still built (their
 * visibility is a separate, non-localized concern — see PublishedSnapshot.sections).
 */
export function buildLocaleContent(
  sections: SectionRow[],
  items: ItemRow[],
  fieldRows: FieldValueRow[],
  locale: Locale,
): LocaleContent {
  const localeFields = fieldRows.filter((f) => f.locale === locale);

  const sectionFields = new Map<string, FieldValueRow[]>();
  const fieldsByItem = new Map<string, FieldValueRow[]>();
  for (const f of localeFields) {
    if (f.owner_type === "section") {
      if (!sectionFields.has(f.owner_id)) sectionFields.set(f.owner_id, []);
      sectionFields.get(f.owner_id)!.push(f);
    } else {
      if (!fieldsByItem.has(f.owner_id)) fieldsByItem.set(f.owner_id, []);
      fieldsByItem.get(f.owner_id)!.push(f);
    }
  }

  const itemsByParent = new Map<string, ItemRow[]>();
  const topItemsBySection = new Map<string, ItemRow[]>();
  for (const it of items) {
    if (it.parent_item_id) {
      if (!itemsByParent.has(it.parent_item_id)) itemsByParent.set(it.parent_item_id, []);
      itemsByParent.get(it.parent_item_id)!.push(it);
    } else {
      if (!topItemsBySection.has(it.section_key)) topItemsBySection.set(it.section_key, []);
      topItemsBySection.get(it.section_key)!.push(it);
    }
  }

  const out: LocaleContent = {};
  for (const s of sections) {
    const node: Record<string, unknown> = {};
    for (const f of sectionFields.get(s.key) ?? []) setPath(node, f.field_key, f.value);

    const byGroup = new Map<string, ItemRow[]>();
    for (const it of topItemsBySection.get(s.key) ?? []) {
      if (!byGroup.has(it.group_key)) byGroup.set(it.group_key, []);
      byGroup.get(it.group_key)!.push(it);
    }
    for (const [groupKey, groupItems] of byGroup) {
      groupItems.sort((a, b) => a.sort_order - b.sort_order);
      setPath(
        node,
        groupKey,
        groupItems.map((gi) => buildItemNode(gi, fieldsByItem, itemsByParent)),
      );
    }
    out[s.key] = node;
  }
  return out;
}
