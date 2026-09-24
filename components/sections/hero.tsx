"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";
import { CTAButton } from "@/components/ui/cta-button";
import { OrganicBlob } from "@/components/ui/organic-blob";
import { HeroMedia } from "./hero-media";
import { trackEvent } from "@/lib/analytics";
import { calendlyLink, whatsappLink } from "@/lib/env";

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");

  const trustItems = [
    t("trust.a"),
    t("trust.b"),
    t("trust.c"),
    t("trust.d"),
  ];

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-dark pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      {/* Discreet ambient light — not a competing visual, just atmosphere */}
      <OrganicBlob variant="primary" slow className="left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/3 opacity-70" />
      <OrganicBlob variant="soft" className="right-0 bottom-0 h-[380px] w-[380px] translate-x-1/4 translate-y-1/4" />

      {/* Subtle fine background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_30%,transparent_100%)]"
        aria-hidden
      />

      {/* Main hero content container */}
      <div className="relative mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-mono font-medium text-white/70 backdrop-blur-md">
          <Sparkle size={13} className="text-cyan" weight="fill" />
          <span>{t("eyebrow")}</span>
        </div>

        {/* Primary headline: Visible immediately in initial frame (no opacity: 0) */}
        <h1 className="mt-6 font-display font-extrabold text-white tracking-[-0.035em] text-balance leading-[1.02] text-4xl sm:text-6xl lg:text-[4.65rem]">
          {t("titleLine1")}{" "}
          <span className="text-cyan">{t("titleAccent")}</span>{" "}
          {t("titleLine2")}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-white/60">
          {t("subtitle")}
        </p>

        {/* Evident CTAs */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <CTAButton
            href={whatsappLink() ?? "#contact"}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => trackEvent("cta_growth_audit", { location: "hero" })}
          >
            {tc("growthAudit")}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </CTAButton>
          <CTAButton
            href={calendlyLink()}
            variant="outline-dark"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => trackEvent("cta_book_consultation", { location: "hero" })}
          >
            {tc("bookConsultation")}
          </CTAButton>
        </div>

        {/* Trust strip */}
        <ul className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5 pt-2">
          {trustItems.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-xs font-medium text-white/60"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        {/* Protagonist visual: CMS video → CMS image → system demo */}
        <HeroMedia />
      </div>
    </section>
  );
}
