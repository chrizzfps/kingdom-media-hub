"use client";

import { useTranslations } from "next-intl";
import { WhatsappLogo } from "@phosphor-icons/react";
import { whatsappLink } from "@/lib/env";
import { trackEvent } from "@/lib/analytics";

export function FloatingWhatsApp() {
  const tc  = useTranslations("common");
  const tCro = useTranslations("cro");
  const wa = whatsappLink(tCro("whatsappPrefill"));
  if (!wa) return null;

  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("cta_whatsapp", { location: "floating" })}
      aria-label={tc("whatsapp")}
      className="group fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-cyan text-ink shadow-md transition-transform hover:-translate-y-1 lg:flex"
    >
      <WhatsappLogo size={26} weight="fill" />
      <span className="card-surface pointer-events-none absolute right-16 origin-right scale-95 whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium text-ink opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
        {tc("talkToUs")}
      </span>
    </a>
  );
}
