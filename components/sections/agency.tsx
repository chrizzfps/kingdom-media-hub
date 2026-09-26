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
  const voicePoints = t.raw("voice.points") as string[];

  return (
    <section id="agency" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="max-w-3xl"
        />

        {/* Featured: AI virtual assistant */}
        <Reveal>
          <div className="mt-16 grid items-center gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 border border-edge text-ink">
                <Robot size={22} weight="duotone" className="text-cyan-deep" />
              </span>
              <p className="eyebrow mt-5">{t("voice.tagline")}</p>
              <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                {t("voice.name")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {t("voice.desc")}
              </p>

              <ul className="mt-6 space-y-3">
                {voicePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-ink/80">
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-cyan-deep" weight="duotone" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CTAButton href={whatsappLink() ?? "#contact"} variant="primary" size="md">
                  {tc("bookCall")}
                </CTAButton>
                <DemoButton />
              </div>
            </div>

            <div className="lg:col-span-7">
              <AgencyVoiceVisual
                imageUrl={voiceMedia.imageUrl}
                imageAlt={voiceMedia.imageAlt}
                label={t("voice.name")}
              />
            </div>
          </div>
        </Reveal>

        {/* Automation + Websites, side by side */}
        <div className="mt-16 grid gap-8 sm:mt-20 lg:grid-cols-2 lg:gap-10">
          {(
            [
              { key: "automation", Icon: Lightning, Visual: AgencyAutomationVisual, media: automationMedia },
              {
                key: "websites",
                Icon: Browser,
                Visual: AgencyWebsitesVisual,
                media: { imageUrl: websitesMedia.imageUrl ?? legacyWebsiteImageUrl, imageAlt: websitesMedia.imageAlt ?? legacyWebsiteImageAlt },
              },
            ] as const
          ).map(({ key, Icon, Visual, media }, i) => {
            const points = t.raw(`${key}.points`) as string[];
            return (
              <Reveal key={key} delay={i * 0.06}>
                <div>
                  <Visual imageUrl={media.imageUrl} imageAlt={media.imageAlt} label={t(`${key}.name`)} />

                  <span className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 border border-edge text-ink">
                    <Icon size={22} weight="duotone" className="text-cyan-deep" />
                  </span>
                  <p className="eyebrow mt-5">{t(`${key}.tagline`)}</p>
                  <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    {t(`${key}.name`)}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {t(`${key}.desc`)}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-ink/80">
                        <CheckCircle size={18} className="mt-0.5 shrink-0 text-cyan-deep" weight="duotone" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <CTAButton href={whatsappLink() ?? "#contact"} variant="primary" size="md">
                      {tc("bookCall")}
                    </CTAButton>
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
