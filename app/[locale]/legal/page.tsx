import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return {
    title: isEs
      ? "Aviso Legal · KINGDOM MEDIA HUB"
      : "Legal Notice · KINGDOM MEDIA HUB",
    description: isEs
      ? "Información legal, condiciones generales de uso del portal web y datos identificativos de KINGDOM MEDIA HUB conforme a la Ley 34/2002 (LSSI-CE)."
      : "Legal information, terms of website use and company identification of KINGDOM MEDIA HUB pursuant to Spanish LSSI-CE.",
    alternates: {
      canonical: `/${locale}/legal/`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEs = locale === "es";

  return (
    <LegalPageLayout
      currentTab="legal"
      title={isEs ? "Aviso Legal" : "Legal Notice"}
      subtitle={
        isEs
          ? "Información general y condiciones de uso del portal web conforme al artículo 10 de la Ley 34/2002 (LSSI-CE)."
          : "General information and website terms of use in accordance with Article 10 of Spanish Law 34/2002 (LSSI-CE)."
      }
      lastUpdated={isEs ? "Marzo de 2025" : "March 2025"}
    >
      {isEs ? (
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              1. Datos Identificativos del Titular (Art. 10 LSSI-CE)
            </h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa a los usuarios de los datos identificativos y mercantiles del titular del presente sitio web:
            </p>
            <div className="rounded-xl border border-edge bg-white p-4 shadow-xs">
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Denominación Social / Nombre Comercial:</strong> KINGDOM MEDIA HUB</li>
                <li><strong>Número de Identificación Fiscal (NIF / CIF):</strong> P198058403</li>
                <li><strong>Domicilio Social:</strong> Madrid, Comunidad de Madrid, España</li>
                <li><strong>Correo electrónico de contacto:</strong> <a href="mailto:contact@kingdommediahub.com">contact@kingdommediahub.com</a></li>
                <li><strong>Teléfono / WhatsApp de atención:</strong> +34 711 251 968</li>
                <li><strong>Sitio Web Oficial:</strong> https://kingdommediahub.com</li>
                <li><strong>Actividad principal:</strong> Prestación de servicios de agencia de marketing digital, adquisición y optimización de conversión (Agency), producción audiovisual de alto impacto, 3D y CGI (Media Lab), sistemas y automatizaciones con inteligencia artificial, y programas de capacitación y consultoría empresarial (Academy).</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              2. Objeto y Ámbito de Aplicación
            </h2>
            <p>
              El presente Aviso Legal regula el acceso, navegación y utilización del sitio web oficial de <strong>KINGDOM MEDIA HUB</strong> (en adelante, el «Sitio Web»).
            </p>
            <p>
              El acceso al Sitio Web atribuye la condición de Usuario (en adelante, el «Usuario») e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal, así como en la <a href="/privacy">Política de Privacidad</a> y la <a href="/cookies">Política de Cookies</a>, en la versión publicada en el momento mismo en que el Usuario acceda al portal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              3. Condiciones de Acceso y Uso del Portal
            </h2>
            <p>
              El acceso al Sitio Web tiene carácter libre y gratuito para los Usuarios. Ciertos servicios específicos (tales como auditorías especializadas, contratación de servicios de agencia o programas formativos) podrán estar sujetos a condiciones particulares de contratación.
            </p>
            <p>El Usuario se compromete a:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Hacer un uso diligente, correcto y lícito del Sitio Web y sus contenidos, de conformidad con la legislación española y comunitaria vigente, la moral, las buenas costumbres y el orden público.</li>
              <li>No utilizar el Sitio Web con fines lesivos para los derechos o intereses de <strong>KINGDOM MEDIA HUB</strong> o de terceros, ni sobrecargar, dañar o inutilizar las redes, servidores o equipos informáticos de la entidad.</li>
              <li>No introducir ni difundir virus informáticos, troyanos, código malicioso o cualesquiera otros sistemas susceptibles de provocar daños en los sistemas lógicos o físicos de la entidad o de sus proveedores.</li>
              <li>No intentar acceder a áreas restringidas, sistemas de gestión interna ni extraer datos mediante técnicas de <em>scraping</em>, minería de datos o ingeniería inversa sin autorización previa y por escrito.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              4. Propiedad Intelectual e Industrial
            </h2>
            <p>
              Todos los contenidos del Sitio Web, incluyendo a título enunciativo pero no limitativo, los diseños gráficos, interfaces, logotipos, marcas comerciales, nombres comerciales, textos, vídeos, animaciones 3D, renders, código fuente, arquitectura de software, bases de datos y selección de materiales, son titularidad exclusiva de <strong>KINGDOM MEDIA HUB</strong> o de terceros que han autorizado expresamente su inclusión.
            </p>
            <p>
              Quedan expresamente prohibidas la reproducción, distribución, comunicación pública, puesta a disposición interactiva, transformación o cualquier otra forma de explotación de todo o parte de los contenidos de este portal, en cualquier soporte y por cualquier medio técnico, sin la autorización previa, expresa y por escrito de <strong>KINGDOM MEDIA HUB</strong>.
            </p>
            <p>
              Cualquier uso no autorizado constituirá una vulneración flagrante de la Ley de Propiedad Intelectual (Real Decreto Legislativo 1/1996) y de la Ley de Marcas (Ley 17/2001).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              5. Exclusión de Garantías y Responsabilidad
            </h2>
            <p>
              <strong>KINGDOM MEDIA HUB</strong> aplica rigurosas medidas de seguridad técnica y organizativa para garantizar el correcto funcionamiento del portal. No obstante, no garantiza la ausencia absoluta de interrupciones, errores técnicos temporales o elementos lesivos en el Sitio Web ocasionados por proveedores ajenos de telecomunicaciones, servidores o fuerza mayor.
            </p>
            <p>
              En la medida en que la legislación aplicable lo permita, <strong>KINGDOM MEDIA HUB</strong> declina toda responsabilidad por los daños y perjuicios de cualquier naturaleza que pudieran derivarse de:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>La falta de disponibilidad, mantenimiento o continuidad en el funcionamiento del portal web o de sus servicios.</li>
              <li>La presencia de virus, malware o programas lesivos introducidos por terceros a pesar de las medidas preventivas adoptadas.</li>
              <li>El uso ilícito, negligente o fraudulento del Sitio Web por parte de los Usuarios.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              6. Enlaces a Terceros (Hipervínculos)
            </h2>
            <p>
              El Sitio Web puede contener enlaces a sitios web de terceros (como plataformas de reserva de citas, redes sociales, servicios de mensajería de WhatsApp o pasarelas de pago). <strong>KINGDOM MEDIA HUB</strong> no ejerce control alguno sobre dichos sitios y no asume responsabilidad alguna por los contenidos, políticas de privacidad o prácticas de sitios web de terceros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              7. Legislación Aplicable y Jurisdicción Competente
            </h2>
            <p>
              Las relaciones establecidas entre <strong>KINGDOM MEDIA HUB</strong> y el Usuario se regirán estrictamente por la normativa española vigente.
            </p>
            <p>
              Para la resolución de cualquier controversia o discrepancia derivada del acceso o uso del Sitio Web, las partes se someten, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a los <strong>Juzgados y Tribunales de la ciudad de Madrid (España)</strong>, salvo en los casos en que la normativa en materia de defensa de consumidores y usuarios establezca con carácter imperativo un fuero distinto.
            </p>
          </section>
        </div>
      ) : (
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              1. Provider Identification (Article 10 Spanish LSSI-CE)
            </h2>
            <p>
              In compliance with Article 10 of Spanish Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE), the identifying data of the website owner is detailed below:
            </p>
            <div className="rounded-xl border border-edge bg-white p-4 shadow-xs">
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Company Name / Trade Name:</strong> KINGDOM MEDIA HUB</li>
                <li><strong>Tax Identification Number (NIF / CIF):</strong> P198058403</li>
                <li><strong>Registered Address:</strong> Madrid, Community of Madrid, Spain</li>
                <li><strong>Contact Email:</strong> <a href="mailto:contact@kingdommediahub.com">contact@kingdommediahub.com</a></li>
                <li><strong>Contact Phone / WhatsApp:</strong> +34 711 251 968</li>
                <li><strong>Official Website:</strong> https://kingdommediahub.com</li>
                <li><strong>Core Operations:</strong> Digital growth agency, media buying and conversion optimization (Agency), high-end audiovisual production, 3D and CGI (Media Lab), AI automations, and corporate training programs (Academy).</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              2. Purpose and Scope
            </h2>
            <p>
              This Legal Notice governs access, browsing, and use of the official website of <strong>KINGDOM MEDIA HUB</strong> (hereinafter, the «Website»).
            </p>
            <p>
              Accessing the Website confers user status (the «User») and implies full and unreserved acceptance of all provisions in this Legal Notice, as well as our <a href="/privacy">Privacy Policy</a> and <a href="/cookies">Cookie Policy</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              3. Terms of Use
            </h2>
            <p>
              Access to this Website is free of charge. Users agree to make diligent, lawful, and ethical use of the portal, refraining from conducting illicit activities, interfering with infrastructure, deploying malware, or attempting unauthorized data extraction (scraping, reverse engineering).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              4. Intellectual and Industrial Property
            </h2>
            <p>
              All assets, code, designs, 3D motion renders, typography, trademarks, brand collateral, and content hosted on this Website are the exclusive intellectual property of <strong>KINGDOM MEDIA HUB</strong> or authorized licensors. Any reproduction, distribution, public display, or derivative work without prior written authorization is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              5. Disclaimer of Warranties and Limitation of Liability
            </h2>
            <p>
              While <strong>KINGDOM MEDIA HUB</strong> implements robust security and performance standards, we do not warrant uninterrupted uptime, absence of telecommunication carrier outages, or third-party unauthorized intrusions. Liability is limited to the maximum extent permitted by applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              6. Governing Law and Dispute Resolution
            </h2>
            <p>
              These conditions are governed exclusively by the laws of the Kingdom of Spain. The parties agree to submit any disputes arising out of the Website to the exclusive jurisdiction of the <strong>Courts of Madrid (Spain)</strong>, without prejudice to non-waivable statutory consumer venues where mandatory.
            </p>
          </section>
        </div>
      )}
    </LegalPageLayout>
  );
}
