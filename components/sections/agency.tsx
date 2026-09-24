import { useTranslations } from "next-intl";
import { Robot, Lightning, Browser, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CTAButton } from "@/components/ui/cta-button";
import { whatsappLink } from "@/lib/env";
import { DemoButton } from "./demo-button";
import { AIDemoModal } from "./ai-demo-modal";
import {
  AgencyVoiceVisual,
  AgencyAutomationVisual,
  AgencyWebsitesVisual,
} from "./agency-visuals";

const services = [
  { key: "voice",      Icon: Robot },
  { key: "automation", Icon: Lightning },
  { key: "websites",   Icon: Browser, featured: true },
] as const;

type ServiceMedia = { imageUrl?: string; imageAlt?: string };
type AgencyT = { has: (key: string) => boolean; raw: (key: string) => unknown };

/** Real project image from the CMS item, if published for this service. */
function getServiceMedia(t: AgencyT, key: string): ServiceMedia {
  const media = t.has(`${key}.media`) ? (t.raw(`${key}.media`) as ServiceMedia[])[0] : undefined;
  return { imageUrl: media?.imageUrl, imageAlt: media?.imageAlt };
}

export function Agency() {
  const t  = useTranslations("agency");
  const tc = useTranslations("common");

  const voiceMedia = getServiceMedia(t, "voice");
  const automationMedia = getServiceMedia(t, "automation");
  const websitesMedia = getServiceMedia(t, "websites");
  // Legacy plain-text field, kept as a fallback in case it was ever published
  // before the CMS item existed — currently unused in production.
  const legacyWebsiteImageUrl = t.has("websites.imageUrl") ? t("websites.imageUrl") : undefined;
  const legacyWebsiteImageAlt = t.has("websites.imageAlt") ? t("websites.imageAlt") : undefined;

  return (
    <section id="agency" className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* Background subtle separation */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(249,250,251,0.6)_50%,transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="max-w-3xl"
        />

        {/* Feature rows with bespoke visual art direction */}
        <div className="mt-20 space-y-24 sm:mt-28 sm:space-y-32">
          {services.map((svc, i) => {
            const { key, Icon } = svc;
            const featured = "featured" in svc && svc.featured === true;
            const isReverse = i % 2 === 1;
            const points = t.raw(`${key}.points`) as string[];

            return (
              <Reveal key={key} delay={0.04}>
                <div
                  className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-14 ${
                    isReverse ? "lg:[&>:first-child]:order-last" : ""
                  }`}
                >
                  {/* Text column (5 cols) */}
                  <div className="lg:col-span-5">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 border border-edge text-ink">
                      <Icon size={22} weight="duotone" className="text-cyan-deep" />
                    </span>
                    <p className="eyebrow mt-5 text-muted tracking-widest">{t(`${key}.tagline`)}</p>
                    <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                      {t(`${key}.name`)}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-muted">
                      {t(`${key}.desc`)}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm text-ink/80">
                          <CheckCircle
                            size={18}
                            className="mt-0.5 shrink-0 text-cyan-deep"
                            weight="duotone"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <CTAButton href={whatsappLink() ?? "#contact"} variant="primary" size="md">
                        {tc("bookCall")}
                      </CTAButton>
                      {featured && <DemoButton />}
                    </div>
                  </div>

                  {/* Visual column (7 cols) — Bespoke art direction */}
                  <div className="lg:col-span-7">
                    {key === "voice" && (
                      <AgencyVoiceVisual imageUrl={voiceMedia.imageUrl} imageAlt={voiceMedia.imageAlt} />
                    )}
                    {key === "automation" && (
                      <AgencyAutomationVisual imageUrl={automationMedia.imageUrl} imageAlt={automationMedia.imageAlt} />
                    )}
                    {key === "websites" && (
                      <AgencyWebsitesVisual
                        imageUrl={websitesMedia.imageUrl ?? legacyWebsiteImageUrl}
                        imageAlt={websitesMedia.imageAlt ?? legacyWebsiteImageAlt}
                      />
                    )}
                  </div>
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
