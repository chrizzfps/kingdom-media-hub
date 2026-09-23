import type { ComponentType } from "react";
import type { PublishedSnapshot } from "@/lib/cms/types";
import { Hero } from "./hero";
import { TrustBar } from "./trust-bar";
import { Ecosystem } from "./ecosystem";
import { ROICalculator } from "./roi-calculator";
import { Agency } from "./agency";
import { MediaLab } from "./media-lab";
import { Academy } from "./academy";
import { HowItWorks } from "./how-it-works";
import { CaseStudies } from "./case-studies";
import { SocialProof } from "./social-proof";
import { Comparison } from "./comparison";
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
  academy: Academy,
  howItWorks: HowItWorks,
  caseStudies: CaseStudies,
  socialProof: SocialProof,
  comparison: Comparison,
  faq: FAQ,
  pricing: Pricing,
  contact: Contact,
};

const DEFAULT_ORDER = Object.keys(SECTION_REGISTRY);

export function homepageOrder(snapshot: PublishedSnapshot | null): string[] {
  const sections = snapshot?.sections?.filter((s) => s.group === "homepage");
  if (!sections?.length) return DEFAULT_ORDER;
  return [...sections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((s) => s.isVisible)
    .map((s) => s.key);
}
