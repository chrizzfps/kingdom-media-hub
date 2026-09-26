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
      ? "Política de Privacidad · KINGDOM MEDIA HUB"
      : "Privacy Policy · KINGDOM MEDIA HUB",
    description: isEs
      ? "Información detallada sobre el tratamiento y protección de sus datos personales conforme al RGPD (UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD)."
      : "Detailed information on data protection and processing of personal data under the EU General Data Protection Regulation (GDPR) and Spanish LOPDGDD.",
    alternates: {
      canonical: `/${locale}/privacy/`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEs = locale === "es";

  return (
    <LegalPageLayout
      currentTab="privacy"
      title={isEs ? "Política de Privacidad" : "Privacy Policy"}
      subtitle={
        isEs
          ? "Tratamiento y protección de datos personales con arreglo al Reglamento General de Protección de Datos (RGPD UE 2016/679) y a la Ley Orgánica 3/2018 (LOPDGDD)."
          : "Personal data handling and privacy rights in accordance with the EU General Data Protection Regulation (GDPR 2016/679) and Spanish LOPDGDD."
      }
      lastUpdated={isEs ? "Marzo de 2025" : "March 2025"}
    >
      {isEs ? (
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              1. Responsable del Tratamiento
            </h2>
            <p>
              El responsable del tratamiento de los datos personales recabados a través del presente sitio web es:
            </p>
            <div className="rounded-xl border border-edge bg-white p-4 shadow-xs">
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Identidad del Responsable:</strong> KINGDOM MEDIA HUB</li>
                <li><strong>NIF / CIF:</strong> P198058403</li>
                <li><strong>Domicilio:</strong> Madrid, España</li>
                <li><strong>Correo de contacto para privacidad:</strong> <a href="mailto:contact@kingdommediahub.com">contact@kingdommediahub.com</a></li>
                <li><strong>Teléfono de contacto:</strong> +34 711 251 968</li>
              </ul>
            </div>
            <p>
              En <strong>KINGDOM MEDIA HUB</strong> asumimos el máximo compromiso con la privacidad, confidencialidad e integridad de la información de nuestros usuarios, clientes y candidatos, cumpliendo rigurosamente los principios de licitud, lealtad, transparencia, minimización de datos, exactitud y limitación del plazo de conservación.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              2. Datos Personales que Recopilamos
            </h2>
            <p>Recopilamos y tratamos las siguientes categorías de datos personales:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Datos identificativos y de contacto:</strong> Nombre, apellidos, dirección de correo electrónico profesional, número de teléfono o WhatsApp, empresa en la que presta servicios, cargo profesional y sector de actividad.</li>
              <li><strong>Datos de solicitud comercial y de proyecto:</strong> Información técnica aportada voluntariamente a través del formulario de auditoría de crecimiento o reservas (volumen de facturación estimado, presupuesto de inversión publicitaria mensual, canales de venta y retos de marketing).</li>
              <li><strong>Datos de navegación y telemetría técnica:</strong> Dirección IP (anonimizada), tipo de navegador, sistema operativo, fecha y hora de acceso, páginas visualizadas y datos agregados de uso (únicamente activados tras su consentimiento expreso mediante nuestro panel de cookies).</li>
              <li><strong>Datos de facturación:</strong> Razón social, NIF/CIF, domicilio fiscal y datos bancarios o de tarjeta en caso de formalización de contratos mercantiles.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              3. Finalidades del Tratamiento y Bases de Legitimación
            </h2>
            <p>
              Tratamos sus datos personales con las siguientes finalidades y bajo las bases jurídicas del artículo 6 del RGPD:
            </p>

            <div className="overflow-x-auto rounded-xl border border-edge bg-white">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-edge bg-gray-50 text-ink font-semibold">
                  <tr>
                    <th className="p-3">Finalidad del Tratamiento</th>
                    <th className="p-3">Base Jurídica (Legitimación)</th>
                    <th className="p-3">Plazo de Conservación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge text-slate-600">
                  <tr>
                    <td className="p-3 font-medium text-ink">Gestión de consultas, solicitudes de auditoría de crecimiento y reservas de consultoría.</td>
                    <td className="p-3">Consentimiento del interesado (Art. 6.1.a RGPD) y aplicación de medidas precontractuales (Art. 6.1.b RGPD).</td>
                    <td className="p-3">Hasta la resolución de la consulta y durante los plazos legales de prescripción de responsabilidades (máximo 1 año si no fructifica en contrato).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Ejecución de servicios contratados de agencia, producción audiovisual (Media Lab) o programas formativos (Academy).</td>
                    <td className="p-3">Ejecución de contrato de prestación de servicios (Art. 6.1.b RGPD).</td>
                    <td className="p-3">Durante la vigencia de la relación contractual y, posteriormente, durante 5 a 6 años por obligaciones fiscales y mercantiles (Código de Comercio, Ley General Tributaria).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Envío de comunicaciones de valor, newsletters sobre tendencias y novedades de servicios.</td>
                    <td className="p-3">Consentimiento explícito otorgado (Art. 6.1.a RGPD) o interés legítimo para clientes existentes (Art. 21.2 LSSI-CE).</td>
                    <td className="p-3">Hasta que el usuario revoque su consentimiento o solicite la baja a través del enlace facilitado en cada comunicación.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Analítica web, optimización de conversión y prevención de fraudes.</td>
                    <td className="p-3">Consentimiento para cookies de analítica y marketing (Art. 6.1.a RGPD); Interés legítimo para seguridad técnica (Art. 6.1.f RGPD).</td>
                    <td className="p-3">Conforme a la vida útil de cada cookie descrita en la Política de Cookies (máx. 2 años).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              4. Destinatarios y Encargados del Tratamiento
            </h2>
            <p>
              <strong>KINGDOM MEDIA HUB</strong> no vende, alquila ni comercializa datos personales de sus usuarios con terceros.
            </p>
            <p>
              Para prestar nuestros servicios, contratamos proveedores tecnológicos que actúan en calidad de <strong>Encargados del Tratamiento</strong>, debidamente vinculados mediante contratos conformes al artículo 28 del RGPD:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Proveedores de alojamiento y cloud:</strong> Vercel Inc. (servidores en la UE y red CDN global) y Supabase Inc. (bases de datos seguras y autenticación).</li>
              <li><strong>Herramientas de productividad y comunicaciones:</strong> Google Workspace y plataformas de videollamada para reuniones de trabajo.</li>
              <li><strong>Herramientas de analítica y marketing:</strong> Google Analytics 4 (Google Ireland Ltd.), Meta Platforms Ireland Ltd., y LinkedIn Ireland Unlimited Company (activados exclusivamente previa autorización mediante el banner de cookies).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              5. Transferencias Internacionales de Datos
            </h2>
            <p>
              Priorizamos el almacenamiento y tratamiento de datos dentro del Espacio Económico Europeo (EEE). En aquellos casos puntuales en los que se utilicen proveedores de servicios tecnológicos con sede o servidores fuera del EEE (como Estados Unidos), nos aseguramos de que dichas entidades estén certificadas bajo el <strong>Marco de Privacidad de Datos UE-EE.UU. (Data Privacy Framework - DPF)</strong> o tengan suscritas las <strong>Cláusulas Contractuales Tipo (CCT)</strong> aprobadas por la Comisión Europea, garantizando un nivel de protección equiparable al europeo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              6. Derechos de los Interesados (ARCO-POL)
            </h2>
            <p>
              El Reglamento General de Protección de Datos y la LOPDGDD garantizan al Usuario el ejercicio de los siguientes derechos:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Derecho de Acceso:</strong> Saber qué datos personales estamos tratando sobre usted.</li>
              <li><strong>Derecho de Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</li>
              <li><strong>Derecho de Supresión («Derecho al Olvido»):</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios para los fines que fueron recogidos.</li>
              <li><strong>Derecho de Oposición:</strong> Oponerse al tratamiento de sus datos con fines de mercadotecnia directa o basados en el interés legítimo.</li>
              <li><strong>Derecho a la Limitación del Tratamiento:</strong> Solicitar que se limite el tratamiento de sus datos en los supuestos legalmente previstos.</li>
              <li><strong>Derecho a la Portabilidad:</strong> Recibir los datos facilitados en un formato estructurado, de uso común y lectura mecánica, o transmitirlos a otro responsable.</li>
              <li><strong>Derecho a revocar el consentimiento:</strong> En cualquier momento y sin carácter retroactivo.</li>
            </ul>

            <div className="rounded-xl border border-edge bg-gray-50 p-4">
              <h3 className="font-semibold text-ink">¿Cómo ejercer sus derechos?</h3>
              <p className="mt-1 text-xs">
                Puede ejercer cualquiera de estos derechos enviando una comunicación escrita por correo electrónico a:
              </p>
              <p className="mt-2 text-xs font-semibold text-cyan-deep">
                <a href="mailto:contact@kingdommediahub.com?subject=Ejercicio%20de%20Derechos%20Proteccion%20de%20Datos">
                  contact@kingdommediahub.com
                </a>
              </p>
              <p className="mt-1 text-xs text-muted">
                Indicando en el asunto: <em>«Protección de Datos - Ejercicio de Derechos»</em>, adjuntando una copia de su DNI o documento equivalente para verificar su identidad y detallando el derecho concreto que desea ejercer. Responderemos a su solicitud en el plazo máximo de un (1) mes legalmente estipulado.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              7. Reclamación ante la Autoridad de Control
            </h2>
            <p>
              Si considera que el tratamiento de sus datos personales infringe la normativa aplicable o que no ha obtenido satisfacción en el ejercicio de sus derechos, tiene derecho a presentar una reclamación ante la autoridad de control competente:
            </p>
            <div className="rounded-xl border border-edge bg-white p-4 text-xs">
              <p className="font-bold text-ink">Agencia Española de Protección de Datos (AEPD)</p>
              <p className="text-muted">C/ Jorge Juan, 6, 28001 Madrid (España)</p>
              <p className="text-muted">Sitio web oficial: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-cyan underline">www.aepd.es</a></p>
              <p className="text-muted">Sede electrónica: sedeagpd.gob.es</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              8. Medidas de Seguridad
            </h2>
            <p>
              En <strong>KINGDOM MEDIA HUB</strong> implementamos medidas de seguridad técnicas, organizativas y jurídicas de última generación para evitar la alteración, pérdida, acceso no autorizado o robo de datos personales, tales como cifrado de comunicaciones extremo a extremo (TLS/HTTPS), políticas de control de acceso restringido y copias de seguridad redundantes.
            </p>
          </section>
        </div>
      ) : (
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              1. Data Controller
            </h2>
            <p>
              The data controller responsible for the personal data collected through this Website is:
            </p>
            <div className="rounded-xl border border-edge bg-white p-4 shadow-xs">
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Controller Name:</strong> KINGDOM MEDIA HUB</li>
                <li><strong>Tax Identification (NIF / CIF):</strong> P198058403</li>
                <li><strong>Headquarters:</strong> Madrid, Spain</li>
                <li><strong>Privacy Contact:</strong> <a href="mailto:contact@kingdommediahub.com">contact@kingdommediahub.com</a></li>
                <li><strong>Phone:</strong> +34 711 251 968</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              2. Data We Collect and Purposes
            </h2>
            <p>
              We process personal information under the principles of legality, transparency, and data minimization:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contact & Inquiry Data:</strong> Full name, professional email address, phone number, company name, and marketing objectives submitted through forms. Basis: Consent & Pre-contractual measures (GDPR Art. 6.1.a & 6.1.b).</li>
              <li><strong>Service Delivery Data:</strong> Client operational details necessary to execute agency engagements, visual productions, and consulting deliverables. Basis: Contract execution (GDPR Art. 6.1.b).</li>
              <li><strong>Analytics & Telemetry:</strong> Anonymized navigation metrics, browser details, and conversion tracking (only enabled with your active consent via the Cookie Preferences Center). Basis: Consent (GDPR Art. 6.1.a).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              3. Data Retention and Processors
            </h2>
            <p>
              Data is retained only as long as necessary to fulfill the relevant operational purpose or to satisfy Spanish tax and statutory obligations (5-6 years for billing). We collaborate with verified GDPR-compliant technology providers (Vercel, Supabase, Google) operating under Standard Contractual Clauses (SCCs) and the EU-US Data Privacy Framework.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              4. Your GDPR Rights
            </h2>
            <p>
              You have the right to access, rectify, delete (right to be forgotten), restrict processing, object to marketing, and request data portability. To exercise your rights, email:
            </p>
            <p className="font-semibold text-cyan-deep">
              <a href="mailto:contact@kingdommediahub.com?subject=GDPR%20Data%20Subject%20Request">
                contact@kingdommediahub.com
              </a>
            </p>
            <p className="text-xs text-muted">
              You also have the statutory right to lodge a complaint with the Spanish Data Protection Authority (Agencia Española de Protección de Datos - <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="underline">www.aepd.es</a>).
            </p>
          </section>
        </div>
      )}
    </LegalPageLayout>
  );
}
