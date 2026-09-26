import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function CaseStudies() {
  const t = useTranslations("caseStudies");
  const cases = t.raw("cases") as Array<{
    metric: string; label: string; client: string; country: string;
  }>;

  return (
    <section id="results" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-14"
        />

        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {cases.map((c, i) => (
            <Reveal
              key={c.metric + c.client}
              delay={i * 0.1}
              className={i === 0 ? "lg:col-span-2 lg:row-span-2" : undefined}
            >
              <article className="card-surface flex h-full flex-col justify-between rounded-2xl p-8">
                {/* Dominant metric */}
                <div>
                  <p
                    className="font-display font-extrabold leading-none tracking-[-0.04em] tabular-nums text-cyan"
                    style={{ fontSize: i === 0 ? "clamp(4rem, 8vw, 6rem)" : "clamp(3rem, 6vw, 4rem)" }}
                  >
                    {c.metric}
                  </p>
                  <p className="mt-3 font-display text-xl font-semibold text-ink">{c.label}</p>
                </div>

                {/* Client info */}
                <div className="mt-8">
                  <p className="text-sm font-medium text-ink/70">{c.client}</p>
                  <p className="text-xs text-muted">{c.country}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
