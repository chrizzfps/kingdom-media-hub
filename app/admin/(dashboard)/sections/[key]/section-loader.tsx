"use client";

import { useEffect, useState } from "react";
import { getSectionDraft } from "@/lib/cms/actions";
import { SectionEditor } from "./section-editor";

type Draft = Awaited<ReturnType<typeof getSectionDraft>>;

export function SectionLoader({ sectionKey }: { sectionKey: string }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSectionDraft(sectionKey)
      .then(setDraft)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudo cargar la sección."));
  }, [sectionKey]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!draft) return <p className="text-sm text-gray-400">Cargando…</p>;
  if (!draft.section) return <p className="text-sm text-gray-500">Sección no encontrada.</p>;

  return (
    <SectionEditor
      key={sectionKey}
      section={draft.section}
      initialFields={draft.fields}
      initialItems={draft.items}
    />
  );
}
