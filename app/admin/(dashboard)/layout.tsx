import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSections } from "@/lib/cms/draft";
import { signOut } from "@/lib/cms/auth-actions";
import "../../globals.css";

export const metadata = { title: "Kingdom CMS" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("kingdom_admins").select("email").eq("user_id", user.id).maybeSingle();
  if (!admin) {
    return (
      <html lang="en">
        <body className="flex min-h-dvh items-center justify-center bg-gray-50 font-sans">
          <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-gray-900">No access</h1>
            <p className="mt-2 text-sm text-gray-500">
              {user.email} is signed in but isn&apos;t an approved Kingdom admin. Ask the project owner to add your
              email to <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">kingdom_admins</code>.
            </p>
            <form action={signOut} className="mt-6">
              <button className="text-sm font-medium text-cyan-600 hover:underline">Sign out</button>
            </form>
          </div>
        </body>
      </html>
    );
  }

  const sections = await getSections();
  const homepage = sections.filter((s) => s.section_group === "homepage");
  const global = sections.filter((s) => s.section_group === "global");

  return (
    <html lang="en">
      <body className="min-h-dvh bg-gray-50 font-sans text-gray-900 antialiased">
        <div className="flex min-h-dvh">
          <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <Link href="/admin" className="font-semibold tracking-tight">
                Kingdom CMS
              </Link>
              <p className="mt-0.5 text-xs text-gray-400">{admin.email}</p>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
              <div className="mb-4 flex gap-2 px-2">
                <a
                  href="/admin/preview/en"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-lg border border-gray-200 py-1.5 text-center text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Preview EN
                </a>
                <a
                  href="/admin/preview/es"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-lg border border-gray-200 py-1.5 text-center text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Preview ES
                </a>
              </div>
              <p className="px-2 pb-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">Homepage</p>
              <ul className="space-y-0.5">
                {homepage.map((s) => (
                  <li key={s.key}>
                    <Link
                      href={`/admin/sections/${s.key}`}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {s.label}
                      {!s.is_visible && <span className="text-[10px] text-gray-400">oculta</span>}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="px-2 pb-1.5 pt-5 text-xs font-medium uppercase tracking-wider text-gray-400">Global</p>
              <ul className="space-y-0.5">
                {global.map((s) => (
                  <li key={s.key}>
                    <Link
                      href={`/admin/sections/${s.key}`}
                      className="flex items-center rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-gray-100 p-3">
              <form action={signOut}>
                <button className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-gray-500 hover:bg-gray-50">
                  Cerrar sesión
                </button>
              </form>
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
