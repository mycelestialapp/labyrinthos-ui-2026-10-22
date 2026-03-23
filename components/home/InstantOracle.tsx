"use client";

import React, { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function GoldFoilCard({ flipped, onToggle }: { flipped: boolean; onToggle: () => void }) {
  const group = React.useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!group.current) return;
    const target = flipped ? Math.PI : 0;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, target, 0.08);
  });

  return (
    <group ref={group}>
      <Float speed={1.1} floatIntensity={0.25} rotationIntensity={0.15}>
        <mesh
          onClick={onToggle}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[1.7, 2.4, 0.08]} />
          <meshPhysicalMaterial
            color={"#0b0b0b"}
            roughness={0.42}
            metalness={0.2}
            clearcoat={0.35}
            clearcoatRoughness={0.65}
          />
        </mesh>

        {/* 金边 */}
        <mesh scale={[1.02, 1.02, 1.01]}>
          <boxGeometry args={[1.7, 2.4, 0.08]} />
          <meshBasicMaterial color={"#D4AF37"} transparent opacity={hovered ? 0.16 : 0.10} />
        </mesh>

        {/* 扫光 */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.6, 2.25]} />
          <meshBasicMaterial
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            color={"#D4AF37"}
          />
        </mesh>
      </Float>
    </group>
  );
}

function OracleScene({ flipped, onToggle }: { flipped: boolean; onToggle: () => void }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} color={"#D4AF37"} />
      <directionalLight position={[-2, -1, -2]} intensity={0.35} color={"#ffffff"} />
      <GoldFoilCard flipped={flipped} onToggle={onToggle} />
      <Environment preset="city" />
    </>
  );
}

export default function InstantOracle() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.52, 0.62], [0, 1]);
  const y = useTransform(scrollYProgress, [0.52, 0.62], [26, 0]);
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.section
      style={{ opacity, y }}
      className="relative min-h-[100svh] w-full flex items-center"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 md:py-18">
        <div className="text-center">
          <div className="text-[11px] tracking-[0.34em] text-zinc-300">INSTANT ORACLE</div>
          <div className={`${playfair.className} mt-6 text-4xl md:text-5xl tracking-[0.22em]`}>
            触碰它，领取今日的共时性信号。
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#D4AF37]/12 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="h-[520px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <OracleScene flipped={flipped} onToggle={() => setFlipped((v) => !v)} />
            </Canvas>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

