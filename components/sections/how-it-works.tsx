import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Array<{ number: string; name: string; desc: string }>;

  return (
    <section id="how-it-works" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title={t("title")}
          align="center"
          className="mb-16"
        />

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block">
          <div className="relative mb-6 flex items-center justify-between">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-edge-strong" />
            {steps.map((step) => (
              <div key={step.number} className="relative flex justify-center" style={{ width: `${100 / steps.length}%` }}>
                <span className="relative h-2.5 w-2.5 rounded-full bg-cyan" />
              </div>
            ))}
          </div>
          <div className="flex">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.08} className="flex-1 px-4 text-center">
                <h3 className="font-display text-lg font-bold text-ink">{step.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <ol className="space-y-8 lg:hidden">
          {steps.map((step, i) => (
            <Reveal key={step.number} as="li" delay={i * 0.06}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan" />
                  {i < steps.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-edge-strong" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-display text-lg font-bold text-ink">{step.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
