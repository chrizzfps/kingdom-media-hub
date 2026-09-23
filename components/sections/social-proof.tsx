import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";

export function SocialProof() {
  const t = useTranslations("socialProof");
  const tc = useTranslations("common");
  const clientLogos = tc.raw("clientLogos") as string[];
  const testimonials = t.raw("testimonials") as Array<{
    quote: string; name: string; role: string; company: string; metric: string;
  }>;

  return (
    <section id="social-proof" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          align="center"
          className="mb-12"
        />

        {/* Logo strip */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clientLogos.map((name) => (
              <span
                key={name}
                className="font-display text-sm font-bold uppercase tracking-wider text-gray-200"
              >
                {name}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Testimonials */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <GlassCard variant="subtle" className="flex flex-col p-6">
                <span className="font-mono text-lg text-cyan">"</span>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{t.quote}</p>
                <div className="mt-5 flex items-center justify-between border-t border-edge pt-5">
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role} · {t.company}</p>
                  </div>
                  <span className="rounded-full bg-cyan/10 px-3 py-1 font-mono text-xs font-semibold text-cyan">
                    {t.metric}
                  </span>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
