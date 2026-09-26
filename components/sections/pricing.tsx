import { useTranslations } from "next-intl";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/ui/reveal";
import { calendlyLink } from "@/lib/env";
import { cn } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("pricing");
  const plans = t.raw("plans") as Array<{
    name: string; price: string; priceSuffix: string;
    desc: string; features: string[]; cta: string; popular: boolean;
  }>;
  const popularBadge = t("popularBadge");

  return (
    <section id="pricing" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-14"
        />

        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08} className="h-full">
              <GlassCard
                variant={plan.popular ? "cyan" : "subtle"}
                className={cn(
                  "flex h-full flex-col justify-between p-7 sm:p-8",
                  plan.popular && "ring-1 ring-cyan/30",
                )}
              >
                <div className="flex flex-1 flex-col">
                  <div className="min-h-[28px] mb-3 flex items-center">
                    {plan.popular && (
                      <span className="inline-flex rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan-deep">
                        {popularBadge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted">{plan.desc}</p>

                  <div className="mt-5 mb-6">
                    {/^\d/.test(plan.price) ? (
                      <>
                        <span className="font-display text-4xl font-extrabold tabular-nums tracking-tight text-ink">
                          {plan.price}
                        </span>
                        {plan.priceSuffix && (
                          <span className="ml-1 text-lg font-medium text-muted">{plan.priceSuffix}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-cyan-deep">{plan.price}</span>
                    )}
                  </div>

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-muted">
                        <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-cyan" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <CTAButton
                  href={calendlyLink()}
                  variant={plan.popular ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {plan.cta}
                </CTAButton>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
