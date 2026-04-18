"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

function parseAccentRgb(s: string): THREE.Color {
  const parts = s.split(",").map((x) => Number.parseFloat(x.trim()) / 255);
  if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
    return new THREE.Color(parts[0]!, parts[1]!, parts[2]!);
  }
  return new THREE.Color(0.66, 0.74, 0.82);
}

function buildHexExtrudeGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const R = 1.18;
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    const x = Math.cos(a) * R;
    const y = Math.sin(a) * R;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.32,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.045,
    bevelSegments: 2,
    curveSegments: 1,
  });
  geo.center();
  return geo;
}

function buildLifePathTexture(lifePath: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d");
  if (!ctx) {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  ctx.clearRect(0, 0, c.width, c.height);
  const g = ctx.createLinearGradient(320, 280, 720, 780);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.35, "#e4eaf2");
  g.addColorStop(0.62, "#b8c4d4");
  g.addColorStop(1, "#eef2f8");
  ctx.fillStyle = g;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '600 320px ui-serif, "Times New Roman", "Noto Serif", "Source Han Serif SC", serif';
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;
  ctx.fillText(String(lifePath), 512, 530);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function MandalaScene({ lifePath, accentRgb, spin }: { lifePath: number; accentRgb: string; spin: boolean }) {
  const group = useRef<THREE.Group>(null);
  const hexGeo = useMemo(() => buildHexExtrudeGeometry(), []);
  const accent = useMemo(() => parseAccentRgb(accentRgb), [accentRgb]);
  const numberTex = useMemo(() => buildLifePathTexture(lifePath), [lifePath]);

  useEffect(() => {
    return () => {
      numberTex.dispose();
    };
  }, [numberTex]);

  useEffect(() => {
    return () => {
      hexGeo.dispose();
    };
  }, [hexGeo]);

  useFrame((_, delta) => {
    if (!spin || !group.current) return;
    group.current.rotation.y += delta * 0.11;
  });

  return (
    <group ref={group} rotation={[0.2, -0.16, 0.035]}>
      <hemisphereLight args={["#dfe8f8", "#080a10", 0.5]} />
      <ambientLight intensity={0.18} />
      <directionalLight position={[4.2, 6.5, 5]} intensity={1.25} color="#f2f6ff" />
      <directionalLight position={[-3.2, -2.4, 2.2]} intensity={0.32} color="#121820" />
      <spotLight
        position={[-3.6, 4, 3]}
        angle={0.4}
        penumbra={0.55}
        intensity={1.65}
        color="#c8dcff"
        distance={14}
        decay={2}
      />

      <mesh geometry={hexGeo}>
        <meshPhysicalMaterial
          color={accent.clone().multiplyScalar(0.52)}
          metalness={0.9}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.16}
          reflectivity={1}
          envMapIntensity={1}
          emissive="#04060a"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, 0, 0.2]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={numberTex} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * 寰宇之门曼陀罗核心区：WebGL 挤出六角 + 主路径数纹理平面（镜鉴等长文仍为 DOM）。
 */
export function NumerologyMandala3DCore({
  lifePath,
  accentRgb,
  className = "",
}: {
  lifePath: number;
  accentRgb: string;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.55], fov: 42, near: 0.1, far: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.style.pointerEvents = "none";
      }}
    >
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.32} />
        <MandalaScene lifePath={lifePath} accentRgb={accentRgb} spin={!reduced} />
      </Suspense>
    </Canvas>
  );
}
