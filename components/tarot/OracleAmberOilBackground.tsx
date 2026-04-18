"use client";

/**
 * 神谕祭坛底场「深阈·余烬」：全程序，无贴图。
 * 深暮光色带（非纯黑）、底缘余烬、柔光干涉、极轻雾、球面透镜 + 视差。
 */
import { useEffect, useRef } from "react";
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

const FRAME_MS = 1000 / 60;
const CAP = { r: 61 / 255, g: 43 / 255, b: 16 / 255 };
const TEXT_LUMA = 0.299 * 0.957 + 0.587 * 0.918 + 0.114 * 0.847;
const LMAX = TEXT_LUMA * 0.15;

const vertexShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const noise3DGlsl = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uParallax;
uniform vec2 uGyro;
uniform vec2 uResolution;

${noise3DGlsl}

/* 极轻雾：两阶 snoise，无厚 FBM 颗粒 */
float veilMist(vec2 uv, float t) {
  float a = snoise(vec3(uv * 1.35, t * 0.05)) * 0.5 + 0.5;
  float b = snoise(vec3(uv * 2.8 + vec2(1.7, -1.1), t * 0.04 + 1.3)) * 0.5 + 0.5;
  return mix(a, b, 0.45);
}

vec2 lensUv(vec2 uv, float aspect) {
  vec2 q = uv - 0.5;
  q.x *= aspect;
  float r2 = dot(q, q);
  q *= 1.0 - 0.05 * min(r2, 0.92);
  q.x /= max(aspect, 1e-4);
  return q + 0.5;
}

void main() {
  const vec3 capRgb = vec3(${CAP.r.toFixed(5)}, ${CAP.g.toFixed(5)}, ${CAP.b.toFixed(5)});

  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 bent = lensUv(vUv, aspect);
  vec2 gyro = uGyro * 0.0035;
  vec2 uv = bent + uParallax * 0.94 + gyro;

  float t = uTime * 0.018;
  /* 顶：深靛暮光；底：暖赭褐 — 刻意避开纯黑 */
  vec3 zenith = vec3(0.078, 0.065, 0.145);
  vec3 floorC = vec3(0.168, 0.098, 0.078);
  float h = smoothstep(0.02, 0.98, uv.y);
  vec3 col = mix(zenith, floorC, pow(h, 1.05));

  float mist = veilMist(uv * vec2(1.0, 0.88), t);
  col += (mist - 0.5) * vec3(0.012, 0.009, 0.014);

  vec2 p = uv * vec2(11.5 * aspect, 8.5);
  float ph = t * 0.06 + dot(uParallax, vec2(4.0, -2.8)) * 3.0;
  float ca = sin(p.x * 1.55 + p.y * 0.9 + ph) * sin(-p.x * 1.05 + p.y * 1.35 - ph * 0.65);
  ca = smoothstep(-0.72, 0.72, ca);
  vec3 cau = vec3(0.14, 0.095, 0.068);
  float caMask = (1.0 - smoothstep(0.2, 0.62, uv.y)) * 0.85;
  col += cau * (ca - 0.5) * 0.055 * caMask;

  float ember = exp(-pow((uv.x - 0.5) * 3.0, 2.0)) * exp(-(1.0 - uv.y) * 3.6);
  col += vec3(0.22, 0.12, 0.075) * ember * 0.18;

  vec2 ctr = vec2(0.5, 0.44);
  vec2 d = (uv - ctr) * vec2(aspect, 1.0);
  float halo = exp(-dot(d, d) * 2.2) * 0.078;
  col += vec3(0.12, 0.085, 0.062) * halo;

  float band = smoothstep(0.58, 0.72, uv.y) * (1.0 - smoothstep(0.72, 0.88, uv.y));
  col += vec3(0.045, 0.032, 0.048) * band * 0.28;

  vec2 c = (vUv - 0.5) * vec2(1.04 * aspect, 1.0);
  float rv = length(c);
  float vig = 1.0 - smoothstep(0.2, 0.9, rv);
  float cr = 1.0 - smoothstep(0.32, 0.98, max(abs(c.x / max(aspect, 1e-4)), abs(c.y)) * 1.0);
  /* 暗角仍压视线，但不收进纯黑 */
  col *= max(vig * mix(0.16, 1.0, cr), 0.06);

  float Lm = dot(col, vec3(0.299, 0.587, 0.114));
  col *= min(1.0, ${LMAX.toFixed(5)} / max(Lm, 1e-5));
  col = min(col, capRgb);

  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = { className?: string };

export default function OracleAmberOilBackground({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    reduceMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const gTarget = { x: 0, y: 0 };
    const gSmooth = { x: 0, y: 0 };
    const gyroRef = { ok: false };

    const onPointer = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      target.x = (e.clientX / w) * 2 - 1;
      target.y = -((e.clientY / h) * 2 - 1);
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      gTarget.x = Math.max(-1, Math.min(1, e.gamma / 55));
      gTarget.y = Math.max(-1, Math.min(1, (e.beta - 40) / 35));
    };

    window.addEventListener("pointermove", onPointer, { passive: true });

    const tryGyro = () => {
      const DO = window.DeviceOrientationEvent;
      if (!DO) return;
      const req = (DO as unknown as { requestPermission?: () => Promise<PermissionState> }).requestPermission;
      if (typeof req === "function") {
        void req
          .call(DO)
          .then((s) => {
            if (s === "granted") {
              gyroRef.ok = true;
              window.addEventListener("deviceorientation", onOrient, { passive: true } as AddEventListenerOptions);
            }
          })
          .catch(() => {});
      } else {
        gyroRef.ok = true;
        window.addEventListener("deviceorientation", onOrient, { passive: true } as AddEventListenerOptions);
      }
    };
    window.addEventListener("pointerdown", tryGyro, { passive: true, once: true } as AddEventListenerOptions);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x14102a, 1);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none;";
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uParallax: { value: new Vector2(0, 0) },
      uGyro: { value: new Vector2(0, 0) },
      uResolution: { value: new Vector2(1, 1) },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new Mesh(new PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const setSize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      const pr = Math.min(window.devicePixelRatio ?? 1, 2);
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w * pr, h * pr);
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    const LERP = 0.028;
    const LERP_G = 0.024;
    const STRENGTH = 0.03;

    let raf = 0;
    let lastRender = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = reduceMotionRef.current ? 0.2 : 1.0;
      smooth.x += (target.x - smooth.x) * LERP * dt;
      smooth.y += (target.y - smooth.y) * LERP * dt;
      gSmooth.x += (gTarget.x - gSmooth.x) * LERP_G * dt;
      gSmooth.y += (gTarget.y - gSmooth.y) * LERP_G * dt;

      const mw = mount.clientWidth || 1;
      const mh = mount.clientHeight || 1;
      const asp = mw / mh;
      uniforms.uParallax.value.set(smooth.x * STRENGTH * asp, smooth.y * STRENGTH);
      uniforms.uGyro.value.set(gyroRef.ok ? gSmooth.x : 0, gyroRef.ok ? gSmooth.y : 0);
      uniforms.uTime.value = reduceMotionRef.current ? now * 0.00005 : now * 0.001;

      if (lastRender > 0 && now - lastRender < FRAME_MS - 0.75) return;
      lastRender = now;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    const onLost = () => cancelAnimationFrame(raf);
    renderer.domElement.addEventListener("webglcontextlost", onLost, false);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", tryGyro);
      if (gyroRef.ok) window.removeEventListener("deviceorientation", onOrient);
      ro.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className ?? ""} aria-hidden />;
}
