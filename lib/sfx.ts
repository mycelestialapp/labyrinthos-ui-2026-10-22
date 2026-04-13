"use client";

/**
 * 交互音效：仅用 Web Audio 合成，不请求 /sfx/*.mp3，避免控制台 404 与资源缺失。
 */

let audioCtx: AudioContext | null = null;
let hoverOsc: OscillatorNode | null = null;
let hoverGain: GainNode | null = null;

function ensureAudioCtx() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  audioCtx = new Ctx();
  return audioCtx;
}

async function beep(opts: { type: "click" | "unlock" | "focus" }) {
  try {
    const ctx = ensureAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.001, now);
    out.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g1 = ctx.createGain();
    const g2 = ctx.createGain();
    const hp = ctx.createBiquadFilter();
    const lp = ctx.createBiquadFilter();

    hp.type = "highpass";
    hp.frequency.setValueAtTime(180, now);
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(
      opts.type === "unlock" ? 1400 : opts.type === "focus" ? 1800 : 2200,
      now,
    );

    osc1.type = "sine";
    osc2.type = "triangle";

    const f = opts.type === "unlock" ? 432 : opts.type === "focus" ? 980 : 740;
    osc1.frequency.setValueAtTime(f, now);
    osc2.frequency.setValueAtTime(f * 1.53, now);

    g1.gain.setValueAtTime(
      opts.type === "unlock" ? 0.42 : opts.type === "focus" ? 0.08 : 0.28,
      now,
    );
    g2.gain.setValueAtTime(
      opts.type === "unlock" ? 0.26 : opts.type === "focus" ? 0.05 : 0.18,
      now,
    );

    osc1.connect(g1);
    osc2.connect(g2);
    g1.connect(hp);
    g2.connect(hp);
    hp.connect(lp);
    lp.connect(out);

    const dur = opts.type === "unlock" ? 0.22 : opts.type === "focus" ? 0.14 : 0.08;
    out.gain.exponentialRampToValueAtTime(
      opts.type === "unlock" ? 0.8 : opts.type === "focus" ? 0.18 : 0.55,
      now + 0.012,
    );
    out.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + dur);
    osc2.stop(now + dur);
  } catch {
    // ignore
  }
}

export async function playClick() {
  await beep({ type: "click" });
}

export async function playUnlock() {
  await beep({ type: "unlock" });
}

export async function playFocus() {
  await beep({ type: "focus" });
}

export async function startPortalHoverTone() {
  try {
    const ctx = ensureAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();
    if (hoverOsc && hoverGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(860, now + 1.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);

    hoverOsc = osc;
    hoverGain = gain;
  } catch {
    // ignore
  }
}

export async function stopPortalHoverTone() {
  try {
    if (!hoverOsc || !hoverGain) return;
    const ctx = ensureAudioCtx();
    const now = ctx.currentTime;
    hoverGain.gain.cancelScheduledValues(now);
    hoverGain.gain.setValueAtTime(Math.max(hoverGain.gain.value, 0.0001), now);
    hoverGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    hoverOsc.stop(now + 0.14);
    window.setTimeout(() => {
      hoverOsc = null;
      hoverGain = null;
    }, 180);
  } catch {
    hoverOsc = null;
    hoverGain = null;
  }
}

export async function playPortalEnter() {
  await stopPortalHoverTone();
  try {
    const ctx = ensureAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(280, now);
    osc.type = "sine";
    osc.frequency.setValueAtTime(98, now);
    osc.frequency.exponentialRampToValueAtTime(54, now + 0.7);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.32, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
    osc.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.74);
  } catch {
    // ignore
  }
}
