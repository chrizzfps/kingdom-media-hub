import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ScrollProgress } from "@/components/cro/scroll-progress";
import { StickyMobileCTA } from "@/components/cro/sticky-mobile-cta";
import { FloatingWhatsApp } from "@/components/cro/floating-whatsapp";
import { SECTION_REGISTRY, homepageOrder } from "@/components/sections/registry";
import { getPublishedContent } from "@/lib/cms/get-published";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Read at build time: publishing in /admin takes effect on the next build + upload.
  const order = homepageOrder(await getPublishedContent());

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
