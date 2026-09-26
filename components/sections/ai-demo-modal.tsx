"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, Waveform } from "@phosphor-icons/react";
import { useUIStore } from "@/lib/store";
import { CTAButton } from "@/components/ui/cta-button";
import { calendlyLink } from "@/lib/env";

export function AIDemoModal() {
  const t         = useTranslations("agency.demo");
  const tc        = useTranslations("common");
  const demoOpen  = useUIStore((s) => s.demoOpen);
  const closeDemo = useUIStore((s) => s.closeDemo);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDemo(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDemo]);

  return (
    <AnimatePresence>
      {demoOpen && (
        <motion.div
          role="dialog"
          aria-modal
          aria-label={t("title")}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDemo}
            aria-hidden
          />
          <motion.div
            className="relative w-full max-w-xl rounded-2xl bg-white p-7 shadow-[0_32px_80px_rgba(0,0,0,0.14)]"
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{ scale: 0.95,    opacity: 0, y: 8  }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={closeDemo}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-muted transition-colors hover:bg-gray-200 hover:text-ink"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <h2 className="font-display text-xl font-bold text-ink">{t("title")}</h2>
            <p className="mt-1.5 text-sm text-muted">{t("desc")}</p>

            {/* Demo placeholder */}
            <div className="mt-5 flex aspect-video items-center justify-center rounded-2xl bg-gray-50 ring-1 ring-gray-200">
              <div className="flex flex-col items-center gap-3 text-dim">
                <Waveform size={40} className="text-cyan/40" />
                <p className="text-center text-sm">{t("soon")}</p>
              </div>
            </div>

            <CTAButton
              href={calendlyLink()}
              variant="primary"
              className="mt-6 w-full"
            >
              {t("cta")}
            </CTAButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
