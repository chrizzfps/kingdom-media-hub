"use client";

import { useState } from "react";
import Image from "next/image";
import { Robot, Lightning, Browser } from "@phosphor-icons/react";
import type { IconWeight } from "@phosphor-icons/react";

/* -------------------------------------------------------------------------- */
/* Shared: real project image (CMS), clean framed. Used by all three         */
/* services when an image is published; falls back to a plain icon panel    */
/* on missing image or load failure rather than a fake product UI.           */
/* -------------------------------------------------------------------------- */

function ServiceImageFrame({
  imageUrl,
  imageAlt,
  onError,
}: {
  imageUrl: string;
  imageAlt?: string;
  onError: () => void;
}) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100">
      <Image
        src={imageUrl}
        alt={imageAlt || "Kingdom project"}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        onError={onError}
      />
    </div>
  );
}

type ServiceIcon = React.ComponentType<{ size: number; weight?: IconWeight; className?: string }>;

function ServicePlaceholder({ Icon, label }: { Icon: ServiceIcon; label: string }) {
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-edge bg-gray-50 p-8 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
        <Icon size={30} weight="duotone" className="text-cyan-deep" />
      </span>
      <p className="max-w-[220px] text-sm font-medium text-muted">{label}</p>
    </div>
  );
}

function ServiceVisual({
  imageUrl,
  imageAlt,
  Icon,
  label,
}: {
  imageUrl?: string;
  imageAlt?: string;
  Icon: ServiceIcon;
  label: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageUrl && !imageFailed) {
    return <ServiceImageFrame imageUrl={imageUrl} imageAlt={imageAlt} onError={() => setImageFailed(true)} />;
  }

  return <ServicePlaceholder Icon={Icon} label={label} />;
}

export function AgencyVoiceVisual(props: { imageUrl?: string; imageAlt?: string; label: string }) {
  return <ServiceVisual {...props} Icon={Robot} />;
}

export function AgencyAutomationVisual(props: { imageUrl?: string; imageAlt?: string; label: string }) {
  return <ServiceVisual {...props} Icon={Lightning} />;
}

export function AgencyWebsitesVisual(props: { imageUrl?: string; imageAlt?: string; label: string }) {
  return <ServiceVisual {...props} Icon={Browser} />;
}
