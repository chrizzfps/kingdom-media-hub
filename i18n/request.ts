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

  const localMessages = (await import(`../messages/${locale}.json`)).default;
  const published = await getPublishedContent();

  // Deep-merge local messages with published CMS content so newly introduced keys
  // always have a fallback.
  const messages = published
    ? {
        ...localMessages,
        ...published[locale],
        footer: {
          ...localMessages.footer,
          ...(published[locale]?.footer ?? {}),
        },
        nav: {
          ...localMessages.nav,
          ...(published[locale]?.nav ?? {}),
        },
      }
    : localMessages;

  return { locale, messages };
});
