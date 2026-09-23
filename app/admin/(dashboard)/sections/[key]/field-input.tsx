"use client";

import { useState, useTransition } from "react";
import { saveFieldValue } from "@/lib/cms/actions";
import { isLongTextField } from "@/lib/cms/format";
import type { Locale } from "@/lib/cms/types";

export function FieldInput({
  ownerType,
  ownerId,
  fieldKey,
  locale,
  initialValue,
  label,
}: {
  ownerType: "section" | "item";
  ownerId: string;
  fieldKey: string;
  locale: Locale;
  initialValue: string;
  label?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();
  const dirty = value !== savedValue;

  function save() {
    if (!dirty) return;
    const next = value;
    startTransition(async () => {
      const res = await saveFieldValue({ ownerType, ownerId, fieldKey, locale, value: next });
      if (res.ok) setSavedValue(next);
    });
  }

  const long = isLongTextField(fieldKey, savedValue);
  const Tag = long ? "textarea" : "input";

  return (
    <div className="relative">
      {label && <label className="mb-1 block text-xs text-gray-500">{label}</label>}
      <Tag
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        rows={long ? 3 : undefined}
        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
      />
      <span className="absolute right-2 top-2 text-[10px] text-gray-400">
        {pending ? "guardando…" : dirty ? "sin guardar" : ""}
      </span>
    </div>
  );
}
