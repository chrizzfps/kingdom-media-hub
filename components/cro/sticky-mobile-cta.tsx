"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import { WhatsappLogo, CalendarCheck } from "@phosphor-icons/react";
import { whatsappLink, calendlyLink } from "@/lib/env";
import { trackEvent } from "@/lib/analytics";

export function StickyMobileCTA() {
  const tc  = useTranslations("common");
  const tCro = useTranslations("cro");
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const contact = document.getElementById("contact");
    const nearContact = contact
      ? contact.getBoundingClientRect().top < window.innerHeight * 0.9
      : false;
    setShow(y > window.innerHeight * 0.6 && !nearContact);
  });

  const wa = whatsappLink(tCro("whatsappPrefill"));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-2 border-t border-edge bg-white/85 p-3 backdrop-blur-[16px] lg:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <a
            href={wa ?? "#contact"}
            onClick={() => trackEvent("cta_whatsapp", { location: "sticky_mobile" })}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-edge-strong bg-white text-sm font-medium text-ink shadow-sm"
            {...(wa ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <WhatsappLogo size={18} className="text-emerald-500" />
            {tc("whatsapp")}
          </a>
          <a
            href={calendlyLink()}
            onClick={() => trackEvent("cta_book_consultation", { location: "sticky_mobile" })}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-cyan text-sm font-semibold text-ink"
          >
            <CalendarCheck size={18} />
            {tc("bookConsultation")}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
