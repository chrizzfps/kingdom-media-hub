import { useTranslations } from "next-intl";
import { Storefront, FilmSlate, GraduationCap, Lightning } from "@phosphor-icons/react/dist/ssr";
import type { IconWeight } from "@phosphor-icons/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";

export function Ecosystem() {
  const t = useTranslations("ecosystem");

  return (
    <section id="ecosystem" className="relative overflow-hidden bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-14"
        />

        <Reveal variant="scale">
          {/* Desktop: left column (Agency top, MediaLab+Academy bottom) + right Core */}
          <div className="hidden gap-4 lg:flex">
            {/* Left column */}
            <div className="flex flex-[2] flex-col gap-4">
              {/* Agency — top, tall */}
              <GlassCard className="flex-1 p-7">
                <EngineCard engineKey="agency" Icon={Storefront} t={t} />
              </GlassCard>
              {/* MediaLab + Academy — bottom row */}
              <div className="grid flex-1 grid-cols-2 gap-4">
                <GlassCard className="p-6">
                  <EngineCard engineKey="mediaLab" Icon={FilmSlate} t={t} />
                </GlassCard>
                <GlassCard className="p-6">
                  <EngineCard engineKey="academy" Icon={GraduationCap} t={t} />
                </GlassCard>
              </div>
            </div>

            {/* Kingdom Core — right, full height */}
            <GlassCard
              variant="cyan"
              className="relative flex flex-[3] flex-col justify-between overflow-hidden p-9"
            >
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10">
                  <Lightning size={24} className="text-cyan" weight="duotone" />
                </span>
                <h3 className="mt-6 font-display text-4xl font-bold tracking-tight text-ink">
                  {t("coreTitle")}
                </h3>
                <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
                  {t("coreDesc")}
                </p>
              </div>
              <EcosystemFlow t={t} />
            </GlassCard>
          </div>

          {/* Mobile / tablet: vertical stack */}
          <div className="flex flex-col gap-4 lg:hidden">
            {/* Core first on mobile */}
            <GlassCard variant="cyan" className="relative overflow-hidden p-7">
              <div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10">
                  <Lightning size={20} className="text-cyan" weight="duotone" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
                  {t("coreTitle")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t("coreDesc")}</p>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(["agency", "mediaLab", "academy"] as const).map((key, i) => {
                const icons = [Storefront, FilmSlate, GraduationCap];
                const Icon = icons[i];
                return (
                  <GlassCard key={key} className="p-5">
                    <EngineCard engineKey={key} Icon={Icon} t={t} compact />
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type EngineKey = "agency" | "mediaLab" | "academy";

function EngineCard({
  engineKey,
  Icon,
  t,
  compact = false,
}: {
  engineKey: EngineKey;
  Icon: React.ComponentType<{ size: number; weight?: IconWeight; className?: string }>;
  t: ReturnType<typeof useTranslations>;
  compact?: boolean;
}) {
  const items = t.raw(`${engineKey}.items`) as string[];
  return (
    <div>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
        <Icon size={20} weight="duotone" className="text-ink" />
      </span>
      <h3 className={`mt-4 font-display font-bold tracking-tight text-ink ${compact ? "text-base" : "text-xl"}`}>
        {t(`${engineKey}.name`)}
      </h3>
      <p className="eyebrow mt-0.5">{t(`${engineKey}.tagline`)}</p>
      {!compact && (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted">
              <span className="h-1 w-1 shrink-0 rounded-full bg-cyan" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EcosystemFlow({ t }: { t: ReturnType<typeof useTranslations> }) {
  const flow = (["agency", "mediaLab", "academy"] as const).map((key) => t(`${key}.tagline`));
  return (
    <div className="mt-10 flex divide-x divide-cyan/15 border-t border-cyan/15 pt-5">
      {flow.map((label) => (
        <p key={label} className="flex-1 px-3 text-center text-sm font-medium text-ink/70 first:pl-0 last:pr-0">
          {label}
        </p>
      ))}
    </div>
  );
}
