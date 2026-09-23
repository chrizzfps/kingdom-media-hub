"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/cms/actions";
import "../../globals.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const res = await signIn(String(form.get("email")).trim().toLowerCase(), String(form.get("password")));
    if (res.ok) {
      router.replace("/admin/");
    } else {
      setError(res.error);
      setPending(false);
    }
  }

  return (
    <html lang="es">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Kingdom CMS</title>
      </head>
      <body className="flex min-h-dvh items-center justify-center bg-gray-50 font-sans">
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Kingdom CMS</h1>
          <p className="mt-1 text-sm text-gray-500">Entra con tu cuenta de administrador.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </body>
    </html>
  );
}
