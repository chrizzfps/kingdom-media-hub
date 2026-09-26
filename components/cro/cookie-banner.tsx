"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, Sliders, X, Check } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import {
  getCookieConsent,
  setCookieConsent,
  acceptAllCookies,
  rejectNonEssentialCookies,
  EVENT_CONSENT_UPDATED,
  EVENT_OPEN_COOKIE_SETTINGS,
  type CookieConsent,
} from "@/lib/cookies";

export function CookieBanner() {
  const locale = useLocale();
  const isEs = locale === "es";

  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal custom preferences state
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = getCookieConsent();
    setConsent(existing);

    if (!existing) {
      // Small delay for smooth entrance without blocking initial paint
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setAnalyticsAllowed(existing.analytics);
      setMarketingAllowed(existing.marketing);
    }

    const handleOpenModal = () => {
      const current = getCookieConsent();
      if (current) {
        setAnalyticsAllowed(current.analytics);
        setMarketingAllowed(current.marketing);
      }
      setShowModal(true);
      setShowBanner(false);
    };

    const handleConsentUpdated = (e: Event) => {
      const c = (e as CustomEvent<CookieConsent>).detail;
      setConsent(c);
      setAnalyticsAllowed(c.analytics);
      setMarketingAllowed(c.marketing);
    };

    window.addEventListener(EVENT_OPEN_COOKIE_SETTINGS, handleOpenModal);
    window.addEventListener(EVENT_CONSENT_UPDATED, handleConsentUpdated);

    return () => {
      window.removeEventListener(EVENT_OPEN_COOKIE_SETTINGS, handleOpenModal);
      window.removeEventListener(EVENT_CONSENT_UPDATED, handleConsentUpdated);
    };
  }, []);

  if (!mounted) return null;

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
    setShowModal(false);
  };

  const handleRejectNonEssential = () => {
    rejectNonEssentialCookies();
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSaveCustom = () => {
    setCookieConsent({
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
    });
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <>
      {/* ── Discreet Minimal Floating Card (Bottom-Left) ─────────────── */}
      <AnimatePresence>
        {showBanner && !showModal && (
          <motion.aside
            role="region"
            aria-label={isEs ? "Aviso de cookies" : "Cookie notice"}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 z-50 w-[calc(100%-2rem)] max-w-[320px] sm:bottom-6 sm:left-6 sm:w-[320px]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B132B]/95 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              {/* Subtle top edge cyan glow */}
              <div
                className="pointer-events-none absolute -top-16 left-1/3 h-20 w-36 rounded-full bg-cyan/15 blur-2xl"
                aria-hidden
              />

              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan/10 text-cyan">
                    <Cookie size={13} weight="fill" />
                  </span>
                  <h3 className="text-xs font-semibold tracking-wide text-white">
                    {isEs ? "Privacidad y Cookies" : "Privacy & Cookies"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="rounded-md p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                  aria-label={isEs ? "Cerrar" : "Close"}
                >
                  <X size={13} />
                </button>
              </div>

              {/* Minimal Text */}
              <p className="text-[11px] leading-relaxed text-white/60 pb-3">
                {isEs ? (
                  <>
                    Usamos cookies técnicas esenciales y analíticas para optimizar tu experiencia (conforme a LSSI-CE y RGPD). Más detalles en nuestra{" "}
                    <Link
                      href="/cookies"
                      className="text-cyan underline underline-offset-2 transition-colors hover:text-white"
                    >
                      política
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    We use technical and performance cookies under GDPR and Spanish LSSI-CE to improve navigation. Learn more in our{" "}
                    <Link
                      href="/cookies"
                      className="text-cyan underline underline-offset-2 transition-colors hover:text-white"
                    >
                      policy
                    </Link>
                    .
                  </>
                )}
              </p>

              {/* Vertical Stacked Buttons (Filas) */}
              <div className="flex flex-col gap-1.5">
                {/* Row 1: Aceptar todas */}
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full rounded-xl bg-cyan py-2 text-xs font-bold text-ink shadow-[0_2px_12px_rgba(0,196,240,0.25)] transition-all duration-150 hover:bg-cyan/90 hover:shadow-[0_4px_16px_rgba(0,196,240,0.35)] cursor-pointer"
                >
                  {isEs ? "Aceptar todas" : "Accept all"}
                </button>

                {/* Row 2: Rechazar opcionales */}
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-medium text-white/80 transition-all duration-150 hover:border-white/20 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                >
                  {isEs ? "Rechazar opcionales" : "Reject optional"}
                </button>

                {/* Row 3: Configurar preferencias */}
                <button
                  type="button"
                  onClick={() => {
                    setShowBanner(false);
                    setShowModal(true);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-white/40 transition-colors hover:text-white cursor-pointer"
                >
                  <Sliders size={13} />
                  <span>{isEs ? "Configurar preferencias" : "Cookie preferences"}</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Granular Preferences Modal Dialog ────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Dialog Container */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-settings-title"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-dark p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.8)] sm:p-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/15 text-cyan">
                    <ShieldCheck size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3
                      id="cookie-settings-title"
                      className="text-base font-bold text-white sm:text-lg"
                    >
                      {isEs
                        ? "Centro de Preferencias de Privacidad"
                        : "Privacy Preference Center"}
                    </h3>
                    <p className="text-[11px] text-white/50">
                      KINGDOM MEDIA HUB · NIF P198058403 · Madrid, España
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                  aria-label={isEs ? "Cerrar" : "Close"}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Explanatory introduction */}
              <p className="mt-4 text-xs leading-relaxed text-white/70">
                {isEs
                  ? "Puedes configurar a continuación qué categorías de cookies consientes. Las cookies técnicas son obligatorias para el funcionamiento del portal. Puedes modificar tu decisión cuando lo desees."
                  : "You can configure which categories of cookies you consent to. Technical cookies are strictly necessary for basic operations. You can modify your choice at any time."}
              </p>

              {/* Cookie Categories */}
              <div className="mt-5 space-y-3.5 max-h-[45vh] overflow-y-auto pr-1">
                {/* 1. Necessary */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-white">
                          {isEs ? "Cookies Técnicas y Esenciales" : "Strictly Necessary Cookies"}
                        </h4>
                        <span className="rounded-full bg-cyan/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan">
                          {isEs ? "Activas" : "Active"}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        {isEs
                          ? "Garantizan la seguridad, navegación técnica y almacenamiento de tus preferencias de consentimiento. No pueden desactivarse."
                          : "Required for core website security, technical session handling, and persisting consent. Cannot be disabled."}
                      </p>
                    </div>
                    <div className="flex h-5 w-9 shrink-0 items-center rounded-full bg-cyan/40 p-0.5 opacity-80 cursor-not-allowed">
                      <div className="h-4 w-4 rounded-full bg-cyan shadow-sm translate-x-4" />
                    </div>
                  </div>
                </div>

                {/* 2. Analytics */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-white">
                          {isEs ? "Cookies Analíticas y de Medición" : "Analytics & Performance Cookies"}
                        </h4>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                          Google Analytics 4
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        {isEs
                          ? "Permiten recopilar datos agregados y anónimos sobre visitas e interacción para optimizar el portal."
                          : "Help us understand visitor behavior and traffic sources in aggregated and anonymized format."}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={analyticsAllowed}
                      onClick={() => setAnalyticsAllowed((v) => !v)}
                      className={`relative flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                        analyticsAllowed ? "bg-cyan" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                          analyticsAllowed ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 3. Marketing */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-white">
                          {isEs ? "Cookies de Marketing y Conversión" : "Marketing & Retargeting Cookies"}
                        </h4>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                          Meta Pixel · LinkedIn
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        {isEs
                          ? "Permiten evaluar la efectividad de campañas en Meta y LinkedIn y atribuir conversiones."
                          : "Used to assess marketing campaign effectiveness on Meta and LinkedIn and attribute conversions."}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={marketingAllowed}
                      onClick={() => setMarketingAllowed((v) => !v)}
                      className={`relative flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                        marketingAllowed ? "bg-cyan" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                          marketingAllowed ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="mt-5 flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[11px] text-white/50">
                  <Link
                    href="/cookies"
                    onClick={() => setShowModal(false)}
                    className="text-cyan underline underline-offset-2 hover:text-white"
                  >
                    {isEs ? "Leer Política completa" : "Read full Policy"}
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={handleRejectNonEssential}
                    className="flex-1 rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-white transition-all hover:bg-white/10 sm:flex-none cursor-pointer"
                  >
                    {isEs ? "Rechazar opcionales" : "Reject optional"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="flex-1 rounded-xl border border-cyan/40 bg-cyan/10 px-3.5 py-2 text-xs font-semibold text-cyan transition-all hover:bg-cyan/20 sm:flex-none cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Check size={13} weight="bold" />
                      {isEs ? "Guardar selección" : "Save choices"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="flex-1 rounded-xl bg-cyan px-4 py-2 text-xs font-bold text-ink shadow-[0_2px_12px_rgba(0,196,240,0.3)] transition-all hover:bg-cyan/90 sm:flex-none cursor-pointer"
                  >
                    {isEs ? "Aceptar todas" : "Accept all"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
