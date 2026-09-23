import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getPublishedContent } from "@/lib/cms/get-published";

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` typically corresponds to the `[locale]` segment.
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const published = await getPublishedContent();
  const messages = published
    ? published[locale]
    : (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
