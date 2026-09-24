"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  ChatCircleText,
  CalendarCheck,
  CheckCircle,
  Lightning,
  GitBranch,
  Cpu,
  DeviceMobile,
  Desktop,
  ShieldCheck,
  Check,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

/* -------------------------------------------------------------------------- */
/* Shared: real project image (CMS), browser-chrome framed. Used by all three */
/* services when an image is published; falls back to the bespoke UI below   */
/* on missing image or load failure.                                         */
/* -------------------------------------------------------------------------- */

function ServiceImageFrame({
  imageUrl,
  imageAlt,
  badge,
  onError,
}: {
  imageUrl: string;
  imageAlt?: string;
  badge: string;
  onError: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-edge bg-white shadow-[0_16px_48px_-12px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between border-b border-edge bg-gray-50/80 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono text-[10px] text-muted truncate max-w-[200px]">
          {imageAlt || "kingdommediahub.com"}
        </span>
        <span className="rounded-full bg-cyan/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan">
          {badge}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full bg-gray-100">
        <Image
          src={imageUrl}
          alt={imageAlt || "Kingdom project"}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          onError={onError}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. Asistente Virtual IA: Secuencia visual de consulta a cita agendada      */
/* -------------------------------------------------------------------------- */

export function AgencyVoiceVisual({
  imageUrl,
  imageAlt,
}: {
  imageUrl?: string;
  imageAlt?: string;
}) {
  const locale = useLocale();
  const isEs = locale === "es";
  const [imageFailed, setImageFailed] = useState(false);

  if (imageUrl && !imageFailed) {
    return (
      <ServiceImageFrame
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        badge={isEs ? "Proyecto" : "Project"}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-edge bg-white shadow-[0_16px_48px_-12px_rgba(15,23,42,0.06)]">
      {/* Chrome header */}
      <div className="flex items-center justify-between border-b border-edge bg-gray-50/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-ink">
            {isEs ? "Asistente Virtual Kingdom" : "Kingdom Virtual Assistant"}
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-dim">
            {isEs ? "WhatsApp & Webchat" : "WhatsApp & Webchat"}
          </span>
        </div>
        <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan">
          {isEs ? "Demostración de flujo" : "Flow Demo"}
        </span>
      </div>

      {/* Conversation timeline */}
      <div className="space-y-4 p-5 sm:p-6 bg-gradient-to-b from-white to-gray-50/40 text-xs sm:text-sm">
        {/* User inbound bubble */}
        <div className="flex flex-col items-end">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-cyan/15 border border-cyan/20 px-4 py-2.5 text-ink">
            <p className="font-medium text-xs text-muted mb-0.5">
              {isEs ? "Cliente potencial" : "Prospective client"}
            </p>
            <p className="leading-relaxed">
              {isEs
                ? "Hola, necesito información para automatizar la atención y agendamiento de citas en mi negocio."
                : "Hello, I'd like info on automating customer inquiries and appointment booking for my business."}
            </p>
            <span className="mt-1 block text-right font-mono text-[10px] text-dim">
              10:14 AM
            </span>
          </div>
        </div>

        {/* AI response bubble */}
        <div className="flex flex-col items-start">
          <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-gray-100/90 border border-edge px-4 py-2.5 text-ink">
            <p className="font-medium text-xs text-cyan-deep mb-0.5 flex items-center gap-1.5">
              <ChatCircleText size={14} weight="duotone" />
              {isEs ? "Asistente IA (Voz de Marca)" : "AI Assistant (Brand Voice)"}
            </p>
            <p className="leading-relaxed">
              {isEs
                ? "¡Hola! Con gusto. Diseñamos sistemas que conectan tus canales con tu calendario para calificar y agendar citas automáticamente. ¿Te gustaría agendar una llamada de diagnóstico de 15 minutos?"
                : "Hi! Gladly. We build systems linking your channels to your calendar to qualify and book consultations automatically. Would a 15-minute diagnostic call work for you?"}
            </p>
            <span className="mt-1 block font-mono text-[10px] text-dim">
              10:14 AM
            </span>
          </div>
        </div>

        {/* Slot selection mockup */}
        <div className="mx-auto my-2 max-w-[92%] rounded-xl border border-edge bg-white p-3.5 shadow-xs">
          <p className="font-mono text-[10px] uppercase tracking-wider text-dim">
            {isEs ? "Disponibilidad de agenda (Demo)" : "Calendar Availability (Demo)"}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between rounded-lg border border-cyan bg-cyan/10 px-3 py-2 text-ink font-medium">
              <span>{isEs ? "Jueves 16:00" : "Thu 4:00 PM"}</span>
              <Check size={14} className="text-cyan font-bold" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-edge bg-gray-50/60 px-3 py-2 text-muted">
              <span>{isEs ? "Viernes 11:30" : "Fri 11:30 AM"}</span>
            </div>
          </div>
        </div>

        {/* Booking confirmation ticket */}
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <CalendarCheck size={20} weight="duotone" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-ink">
                  {isEs ? "Cita Confirmada en Agenda" : "Appointment Confirmed"}
                </p>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                  {isEs ? "Confirmado" : "Confirmed"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                {isEs
                  ? "Jueves · 16:00 hrs · Enlace de reunión y ficha creada automáticamente en el CRM."
                  : "Thursday · 4:00 PM · Meeting link & contact deal auto-created in CRM."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer annotation */}
      <div className="border-t border-edge bg-gray-50/80 px-4 py-2.5 text-center sm:px-6">
        <p className="font-mono text-[10px] text-dim">
          {isEs
            ? "Demostración de flujo · Sin métricas simuladas · Configurable a la operación del negocio"
            : "Flow demo · Zero simulated metrics · Fully configurable to business workflow"}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Sistemas de Automatización: Flujo preciso, limpio y estructurado       */
/* -------------------------------------------------------------------------- */

export function AgencyAutomationVisual({
  imageUrl,
  imageAlt,
}: {
  imageUrl?: string;
  imageAlt?: string;
}) {
  const locale = useLocale();
  const isEs = locale === "es";
  const [imageFailed, setImageFailed] = useState(false);

  if (imageUrl && !imageFailed) {
    return (
      <ServiceImageFrame
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        badge={isEs ? "Proyecto" : "Project"}
        onError={() => setImageFailed(true)}
      />
    );
  }

  const workflowSteps = [
    {
      step: "01",
      icon: Lightning,
      title: isEs ? "Evento Disparador" : "Trigger Event",
      subtitle: isEs ? "Captura Inbound" : "Inbound Capture",
      desc: isEs
        ? "Consulta recibida en formulario o WhatsApp."
        : "Inquiry received via web form or WhatsApp.",
    },
    {
      step: "02",
      icon: Cpu,
      title: isEs ? "Enrutamiento & CRM" : "Routing & CRM",
      subtitle: isEs ? "Procesamiento Inteligente" : "Smart Processing",
      desc: isEs
        ? "Cualificación del lead, creación de trato y alerta interna."
        : "Lead qualification, deal creation and sales notification.",
    },
    {
      step: "03",
      icon: PaperPlaneTilt,
      title: isEs ? "Acción Inmediata" : "Instant Action",
      subtitle: isEs ? "Secuencia & Cierre" : "Sequence & Follow-up",
      desc: isEs
        ? "Respuesta personalizada enviada y seguimiento activo."
        : "Personalized reply dispatched and active follow-up.",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-edge bg-white shadow-[0_16px_48px_-12px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-edge bg-gray-50/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-cyan" weight="duotone" />
          <span className="text-xs font-semibold text-ink">
            {isEs ? "Arquitectura de Automatización" : "Automation Architecture"}
          </span>
        </div>
        <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan">
          {isEs ? "Ejemplo de flujo" : "Workflow Example"}
        </span>
      </div>

      {/* Sequential clean workflow (avoiding messy node cobwebs) */}
      <div className="p-5 sm:p-7 space-y-4 bg-gradient-to-b from-white to-gray-50/30">
        {workflowSteps.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === workflowSteps.length - 1;
          return (
            <div key={item.step} className="relative">
              <div className="flex items-start gap-4 rounded-xl border border-edge bg-white p-4 shadow-2xs transition-colors hover:border-cyan/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-ink">
                  <Icon size={20} weight="duotone" className="text-cyan" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan">
                      {isEs ? `Paso ${item.step}` : `Step ${item.step}`}
                    </span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                      {item.subtitle}
                    </span>
                  </div>
                  <h4 className="mt-1 font-display text-sm font-bold text-ink">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Connecting clean indicator between steps */}
              {!isLast && (
                <div className="mx-auto my-1 flex h-4 w-px items-center justify-center bg-edge">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-edge bg-gray-50/80 px-4 py-2.5 text-center sm:px-6">
        <p className="font-mono text-[10px] text-dim">
          {isEs
            ? "Flujo de orquestación técnica · Sin fricción manual ni tareas repetitivas"
            : "Technical orchestration pipeline · Zero manual friction or repetitive tasks"}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Webs de Alta Conversión: Presentación editorial de estructura y diseño  */
/* -------------------------------------------------------------------------- */

export function AgencyWebsitesVisual({
  imageUrl,
  imageAlt,
}: {
  imageUrl?: string;
  imageAlt?: string;
}) {
  const locale = useLocale();
  const isEs = locale === "es";
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [imageFailed, setImageFailed] = useState(false);

  // If a real project image was uploaded via the CMS, display it with editorial chrome
  if (imageUrl && !imageFailed) {
    return (
      <ServiceImageFrame
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        badge={isEs ? "Proyecto" : "Project"}
        onError={() => setImageFailed(true)}
      />
    );
  }

  // Prepared editorial conversion blueprint (honest demo, not pretending to be a finished client project)
  return (
    <div className="overflow-hidden rounded-2xl border border-edge bg-white shadow-[0_16px_48px_-12px_rgba(15,23,42,0.06)]">
      {/* Browser window chrome */}
      <div className="flex items-center justify-between border-b border-edge bg-gray-50/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-edge bg-white px-3 py-1 text-[11px] font-mono text-muted">
          <span>kingdommediahub.com/arquitectura</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1 rounded ${device === "desktop" ? "bg-gray-200 text-ink" : "text-dim hover:text-ink"}`}
            title="Desktop view"
          >
            <Desktop size={14} />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1 rounded ${device === "mobile" ? "bg-gray-200 text-ink" : "text-dim hover:text-ink"}`}
            title="Mobile view"
          >
            <DeviceMobile size={14} />
          </button>
        </div>
      </div>

      {/* Editorial architecture blueprint preview */}
      <div className="p-5 sm:p-7 bg-gradient-to-b from-white to-gray-50/50">
        <div className={`mx-auto transition-all duration-300 ${device === "mobile" ? "max-w-[280px]" : "w-full"}`}>
          <div className="rounded-xl border border-edge bg-white p-4 sm:p-5 shadow-2xs">
            {/* Top mini navbar */}
            <div className="flex items-center justify-between border-b border-edge/60 pb-3">
              <span className="h-3 w-16 rounded bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block h-2 w-10 rounded bg-gray-100" />
                <span className="h-5 w-14 rounded-full bg-cyan/20" />
              </div>
            </div>

            {/* Wireframe Hero with conversion anatomy */}
            <div className="mt-4 text-center py-4">
              <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[9px] text-muted uppercase">
                {isEs ? "Estructura de Conversión" : "Conversion Anatomy"}
              </span>
              <h5 className="mt-2 font-display text-xs sm:text-sm font-bold text-ink leading-snug">
                {isEs
                  ? "Propuesta de Valor de Alta Claridad"
                  : "High-Clarity Value Proposition"}
              </h5>
              <p className="mt-1 text-[11px] text-muted max-w-xs mx-auto leading-relaxed">
                {isEs
                  ? "Jerarquía estricta: propuesta principal, prueba social inmediata y llamadas a la acción sin fricción."
                  : "Strict hierarchy: main value proposition, immediate social proof, and zero-friction CTAs."}
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="inline-block rounded-full bg-cyan px-3 py-1 text-[10px] font-semibold text-ink shadow-2xs">
                  {isEs ? "CTA Principal" : "Primary CTA"}
                </span>
                <span className="inline-block rounded-full border border-edge bg-white px-3 py-1 text-[10px] font-medium text-muted">
                  {isEs ? "Consulta" : "Consultation"}
                </span>
              </div>
            </div>

            {/* 3 Core pillars breakdown */}
            <div className="mt-4 grid grid-cols-1 gap-2 pt-3 border-t border-edge/60 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-2.5 text-center">
                <p className="font-mono text-[10px] font-semibold text-cyan">
                  {isEs ? "01. Velocidad" : "01. Speed"}
                </p>
                <p className="text-[10px] text-muted mt-0.5">
                  {isEs ? "Carga instantánea" : "Instant load"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 text-center">
                <p className="font-mono text-[10px] font-semibold text-cyan">
                  {isEs ? "02. Autoridad" : "02. Authority"}
                </p>
                <p className="text-[10px] text-muted mt-0.5">
                  {isEs ? "Prueba y resultados" : "Proof & outcomes"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 text-center">
                <p className="font-mono text-[10px] font-semibold text-cyan">
                  {isEs ? "03. Conversión" : "03. Capture"}
                </p>
                <p className="text-[10px] text-muted mt-0.5">
                  {isEs ? "Embudos optimizados" : "Optimized funnels"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footnote */}
      <div className="border-t border-edge bg-gray-50/80 px-4 py-2.5 text-center sm:px-6">
        <p className="font-mono text-[10px] text-dim">
          {isEs
            ? "Espacio preparado para capturas reales editables desde el CMS · Anatomía de diseño orientado a ventas"
            : "Space prepared for real project captures editable in CMS · Sales-oriented design anatomy"}
        </p>
      </div>
    </div>
  );
}
