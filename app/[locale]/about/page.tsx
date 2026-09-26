import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { KingdomLogo } from "@/components/ui/kingdom-logo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return {
    title: isEs ? "Sobre Nosotros · KINGDOM MEDIA HUB" : "About Us · KINGDOM MEDIA HUB",
    description: isEs
      ? "La historia de KINGDOM y su fundador, Chrizz Lacruz."
      : "The story of KINGDOM and its founder, Chrizz Lacruz.",
    alternates: {
      canonical: `/${locale}/about/`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEs = locale === "es";

  return (
    <>
      <Navbar />
      <main>
        {/* Kingdom's story */}
        <section className="bg-dark pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <KingdomLogo color="#fff" height={36} className="mx-auto" />
            <p className="eyebrow mt-8 text-white/50">{isEs ? "Nuestra Historia" : "Our Story"}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
              {isEs ? "Cómo nació KINGDOM" : "How KINGDOM began"}
            </h1>
            <p className="mt-6 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
              {isEs
                ? "KINGDOM nació de una idea sencilla: las empresas no necesitan más herramientas desconectadas, sino sistemas capaces de convertir atención en crecimiento. Con el tiempo, evolucionamos hasta integrar estrategia, diseño, desarrollo y automatización en una misma estructura de trabajo. Hoy creamos webs de alta conversión, productos digitales y ecosistemas comerciales que conectan la captación, la atención, el seguimiento y la operación. No construimos tecnología por construir; diseñamos soluciones que responden a la realidad de cada negocio y le permiten avanzar con mayor claridad, control y capacidad de crecimiento."
                : "KINGDOM was born from a simple idea: businesses don't need more disconnected tools, they need systems capable of turning attention into growth. Over time, we evolved to integrate strategy, design, development, and automation into a single way of working. Today we build high-conversion websites, digital products, and commercial ecosystems that connect acquisition, attention, follow-up, and operations. We don't build technology for its own sake; we design solutions that respond to the reality of each business and let it move forward with greater clarity, control, and growth capacity."}
            </p>
          </div>
        </section>

        {/* Founder */}
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl">
                <Image
                  src="/about/chrizz-founder.png"
                  alt="Chrizz Lacruz, founder of KINGDOM"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 24rem, 80vw"
                  priority
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="eyebrow">
                {isEs ? "El Fundador" : "The Founder"}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink sm:text-4xl">
                Chrizz Lacruz
              </h2>
              <p className="mt-6 text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {isEs
                  ? "Chrizz Lacruz es estratega, diseñador y desarrollador de productos digitales, especializado en crear experiencias web, automatizaciones y sistemas comerciales conectados. Como fundador y director de KINGDOM, combina visión de negocio, dirección creativa y tecnología para transformar problemas complejos en soluciones claras y funcionales. Su enfoque comienza antes del diseño o el código: entender cómo funciona el negocio, detectar qué está frenando su crecimiento y construir el sistema adecuado para resolverlo."
                  : "Chrizz Lacruz is a strategist, designer, and digital product developer specialized in building web experiences, automations, and connected commercial systems. As founder and director of KINGDOM, he combines business vision, creative direction, and technology to turn complex problems into clear, functional solutions. His approach starts before design or code: understanding how the business works, identifying what's holding back its growth, and building the right system to solve it."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
