"use client";

import { useEffect, useState, useTransition } from "react";
import { reorderSections, setSectionVisibility } from "@/lib/cms/actions";
import type { SectionRow } from "@/lib/cms/types";
import { useAdminSections } from "./admin-shell";

export function SectionOrder() {
  const { sections, refresh } = useAdminSections();
  const [rows, setRows] = useState<SectionRow[]>([]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(sections.filter((s) => s.section_group === "homepage").sort((a, b) => a.sort_order - b.sort_order));
  }, [sections]);

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (!rows[target]?.is_reorderable || !rows[index].is_reorderable) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    startTransition(async () => {
      const res = await reorderSections(next.map((r) => r.key));
      if (!res.ok) setError(res.error);
      refresh();
    });
  }

  function toggle(row: SectionRow) {
    startTransition(async () => {
      const res = await setSectionVisibility(row.key, !row.is_visible);
      if (!res.ok) setError(res.error);
      refresh();
    });
  }

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-900">Orden y visibilidad de secciones</h2>
      <p className="mt-1 text-xs text-gray-500">Se aplica al publicar. El Hero siempre va primero.</p>
      <ul className="mt-4 divide-y divide-gray-100">
        {rows.map((row, i) => (
          <li key={row.key} className="flex items-center justify-between py-2.5 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-xs leading-none text-gray-400">
                <button
                  aria-label="Subir"
                  disabled={pending || i === 0 || !row.is_reorderable || !rows[i - 1]?.is_reorderable}
                  onClick={() => move(i, -1)}
                  className="px-1 hover:text-gray-900 disabled:opacity-25"
                >
                  ▲
                </button>
                <button
                  aria-label="Bajar"
                  disabled={pending || i === rows.length - 1 || !row.is_reorderable}
                  onClick={() => move(i, 1)}
                  className="px-1 hover:text-gray-900 disabled:opacity-25"
                >
                  ▼
                </button>
              </div>
              <span className={row.is_visible ? "text-gray-900" : "text-gray-400 line-through"}>{row.label}</span>
            </div>
            {row.is_hideable ? (
              <label className="flex items-center gap-1.5 text-xs text-gray-600">
                <input type="checkbox" checked={row.is_visible} disabled={pending} onChange={() => toggle(row)} />
                Visible
              </label>
            ) : (
              <span className="text-xs text-gray-300">fija</span>
            )}
          </li>
        ))}
      </ul>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </section>
  );
}
