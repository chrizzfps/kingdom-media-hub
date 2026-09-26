import { cn } from "@/lib/utils";

type Variant = "default" | "subtle" | "dark" | "cyan";

/**
 * Solid card surface (no blur). variant="dark" is used inside dark
 * sections (Hero, Footer). variant="cyan" adds a cyan-tinted border
 * for featured cards.
 */
export function GlassCard({
  children,
  className,
  variant = "default",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-2xl transition-shadow duration-300",
        (variant === "default" || variant === "subtle") && [
          "card-surface",
          "hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]",
        ],
        variant === "dark" && "card-surface-dark",
        variant === "cyan" && [
          "card-surface",
          "border-cyan/30 shadow-[0_0_0_1px_rgba(0,196,240,0.15),0_8px_28px_rgba(15,23,42,0.06)]",
          "hover:border-cyan/50",
        ],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
