import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * Standard section header: optional eyebrow + Cabinet display title + Satoshi sub.
 * dark prop: inverts colors for dark-background sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p className={cn("eyebrow", dark && "text-white/50")}>
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={cn(
          "mt-4 font-display text-balance font-bold leading-[1.05] tracking-tight",
          "text-4xl sm:text-5xl",
          dark ? "text-white" : "text-ink",
        )}>
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className={cn(
            "mt-5 text-pretty text-base leading-relaxed sm:text-lg",
            dark ? "text-white/60" : "text-muted",
          )}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
