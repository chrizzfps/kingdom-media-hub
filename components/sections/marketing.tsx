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
import { Reveal } from "@/components/ui/reveal";
import { CTAButton } from "@/components/ui/cta-button";
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
    <section id="marketing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-14"
        />

        {/* Services list — grouped 2-column, icon inline */}
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {services.map((svc, i) => {
            const Icon = icons[svc.key] ?? Target;
            return (
              <Reveal key={svc.key} delay={i * 0.05}>
                <div className="flex gap-4">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <Icon size={20} weight="duotone" className="text-cyan-deep" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                      {svc.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{svc.desc}</p>
                    <p className="mt-2 text-xs font-semibold tabular-nums text-cyan-deep">
                      {svc.metric}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Team strip */}
        <Reveal delay={0.1}>
          <div className="mt-16 rounded-2xl bg-gray-50 p-8 sm:p-12">
            <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-lg">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10">
                  <UsersThree size={22} weight="duotone" className="text-cyan-deep" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {t("team.title")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {t("team.desc")}
                </p>
                <CTAButton href={calendlyLink()} variant="primary" size="md" className="mt-7">
                  {t("team.cta")}
                </CTAButton>
              </div>

              <div className="grid grid-cols-3 gap-6 sm:gap-10">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-cyan-deep sm:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 max-w-[8rem] text-xs leading-snug text-muted">
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

