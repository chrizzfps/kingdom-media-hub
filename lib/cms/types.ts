export type Locale = "en" | "es";

export interface SectionRow {
  key: string;
  label: string;
  section_group: "homepage" | "global";
  sort_order: number;
  is_visible: boolean;
  is_hideable: boolean;
  is_reorderable: boolean;
  updated_at: string;
}

export interface ItemRow {
  id: string;
  section_key: string;
  parent_item_id: string | null;
  group_key: string;
  item_key: string;
  sort_order: number;
  is_visible: boolean;
  image_url: string | null;
  flags: Record<string, unknown>;
}

export interface FieldValueRow {
  owner_type: "section" | "item";
  owner_id: string;
  field_key: string;
  locale: Locale;
  value: string;
}

/** { en: {...}, es: {...} } — same shape as the old messages/*.json files. */
export type LocaleContent = Record<string, unknown>;

export interface PublishedSnapshot {
  en: LocaleContent;
  es: LocaleContent;
  sections: Array<{
    key: string;
    label: string;
    group: "homepage" | "global";
    sortOrder: number;
    isVisible: boolean;
    isHideable: boolean;
    isReorderable: boolean;
  }>;
}
