import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { Reveal } from "@/components/ui/reveal";

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export function TrustBar() {
  const t = useTranslations("trust");
  const tc = useTranslations("common");
  const stats = t.raw("statsItems") as StatItem[];
  // Hidden (all logos unchecked) in the CMS until real client logos are uploaded.
  const clientLogos = tc.has("clientLogos")
    ? (tc.raw("clientLogos") as Array<{ id: string; imageUrl?: string; imageAlt?: string }>)
    : [];

  return (
    <section aria-label={t("title")} className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center text-sm font-medium text-muted">{t("title")}</p>
        </Reveal>

        {/* Counters */}
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-edge bg-gray-200 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.id} delay={i * 0.07}>
              <div className="flex flex-col items-center justify-center bg-gray-50 px-6 py-8 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="text-ink"
                  />
                </dd>
                <p className="mt-1.5 text-sm text-muted">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </dl>

        {/* Client logo carousel */}
        {clientLogos.length > 0 && (
          <Reveal delay={0.15}>
            <LogoCarousel logos={clientLogos} className="mt-12" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
