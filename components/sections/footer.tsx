"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { KingdomLogo } from "@/components/ui/kingdom-logo";
import { whatsappLink } from "@/lib/env";
import { openCookieSettings } from "@/lib/cookies";

const ecosystem = [
  { key: "agency", href: "/#agency" },
  { key: "mediaLab", href: "/#media-lab" },
  { key: "academy", href: "/#academy" },
] as const;

const company = [
  { key: "results", href: "/#results" },
  { key: "faq", href: "/#faq" },
  // Contact form backend not wired up yet, send to WhatsApp for now.
  { key: "getStarted", href: whatsappLink() ?? "/#contact" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="bg-dark text-white/80">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="Kingdom Media Hub">
              <KingdomLogo height={28} color="white" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {t("tagline")}
            </p>
          </div>

          {/* Ecosystem */}
          <div>
            <h3 className="text-sm font-semibold text-white/40">
              {t("ecosystem")}
            </h3>
            <ul className="mt-4 space-y-3">
              {ecosystem.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {tn(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white/40">
              {t("company")}
            </h3>
            <ul className="mt-4 space-y-3">
              {company.map(({ key, href }) => (
                <li key={key}>
                  {href.startsWith("http") ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {key === "getStarted"
                        ? t("getStarted")
                        : tn(key as "results" | "faq")}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {key === "getStarted"
                        ? t("getStarted")
                        : tn(key as "results" | "faq")}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} KINGDOM MEDIA HUB. {t("rights")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <Link
              href="/legal"
              className="text-white/40 transition-colors hover:text-white"
            >
              {t("legalNotice")}
            </Link>
            <Link
              href="/privacy"
              className="text-white/40 transition-colors hover:text-white"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/cookies"
              className="text-white/40 transition-colors hover:text-white"
            >
              {t("cookies")}
            </Link>
            <Link
              href="/terms"
              className="text-white/40 transition-colors hover:text-white"
            >
              {t("terms")}
            </Link>
            <button
              type="button"
              onClick={openCookieSettings}
              className="text-cyan transition-colors hover:text-white hover:underline underline-offset-2 cursor-pointer"
            >
              {t("cookieSettings")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
