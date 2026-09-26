"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { createPublicClient } from "@/lib/supabase/public";
import type { Locale, PublishedSnapshot } from "@/lib/cms/types";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ScrollProgress } from "@/components/cro/scroll-progress";
import { StickyMobileCTA } from "@/components/cro/sticky-mobile-cta";
import { FloatingWhatsApp } from "@/components/cro/floating-whatsapp";
import { SECTION_REGISTRY, homepageOrder } from "@/components/sections/registry";
import localEn from "@/messages/en.json";
import localEs from "@/messages/es.json";

const LOCAL_MESSAGES: Record<Locale, Record<string, unknown>> = { en: localEn, es: localEs };

// Same shape as i18n/request.ts's build-time merge, run again in the browser
// so a publish in /admin shows up on the next page load — no rebuild needed.
function mergeMessages(locale: Locale, published: PublishedSnapshot | null) {
  const local = LOCAL_MESSAGES[locale];
  if (!published) return local;
  const p = published[locale] as Record<string, Record<string, unknown>> | undefined;
  return {
    ...local,
    ...p,
    footer: { ...(local.footer as object), ...(p?.footer ?? {}) },
    nav: { ...(local.nav as object), ...(p?.nav ?? {}) },
  };
}

export function HomeClient({
  locale,
  initialSnapshot,
}: {
  locale: Locale;
  initialSnapshot: PublishedSnapshot | null;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    let cancelled = false;
    createPublicClient()
      .from("kingdom_published")
      .select("snapshot")
      .eq("id", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled && !error && data?.snapshot) {
          setSnapshot(data.snapshot as PublishedSnapshot);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <NextIntlClientProvider locale={locale} messages={mergeMessages(locale, snapshot) as Record<string, never>}>
      <ScrollProgress />
      <Navbar />
      <main>
        {homepageOrder(snapshot).map((key) => {
          const Section = SECTION_REGISTRY[key];
          return Section ? <Section key={key} /> : null;
        })}
      </main>
      <Footer />
      <StickyMobileCTA />
      <FloatingWhatsApp />
    </NextIntlClientProvider>
  );
}
