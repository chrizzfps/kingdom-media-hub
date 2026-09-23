"use client";

import { useActionState } from "react";
import { signInOrRegister } from "@/lib/cms/auth-actions";
import "../../globals.css";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(signInOrRegister, undefined);

  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-gray-50 font-sans">
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Kingdom CMS</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in with your admin email. First time? Enter the email the owner approved and choose a password.
          </p>
          <form action={action} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "…" : "Continue"}
            </button>
          </form>
        </div>
      </body>
    </html>
  );
}
