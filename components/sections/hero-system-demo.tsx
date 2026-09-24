"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  Chats,
  Robot,
  CalendarCheck,
  CheckCircle,
  Lightning,
} from "@phosphor-icons/react";

export function HeroSystemDemo() {
  const locale = useLocale();
  const isEs = locale === "es";
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(1);

  const steps = [
    {
      id: "capture",
      number: "01",
      icon: Chats,
      tag: isEs ? "Entrada" : "Inbound",
      title: isEs ? "Captura Multicanal" : "Multichannel Capture",
      desc: isEs
        ? "Recepción instantánea de consultas vía WhatsApp y web."
        : "Instant inquiry capture via WhatsApp and web.",
      preview: {
        badge: isEs ? "Consulta entrante · Ejemplo" : "Inbound message · Demo",
        sender: isEs ? "Cliente potencial" : "Prospective client",
        text: isEs
          ? "Hola, queremos automatizar la atención de citas y cualificar leads antes de agendar."
          : "Hi, we want to automate appointment booking and qualify leads before scheduling.",
        channel: "WhatsApp / Web",
      },
    },
    {
      id: "qualify",
      number: "02",
      icon: Robot,
      tag: isEs ? "Cualificación" : "Qualification",
      title: isEs ? "Asistente Virtual IA" : "AI Virtual Assistant",
      desc: isEs
        ? "Diálogo natural en la voz de tu marca y reserva directa."
        : "Natural dialogue in your brand voice and direct booking.",
      preview: {
        badge: isEs ? "Respuesta inteligente · Demo" : "Smart reply · Demo",
        sender: "Kingdom AI Assistant",
        text: isEs
          ? "¡Con gusto! Nuestro orquestador conecta tus canales con tu agenda. ¿Prefieres una sesión diagnóstica este jueves a las 16:00?"
          : "Gladly! Our orchestrator links your channels with your calendar. Would Thursday at 4:00 PM work for a diagnostic session?",
        status: isEs ? "Disponibilidad verificada" : "Availability checked",
      },
    },
    {
      id: "sync",
      number: "03",
      icon: CalendarCheck,
      tag: isEs ? "Cierre" : "Conversion",
      title: isEs ? "Sincronización & Pipeline" : "Sync & Pipeline",
      desc: isEs
        ? "Registro automático en CRM y notificación al equipo."
        : "Automated CRM entry and team notification.",
      preview: {
        badge: isEs ? "Resultado operativo · Demo" : "Operational outcome · Demo",
        sender: isEs ? "CRM & Calendario" : "CRM & Calendar",
        text: isEs
          ? "Cita agendada · Trato creado en CRM · Invitación enviada con enlace de reunión."
          : "Session scheduled · Deal created in CRM · Invite dispatched with meeting link.",
        status: isEs ? "Confirmación enviada" : "Confirmation sent",
      },
    },
  ];

  return (
    <div className="relative mx-auto mt-14 w-full max-w-5xl">
      {/* Outer frame */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-dark-2/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.50)] backdrop-blur-xl">
        {/* Chrome header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white/50">
              {isEs
                ? "Arquitectura del Sistema · Demostración"
                : "System Architecture · Demo"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-white/60">
              <Lightning size={11} className="text-cyan" weight="fill" />
              {isEs ? "Flujo Automatizado" : "Automated Flow"}
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/30">
              {isEs ? "Ejemplo ilustrativo · No es actividad en vivo" : "Illustrative example · Not live activity"}
            </span>
          </div>
        </div>

        {/* Step navigation tabs */}
        <div className="grid grid-cols-1 border-b border-white/10 divide-y divide-white/10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(idx as 0 | 1 | 2)}
                className={`group relative flex flex-col items-start p-4 text-left transition-all duration-200 sm:p-5 ${
                  isActive
                    ? "bg-white/[0.06]"
                    : "bg-transparent hover:bg-white/[0.03]"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-cyan" />
                )}
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-cyan">
                    {step.number}
                  </span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono uppercase text-white/50">
                    {step.tag}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <Icon
                    size={18}
                    weight={isActive ? "duotone" : "regular"}
                    className={isActive ? "text-cyan" : "text-white/50 group-hover:text-white"}
                  />
                  <h4 className="font-display text-sm font-bold tracking-tight text-white">
                    {step.title}
                  </h4>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  {step.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dynamic preview canvas */}
        <div className="bg-gradient-to-b from-white/[0.02] to-transparent p-5 sm:p-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-dark/60 p-5 sm:p-7">
            {/* Header of preview card */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white">
                  {activeStep === 0 && <Chats size={18} weight="duotone" className="text-cyan" />}
                  {activeStep === 1 && <Robot size={18} weight="duotone" className="text-cyan" />}
                  {activeStep === 2 && <CalendarCheck size={18} weight="duotone" className="text-emerald-400" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {steps[activeStep].preview.sender}
                  </p>
                  <p className="text-[10px] font-mono text-white/40">
                    {steps[activeStep].preview.badge}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-cyan">
                {activeStep === 0 && (isEs ? "Canal Activo" : "Active Channel")}
                {activeStep === 1 && (isEs ? "Voz de Marca" : "Brand Voice")}
                {activeStep === 2 && (isEs ? "Sincronizado" : "Synced")}
              </span>
            </div>

            {/* Message content */}
            <div className="mt-4 rounded-lg bg-white/[0.04] p-4 text-sm leading-relaxed text-white/85 border border-white/10">
              <p>{steps[activeStep].preview.text}</p>
            </div>

            {/* Footer indicators */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-white/50">
              <div className="flex items-center gap-2">
                <CheckCircle size={15} weight="fill" className="text-emerald-400" />
                <span className="text-[11px] font-medium text-white/50">
                  {activeStep === 0 && (isEs ? "Conexión WhatsApp & Web disponible" : "WhatsApp & Web ready")}
                  {activeStep === 1 && (isEs ? "Integración con Google Calendar y Outlook" : "Google Calendar & Outlook integration")}
                  {activeStep === 2 && (isEs ? "Registro automático en CRM" : "Automated CRM deal creation")}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase text-white/30">
                {isEs ? "Paso interactivo de demostración" : "Interactive demonstration step"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
