import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Reveal } from "@/components/ui/reveal";
import { stats } from "@/content/stats";

// const clientLogos = [
//   "Velox Tech", "Centro Médico Avanza", "Logística Sur", "Moda VE", "Rest Group", "TechStart",
// ];

export function TrustBar() {
  const t = useTranslations("trust");

  return (
    <section aria-label={t("title")} className="border-y border-edge bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-center">{t("eyebrow")}</p>
        </Reveal>

        {/* Counters */}
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-edge bg-gray-200 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.key} delay={i * 0.07}>
              <div className="flex flex-col items-center justify-center bg-gray-50 px-6 py-8 text-center">
                <dt className="sr-only">{t(`stats.${stat.key}`)}</dt>
                <dd className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="text-ink"
                  />
                </dd>
                <p className="mt-1.5 text-sm text-muted">{t(`stats.${stat.key}`)}</p>
              </div>
            </Reveal>
          ))}
        </dl>

        {/* Client logo strip (temporarily disabled) */}
        {/* <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clientLogos.map((name) => (
              <span
                key={name}
                className="font-display text-sm font-bold tracking-wider text-gray-300 uppercase"
                aria-label={name}
              >
                {name}
              </span>
            ))}
          </div>
        </Reveal> */}
      </div>
    </section>
  );
}
