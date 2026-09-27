"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/ui/reveal";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink } from "@/lib/env";

const GradientBackground = dynamic(
  () => import("@/components/ui/paper-design-shader-background").then((m) => m.GradientBackground),
  { ssr: false }
);

/** Full-bleed brand statement between the comparison table and the FAQ. */
export function Manifesto() {
  const t = useTranslations("manifesto");
  const tc = useTranslations("common");

  return (
    <section
      id="manifesto"
      className="relative flex min-h-[85dvh] flex-col justify-center overflow-hidden bg-black py-28 sm:py-36"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <GradientBackground />
      </motion.div>
      <div className="absolute inset-0 z-[5] bg-black/25" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-white/70">{t("eyebrow")}</p>
        </Reveal>

        <Reveal delay={0.1} variant="blur">
          <h2 className="mt-6 font-display font-extrabold text-white tracking-[-0.035em] leading-[1.02] text-4xl sm:text-6xl lg:text-[4.65rem] text-balance">
            <span className="block">{t("titleLine1")}</span>
            <span className="block font-serif font-medium italic text-[#66ffcc]">{t("titleAccent")}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-white/80">
            {t("subtitle")}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-9 flex justify-center">
            <CTAButton
              href={whatsappLink() ?? "#contact"}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => trackEvent("cta_growth_audit", { location: "manifesto" })}
            >
              {tc("growthAudit")}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
