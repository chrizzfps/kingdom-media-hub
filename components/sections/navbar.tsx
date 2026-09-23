"use client";

import { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { List, X } from "@phosphor-icons/react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { CTAButton } from "@/components/ui/cta-button";
import { KingdomLogo } from "@/components/ui/kingdom-logo";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink } from "@/lib/env";
import { cn } from "@/lib/utils";

const links = [
  { id: "#agency",    key: "agency"    },
  { id: "#media-lab", key: "mediaLab"  },
  { id: "#marketing", key: "marketing" },
  { id: "#academy",   key: "academy"   },
  { id: "#results",   key: "results"   },
  { id: "#faq",       key: "faq"       },
] as const;

export function Navbar() {
  const t  = useTranslations("nav");
  const tc = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-edge bg-white/75 py-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] backdrop-blur-[20px]"
          : "border-b border-transparent py-4",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <a href="#top" aria-label="Kingdom Media Hub">
          <KingdomLogo height={32} />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.id}
              className="text-sm font-medium text-muted transition-colors duration-150 hover:text-ink"
            >
              {t(l.key)}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <LocaleToggle />
          <CTAButton
            href={whatsappLink() ?? "#contact"}
            variant="primary"
            size="sm"
            onClick={() => trackEvent("cta_growth_audit", { location: "navbar" })}
          >
            {tc("growthAudit")}
          </CTAButton>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t("close") : t("menu")}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="absolute inset-x-0 top-full border-t border-edge bg-white/90 px-5 py-5 backdrop-blur-[20px] lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.id}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-gray-50"
              >
                {t(l.key)}
              </a>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-edge pt-4">
            <LocaleToggle />
            <CTAButton
              href={whatsappLink() ?? "#contact"}
              variant="primary"
              className="flex-1"
              onClick={() => { setOpen(false); trackEvent("cta_growth_audit", { location: "mobile_menu" }); }}
            >
              {tc("growthAudit")}
            </CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}

function LocaleToggle() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  return (
    <div
      className="flex items-center rounded-full border border-edge bg-gray-50 p-0.5"
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => startTransition(() => router.replace(pathname, { locale: l }))}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-xs uppercase transition-all duration-150",
            locale === l
              ? "bg-cyan text-ink font-semibold shadow-sm"
              : "text-muted hover:text-ink",
          )}
          aria-current={locale === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
