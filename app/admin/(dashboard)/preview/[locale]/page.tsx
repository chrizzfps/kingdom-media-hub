import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getPreviewSnapshot } from "@/lib/cms/actions";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Ecosystem } from "@/components/sections/ecosystem";
import { ROICalculator } from "@/components/sections/roi-calculator";
import { Agency } from "@/components/sections/agency";
import { MediaLab } from "@/components/sections/media-lab";
import { Academy } from "@/components/sections/academy";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CaseStudies } from "@/components/sections/case-studies";
import { SocialProof } from "@/components/sections/social-proof";
import { Comparison } from "@/components/sections/comparison";
import { FAQ } from "@/components/sections/faq";
import { Pricing } from "@/components/sections/pricing";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  hero: Hero,
  trust: TrustBar,
  ecosystem: Ecosystem,
  roi: ROICalculator,
  agency: Agency,
  mediaLab: MediaLab,
  academy: Academy,
  howItWorks: HowItWorks,
  caseStudies: CaseStudies,
  socialProof: SocialProof,
  comparison: Comparison,
  faq: FAQ,
  pricing: Pricing,
  contact: Contact,
};

export default async function PreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "es") notFound();

  const snapshot = await getPreviewSnapshot();
  const order = [...snapshot.sections]
    .filter((s) => s.group === "homepage")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((s) => s.isVisible)
    .map((s) => s.key);

  return (
    <div>
      <div className="sticky top-0 z-[60] bg-amber-400 px-4 py-1.5 text-center text-xs font-semibold text-amber-950">
        Vista previa del borrador — esto NO es lo publicado ({locale.toUpperCase()})
      </div>
      <NextIntlClientProvider locale={locale} messages={snapshot[locale]}>
        <Navbar />
        <main>
          {order.map((key) => {
            const Section = SECTION_REGISTRY[key];
            return Section ? <Section key={key} /> : null;
          })}
        </main>
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}
