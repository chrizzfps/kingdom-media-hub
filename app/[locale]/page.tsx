import { setRequestLocale } from "next-intl/server";
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
import { ScrollProgress } from "@/components/cro/scroll-progress";
import { StickyMobileCTA } from "@/components/cro/sticky-mobile-cta";
import { FloatingWhatsApp } from "@/components/cro/floating-whatsapp";
import { getPublishedContent } from "@/lib/cms/get-published";

// Every reorderable/hideable homepage section — driven by kingdom_sections
// (order + visibility), edited from /admin. Hero and Contact are structural
// (always present) but still participate in the order list.
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

const DEFAULT_ORDER = [
  "hero",
  "trust",
  "ecosystem",
  "roi",
  "agency",
  "mediaLab",
  "academy",
  "howItWorks",
  "caseStudies",
  "socialProof",
  "comparison",
  "faq",
  "pricing",
  "contact",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const published = await getPublishedContent();
  const sections = published?.sections?.filter((s) => s.group === "homepage");

  const order = sections
    ? [...sections].sort((a, b) => a.sortOrder - b.sortOrder).filter((s) => s.isVisible).map((s) => s.key)
    : DEFAULT_ORDER;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        {order.map((key) => {
          const Section = SECTION_REGISTRY[key];
          return Section ? <Section key={key} /> : null;
        })}
      </main>
      <Footer />
      <StickyMobileCTA />
      <FloatingWhatsApp />
    </>
  );
}
