import { PreviewClient } from "./preview-client";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function PreviewPage({ params }: { params: Promise<{ locale: "en" | "es" }> }) {
  const { locale } = await params;
  return <PreviewClient locale={locale} />;
}
