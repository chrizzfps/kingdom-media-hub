"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowRight, WhatsappLogo, CalendarCheck, EnvelopeSimple, Phone, CheckCircle } from "@phosphor-icons/react";
import { contactSchema, type ContactInput, revenueBands, projectTypes } from "@/lib/validations";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTAButton } from "@/components/ui/cta-button";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink, calendlyLink } from "@/lib/env";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const t   = useTranslations("contact");
  const tc  = useTranslations("common");
  const tcro = useTranslations("cro");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      trackEvent("contact_form_submitted", {});
    } catch {
      setStatus("error");
    }
  };

  const wa = whatsappLink(tcro("whatsappPrefill") ?? undefined);

  return (
    <section id="contact" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left info */}
          <div>
            <SectionHeading
              title={t("title")}
              subtitle={t("subtitle")}
            />
            <div className="mt-10 flex flex-col gap-3">
              {wa && (
                <CTAButton
                  href={wa}
                  variant="secondary"
                  size="lg"
                  className="w-full justify-start gap-3"
                  onClick={() => trackEvent("cta_whatsapp_contact", {})}
                >
                  <WhatsappLogo size={20} className="shrink-0 text-emerald-500" />
                  WhatsApp
                </CTAButton>
              )}
              <CTAButton
                href={calendlyLink()}
                variant="secondary"
                size="lg"
                className="w-full justify-start gap-3"
                onClick={() => trackEvent("cta_book_consultation", { location: "contact" })}
              >
                <CalendarCheck size={20} className="shrink-0 text-cyan" />
                {tc("bookConsultation")}
              </CTAButton>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-edge pt-6">
              <a
                href={`mailto:${t("direct.emailAddress")}`}
                className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
              >
                <EnvelopeSimple size={18} className="shrink-0 text-cyan" />
                <span>{t("direct.email")}: {t("direct.emailAddress")}</span>
              </a>
              <a
                href={`tel:${t("direct.phoneNumber").replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
              >
                <Phone size={18} className="shrink-0 text-cyan" />
                <span>{t("direct.phone")}: {t("direct.phoneNumber")}</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="card-surface rounded-2xl p-6 sm:p-8">
            {status === "success" ? (
              <div className="flex h-full items-center justify-center py-12 text-center">
                <div>
                  <CheckCircle size={40} weight="fill" className="mx-auto text-cyan" />
                  <p className="mt-4 font-display text-lg font-semibold text-ink">{t("form.success")}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {/* Row 1 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("form.name")} error={errors.name?.message}>
                    <Input {...register("name")} placeholder={t("placeholders.name")} error={!!errors.name} />
                  </Field>
                  <Field label={t("form.company")} error={errors.company?.message}>
                    <Input {...register("company")} placeholder={t("placeholders.company")} error={!!errors.company} />
                  </Field>
                </div>
                {/* Row 2 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("form.industry")} error={errors.industry?.message}>
                    <Input {...register("industry")} placeholder={t("placeholders.industry")} error={!!errors.industry} />
                  </Field>
                  <Field label={t("form.revenue")} error={errors.revenue?.message}>
                    <Select {...register("revenue")} error={!!errors.revenue}>
                      <option value="">{t("form.revenue")}</option>
                      {revenueBands.map((b) => (
                        <option key={b} value={b}>{t(`revenueBands.${b}`)}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                {/* Row 3 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("form.email")} error={errors.email?.message}>
                    <Input {...register("email")} type="email" placeholder={t("placeholders.email")} error={!!errors.email} />
                  </Field>
                  <Field label={t("form.phone")} error={errors.phone?.message}>
                    <Input {...register("phone")} placeholder={t("placeholders.phone")} error={!!errors.phone} />
                  </Field>
                </div>
                {/* Project type */}
                <Field label={t("form.projectType")} error={errors.projectType?.message}>
                  <Select {...register("projectType")} error={!!errors.projectType}>
                    <option value="">{t("form.projectType")}</option>
                    {projectTypes.map((pt) => (
                      <option key={pt} value={pt}>{t(`projectTypes.${pt}`)}</option>
                    ))}
                  </Select>
                </Field>
                {/* Message */}
                <Field label={t("form.message")}>
                  <textarea
                    {...register("message")}
                    rows={3}
                    placeholder={t("placeholders.message")}
                    className="w-full resize-none rounded-xl border border-edge-strong bg-white px-4 py-3 text-sm text-ink placeholder-dim outline-none transition-colors focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20"
                  />
                </Field>

                {status === "error" && (
                  <p className="text-sm text-red-500">{t("form.error")}</p>
                )}

                <CTAButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? t("form.submitting") : t("form.submit")}
                  <ArrowRight size={18} />
                </CTAButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Input({ error, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink placeholder-dim outline-none transition-colors",
        error
          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
          : "border-edge-strong focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20",
        className,
      )}
      {...props}
    />
  );
}

function Select({ error, className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors",
        error
          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
          : "border-edge-strong focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
