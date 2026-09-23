import { useTranslations } from "next-intl";
import { Robot, Lightning, Browser, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { CTAButton } from "@/components/ui/cta-button";
import { OrganicBlob } from "@/components/ui/organic-blob";
import { whatsappLink } from "@/lib/env";
import { DemoButton } from "./demo-button";
import { AIDemoModal } from "./ai-demo-modal";

const services = [
  { key: "voice",      Icon: Robot },
  { key: "automation", Icon: Lightning },
  { key: "websites",   Icon: Browser, featured: true },
] as const;

export function Agency() {
  const t  = useTranslations("agency");
  const tc = useTranslations("common");

  return (
    <section id="agency" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <OrganicBlob variant="secondary" className="-left-32 top-20 h-[400px] w-[400px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="max-w-2xl"
        />

        {/* Feature rows — Apple style */}
        <div className="mt-20 space-y-20 sm:mt-24">
          {services.map((svc, i) => {
            const { key, Icon } = svc;
            const featured = "featured" in svc && svc.featured === true;
            const isReverse = i % 2 === 1;
            const points = t.raw(`${key}.points`) as string[];
            return (
              <Reveal key={key} delay={0.05}>
                <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${isReverse ? "lg:[&>:first-child]:order-last" : ""}`}>
                  {/* Text */}
                  <div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                      <Icon size={22} weight="duotone" className="text-ink" />
                    </span>
                    <p className="eyebrow mt-5">{t(`${key}.tagline`)}</p>
                    <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                      {t(`${key}.name`)}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-muted">{t(`${key}.desc`)}</p>

                    <ul className="mt-6 space-y-3">
                      {points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm text-muted">
                          <CheckCircle
                            size={18}
                            className="mt-0.5 shrink-0 text-cyan"
                            weight="duotone"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <CTAButton href={whatsappLink() ?? "#contact"} variant="primary" size="md">
                        {tc("bookCall")}
                      </CTAButton>
                      {featured && <DemoButton />}
                    </div>
                  </div>

                  {/* Visual mockup */}
                  <ServiceVisual serviceKey={key} featured={featured} />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <AIDemoModal />
    </section>
  );
}

function ServiceVisual({ serviceKey, featured }: { serviceKey: string; featured: boolean }) {
  const colors = {
    voice:      { accent: "bg-emerald-50", dot: "bg-emerald-400" },
    automation: { accent: "bg-blue-50",    dot: "bg-blue-400" },
    websites:   { accent: "bg-cyan-50",    dot: "bg-cyan" },
  } as Record<string, { accent: string; dot: string }>;
  const c = colors[serviceKey] ?? colors.voice;

  return (
    <GlassCard
      variant={featured ? "cyan" : "subtle"}
      className="aspect-[4/3] w-full overflow-hidden"
    >
      <div className={`flex h-full flex-col ${c.accent} p-6`}>
        {/* Fake window chrome */}
        <div className="flex items-center gap-1.5">
          {["bg-red-400", "bg-amber-400", "bg-green-400"].map((cl) => (
            <span key={cl} className={`h-3 w-3 rounded-full ${cl}`} />
          ))}
        </div>
        {/* Content placeholder */}
        <div className="mt-6 flex-1 space-y-3">
          {serviceKey === "voice" && <VoiceUI dotColor={c.dot} />}
          {serviceKey === "automation" && <AutomationUI dotColor={c.dot} />}
          {serviceKey === "websites" && <WebsiteUI />}
        </div>
      </div>
    </GlassCard>
  );
}

function VoiceUI({ dotColor }: { dotColor: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
        <span className={`relative flex h-3 w-3 shrink-0 ${dotColor}`}>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-current" />
        </span>
        <div className="flex-1 space-y-1">
          <div className="h-2 w-32 rounded-full bg-gray-200" />
          <div className="h-2 w-20 rounded-full bg-gray-100" />
        </div>
      </div>
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex gap-2">
          <div className={`h-2 rounded-full ${n % 2 === 0 ? "ml-auto bg-cyan/20" : "bg-gray-200"}`}
            style={{ width: `${40 + n * 15}%` }} />
        </div>
      ))}
    </div>
  );
}

function AutomationUI({ dotColor }: { dotColor: string }) {
  const nodes = [
    { x: "20%", y: "20%" }, { x: "50%", y: "20%" }, { x: "80%", y: "20%" },
    { x: "35%", y: "55%" }, { x: "65%", y: "55%" },
    { x: "50%", y: "85%" },
  ];
  return (
    <div className="relative h-40">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <line x1="20%" y1="20%" x2="50%" y2="20%" stroke="#E5E7EB" strokeWidth="1.5" />
        <line x1="50%" y1="20%" x2="80%" y2="20%" stroke="#E5E7EB" strokeWidth="1.5" />
        <line x1="35%" y1="35%" x2="35%" y2="55%" stroke="#E5E7EB" strokeWidth="1.5" />
        <line x1="65%" y1="35%" x2="65%" y2="55%" stroke="#E5E7EB" strokeWidth="1.5" />
        <line x1="50%" y1="70%" x2="50%" y2="85%" stroke="#33CCFF" strokeWidth="1.5" />
      </svg>
      {nodes.map((n, i) => (
        <span
          key={i}
          className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm ${i === 5 ? dotColor : "bg-gray-200"}`}
          style={{ left: n.x, top: n.y }}
        />
      ))}
    </div>
  );
}

function WebsiteUI() {
  return (
    <div className="space-y-2">
      <div className="h-16 rounded-xl bg-white/80 shadow-sm" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-10 rounded-lg bg-white/60 shadow-sm" />
        ))}
      </div>
      <div className="h-8 w-1/2 rounded-full bg-cyan/20 shadow-sm" />
    </div>
  );
}
