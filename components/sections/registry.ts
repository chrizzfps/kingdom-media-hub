import type { ComponentType } from "react";
import type { PublishedSnapshot } from "@/lib/cms/types";
import { Hero } from "./hero";
import { TrustBar } from "./trust-bar";
import { Ecosystem } from "./ecosystem";
import { ROICalculator } from "./roi-calculator";
import { Agency } from "./agency";
import { MediaLab } from "./media-lab";
import { Marketing } from "./marketing";
import { Academy } from "./academy";
import { HowItWorks } from "./how-it-works";
import { CaseStudies } from "./case-studies";
import { SocialProof } from "./social-proof";
import { Comparison } from "./comparison";
import { Manifesto } from "./manifesto";
import { FAQ } from "./faq";
import { Pricing } from "./pricing";
import { Contact } from "./contact";

/** Homepage blocks keyed by kingdom_sections.key — order and visibility come from the CMS. */
export const SECTION_REGISTRY: Record<string, ComponentType> = {
  hero: Hero,
  trust: TrustBar,
  ecosystem: Ecosystem,
  roi: ROICalculator,
  agency: Agency,
  mediaLab: MediaLab,
  marketing: Marketing,
  academy: Academy,
  howItWorks: HowItWorks,
  caseStudies: CaseStudies,
  socialProof: SocialProof,
  comparison: Comparison,
  manifesto: Manifesto,
  faq: FAQ,
  pricing: Pricing,
  contact: Contact,
};

const DEFAULT_ORDER = Object.keys(SECTION_REGISTRY);

export function homepageOrder(snapshot: PublishedSnapshot | null): string[] {
  const sections = snapshot?.sections?.filter((s) => s.group === "homepage");
  if (!sections?.length) return DEFAULT_ORDER;
  const order = [...sections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((s) => s.isVisible)
    .map((s) => s.key);

  // Sections shipped in code but not yet in the published snapshot (migration
  // applied, no publish since) go right after their nearest rendered
  // predecessor in DEFAULT_ORDER.
  const known = new Set(sections.map((s) => s.key));
  DEFAULT_ORDER.forEach((key, i) => {
    if (known.has(key)) return;
    let after = -1;
    for (let j = i - 1; j >= 0 && after === -1; j--) after = order.indexOf(DEFAULT_ORDER[j]);
    order.splice(after + 1, 0, key);
  });
  return order;
}
