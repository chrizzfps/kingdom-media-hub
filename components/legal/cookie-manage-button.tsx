"use client";

import { Sliders } from "@phosphor-icons/react";
import { openCookieSettings } from "@/lib/cookies";

export function CookieManageButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-xs font-bold text-ink shadow-[0_4px_16px_rgba(0,196,240,0.3)] transition-all hover:bg-cyan/90 cursor-pointer"
    >
      <Sliders size={16} weight="bold" />
      <span>{label}</span>
    </button>
  );
}
