/**
 * Centralized, typed access to environment-driven integrations.
 * Every value is optional so the site renders and builds without real keys.
 * Components should degrade gracefully when a value is missing.
 */

const raw = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, // digits only, e.g. 584140000000
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  linkedInPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
} as const;

export const env = {
  ...raw,
  siteUrl: raw.siteUrl ?? "https://kingdommediahub.com",
};

/** Build a WhatsApp deep link with an optional prefilled message. */
export function whatsappLink(message?: string): string | null {
  if (!raw.whatsappNumber) return null;
  const base = `https://wa.me/${raw.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Calendly link, falling back to the contact section if unconfigured. */
export function calendlyLink(): string {
  return raw.calendlyUrl ?? "#contact";
}
