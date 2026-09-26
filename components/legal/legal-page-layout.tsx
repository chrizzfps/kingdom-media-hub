"use client";

import { ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  FileText,
  ShieldCheck,
  Cookie,
  Scales,
  Printer,
  Sliders,
  Buildings,
  EnvelopeSimple,
  MapPin,
  IdentificationCard,
  Phone,
} from "@phosphor-icons/react";
import { openCookieSettings } from "@/lib/cookies";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

type LegalTab = "legal" | "privacy" | "cookies" | "terms";

interface LegalPageLayoutProps {
  currentTab: LegalTab;
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: ReactNode;
}

const TABS: { id: LegalTab; href: string; labelEs: string; labelEn: string; icon: typeof FileText }[] = [
  { id: "legal", href: "/legal", labelEs: "Aviso Legal", labelEn: "Legal Notice", icon: Scales },
  { id: "privacy", href: "/privacy", labelEs: "Privacidad", labelEn: "Privacy Policy", icon: ShieldCheck },
  { id: "cookies", href: "/cookies", labelEs: "Cookies", labelEn: "Cookie Policy", icon: Cookie },
  { id: "terms", href: "/terms", labelEs: "Términos y Condiciones", labelEn: "Terms & Conditions", icon: FileText },
];

export function LegalPageLayout({
  currentTab,
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const locale = useLocale();
  const isEs = locale === "es";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FDFDFE] text-ink antialiased">
        {/* ── Dark Luxury Hero Header ─────────────────────────────────── */}
        <section className="relative overflow-hidden bg-dark pt-32 pb-16 sm:pt-40 sm:pb-20 text-white">
          {/* Subtle cyan ambient lighting */}
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan/15 blur-[120px]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs text-white/50">
              <Link href="/" className="transition-colors hover:text-white">
                {isEs ? "Inicio" : "Home"}
              </Link>
              <span>/</span>
              <span className="text-white/70">{isEs ? "Marco Legal" : "Legal"}</span>
              <span>/</span>
              <span className="text-cyan font-medium">{title}</span>
            </nav>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold tracking-wide text-cyan backdrop-blur-md">
                  <ShieldCheck size={14} weight="bold" />
                  <span>
                    {isEs
                      ? "Conforme a RGPD · LOPDGDD · LSSI-CE"
                      : "Compliant with EU GDPR · LSSI-CE"}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                  {subtitle}
                </p>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2 pt-2 md:pt-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-white/15 hover:text-white"
                >
                  <Printer size={15} />
                  <span>{isEs ? "Imprimir" : "Print"}</span>
                </button>

                {currentTab === "cookies" && (
                  <button
                    type="button"
                    onClick={openCookieSettings}
                    className="flex items-center gap-1.5 rounded-xl bg-cyan px-3.5 py-2 text-xs font-bold text-ink shadow-[0_4px_16px_rgba(0,196,240,0.3)] transition-all hover:bg-cyan/90"
                  >
                    <Sliders size={15} />
                    <span>{isEs ? "Configurar Cookies" : "Cookie Settings"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Document Switcher Tabs */}
            <div className="mt-10 flex overflow-x-auto border-b border-white/10 pb-px scrollbar-none">
              <div className="flex gap-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.id === currentTab;
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-t-xl px-4 py-3 text-xs font-semibold transition-all ${
                        isActive
                          ? "border-b-2 border-cyan bg-white/10 text-cyan"
                          : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{isEs ? tab.labelEs : tab.labelEn}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Content Container ───────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            {/* Main Legal Content */}
            <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-ink prose-p:text-muted prose-p:leading-relaxed prose-li:text-muted prose-strong:text-ink prose-a:text-cyan prose-a:underline hover:prose-a:text-cyan-deep">
              {children}

              <div className="mt-12 rounded-xl border border-edge bg-gray-50 p-5 text-xs text-muted">
                <p>
                  <strong>{isEs ? "Fecha de última revisión:" : "Last updated:"}</strong>{" "}
                  {lastUpdated}.
                </p>
                <p className="mt-1">
                  {isEs
                    ? "Este documento legal se revisa periódicamente para garantizar el cumplimiento con las directivas de la Agencia Española de Protección de Datos (AEPD), el RGPD y la LSSI-CE."
                    : "This legal policy is periodically reviewed to maintain full compliance with European GDPR, Spanish LSSI-CE, and Spanish Data Protection Agency (AEPD) guidelines."}
                </p>
              </div>
            </article>

            {/* Sidebar: Legal entity info card & quick help */}
            <aside className="space-y-6">
              {/* Official Identification Card */}
              <div className="sticky top-24 rounded-2xl border border-edge bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-edge pb-4">
                  <IdentificationCard size={20} className="text-cyan" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                    {isEs ? "Identificación del Prestador" : "Service Provider Details"}
                  </h3>
                </div>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <span className="block font-semibold text-ink">
                      KINGDOM MEDIA HUB
                    </span>
                    <span className="text-muted">
                      {isEs ? "Titular del sitio web" : "Website Operator"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-muted">
                    <Buildings size={16} className="shrink-0 text-cyan mt-0.5" />
                    <div>
                      <strong className="text-ink">NIF / CIF:</strong> P198058403
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-muted">
                    <MapPin size={16} className="shrink-0 text-cyan mt-0.5" />
                    <div>
                      <strong className="text-ink">{isEs ? "Domicilio:" : "Location:"}</strong>{" "}
                      Madrid, España
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-muted">
                    <EnvelopeSimple size={16} className="shrink-0 text-cyan mt-0.5" />
                    <div>
                      <strong className="text-ink">Email:</strong>{" "}
                      <a
                        href="mailto:contact@kingdommediahub.com"
                        className="text-cyan hover:underline break-all"
                      >
                        contact@kingdommediahub.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-muted">
                    <Phone size={16} className="shrink-0 text-cyan mt-0.5" />
                    <div>
                      <strong className="text-ink">{isEs ? "Teléfono:" : "Phone:"}</strong>{" "}
                      +34 711 251 968
                    </div>
                  </div>
                </div>

                {/* Quick actions box */}
                <div className="mt-6 border-t border-edge pt-4 space-y-2">
                  <button
                    type="button"
                    onClick={openCookieSettings}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-edge bg-gray-50 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-gray-100 cursor-pointer"
                  >
                    <Sliders size={14} className="text-cyan" />
                    <span>{isEs ? "Gestionar Cookies" : "Manage Cookies"}</span>
                  </button>

                  <a
                    href="mailto:contact@kingdommediahub.com?subject=Consulta%20Legal%20Kingdom%20Media%20Hub"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan/30 bg-cyan/10 py-2.5 text-xs font-semibold text-cyan-deep transition-colors hover:bg-cyan/20"
                  >
                    <EnvelopeSimple size={14} />
                    <span>{isEs ? "Canal Legal Directo" : "Legal Contact Channel"}</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
