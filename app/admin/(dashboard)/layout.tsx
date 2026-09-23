import type { Metadata } from "next";
import { AdminShell } from "./admin-shell";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Kingdom CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-gray-50 font-sans text-gray-900 antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
