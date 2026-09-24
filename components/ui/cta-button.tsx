"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Liquid Intelligence button system.
 * primary  → cyan solid (CTAs, conversions)
 * secondary → light glass (alternative actions)
 * ghost    → text only with arrow (inline links)
 */
const cta = cva(
  "group inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-tight transition-all duration-200 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: [
          "rounded-full bg-cyan text-ink",
          "shadow-[0_8px_24px_rgba(51,204,255,0.30)]",
          "hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(51,204,255,0.45)]",
        ],
        secondary: [
          "rounded-full glass-subtle",
          "border border-edge-strong text-ink",
          "hover:-translate-y-0.5 hover:border-cyan/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
        ],
        ghost: [
          "rounded-full text-ink hover:text-cyan",
          "underline-offset-4 hover:underline",
        ],
        dark: [
          "rounded-full bg-ink text-white",
          "hover:-translate-y-0.5 hover:bg-dark-2",
        ],
        "outline-dark": [
          "rounded-full border border-white/30 bg-white/[0.06] text-white",
          "hover:-translate-y-0.5 hover:border-cyan/50 hover:bg-white/10",
        ],
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type BaseProps = VariantProps<typeof cta> & {
  className?: string;
  children: React.ReactNode;
};
type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function CTAButton(props: AnchorProps | ButtonProps) {
  const { variant, size, className, children, ...rest } = props;
  const classes = cn(cta({ variant, size }), className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
