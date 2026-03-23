"use client";

import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { useRouter } from "next/navigation";
import { COLOR_TABLE, NUMBER_TABLE } from "../../src/constants/energy-tables";
import { playPortalEnter, startPortalHoverTone, stopPortalHoverTone } from "../../lib/sfx";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type Realm = {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  accent: string;
  shader: "smoke" | "sand" | "gold" | "void";
  position: [number, number, number];
};

const REALMS: Realm[] = [
  {
    id: "nebula",
    title: "星云",
    subtitle: "星云",
    route: "/",
    shader: "smoke",
    accent: "#D4AF37",
    position: [-2.1, 0.75, 0],
  },
  {
    id: "apocalypse",
    title: "天启",
    subtitle: "天启",
    route: "/apocalypse",
    shader: "sand",
    accent: "#D4AF37",
    position: [2.1, 0.75, 0],
  },
  {
    id: "origins",
    title: "缘起",
    subtitle: "缘起",
    route: "/origins",
    shader: "gold",
    accent: "#D4AF37",
    position: [-2.1, -1.0, 0],
  },
  {
    id: "arcana",
    title: "玄典",
    subtitle: "玄典",
    route: "/arcana",
    shader: "void",
    accent: "#D4AF37",
    position: [2.1, -1.0, 0],
  },
];

function stringHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makePortalUniforms(variant: Realm["shader"]) {
  const palettes: Record<Realm["shader"], [THREE.Color, THREE.Color]> = {
    smoke: [new THREE.Color("#6f4a9c"), new THREE.Color("#D4AF37")],
    sand: [new THREE.Color("#a96d2b"), new THREE.Color("#f2ddb0")],
    gold: [new THREE.Color("#6d5a20"), new THREE.Color("#f5d67a")],
    void: [new THREE.Color("#2b1a4e"), new THREE.Color("#8d72c7")],
  };
  const [c1, c2] = palettes[variant];
  return {
    uTime: { value: 0 },
    uColorA: { value: c1 },
    uColorB: { value: c2 },
    uHover: { value: 0 },
  };
}

function PortalOrb({
  realm,
  hovered,
  onHover,
  onClick,
}: {
  realm: Realm;
  hovered: boolean;
  onHover: (v: boolean) => void;
  onClick: () => void;
}) {
  const orbRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => makePortalUniforms(realm.shader), [realm.shader]);

  useFrame((_, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta;
      shaderRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.uHover.value,
        hovered ? 1 : 0,
        0.07
      );
    }
    if (rimRef.current) {
      const mat = rimRef.current.material;
      if (mat && mat instanceof THREE.MeshBasicMaterial) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, hovered ? 0.19 : 0.1, 0.08);
      }
    }
  });

  return (
    <group position={realm.position}>
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.24}>
        <mesh
          ref={orbRef}
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
          onClick={onClick}
        >
          <sphereGeometry args={[0.86, 80, 80]} />
          <shaderMaterial
            ref={shaderRef}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={uniforms}
            vertexShader={`
              varying vec3 vPos;
              varying vec3 vNormal;
              void main() {
                vPos = position;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform float uTime;
              uniform vec3 uColorA;
              uniform vec3 uColorB;
              uniform float uHover;
              varying vec3 vPos;
              varying vec3 vNormal;
              void main() {
                float n = sin(vPos.x * 6.0 + uTime * 0.9) * 0.25 + sin(vPos.y * 10.0 - uTime * 0.7) * 0.2 + sin(vPos.z * 13.0 + uTime * 1.1) * 0.15;
                float mixv = smoothstep(-0.45, 0.45, n);
                vec3 col = mix(uColorA, uColorB, mixv);
                float fres = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.4);
                float alpha = 0.62 + fres * 0.22 + uHover * 0.1;
                gl_FragColor = vec4(col, alpha);
              }
            `}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.86, 80, 80]} />
          <meshPhysicalMaterial
            color={"#0b0b0b"}
            roughness={0.2}
            metalness={0.05}
            transmission={0.9}
            thickness={0.45}
            ior={1.5}
            transparent
            opacity={0.5}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        </mesh>

        <mesh ref={rimRef} scale={1.08}>
          <sphereGeometry args={[0.88, 64, 64]} />
          <meshBasicMaterial
            color={realm.accent}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>
    </group>
  );
}

function RealmsScene({
  onPortalClick,
}: {
  onPortalClick: (route: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} color={"#D4AF37"} />
      <directionalLight position={[-3, -1, -2]} intensity={0.35} color={"#ffffff"} />
      {REALMS.map((r) => (
        <PortalOrb
          key={r.id}
          realm={r}
          hovered={hoveredId === r.id}
          onHover={async (v) => {
            setHoveredId(v ? r.id : null);
            if (v) await startPortalHoverTone();
            else await stopPortalHoverTone();
          }}
          onClick={() => onPortalClick(r.route)}
        />
      ))}
      <Environment preset="city" />
    </>
  );
}

function pickDailyPrescription() {
  const daySeed = new Date().toISOString().slice(0, 10);
  const rand = mulberry32(stringHash(`prescription-${daySeed}`));
  const c = COLOR_TABLE[Math.floor(rand() * COLOR_TABLE.length)];
  const n = NUMBER_TABLE[Math.floor(rand() * NUMBER_TABLE.length)];
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
  const d = dirs[Math.floor(rand() * dirs.length)];
  const dirZh: Record<(typeof dirs)[number], string> = {
    N: "北",
    NE: "东北",
    E: "东",
    SE: "东南",
    S: "南",
    SW: "西南",
    W: "西",
    NW: "西北",
  };
  return {
    color: c,
    number: n,
    direction: d,
    directionLabel: dirZh[d],
  };
}

function pickRecommendedRealm() {
  const daySeed = new Date().toISOString().slice(0, 10);
  const rand = mulberry32(stringHash(`recommended-${daySeed}`));
  return REALMS[Math.floor(rand() * REALMS.length)];
}

export default function FourRealms() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.34, 0.44], [0, 1]);
  const y = useTransform(scrollYProgress, [0.34, 0.44], [22, 0]);
  const [entering, setEntering] = useState(false);

  const prescription = useMemo(() => pickDailyPrescription(), []);
  const recommended = useMemo(() => pickRecommendedRealm(), []);

  const cards = [
    {
      id: prescription.color.id,
      title: "共振色",
      value: `${prescription.color.name}`,
      sub: prescription.color.hex,
      chip: prescription.color.hex,
    },
    {
      id: prescription.number.id,
      title: "神谕数",
      value: `${prescription.number.value}`,
      sub: prescription.number.keyword,
      chip: "linear-gradient(135deg, #D4AF37, #F7E7B5, #B8860B)",
    },
    {
      id: `D-${prescription.direction}`,
      title: "势能向",
      value: prescription.directionLabel,
      sub: `方位 ${prescription.direction}`,
      chip: "conic-gradient(from 220deg, #1a0b3d, #D4AF37, #1a0b3d)",
    },
  ] as const;

  return (
    <motion.section
      style={{ opacity, y }}
      className="relative min-h-[100svh] w-full flex items-center"
    >
      {entering ? (
        <motion.div
          className="fixed inset-0 z-[90] bg-black pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />
      ) : null}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 md:py-18">
        <div className="text-center">
          <div className="text-[11px] tracking-[0.34em] text-zinc-300">今日能量处方</div>
          <div className={`${playfair.className} mt-6 text-4xl md:text-5xl tracking-[0.22em]`}>
            能量处方与圣域入口
          </div>
          <div className="mt-4 text-sm tracking-[0.22em] text-zinc-400">
            今日仪式参数
          </div>
        </div>

        <div className="mt-8 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-4 md:grid md:min-w-0 md:grid-cols-3">
            {cards.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                whileHover={{
                  y: -4,
                  boxShadow:
                    "0 0 0 1px rgba(212,175,55,0.18), 0 0 46px rgba(212,175,55,0.18)",
                }}
                className="w-[280px] md:w-auto rounded-2xl border border-[#D4AF37]/20 bg-white/5 backdrop-blur-2xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="text-[11px] tracking-[0.28em] text-zinc-400">{c.title}</div>
                  <div className="text-[11px] tracking-[0.24em] text-[#D4AF37]">{c.id}</div>
                </div>
                <div className={`${playfair.className} mt-5 text-3xl tracking-[0.18em] text-zinc-100`}>
                  {c.value}
                </div>
                <div className="mt-2 text-[11px] tracking-[0.24em] text-zinc-400">{c.sub}</div>
                <div
                  className="mt-4 h-2.5 w-28 rounded-full border border-[#D4AF37]/20"
                  style={{ background: c.chip }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] tracking-[0.32em] text-[#D4AF37]/90">
          推荐路径：{recommended.title}
        </div>

        <div className="mt-5 rounded-3xl border border-[#D4AF37]/14 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="h-[520px]">
            <Canvas camera={{ position: [0, 0, 4.45], fov: 45 }}>
              <RealmsScene
                onPortalClick={async (route) => {
                  if (entering) return;
                  setEntering(true);
                  await playPortalEnter();
                  window.setTimeout(() => {
                    router.push(route);
                    setEntering(false);
                  }, 560);
                }}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

