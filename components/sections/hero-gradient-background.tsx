"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

// Frames to wait before reporting ready: the first couple of frames can still be
// compiling shaders / uploading textures, so wait until rendering has settled.
const READY_AFTER_FRAMES = 3;

function ReadySignal({ onReadyChange }: { onReadyChange?: (ready: boolean) => void }) {
  const frames = useRef(0);
  const reported = useRef(false);

  useFrame(() => {
    if (reported.current) return;
    frames.current += 1;
    if (frames.current >= READY_AFTER_FRAMES) {
      reported.current = true;
      onReadyChange?.(true);
    }
  });

  // The canvas unmounts when scrolled far out of view (lazyLoad); reset so the
  // parent fades it back in instead of popping when it remounts.
  useEffect(() => () => onReadyChange?.(false), [onReadyChange]);

  return null;
}

export function HeroGradientBackground({
  onReadyChange,
}: {
  onReadyChange?: (ready: boolean) => void;
}) {
  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0 }}
      pointerEvents="none"
      pixelDensity={1}
      fov={45}
      threshold={0}
      rootMargin="50% 0px 50% 0px"
    >
      <ShaderGradient
        animate="on"
        brightness={1.1}
        cAzimuthAngle={180}
        cDistance={3.9}
        cPolarAngle={115}
        cameraZoom={1}
        color1="#0073ff"
        color2="#00edfe"
        color3="#000000"
        envPreset="city"
        grain="on"
        lightType="3d"
        positionX={-0.5}
        positionY={0.1}
        positionZ={0}
        range="disabled"
        rangeEnd={40}
        rangeStart={0}
        reflection={0.1}
        rotationX={0}
        rotationY={0}
        rotationZ={235}
        shader="defaults"
        type="waterPlane"
        uAmplitude={0}
        uDensity={1.1}
        uFrequency={5.5}
        uSpeed={0.1}
        uStrength={1.6}
        uTime={0.2}
        wireframe={false}
      />
      <ReadySignal onReadyChange={onReadyChange} />
    </ShaderGradientCanvas>
  );
}
