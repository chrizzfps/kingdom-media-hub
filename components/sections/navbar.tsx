"use client";

import { useEffect, useState, useTransition } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { List, X } from "@phosphor-icons/react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
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
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isHome = pathname === "/" || pathname === "";
  const getHref = (hash: string) => (isHome ? hash : `/${hash}`);

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
        <Link href="/" aria-label="Kingdom Media Hub">
          <KingdomLogo height={32} color={scrolled ? undefined : "#fff"} />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.id}
              href={getHref(l.id)}
              className={cn(
                "text-sm font-medium transition-colors duration-150",
                scrolled ? "text-muted hover:text-ink" : "text-white/70 hover:text-white",
              )}
            >
              {t(l.key)}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <LocaleToggle scrolled={scrolled} />
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
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl lg:hidden",
            scrolled ? "text-ink" : "text-white",
          )}
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
              <Link
                key={l.id}
                href={getHref(l.id)}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-gray-50"
              >
                {t(l.key)}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-edge pt-4">
            <LocaleToggle scrolled />
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

function LocaleToggle({ scrolled }: { scrolled: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "flex items-center rounded-full border p-0.5",
        scrolled ? "border-edge bg-gray-50" : "border-white/20 bg-white/[0.06]",
      )}
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => startTransition(() => router.replace(pathname, { locale: l }))}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-150",
            locale === l
              ? "bg-cyan text-ink shadow-sm"
              : scrolled ? "text-muted hover:text-ink" : "text-white/70 hover:text-white",
          )}
          aria-current={locale === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
