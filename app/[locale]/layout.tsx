import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { env } from "@/lib/env";
import { organizationSchema, localBusinessSchema, jsonLdScript } from "@/lib/schema";
import { fontVariables } from "@/lib/fonts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(env.siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/`,
      languages: { en: "/en/", es: "/es/", "x-default": "/en/" },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: `${env.siteUrl}/${locale}/`,
      siteName: "Kingdom Media Hub",
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script {...jsonLdScript(organizationSchema())} />
        <script {...jsonLdScript(localBusinessSchema())} />
      </head>
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>
          <LenisProvider>{children}</LenisProvider>
        </NextIntlClientProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
