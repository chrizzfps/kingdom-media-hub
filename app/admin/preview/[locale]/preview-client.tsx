"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getPreviewSnapshot } from "@/lib/cms/actions";
import type { PublishedSnapshot } from "@/lib/cms/types";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { SECTION_REGISTRY, homepageOrder } from "@/components/sections/registry";

export function PreviewClient({ locale }: { locale: "en" | "es" }) {
  const [snapshot, setSnapshot] = useState<PublishedSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPreviewSnapshot()
      .then((s) => {
        // RLS returns zero rows (not an error) to anyone who isn't an admin.
        if (s.sections.length === 0) throw new Error("Sin acceso al borrador");
        setSnapshot(s);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudo cargar el borrador."));
  }, []);

  if (error) {
    return <p className="p-10 text-center text-sm text-red-500">{error} — entra primero en /admin.</p>;
  }
  if (!snapshot) {
    return <p className="p-10 text-center text-sm text-gray-400">Cargando borrador…</p>;
  }

  return (
    <>
      <div className="sticky top-0 z-[60] bg-amber-400 px-4 py-1.5 text-center text-xs font-semibold text-amber-950">
        Vista previa del borrador ({locale.toUpperCase()}) — no es lo que ve el público
      </div>
      <NextIntlClientProvider locale={locale} messages={snapshot[locale] as Record<string, never>}>
        <Navbar />
        <main>
          {homepageOrder(snapshot).map((key) => {
            const Section = SECTION_REGISTRY[key];
            return Section ? <Section key={key} /> : null;
          })}
        </main>
        <Footer />
      </NextIntlClientProvider>
    </>
  );
}
