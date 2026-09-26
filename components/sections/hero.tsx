"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { CTAButton } from "@/components/ui/cta-button";
import { FloatingCard } from "@/components/ui/floating-card";
import { HeroMedia } from "./hero-media";
import { trackEvent } from "@/lib/analytics";
import { calendlyLink, whatsappLink } from "@/lib/env";

const HeroGradientBackground = dynamic(
  () => import("./hero-gradient-background").then((m) => m.HeroGradientBackground),
  { ssr: false }
);

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
      <HeroGradientBackground />
      <div className="absolute inset-0 z-[5] bg-black/45" />

      {/* Floating metric cards — anchored to the full section, not the text column,
          so they sit in the side gutters instead of over the headline. Hidden below
          lg: at narrower widths there isn't enough gutter to avoid overlap. */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" aria-hidden>
        <FloatingCard
          label={t("cards.appointmentsLabel")}
          value={t("cards.appointments")}
          floatClass="float-a"
          className="absolute left-[3%] top-[22%] whitespace-nowrap xl:left-[6%]"
        />
        <FloatingCard
          label={t("cards.agentLabel")}
          value={t("cards.agent")}
          status="active"
          floatClass="float-b"
          className="absolute right-[3%] top-[16%] whitespace-nowrap xl:right-[6%]"
        />
        <FloatingCard
          label={t("cards.leadsLabel")}
          value={t("cards.leads")}
          floatClass="float-c"
          className="absolute bottom-[28%] left-[2%] whitespace-nowrap xl:left-[5%]"
        />
        <FloatingCard
          label={t("cards.crmLabel")}
          value={t("cards.crm")}
          floatClass="float-d"
          className="absolute bottom-[32%] right-[19%] whitespace-nowrap xl:right-[22%]"
        />
        <FloatingCard
          label={t("cards.automationLabel")}
          value={t("cards.automation")}
          status="running"
          floatClass="float-e"
          className="absolute bottom-[14%] right-[2%] whitespace-nowrap xl:right-[4%]"
        />
      </div>

      {/* Main hero content container */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        {/* Primary headline: Visible immediately in initial frame (no opacity: 0) */}
        <h1 className="font-display font-extrabold text-white tracking-[-0.035em] leading-[1.02] text-4xl sm:text-6xl lg:text-[4.65rem]">
          <span className="block">{t("titleLine1")}</span>
          <span className="block font-serif font-medium italic text-[#66ffcc]">{t("titleAccent")}</span>
          <span className="block">{t("titleLine2")}</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-white/75">
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
