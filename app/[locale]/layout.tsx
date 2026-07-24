import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { env } from "@/lib/env";
import { organizationSchema, localBusinessSchema, jsonLdScript } from "@/lib/schema";

// Display / headings — geometric, premium, Apple-adjacent.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Body / UI — Vercel's Geist, closest web equivalent to SF Pro Text.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Mono — eyebrows, metrics, ROI calculator.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

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
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: `${env.siteUrl}/${locale}`,
      siteName: "Kingdom Media Hub",
      title: t("title"),
      description: t("description"),
      images: ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/opengraph-image.png"],
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
      className={`${jakarta.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script {...jsonLdScript(organizationSchema())} />
        <script {...jsonLdScript(localBusinessSchema())} />
      </head>
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <NextIntlClientProvider>
          <LenisProvider>{children}</LenisProvider>
        </NextIntlClientProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
