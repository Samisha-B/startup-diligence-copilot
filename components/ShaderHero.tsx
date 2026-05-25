"use client";

import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";

export default function ShaderHero() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.18] mix-blend-screen">
        <ShaderGradientCanvas
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <ShaderGradient
            control="query"
            type="sphere"
            animate="on"
            uSpeed={0.12}
            uStrength={1.2}
            uDensity={1.1}
            uFrequency={4.2}
            uAmplitude={0.8}
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={10}
            rotationY={0}
            rotationZ={-12}
            color1="#2a2218"
            color2="#8d6a3d"
            color3="#111111"
            grain="on"
          />
        </ShaderGradientCanvas>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,97,0.12),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.05),transparent_28%)]" />
    </div>
  );
}