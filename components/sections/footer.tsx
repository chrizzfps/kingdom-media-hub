import { useTranslations } from "next-intl";
import { InstagramLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { KingdomLogo } from "@/components/ui/kingdom-logo";
import { whatsappLink } from "@/lib/env";

const ecosystem = [
  { key: "agency", href: "#agency" },
  { key: "mediaLab", href: "#media-lab" },
  { key: "academy", href: "#academy" },
] as const;

const company = [
  { key: "results", href: "#results" },
  { key: "faq", href: "#faq" },
  // Contact form backend not wired up yet — send to WhatsApp for now.
  { key: "getStarted", href: whatsappLink() ?? "#contact" },
] as const;

const socials = [
  { label: "Instagram", Icon: InstagramLogo, href: "#" },
  { label: "LinkedIn",  Icon: LinkedinLogo,  href: "#" },
] as const;

export function Footer() {
  const t  = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="bg-dark text-white/80">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <KingdomLogo height={28} color="white" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {t("tagline")}
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-white/30">
              {t("markets")}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/05 text-white/50 transition-colors hover:bg-white/10 hover:text-cyan"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
              {t("ecosystem")}
            </h3>
            <ul className="mt-4 space-y-3">
              {ecosystem.map(({ key, href }) => (
                <li key={key}>
                  <a href={href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {tn(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
              {t("company")}
            </h3>
            <ul className="mt-4 space-y-3">
              {company.map(({ key, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {key === "getStarted" ? t("getStarted") : tn(key as "results" | "faq")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Kingdom Media Hub. {t("rights")}
          </p>
          <div className="flex gap-5">
            {[t("privacy"), t("terms")].map((label) => (
              <a key={label} href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
