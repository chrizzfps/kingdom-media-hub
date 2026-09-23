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
  label: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const dirty = value !== savedValue;

  function save() {
    if (!dirty) return;
    const next = value;
    startTransition(async () => {
      const res = await saveFieldValue({ ownerType, ownerId, fieldKey, locale, value: next });
      setError(!res.ok);
      if (res.ok) setSavedValue(next);
    });
  }

  const long = isLongTextField(fieldKey, initialValue);
  const className = `w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ${
    error ? "border-red-300 focus:ring-red-100" : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-100"
  }`;
  const status = pending ? "guardando…" : error ? "no se guardó" : dirty ? "sin guardar" : "";

  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-xs text-gray-500">
        {label}
        <span className={error ? "text-red-500" : "text-gray-400"}>{status}</span>
      </span>
      {long ? (
        <textarea value={value} onChange={(e) => setValue(e.target.value)} onBlur={save} rows={3} className={className} />
      ) : (
        <input value={value} onChange={(e) => setValue(e.target.value)} onBlur={save} className={className} />
      )}
    </label>
  );
}
