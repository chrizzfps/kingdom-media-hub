import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Ecosystem } from "@/components/sections/ecosystem";
import { ROICalculator } from "@/components/sections/roi-calculator";
import { Agency } from "@/components/sections/agency";
import { MediaLab } from "@/components/sections/media-lab";
import { Marketing } from "@/components/sections/marketing";
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Ecosystem />
        <ROICalculator />
        <Agency />
        <MediaLab />
        <Marketing />
        <Academy />
        <HowItWorks />
        <CaseStudies />
        <SocialProof />
        <Comparison />
        <FAQ />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <StickyMobileCTA />
      <FloatingWhatsApp />
    </>
  );
}
