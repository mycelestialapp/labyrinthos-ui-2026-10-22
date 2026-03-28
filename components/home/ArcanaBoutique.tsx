"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function Crystal({ color, position }: { color: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0.35} floatIntensity={0.35}>
        <mesh>
          <icosahedronGeometry args={[1.0, 0]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.18}
            metalness={0.0}
            transmission={0.95}
            thickness={0.6}
            ior={1.5}
            clearcoat={0.45}
            clearcoatRoughness={0.35}
          />
        </mesh>

        <mesh scale={1.04}>
          <icosahedronGeometry args={[1.0, 0]} />
          <meshBasicMaterial color={"#D4AF37"} transparent opacity={0.08} />
        </mesh>
      </Float>
    </group>
  );
}

function BoutiqueScene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color={"#D4AF37"} />
      <directionalLight position={[-3, -2, -3]} intensity={0.35} color={"#ffffff"} />
      <Crystal color={"#1a0b3d"} position={[-1.55, 0, 0]} />
      <Crystal color={"#0b0b0b"} position={[1.55, 0, 0]} />
      <Environment preset="city" />
    </>
  );
}

export default function ArcanaBoutique() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.72, 0.82], [0, 1]);
  const y = useTransform(scrollYProgress, [0.72, 0.82], [30, 0]);

  return (
    <motion.section
      style={{ opacity, y }}
      className="relative min-h-[100svh] w-full flex items-center"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 md:py-18">
        <div className="text-center">
          <div className="text-[11px] tracking-[0.34em] text-zinc-300">玄典精品</div>
          <div className={`${playfair.className} mt-6 text-4xl md:text-5xl tracking-[0.22em]`}>
            能量精品预览
          </div>
          <div className="mt-5 text-[12px] tracking-[0.38em] text-zinc-400">
            双晶陈列 • 奢感视觉编排
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#D4AF37]/12 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="h-[520px]">
            <Canvas camera={{ position: [0, 0.1, 6], fov: 45 }}>
              <BoutiqueScene />
            </Canvas>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

