import { useTranslations } from "next-intl";
import {
  ShareNetwork,
  Megaphone,
  PenNib,
  FilmSlate,
  ChartLineUp,
  Target,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { CTAButton } from "@/components/ui/cta-button";
import { OrganicBlob } from "@/components/ui/organic-blob";
import { calendlyLink } from "@/lib/env";

const icons = {
  social: ShareNetwork,
  paid: Megaphone,
  branding: PenNib,
  content: FilmSlate,
  strategy: ChartLineUp,
  analytics: Target,
} as const;

export function Marketing() {
  const t = useTranslations("marketing");
  const services = t.raw("services") as Array<{
    key: keyof typeof icons; name: string; desc: string; metric: string;
  }>;
  const stats = t.raw("team.stats") as Array<{ value: string; label: string }>;

  return (
    <section id="marketing" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <OrganicBlob variant="soft" className="-right-32 bottom-0 h-[440px] w-[440px]" slow />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-14"
        />

        {/* Interactive solutions grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc, i) => {
            const Icon = icons[svc.key] ?? Target;
            return (
              <Reveal key={svc.key} delay={i * 0.06}>
                <GlassCard variant="subtle" className="group h-full p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-cyan/10">
                    <Icon size={22} weight="duotone" className="text-ink transition-colors group-hover:text-cyan" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                    {svc.name}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{svc.desc}</p>
                  <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider text-dim opacity-0 transition-opacity duration-300 group-hover:text-cyan group-hover:opacity-100">
                    {svc.metric}
                  </p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>

        {/* Team strip */}
        <Reveal delay={0.1}>
          <div className="relative mt-16 overflow-hidden rounded-3xl bg-dark p-8 sm:p-12">
            <OrganicBlob variant="secondary" className="-left-20 top-1/2 h-[300px] w-[300px] -translate-y-1/2" />
            <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-lg">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <UsersThree size={22} weight="duotone" className="text-cyan" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {t("team.title")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
                  {t("team.desc")}
                </p>
                <CTAButton href={calendlyLink()} variant="primary" size="md" className="mt-7">
                  {t("team.cta")}
                </CTAButton>
              </div>

              <div className="grid grid-cols-3 gap-6 sm:gap-10">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-display text-3xl font-extrabold tracking-tight text-cyan sm:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 max-w-[8rem] text-xs leading-snug text-white/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

