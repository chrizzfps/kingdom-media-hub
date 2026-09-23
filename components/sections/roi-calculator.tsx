"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTAButton } from "@/components/ui/cta-button";
import { OrganicBlob } from "@/components/ui/organic-blob";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink } from "@/lib/env";
import { cn } from "@/lib/utils";

const DEFAULTS = { missedCalls: 30, ticket: 500, conversion: 20 };

export function ROICalculator() {
  const t  = useTranslations("roi");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [missed,     setMissed]     = useState(DEFAULTS.missedCalls);
  const [ticket,     setTicket]     = useState(DEFAULTS.ticket);
  const [conversion, setConversion] = useState(DEFAULTS.conversion);

  const monthly = useMemo(
    () => missed * (conversion / 100) * ticket,
    [missed, ticket, conversion],
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(n);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => trackEvent("roi_calculated", { monthly }),
      1200,
    );
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [monthly]);

  return (
    <section id="roi" className="relative overflow-hidden bg-section-cta py-24 sm:py-32">
      <OrganicBlob variant="primary" className="left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2" slow />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-12"
        />

        <div className="glass-subtle overflow-hidden rounded-3xl border border-edge p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Sliders */}
            <div className="space-y-8">
              <Slider
                label={t("inputs.missedCalls")}
                value={missed}
                onChange={setMissed}
                min={5} max={200} step={5}
                display={`${missed}`}
              />
              <Slider
                label={t("inputs.ticket")}
                value={ticket}
                onChange={setTicket}
                min={10} max={10000} step={10}
                display={fmt(ticket)}
              />
              <Slider
                label={t("inputs.conversion")}
                value={conversion}
                onChange={setConversion}
                min={1} max={60} step={1}
                display={`${conversion}%`}
              />
            </div>

            {/* Result */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/60 p-6 sm:p-8 text-center ring-1 ring-inset ring-cyan/20 w-full max-w-full overflow-hidden">
              <p className="eyebrow">{t("resultLabel")}</p>
              <div className="mt-4 flex w-full max-w-full items-center justify-center overflow-hidden px-1">
                <p
                  className="font-display font-extrabold leading-none tracking-tight text-cyan max-w-full whitespace-nowrap"
                  style={{
                    fontSize:
                      fmt(monthly).length > 9
                        ? "clamp(1.75rem, 4.5vw, 3.25rem)"
                        : fmt(monthly).length > 7
                        ? "clamp(2.15rem, 5.5vw, 4rem)"
                        : "clamp(2.5rem, 7vw, 5rem)",
                  }}
                  aria-live="polite"
                >
                  {fmt(monthly)}
                </p>
              </div>
              <p className="mt-3 text-sm text-muted">
                {t("resultYearLabel")}{" "}
                <strong className="font-semibold text-ink">{fmt(monthly * 12)}</strong>{" "}
                {t("resultYearSuffix")}
              </p>
              <p className="mt-4 text-xs text-dim">{t("disclaimer")}</p>
              <CTAButton
                href={whatsappLink() ?? "#contact"}
                variant="primary"
                size="lg"
                className="mt-8 w-full"
                onClick={() => trackEvent("cta_recover_revenue", { monthly })}
              >
                {tc("recoverRevenue")}
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label, value, onChange, min, max, step, display,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; display: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-ink">{label}</label>
        <span className="font-mono text-sm font-semibold text-cyan">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full",
          "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-cyan [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(51,204,255,0.2)]",
        )}
        style={{
          background: `linear-gradient(to right, #33CCFF ${pct}%, #E5E7EB ${pct}%)`,
        }}
        aria-valuetext={display}
      />
    </div>
  );
}
