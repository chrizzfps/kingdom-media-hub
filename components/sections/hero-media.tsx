"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroSystemDemo } from "./hero-system-demo";

type HeroMediaItem = {
  videoUrl?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  imageAlt?: string;
  focus?: "top" | "center" | "bottom";
};

/**
 * Priority: video → image → the built-in system demo. The same image doubles
 * as the video poster, so publishing one asset covers both. Video is skipped
 * entirely on mobile/reduced-motion (never mounted, never downloaded) and any
 * load failure falls through to the next tier rather than showing a broken
 * element.
 */
export function HeroMedia() {
  const t = useTranslations("hero");
  const media: HeroMediaItem | undefined = t.has("media") ? (t.raw("media") as HeroMediaItem[])[0] : undefined;

  const videoUrl = media?.videoUrl || undefined;
  const imageUrl = media?.imageUrl || undefined;
  const mobileImageUrl = media?.mobileImageUrl || undefined;
  const imageAlt = media?.imageAlt || "";
  const focus = media?.focus ?? "center";

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    sync();
    setMounted(true);
    mobileQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      mobileQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  const frameClass =
    "relative mx-auto mt-14 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.50)]";

  // Before hydration settles, render the demo — it's a fully finished visual
  // on its own, so there's no flash of an unstyled or empty hero.
  const showVideo = mounted && !!videoUrl && !videoFailed && !reducedMotion && !isMobile;
  const showImage = mounted && !showVideo && !!imageUrl && !imageFailed;

  if (showVideo) {
    return (
      <div className={frameClass}>
        <video
          className="aspect-video w-full bg-dark-2 object-cover"
          style={{ objectPosition: focus }}
          autoPlay
          muted
          loop
          playsInline
          poster={imageUrl}
          onError={() => setVideoFailed(true)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (showImage) {
    const src = isMobile && mobileImageUrl ? mobileImageUrl : imageUrl!;
    return (
      <div className={`${frameClass} aspect-video bg-dark-2`}>
        <Image
          src={src}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          style={{ objectPosition: focus }}
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return <HeroSystemDemo />;
}
