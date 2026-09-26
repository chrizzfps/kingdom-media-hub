"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function FAQ() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          title={t("title")}
          align="center"
          className="mb-12"
        />

        <dl className="divide-y divide-edge">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div>
                <dt>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    <span className="font-display text-base font-semibold text-ink sm:text-lg">
                      {item.q}
                    </span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-muted">
                      {open === i ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.dd
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-relaxed text-muted">{item.a}</p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
