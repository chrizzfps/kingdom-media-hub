import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { CookieManageButton } from "@/components/legal/cookie-manage-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return {
    title: isEs
      ? "Política de Cookies · KINGDOM MEDIA HUB"
      : "Cookie Policy · KINGDOM MEDIA HUB",
    description: isEs
      ? "Información transparente sobre el uso de cookies, tipologías y panel de configuración de preferencias conforme a la LSSI-CE y la AEPD."
      : "Transparent information about cookie usage, categories and preference configuration under Spanish LSSI-CE and AEPD guidelines.",
    alternates: {
      canonical: `/${locale}/cookies/`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEs = locale === "es";

  return (
    <LegalPageLayout
      currentTab="cookies"
      title={isEs ? "Política de Cookies" : "Cookie Policy"}
      subtitle={
        isEs
          ? "Información detallada sobre el uso de cookies propias y de terceros, finalidades y configuración conforme a la LSSI-CE y la Guía de la AEPD."
          : "Detailed information regarding first and third-party cookies, purposes, and consent settings under Spanish LSSI-CE and AEPD standards."
      }
      lastUpdated={isEs ? "Marzo de 2025" : "March 2025"}
    >
      {isEs ? (
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              1. ¿Qué son las Cookies?
            </h2>
            <p>
              Una cookie es un pequeño archivo de texto que los sitios web almacenan en su navegador o dispositivo (ordenador, smartphone o tablet) al visitarlos. Las cookies permiten a las plataformas web recordar información sobre su visita, como su idioma preferido, mantener su sesión activa o recopilar datos estadísticos para mejorar la experiencia de navegación.
            </p>
            <p>
              Las cookies no pueden dañar su equipo y son esenciales para el funcionamiento de los servicios interactivos de la sociedad de la información.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              2. Clasificación de las Cookies que Utilizamos
            </h2>
            <p>
              Conforme a la <em>Guía sobre el uso de cookies para el cumplimiento de la LSSI-CE</em> de la Agencia Española de Protección de Datos (AEPD), las cookies se clasifican según:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Según la entidad que las gestiona:</strong>
                <ul className="list-circle pl-5 mt-1 space-y-1">
                  <li><strong>Cookies propias:</strong> Enviadas a su equipo desde servidores o dominios gestionados directamente por <strong>KINGDOM MEDIA HUB</strong>.</li>
                  <li><strong>Cookies de terceros:</strong> Enviadas desde un equipo o dominio gestionado por otra entidad colaboradora (como Google, Meta o LinkedIn).</li>
                </ul>
              </li>
              <li>
                <strong>Según el plazo de tiempo que permanecen activas:</strong>
                <ul className="list-circle pl-5 mt-1 space-y-1">
                  <li><strong>Cookies de sesión:</strong> Diseñadas para recabar y almacenar datos únicamente mientras el usuario accede a la web, desapareciendo al cerrar el navegador.</li>
                  <li><strong>Cookies persistentes:</strong> Los datos siguen almacenados en el terminal y pueden ser accedidos durante un periodo definido por el responsable de la cookie (desde minutos hasta años).</li>
                </ul>
              </li>
              <li>
                <strong>Según su finalidad:</strong>
                <ul className="list-circle pl-5 mt-1 space-y-1">
                  <li><strong>Cookies técnicas (estrictamente necesarias):</strong> Permiten la navegación a través del sitio web, el control del tráfico y la comunicación de datos, la identificación de la sesión y el almacenamiento de sus preferencias de consentimiento. Están exentas de la obligación de consentimiento del artículo 22.2 LSSI-CE.</li>
                  <li><strong>Cookies analíticas y de medición:</strong> Permiten cuantificar el número de usuarios y realizar la medición y análisis estadístico del uso que hacen los usuarios de los servicios ofrecidos, con el fin de optimizar el portal.</li>
                  <li><strong>Cookies de publicidad comportamental y marketing:</strong> Almacenan información de los hábitos de navegación de los usuarios para mostrar anuncios relevantes y medir el retorno de campañas en plataformas publicitarias.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              3. Cuadro Inventario de Cookies del Sitio Web
            </h2>
            <p>
              A continuación se detalla de manera transparente el inventario de cookies utilizadas en este sitio web:
            </p>

            <div className="overflow-x-auto rounded-xl border border-edge bg-white">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-edge bg-gray-50 text-ink font-semibold">
                  <tr>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Proveedor / Titular</th>
                    <th className="p-3">Tipo / Finalidad</th>
                    <th className="p-3">Duración</th>
                    <th className="p-3">Exenta de Consentimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge text-slate-600">
                  <tr>
                    <td className="p-3 font-mono font-bold text-ink">kmh_cookie_consent_v1</td>
                    <td className="p-3">KINGDOM MEDIA HUB (Propia)</td>
                    <td className="p-3">Técnica: almacena la elección y categorías de cookies consentidas por el usuario.</td>
                    <td className="p-3">1 año</td>
                    <td className="p-3 text-emerald-700 font-semibold">Sí (Necesaria)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-ink">_ga</td>
                    <td className="p-3">Google LLC / Google Ireland</td>
                    <td className="p-3">Analítica: distingue usuarios únicos para generar estadísticas anónimas de visitas en GA4.</td>
                    <td className="p-3">2 años</td>
                    <td className="p-3 text-amber-700 font-semibold">No (Requiere Consentimiento)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-ink">_ga_*</td>
                    <td className="p-3">Google LLC / Google Ireland</td>
                    <td className="p-3">Analítica: mantiene el estado de la sesión en Google Analytics 4.</td>
                    <td className="p-3">2 años</td>
                    <td className="p-3 text-amber-700 font-semibold">No (Requiere Consentimiento)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-ink">_fbp</td>
                    <td className="p-3">Meta Platforms Ireland Ltd.</td>
                    <td className="p-3">Marketing: almacena y rastrea visitas para optimizar campañas en Facebook e Instagram.</td>
                    <td className="p-3">3 meses</td>
                    <td className="p-3 text-amber-700 font-semibold">No (Requiere Consentimiento)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-ink">bcookie, li_sugr</td>
                    <td className="p-3">LinkedIn Ireland Unlimited</td>
                    <td className="p-3">Marketing: atribución publicitaria y análisis de audiencia profesional B2B.</td>
                    <td className="p-3">1 año / 3 meses</td>
                    <td className="p-3 text-amber-700 font-semibold">No (Requiere Consentimiento)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-ink">
              4. ¿Cómo Configurar o Revocar su Consentimiento?
            </h2>
            <p>
              Usted puede en cualquier momento aceptar todas las cookies, rechazar las cookies no esenciales o personalizar sus preferencias de manera granular a través de nuestro panel de control interactivo:
            </p>

            <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-ink">Centro de Preferencias de Cookies</h3>
                  <p className="text-xs text-muted mt-1">
                    Haga clic en el botón para abrir el configurador y cambiar sus selecciones en tiempo real.
                  </p>
                </div>
                <CookieManageButton label="Abrir Panel de Cookies" />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              5. Desactivación o Eliminación a través del Navegador
            </h2>
            <p>
              Además de nuestro panel interactivo, puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador que utilice:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>
                <strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios. (
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                  Ver guía oficial
                </a>)
              </li>
              <li>
                <strong>Mozilla Firefox:</strong> Ajustes &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio. (
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">
                  Ver guía oficial
                </a>)
              </li>
              <li>
                <strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies. (
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  Ver guía oficial
                </a>)
              </li>
              <li>
                <strong>Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio &gt; Administra y elimina cookies. (
                <a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">
                  Ver guía oficial
                </a>)
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              6. Actualizaciones de la Política de Cookies
            </h2>
            <p>
              <strong>KINGDOM MEDIA HUB</strong> se reserva el derecho de modificar la presente Política de Cookies en función de nuevas exigencias legislativas, reglamentarias o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos (AEPD).
            </p>
          </section>
        </div>
      ) : (
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              1. What are Cookies?
            </h2>
            <p>
              Cookies are small text files downloaded to your device when visiting websites. They facilitate technical functionality, remember your preferences, and provide analytical data to evaluate performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">
              2. Categories of Cookies We Use
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Strictly Necessary / Technical Cookies:</strong> Essential for secure browsing, fraud prevention, and storing consent preferences. Exempt from prior consent under Art. 22.2 of the Spanish LSSI-CE.</li>
              <li><strong>Analytics Cookies:</strong> Measure traffic and page interactions (Google Analytics 4). Activated only with your explicit consent.</li>
              <li><strong>Marketing & Advertising Cookies:</strong> Deliver campaign attribution and targeted promotional content (Meta Pixel, LinkedIn Insight Tag). Activated only with your consent.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-ink">
              3. Manage or Revoke Your Consent
            </h2>
            <p>
              You can adjust your cookie settings at any time using our preference center:
            </p>
            <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-ink">Cookie Preferences Center</h3>
                  <p className="text-xs text-muted mt-1">
                    Click the button below to update your choices in real time.
                  </p>
                </div>
                <CookieManageButton label="Open Cookie Settings" />
              </div>
            </div>
          </section>
        </div>
      )}
    </LegalPageLayout>
  );
}
