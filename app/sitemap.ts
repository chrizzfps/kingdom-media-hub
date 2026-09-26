import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";

export const dynamic = "force-static";

const legalPages = ["", "legal", "privacy", "cookies", "terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of legalPages) {
    for (const locale of routing.locales) {
      const path = page ? `${page}/` : "";
      entries.push({
        url: `${env.siteUrl}/${locale}/${path}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? (locale === routing.defaultLocale ? 1 : 0.9) : 0.3,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${env.siteUrl}/${l}/${path}`])
          ),
        },
      });
    }
  }

  return entries;
}
