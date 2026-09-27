"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

// Brand palette: blue → cyan → mint over black.
const BRAND_COLORS = ["#0073ff", "#00c4f0", "#00d084"];

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <GrainGradient
        style={{ height: "100%", width: "100%" }}
        colorBack="#000000"
        softness={0.76}
        intensity={0.45}
        noise={0}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={1}
        colors={BRAND_COLORS}
      />
    </div>
  );
}
