import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${env.siteUrl}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${env.siteUrl}/${l}/`]),
      ),
    },
  }));
}
