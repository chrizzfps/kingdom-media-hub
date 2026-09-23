import type { Metadata } from "next";
import { env } from "@/lib/env";
import "./globals.css";

/**
 * metadataBase lives here (not just in app/[locale]/layout.tsx) so
 * root-level file conventions like app/opengraph-image.tsx — which sit
 * outside the [locale] segment — resolve to a real URL instead of
 * localhost:3000.
 */
export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
};

/**
 * Root layout is intentionally minimal — the <html>/<body> shell lives in
 * app/[locale]/layout.tsx so the lang attribute and fonts follow the locale.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
