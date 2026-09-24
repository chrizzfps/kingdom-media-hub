"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { CTAButton } from "@/components/ui/cta-button";
import { HeroMedia } from "./hero-media";
import { trackEvent } from "@/lib/analytics";
import { calendlyLink, whatsappLink } from "@/lib/env";

type HeroMediaFlags = { backgroundColor?: string };

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");

  const media: HeroMediaFlags | undefined = t.has("media") ? (t.raw("media") as HeroMediaFlags[])[0] : undefined;
  const backgroundColor = media?.backgroundColor || undefined;

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-dark pt-28 pb-20 sm:pt-36 sm:pb-28"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {/* Subtle fine background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_30%,transparent_100%)]"
        aria-hidden
      />

      {/* Main hero content container */}
      <div className="relative mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        {/* Primary headline: Visible immediately in initial frame (no opacity: 0) */}
        <h1 className="font-display font-extrabold text-white tracking-[-0.035em] text-balance leading-[1.02] text-4xl sm:text-6xl lg:text-[4.65rem]">
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

        {/* Protagonist visual: CMS video → CMS image → system demo */}
        <HeroMedia />
      </div>
    </section>
  );
}
