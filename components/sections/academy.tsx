import { useTranslations } from "next-intl";
import { BookOpen, TrendUp, Robot, ChartLineUp } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";

const icons = [BookOpen, TrendUp, Robot, ChartLineUp] as const;

export function Academy() {
  const t = useTranslations("academy");
  const programs = t.raw("programs") as Array<{
    id: string; name: string; desc: string; badge: string;
  }>;
  const [featured, ...rest] = programs;
  const FeaturedIcon = icons[0];

  return (
    <section id="academy" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-14"
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-3">
            <GlassCard variant="subtle" className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cyan/10">
                <FeaturedIcon size={28} weight="duotone" className="text-cyan-deep" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-bold text-ink">{featured.name}</h3>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">{featured.desc}</p>
              </div>
              <div className="inline-flex shrink-0 items-center self-start rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan-deep sm:self-center">
                {featured.badge}
              </div>
            </GlassCard>
          </Reveal>

          {rest.map((prog, i) => {
            const Icon = icons[(i + 1) % icons.length];
            return (
              <Reveal key={prog.id} delay={i * 0.06 + 0.05}>
                <GlassCard variant="subtle" className="flex h-full flex-col p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                    <Icon size={22} weight="duotone" className="text-ink" />
                  </span>
                  <div className="mt-4 flex-1">
                    <h3 className="font-display text-lg font-bold text-ink">{prog.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{prog.desc}</p>
                  </div>
                  <div className="mt-5 inline-flex items-center self-start rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan-deep">
                    {prog.badge}
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
