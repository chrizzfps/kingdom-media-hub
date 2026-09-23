"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAdminStatus, getSections, signOut } from "@/lib/cms/actions";
import type { SectionRow } from "@/lib/cms/types";

const SectionsContext = createContext<{ sections: SectionRow[]; refresh: () => void }>({
  sections: [],
  refresh: () => {},
});

export const useAdminSections = () => useContext(SectionsContext);

type Status =
  | { state: "loading" }
  | { state: "not-admin"; email: string }
  | { state: "admin"; email: string };

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ state: "loading" });
  const [sections, setSections] = useState<SectionRow[]>([]);

  const refresh = useCallback(() => {
    getSections().then(setSections).catch(() => {});
  }, []);

  useEffect(() => {
    getAdminStatus().then((s) => {
      if (s.state === "signed-out") {
        router.replace("/admin/login/");
        return;
      }
      setStatus(s);
      if (s.state === "admin") refresh();
    });
  }, [router, refresh]);

  async function handleSignOut() {
    await signOut();
    router.replace("/admin/login/");
  }

  if (status.state === "loading") {
    return <div className="flex min-h-dvh items-center justify-center text-sm text-gray-400">Cargando…</div>;
  }

  if (status.state === "not-admin") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Sin acceso</h1>
          <p className="mt-2 text-sm text-gray-500">
            {status.email} inició sesión pero no es administrador de Kingdom. Pide al dueño del proyecto que añada tu
            email a <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">kingdom_admins</code>.
          </p>
          <button onClick={handleSignOut} className="mt-6 text-sm font-medium text-cyan-600 hover:underline">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const homepage = sections.filter((s) => s.section_group === "homepage");
  const global = sections.filter((s) => s.section_group === "global");

  return (
    <SectionsContext.Provider value={{ sections, refresh }}>
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 flex h-dvh w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <Link href="/admin/" className="font-semibold tracking-tight">
              Kingdom CMS
            </Link>
            <p className="mt-0.5 truncate text-xs text-gray-400">{status.email}</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
            <div className="mb-4 flex gap-2 px-2">
              {(["en", "es"] as const).map((l) => (
                <a
                  key={l}
                  href={`/admin/preview/${l}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-lg border border-gray-200 py-1.5 text-center text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Preview {l.toUpperCase()}
                </a>
              ))}
            </div>
            <NavGroup title="Homepage" sections={homepage} />
            <NavGroup title="Global" sections={global} />
          </nav>
          <div className="border-t border-gray-100 p-3">
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-gray-500 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </SectionsContext.Provider>
  );
}

function NavGroup({ title, sections }: { title: string; sections: SectionRow[] }) {
  return (
    <>
      <p className="px-2 pb-1.5 pt-4 text-xs font-medium uppercase tracking-wider text-gray-400 first:pt-0">{title}</p>
      <ul className="space-y-0.5">
        {sections.map((s) => (
          <li key={s.key}>
            <Link
              href={`/admin/sections/${s.key}/`}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              {s.label}
              {!s.is_visible && <span className="text-[10px] text-gray-400">oculta</span>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
