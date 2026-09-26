import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { Reveal } from "@/components/ui/reveal";

const CELL_SPAN = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-3"];

export function SocialProof() {
  const t = useTranslations("socialProof");
  const tc = useTranslations("common");
  // Hidden (all logos unchecked) in the CMS until real client logos are uploaded.
  const clientLogos = tc.has("clientLogos")
    ? (tc.raw("clientLogos") as Array<{ id: string; imageUrl?: string; imageAlt?: string }>)
    : [];
  const testimonials = t.raw("testimonials") as Array<{
    quote: string; name: string; role: string; company: string;
  }>;

  return (
    <section id="social-proof" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title={t("title")}
          align="center"
          className="mb-12"
        />

        {/* Logo carousel */}
        {clientLogos.length > 0 && (
          <Reveal>
            <LogoCarousel logos={clientLogos} />
          </Reveal>
        )}

        {/* Testimonials */}
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08} className={CELL_SPAN[i]}>
              <GlassCard variant="subtle" className="flex h-full flex-col justify-between p-6">
                <p className={`leading-relaxed text-ink/80 ${i === 0 ? "text-lg" : "text-sm"}`}>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-5 border-t border-edge pt-5">
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-muted">{item.role}, {item.company}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
