"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export function HeroGradientBackground() {
  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0, backgroundColor: "#000000" }}
      pointerEvents="none"
      pixelDensity={1}
      fov={45}
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
    </ShaderGradientCanvas>
  );
}
