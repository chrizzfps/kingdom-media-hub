import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "Preview — Kingdom CMS",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
