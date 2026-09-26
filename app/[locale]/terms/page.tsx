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
      ? "Términos y Condiciones · KINGDOM MEDIA HUB"
      : "Terms & Conditions · KINGDOM MEDIA HUB",
    description: isEs
      ? "Condiciones generales de contratación y prestación de servicios de KINGDOM MEDIA HUB (Agency, Media Lab, Academy)."
      : "General terms and conditions of contracting and service delivery for KINGDOM MEDIA HUB.",
    alternates: {
      canonical: `/${locale}/terms/`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEs = locale === "es";

  return (
    <LegalPageLayout
      currentTab="terms"
      title={isEs ? "Términos y Condiciones" : "Terms & Conditions"}
      subtitle={
        isEs
          ? "Condiciones generales de contratación y prestación de servicios profesionales de KINGDOM MEDIA HUB."
          : "General terms and conditions governing professional service engagements with KINGDOM MEDIA HUB."
      }
      lastUpdated={isEs ? "Marzo de 2025" : "March 2025"}
    >
      {isEs ? (
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              1. Partes y Objeto del Contrato
            </h2>
            <p>
              Las presentes Condiciones Generales regulan la contratación de los servicios profesionales prestados por <strong>KINGDOM MEDIA HUB</strong>, con NIF <strong>P198058403</strong> y domicilio en Madrid (España), correo electrónico de contacto: <a href="mailto:contact@kingdommediahub.com">contact@kingdommediahub.com</a> (en adelante, la «Agencia» o el «Prestador»), a personas físicas o jurídicas que actúen con fines comerciales, empresariales o profesionales (en adelante, el «Cliente»).
            </p>
            <p>
              La aceptación de una propuesta de servicios, presupuesto comercial (SOW - Statement of Work) o el abono de una factura proforma implica la adhesión plena e incondicional a las presentes Condiciones Generales.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              2. Áreas de Servicio de KINGDOM MEDIA HUB
            </h2>
            <p>
              La Agencia presta servicios especializados estructurados en torno a tres divisiones principales:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Agency (Crecimiento y Adquisición Digital):</strong> Diseño y ejecución de estrategias de marketing digital, optimización de la tasa de conversión (CRO), auditorías de crecimiento, adquisición de tráfico de pago (Paid Media en Meta, Google, LinkedIn y TikTok), y despliegue de automatizaciones operativas con IA.
              </li>
              <li>
                <strong>Media Lab (Producción Audiovisual y 3D):</strong> Creación de anuncios publicitarios de alta retención, motion graphics, modelado y renderizado tridimensional (3D/CGI), edición cinematográfica y diseño visual de activos de marca.
              </li>
              <li>
                <strong>Academy (Capacitación y Consultoría Estratégica):</strong> Programas de mentoría, formación especializada para equipos internos y consultoría estratégica de negocio.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              3. Proceso de Contratación y Presupuestos
            </h2>
            <p>
              Todo proyecto o relación de servicio se regirá por una <strong>Propuesta Comercial o Presupuesto</strong> individualizado emitido por la Agencia, el cual especificará el alcance concreto de los entregables, el cronograma de ejecución y la estructura de honorarios (retribución fija mensual o precio cerrado por hito).
            </p>
            <p>
              Las modificaciones sobre el alcance inicialmente acordado requerirán la formalización previa de una orden de cambio o adenda económica aprobada por ambas partes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              4. Condiciones Económicas, Facturación y Medios de Pago
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Precios e Impuestos:</strong> Salvo indicación expresa en contrario, los importes se cotizan en Euros (€) y no incluyen el Impuesto sobre el Valor Añadido (IVA) ni otros gravámenes indirectos aplicables según la residencia fiscal del Cliente.</li>
              <li><strong>Plazos de Pago:</strong> Las facturas por servicios mensuales recurrentes (retainers) se abonarán por anticipado dentro de los primeros cinco (5) días hábiles de cada periodo mensual facturado. En proyectos de producción cerrada (Media Lab), se requerirá un anticipo del 50% al inicio y el 50% restante con la entrega de los másteres definitivos.</li>
              <li><strong>Inversión Publicitaria:</strong> Salvo pacto expreso, el presupuesto publicitario (Ad Spend) destinado a las plataformas (Meta Ads, Google Ads) se facturará y gestionará directamente con la tarjeta de crédito o cuenta publicitaria del Cliente.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              5. Deber de Colaboración del Cliente
            </h2>
            <p>
              El cumplimiento de los plazos de entrega pactados está condicionado a la colaboración activa del Cliente. El Cliente se compromete a:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Facilitar en tiempo y forma el material corporativo, accesos a paneles técnicos y credenciales requeridas.</li>
              <li>Revisar y validar los hitos y entregables provisionales en un plazo máximo de cinco (5) días laborables tras su presentación. En ausencia de observaciones en dicho plazo, se considerarán aprobados a todos los efectos.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              6. Propiedad Intelectual y Licencias
            </h2>
            <p>
              <strong>Entregables Finales:</strong> Una vez satisfecho íntegramente el precio del proyecto, la Agencia cede en favor del Cliente los derechos patrimoniales de explotación (reproducción, distribución y comunicación pública) sobre los materiales finales específicamente desarrollados para dicho Cliente.
            </p>
            <p>
              <strong>Metodologías Propias y Know-How:</strong> La Agencia se reserva la titularidad exclusiva sobre sus metodologías, frameworks, scripts, flujos automatizados de IA, modelos internos y herramientas base que preexistieran o que sean de aplicación transversal a sus operaciones.
            </p>
            <p>
              <strong>Derecho de Portfolio:</strong> La Agencia se reserva el derecho de mencionar al Cliente y exhibir muestras de los trabajos realizados (no confidenciales) en su sitio web, presentaciones comerciales y redes sociales con fines de promoción profesional.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              7. Confidencialidad
            </h2>
            <p>
              Ambas partes se obligan a mantener estricta confidencialidad respecto a cualquier información técnica, financiera, estratégica, operativa o de negocio que intercambien durante la ejecución del contrato, subsistiendo esta obligación durante un plazo de tres (3) años tras la finalización de los servicios.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              8. Garantías y Limitación de Responsabilidad
            </h2>
            <p>
              La Agencia presta sus servicios con la máxima diligencia profesional exigible en el sector de la consultoría de crecimiento y la producción audiovisual. No obstante, dado que los resultados de mercado dependen de variables externas impredecibles (tales como fluctuaciones de demanda, competencia, cambios algorítmicos de Meta/Google o políticas publicitarias de terceros), la Agencia asume una <strong>obligación de medios cualificada</strong> y no garantiza resultados financieros específicos de ventas.
            </p>
            <p>
              En cualquier caso, la responsabilidad acumulada total de la Agencia por cualquier concepto derivado de la relación contractual quedará limitada a las cantidades efectivamente percibidas del Cliente en los tres (3) meses anteriores al hecho causante.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              9. Ley Aplicable y Fuero Jurisdiccional
            </h2>
            <p>
              Las relaciones contractuales entre las partes se regirán por el Derecho común español.
            </p>
            <p>
              Para la resolución de cuantas controversias pudieran suscitarse con ocasión de la interpretación o ejecución de los contratos, las partes renuncian expresamente a su propio fuero y se someten a la jurisdicción exclusiva de los <strong>Juzgados y Tribunales de la ciudad de Madrid (España)</strong>.
            </p>
          </section>
        </div>
      ) : (
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              1. Engagement & Identity of Provider
            </h2>
            <p>
              These General Terms &amp; Conditions govern professional services rendered by <strong>KINGDOM MEDIA HUB</strong> (NIF: <strong>P198058403</strong>, Madrid, Spain, contact: <a href="mailto:contact@kingdommediahub.com">contact@kingdommediahub.com</a>) across its three divisions: Agency (Growth &amp; Paid Media), Media Lab (Visuals, 3D &amp; Video Production), and Academy (Consulting &amp; Training).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              2. Intellectual Property of Deliverables
            </h2>
            <p>
              Upon full settlement of agreed service invoices, the client receives ownership of customized final deliverables. Pre-existing proprietary frameworks, internal automated systems, prompt architectures, and algorithms remain the exclusive intellectual property of <strong>KINGDOM MEDIA HUB</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              3. Governing Law and Exclusive Venue
            </h2>
            <p>
              All contractual obligations and disputes are subject to the laws of Spain. Both parties submit to the exclusive jurisdiction of the <strong>Courts of Madrid, Spain</strong>.
            </p>
          </section>
        </div>
      )}
    </LegalPageLayout>
  );
}
