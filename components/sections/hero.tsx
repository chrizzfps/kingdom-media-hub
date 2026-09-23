"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { CTAButton } from "@/components/ui/cta-button";
import { FloatingCard } from "@/components/ui/floating-card";
import { OrganicBlob } from "@/components/ui/organic-blob";
import { trackEvent } from "@/lib/analytics";
import { calendlyLink, whatsappLink } from "@/lib/env";

export function Hero() {
  const t  = useTranslations("hero");
  const tc = useTranslations("common");
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial:    { opacity: 0, y: reduce ? 0 : 18, filter: reduce ? "none" : "blur(4px)" },
    animate:    { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const trustItems = [t("trust.a"), t("trust.b"), t("trust.c"), t("trust.d")];

  return (
    <section
      id="top"
      className="relative flex min-h-dvh items-center overflow-hidden bg-section-hero pt-28 pb-20"
    >
      {/* Blobs */}
      <OrganicBlob
        variant="primary"
        className="right-[-10%] top-[-15%] h-[680px] w-[680px]"
      />
      <OrganicBlob
        variant="secondary"
        slow
        className="bottom-[-10%] left-[-8%] h-[500px] w-[500px]"
      />

      {/* Dot grid */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      {/* Floating cards — hidden on small mobile to protect CTA */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
        <FloatingCard
          label={t("cards.appointmentsLabel")}
          value={t("cards.appointments")}
          floatClass="float-a"
          className="absolute left-[5%] top-[22%]"
        />
        <FloatingCard
          label={t("cards.agentLabel")}
          value={t("cards.agent")}
          status="active"
          floatClass="float-b"
          className="absolute right-[6%] top-[18%]"
        />
        <FloatingCard
          label={t("cards.leadsLabel")}
          value={t("cards.leads")}
          floatClass="float-c"
          className="absolute bottom-[24%] left-[4%]"
        />
        <FloatingCard
          label={t("cards.crmLabel")}
          value={t("cards.crm")}
          floatClass="float-d"
          className="absolute bottom-[22%] right-[18%]"
        />
        <FloatingCard
          label={t("cards.automationLabel")}
          value={t("cards.automation")}
          status="running"
          floatClass="float-e"
          className="absolute bottom-[20%] right-[4%]"
        />
      </div>

      {/* Main content */}
      <div className="relative mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
        <motion.h1
          {...fade(0.07)}
          className="mt-7 font-display text-balance font-extrabold leading-[0.95] tracking-[-0.04em] text-ink"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
        >
          {t("titleLine1")}{" "}
          <span className="text-cyan-gradient">{t("titleAccent")}</span>{" "}
          {t("titleLine2")}
        </motion.h1>

        <motion.p
          {...fade(0.15)}
          className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          {...fade(0.22)}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <CTAButton
            href={whatsappLink() ?? "#contact"}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => trackEvent("cta_growth_audit", { location: "hero" })}
          >
            {tc("growthAudit")}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </CTAButton>
          <CTAButton
            href={calendlyLink()}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => trackEvent("cta_book_consultation", { location: "hero" })}
          >
            {tc("bookConsultation")}
          </CTAButton>
        </motion.div>

        <motion.ul
          {...fade(0.30)}
          className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          {trustItems.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-dim"
            >
              <span className="h-1 w-1 rounded-full bg-cyan/60" aria-hidden />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"
        aria-hidden
      />
    </section>
  );
}
