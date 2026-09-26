import { setRequestLocale } from "next-intl/server";
import { getPublishedContent } from "@/lib/cms/get-published";
import type { Locale } from "@/lib/cms/types";
import { HomeClient } from "./home-client";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Baked at build time as the initial paint (SEO, no flash). HomeClient
  // re-fetches the published snapshot in the browser right after, so a
  // publish in /admin shows up on the next page load without a rebuild.
  const initialSnapshot = await getPublishedContent();

  return <HomeClient locale={locale as Locale} initialSnapshot={initialSnapshot} />;
}
