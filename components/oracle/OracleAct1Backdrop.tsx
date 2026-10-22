"use client";

/** 第一幕 · 神圣几何背景 / 光雾 / 水晶 */
export default function OracleAct1Backdrop() {
  return (
    <div className="o3a-act1__backdrop" aria-hidden>
      <svg className="o3a-act1__geometry" viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="o3a-geo-glow" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(197,168,128,0.12)" />
            <stop offset="100%" stopColor="rgba(197,168,128,0)" />
          </radialGradient>
        </defs>
        <rect width="800" height="900" fill="url(#o3a-geo-glow)" />
        {/* Flower-of-life fragment */}
        {[200, 320, 440, 560, 680].map(cx => (
          <circle key={`c1-${cx}`} cx={cx} cy={380} r="72" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
        ))}
        {[260, 380, 500, 620].map(cx => (
          <circle key={`c2-${cx}`} cx={cx} cy={452} r="72" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.6" />
        ))}
        {[260, 380, 500, 620].map(cx => (
          <circle key={`c3-${cx}`} cx={cx} cy={308} r="72" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" />
        ))}
        {/* Merkaba */}
        <g transform="translate(400,400)" opacity="0.07">
          <polygon points="0,-90 78,45 -78,45" fill="none" stroke="rgba(197,168,128,0.9)" strokeWidth="0.8" />
          <polygon points="0,90 78,-45 -78,-45" fill="none" stroke="rgba(197,168,128,0.7)" strokeWidth="0.8" />
        </g>
        {/* Constellation lines */}
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="rgba(255,255,255,0.25)">
          <line x1="120" y1="180" x2="210" y2="140" />
          <line x1="210" y1="140" x2="280" y2="200" />
          <circle cx="120" cy="180" r="1.5" />
          <circle cx="210" cy="140" r="1.8" />
          <circle cx="280" cy="200" r="1.2" />
          <line x1="520" y1="160" x2="600" y2="120" />
          <line x1="600" y1="120" x2="680" y2="175" />
          <circle cx="520" cy="160" r="1.4" />
          <circle cx="600" cy="120" r="1.6" />
          <circle cx="680" cy="175" r="1.3" />
          <line x1="140" y1="620" x2="220" y2="680" />
          <line x1="220" y1="680" x2="300" y2="640" />
          <circle cx="140" cy="620" r="1.2" />
          <circle cx="220" cy="680" r="1.5" />
          <circle cx="300" cy="640" r="1.1" />
        </g>
        {/* Outer ring */}
        <circle cx="400" cy="420" r="280" fill="none" stroke="rgba(197,168,128,0.05)" strokeWidth="0.6" />
        <circle cx="400" cy="420" r="220" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="4 8" />
      </svg>

      <div className="o3a-act1__mist-row">
        <div className="o3a-act1__mist o3a-act1__mist--path" />
        <div className="o3a-act1__mist o3a-act1__mist--choice" />
        <div className="o3a-act1__mist o3a-act1__mist--heal" />
      </div>

      <svg className="o3a-act1__crystals" viewBox="0 0 120 80" aria-hidden>
        <defs>
          <linearGradient id="o3a-crystal-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(140,120,200,0.5)" />
            <stop offset="100%" stopColor="rgba(60,50,90,0.2)" />
          </linearGradient>
          <linearGradient id="o3a-crystal-b" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(100,140,220,0.45)" />
            <stop offset="100%" stopColor="rgba(40,60,100,0.15)" />
          </linearGradient>
        </defs>
        <polygon points="40,75 52,25 64,75" fill="url(#o3a-crystal-b)" stroke="rgba(180,200,255,0.25)" strokeWidth="0.5" />
        <polygon points="52,75 60,35 68,75" fill="url(#o3a-crystal-a)" stroke="rgba(200,170,255,0.3)" strokeWidth="0.5" />
        <polygon points="28,75 38,40 48,75" fill="url(#o3a-crystal-a)" stroke="rgba(180,160,230,0.2)" strokeWidth="0.5" />
        <polygon points="68,75 78,42 88,75" fill="url(#o3a-crystal-b)" stroke="rgba(160,180,240,0.2)" strokeWidth="0.5" />
        <ellipse cx="58" cy="76" rx="38" ry="4" fill="rgba(120,100,180,0.15)" />
      </svg>
    </div>
  );
}

function GateCornerOrnament({ className }: { className: string }) {
  return (
    <span className={className} aria-hidden>
      <svg viewBox="0 0 28 28" fill="none">
        <path
          d="M2 10 C2 4 6 2 12 2 M2 10 C6 10 10 6 14 2 M14 2 C18 2 22 4 24 8"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <path d="M2 2 L2 8 M2 2 L8 2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="5" cy="5" r="1" fill="currentColor" opacity="0.6" />
      </svg>
    </span>
  );
}

export function GateOrnaments() {
  return (
    <>
      <GateCornerOrnament className="o3a-gate__ornament o3a-gate__ornament--tl" />
      <GateCornerOrnament className="o3a-gate__ornament o3a-gate__ornament--tr" />
      <GateCornerOrnament className="o3a-gate__ornament o3a-gate__ornament--bl" />
      <GateCornerOrnament className="o3a-gate__ornament o3a-gate__ornament--br" />
    </>
  );
}
