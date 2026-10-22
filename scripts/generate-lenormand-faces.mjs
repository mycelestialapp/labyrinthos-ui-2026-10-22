/**
 * 生成 36 张 Petit Lenormand 风格原创牌面（SVG）。
 * 母题与角标花色按传统对应；画面为产品自绘，未使用受版权保护的现代牌组。
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../public/lenormand");
mkdirSync(outDir, { recursive: true });

const SUIT = {
  H: { fill: "#a3262a", pip: "M12 21 C4 14 3 8 7 5 C10 3 12 6 12 6 C12 6 14 3 17 5 C21 8 20 14 12 21 Z" },
  D: { fill: "#a3262a", pip: "M12 3 L21 12 L12 21 L3 12 Z" },
  S: { fill: "#1c1a17", pip: "M12 3 C8 8 4 11 4 15 C4 18 7 20 10 20 C11 20 11.5 19.5 12 18.5 C12.5 19.5 13 20 14 20 C17 20 20 18 20 15 C20 11 16 8 12 3 Z" },
  C: { fill: "#1c1a17", pip: "M12 20 L10.5 20 C9 16 6 15 6 12 C6 10 8 8 10 8 C11 8 11.5 8.5 12 9.5 C12.5 8.5 13 8 14 8 C16 8 18 10 18 12 C18 15 15 16 13.5 20 Z" },
};

const CARDS = [
  { id: 1, name: "骑士", inset: ["9", "H"], art: rider },
  { id: 2, name: "三叶草", inset: ["6", "D"], art: clover },
  { id: 3, name: "船", inset: ["10", "S"], art: ship },
  { id: 4, name: "房子", inset: ["K", "H"], art: house },
  { id: 5, name: "树", inset: ["7", "H"], art: tree },
  { id: 6, name: "云", inset: ["K", "C"], art: clouds },
  { id: 7, name: "蛇", inset: ["Q", "C"], art: snake },
  { id: 8, name: "棺材", inset: ["9", "D"], art: coffin },
  { id: 9, name: "花束", inset: ["Q", "S"], art: bouquet },
  { id: 10, name: "镰刀", inset: ["J", "D"], art: scythe },
  { id: 11, name: "鞭子", inset: ["J", "C"], art: whip },
  { id: 12, name: "鸟", inset: ["7", "D"], art: birds },
  { id: 13, name: "孩子", inset: ["J", "S"], art: child },
  { id: 14, name: "狐狸", inset: ["9", "C"], art: fox },
  { id: 15, name: "熊", inset: ["10", "C"], art: bear },
  { id: 16, name: "星星", inset: ["6", "H"], art: stars },
  { id: 17, name: "鹳", inset: ["Q", "H"], art: stork },
  { id: 18, name: "狗", inset: ["10", "H"], art: dog },
  { id: 19, name: "塔", inset: ["6", "S"], art: tower },
  { id: 20, name: "花园", inset: ["8", "S"], art: garden },
  { id: 21, name: "山", inset: ["8", "C"], art: mountain },
  { id: 22, name: "路", inset: ["Q", "D"], art: paths },
  { id: 23, name: "老鼠", inset: ["7", "C"], art: mice },
  { id: 24, name: "心", inset: ["J", "H"], art: heart },
  { id: 25, name: "戒指", inset: ["A", "C"], art: ring },
  { id: 26, name: "书", inset: ["10", "D"], art: book },
  { id: 27, name: "信", inset: ["7", "S"], art: letter },
  { id: 28, name: "男人", inset: ["A", "H"], art: man },
  { id: 29, name: "女人", inset: ["A", "S"], art: woman },
  { id: 30, name: "百合", inset: ["K", "S"], art: lily },
  { id: 31, name: "太阳", inset: ["A", "D"], art: sun },
  { id: 32, name: "月亮", inset: ["8", "H"], art: moon },
  { id: 33, name: "钥匙", inset: ["8", "D"], art: key },
  { id: 34, name: "鱼", inset: ["K", "D"], art: fish },
  { id: 35, name: "锚", inset: ["9", "S"], art: anchor },
  { id: 36, name: "十字", inset: ["6", "C"], art: cross },
];

function pip(suit) {
  const s = SUIT[suit];
  return `<g transform="translate(0,0) scale(0.72)"><path d="${s.pip}" fill="${s.fill}"/></g>`;
}

function insetCard(rank, suit, x, y) {
  const s = SUIT[suit];
  return `<g transform="translate(${x},${y})">
    <rect x="0" y="0" width="46" height="64" rx="4" fill="#f7f1e4" stroke="#2a2418" stroke-width="1.2"/>
    <text x="6" y="16" font-size="11" font-family="Georgia, serif" fill="${s.fill}" font-weight="700">${rank}</text>
    <g transform="translate(11,22)">${pip(suit)}</g>
  </g>`;
}

function frame(id, name, art, rank, suit) {
  const no = String(id).padStart(2, "0");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 430" role="img" aria-label="${no} ${name}">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f4ead4"/>
      <stop offset="1" stop-color="#e6d5b3"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="45%">
      <stop offset="0" stop-color="#fff8e8" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#e6d5b3" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="280" height="430" fill="#1a140f"/>
  <rect x="8" y="8" width="264" height="414" rx="10" fill="url(#paper)" stroke="#c5a059" stroke-width="2.2"/>
  <rect x="16" y="16" width="248" height="398" rx="7" fill="none" stroke="#8a6a32" stroke-width="0.8"/>
  <rect x="16" y="16" width="248" height="398" rx="7" fill="url(#glow)"/>
  <text x="28" y="48" font-family="Georgia, 'Noto Serif SC', serif" font-size="22" fill="#6b4e1e" font-weight="700">${no}</text>
  <text x="140" y="48" text-anchor="middle" font-family="'Noto Serif SC', serif" font-size="20" fill="#3d2a12">${name}</text>
  ${insetCard(rank, suit, 210, 22)}
  <g transform="translate(40,78)">${art()}</g>
  <text x="140" y="404" text-anchor="middle" font-family="Georgia, serif" font-size="9" letter-spacing="0.28em" fill="#8a6a32">PETIT LENORMAND</text>
</svg>`;
}

function rider() {
  return `<g fill="none" stroke="#3d2a12" stroke-width="2.4" stroke-linejoin="round">
    <path d="M20 168 C40 168 48 150 78 148 C110 146 128 158 168 156 C188 155 198 148 210 148" stroke="#6b4e1e"/>
    <path d="M70 148 C72 120 88 96 118 92 C142 88 150 108 148 128" fill="#6b4e1e" stroke="none"/>
    <path d="M118 92 L132 58 L148 70 L136 96" fill="#8a5a2a" stroke="none"/>
    <circle cx="138" cy="48" r="10" fill="#c4a574" stroke="#3d2a12"/>
    <path d="M78 148 L62 188 M92 148 L88 192 M148 128 L142 192 M162 140 L176 188" />
    <path d="M128 58 L168 46" />
  </g>`;
}
function clover() {
  return `<g fill="#2f6b3a">
    <ellipse cx="100" cy="78" rx="28" ry="32" transform="rotate(-18 100 78)"/>
    <ellipse cx="142" cy="78" rx="28" ry="32" transform="rotate(18 142 78)"/>
    <ellipse cx="121" cy="112" rx="30" ry="34"/>
    <path d="M121 130 C126 168 118 198 108 210" fill="none" stroke="#2f6b3a" stroke-width="6"/>
  </g>`;
}
function ship() {
  return `<g>
    <path d="M28 150 C70 188 150 196 212 148 L198 168 C140 200 70 194 36 164 Z" fill="#3d4d6b"/>
    <path d="M118 40 L118 168" stroke="#5a4630" stroke-width="5"/>
    <path d="M122 48 L188 92 L122 128 Z" fill="#efe6cf" stroke="#5a4630" stroke-width="2"/>
    <path d="M114 58 L58 110 L114 132 Z" fill="#e4d7b4" stroke="#5a4630" stroke-width="2"/>
    <ellipse cx="120" cy="188" rx="90" ry="10" fill="#7ea0b8" opacity="0.45"/>
  </g>`;
}
function house() {
  return `<g>
    <path d="M40 128 L120 58 L200 128 V198 H40 Z" fill="#c9b48a" stroke="#5a4630" stroke-width="2.4"/>
    <path d="M40 128 L120 58 L200 128" fill="#8a4e3a"/>
    <rect x="108" y="148" width="28" height="50" fill="#5a4630"/>
    <rect x="62" y="142" width="26" height="22" fill="#dce8f0"/>
    <rect x="152" y="142" width="26" height="22" fill="#dce8f0"/>
  </g>`;
}
function tree() {
  return `<g>
    <rect x="108" y="120" width="18" height="88" rx="4" fill="#6b4a2a"/>
    <circle cx="90" cy="108" r="38" fill="#2f6b3a"/>
    <circle cx="148" cy="100" r="42" fill="#3a7a42"/>
    <circle cx="118" cy="72" r="36" fill="#4a8c4e"/>
  </g>`;
}
function clouds() {
  return `<g fill="#9aa7b8">
    <ellipse cx="86" cy="110" rx="48" ry="28"/>
    <ellipse cx="128" cy="96" rx="52" ry="32"/>
    <ellipse cx="168" cy="118" rx="44" ry="26"/>
    <ellipse cx="70" cy="140" rx="36" ry="18" fill="#b7c2ce"/>
  </g>`;
}
function snake() {
  return `<g fill="none" stroke="#2f6b3a" stroke-width="8" stroke-linecap="round">
    <path d="M36 168 C70 120 90 190 128 140 C160 98 176 186 210 128"/>
    <circle cx="214" cy="122" r="10" fill="#2f6b3a" stroke="none"/>
    <circle cx="218" cy="118" r="2.2" fill="#f4ead4"/>
  </g>`;
}
function coffin() {
  return `<g>
    <path d="M70 70 L150 70 L178 188 L42 188 Z" fill="#4a3a2a" stroke="#2a2018" stroke-width="2"/>
    <path d="M82 88 L138 88 L158 172 L62 172 Z" fill="none" stroke="#c5a059" stroke-width="1.6"/>
    <path d="M110 108 L110 152 M92 130 H128" stroke="#c5a059" stroke-width="2"/>
  </g>`;
}
function bouquet() {
  return `<g>
    <circle cx="92" cy="88" r="22" fill="#c45a6a"/>
    <circle cx="128" cy="74" r="24" fill="#d4a0c0"/>
    <circle cx="154" cy="98" r="20" fill="#e8c45a"/>
    <circle cx="116" cy="108" r="18" fill="#7eb86a"/>
    <path d="M118 120 C110 168 96 198 88 210" stroke="#2f6b3a" stroke-width="5" fill="none"/>
    <path d="M118 120 C132 170 148 196 162 206" stroke="#2f6b3a" stroke-width="4" fill="none"/>
  </g>`;
}
function scythe() {
  return `<g fill="none" stroke="#5a4630" stroke-width="5" stroke-linecap="round">
    <path d="M70 210 L150 46"/>
    <path d="M150 46 C188 52 206 88 198 128 C170 86 150 70 150 46" fill="#c5c8ce" stroke="#4a4e55" stroke-width="2.4"/>
  </g>`;
}
function whip() {
  return `<g fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round">
    <path d="M48 60 C90 70 70 130 110 150 C150 170 130 210 168 200"/>
    <path d="M86 54 C128 64 108 124 148 144 C188 164 168 204 206 194"/>
  </g>`;
}
function birds() {
  return `<g fill="#3d4d6b">
    <ellipse cx="86" cy="110" rx="22" ry="12"/>
    <path d="M86 110 L58 86 L86 100 L108 78 Z"/>
    <ellipse cx="150" cy="128" rx="24" ry="13"/>
    <path d="M150 128 L122 102 L150 118 L176 96 Z"/>
  </g>`;
}
function child() {
  return `<g>
    <circle cx="120" cy="78" r="28" fill="#e2c8a4"/>
    <path d="M78 210 C78 140 162 140 162 210 Z" fill="#c45a4a"/>
    <circle cx="110" cy="74" r="3" fill="#3d2a12"/>
    <circle cx="130" cy="74" r="3" fill="#3d2a12"/>
    <path d="M110 90 Q120 98 130 90" fill="none" stroke="#3d2a12" stroke-width="2"/>
  </g>`;
}
function fox() {
  return `<g fill="#c45a2a">
    <ellipse cx="120" cy="128" rx="48" ry="32"/>
    <path d="M78 100 L92 58 L112 96 Z"/>
    <path d="M162 100 L148 58 L128 96 Z"/>
    <circle cx="104" cy="122" r="5" fill="#1c1a17"/>
    <circle cx="136" cy="122" r="5" fill="#1c1a17"/>
    <ellipse cx="120" cy="138" rx="8" ry="5" fill="#1c1a17"/>
  </g>`;
}
function bear() {
  return `<g fill="#6b4a2a">
    <circle cx="88" cy="86" r="18"/>
    <circle cx="152" cy="86" r="18"/>
    <ellipse cx="120" cy="128" rx="58" ry="50"/>
    <circle cx="102" cy="118" r="6" fill="#1c1a17"/>
    <circle cx="138" cy="118" r="6" fill="#1c1a17"/>
    <ellipse cx="120" cy="142" rx="12" ry="8" fill="#3d2a12"/>
  </g>`;
}
function stars() {
  return `<g fill="#d4b45a">
    ${star(70, 90, 16)} ${star(150, 70, 22)} ${star(118, 140, 14)} ${star(186, 128, 10)}
  </g>`;
}
function star(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i += 1) {
    const a = (-Math.PI / 2) + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.4;
    pts.push(`${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`);
  }
  return `<polygon points="${pts.join(" ")}"/>`;
}
function stork() {
  return `<g fill="#efe6cf" stroke="#5a4630" stroke-width="2">
    <ellipse cx="120" cy="120" rx="36" ry="22"/>
    <path d="M150 112 C178 96 188 80 198 70" fill="none" stroke-width="3"/>
    <circle cx="96" cy="108" r="10"/>
    <path d="M108 140 L96 198 M132 140 L144 198" fill="none"/>
    <path d="M86 108 L58 102" fill="none" stroke="#c45a2a" stroke-width="3"/>
  </g>`;
}
function dog() {
  return `<g fill="#8a6a48">
    <ellipse cx="128" cy="138" rx="50" ry="32"/>
    <ellipse cx="78" cy="110" rx="28" ry="24"/>
    <path d="M58 96 L48 70 L72 90 Z"/>
    <circle cx="70" cy="106" r="3" fill="#1c1a17"/>
    <path d="M108 168 L96 206 M148 168 L160 206" stroke="#8a6a48" stroke-width="8" fill="none"/>
  </g>`;
}
function tower() {
  return `<g fill="#8a8e96" stroke="#3d4248" stroke-width="2">
    <path d="M88 210 V90 H152 V210 Z"/>
    <path d="M78 90 L88 70 H152 L162 90 Z" fill="#6b7078"/>
    <rect x="108" y="118" width="24" height="36" fill="#dce8f0"/>
    <rect x="108" y="168" width="24" height="42" fill="#4a3a2a"/>
  </g>`;
}
function garden() {
  return `<g>
    <path d="M30 170 H210" stroke="#6b8f4a" stroke-width="10"/>
    <circle cx="70" cy="120" r="22" fill="#3a7a42"/>
    <circle cx="120" cy="108" r="28" fill="#2f6b3a"/>
    <circle cx="168" cy="124" r="22" fill="#4a8c4e"/>
    <rect x="112" y="128" width="16" height="48" fill="#6b4a2a"/>
    <path d="M40 188 Q120 210 200 188" fill="none" stroke="#c5a059" stroke-width="2"/>
  </g>`;
}
function mountain() {
  return `<g fill="#6b7380">
    <path d="M20 188 L90 70 L150 188 Z"/>
    <path d="M90 188 L160 58 L230 188 Z" fill="#8a93a0"/>
    <path d="M148 86 L160 58 L176 90 Z" fill="#efe6cf"/>
  </g>`;
}
function paths() {
  return `<g fill="none" stroke="#8a6a32" stroke-width="8" stroke-linecap="round">
    <path d="M40 188 C80 140 70 90 40 50"/>
    <path d="M200 188 C160 140 170 90 200 50"/>
    <circle cx="120" cy="168" r="8" fill="#c5a059" stroke="none"/>
  </g>`;
}
function mice() {
  return `<g fill="#8a8490">
    <ellipse cx="86" cy="140" rx="28" ry="16"/>
    <circle cx="62" cy="132" r="10"/>
    <path d="M112 140 C140 120 160 160 178 148" fill="none" stroke="#8a8490" stroke-width="3"/>
    <ellipse cx="148" cy="168" rx="22" ry="12"/>
    <circle cx="132" cy="162" r="8"/>
  </g>`;
}
function heart() {
  return `<path d="M120 86 C70 40 28 92 120 186 C212 92 170 40 120 86 Z" fill="#a3262a"/>`;
}
function ring() {
  return `<g fill="none" stroke="#c5a059" stroke-width="14">
    <circle cx="120" cy="120" r="48"/>
    <circle cx="120" cy="64" r="10" fill="#efe6cf" stroke="#8a6a32" stroke-width="3"/>
  </g>`;
}
function book() {
  return `<g>
    <path d="M50 70 H120 V190 H50 Z" fill="#6b2a2a"/>
    <path d="M120 70 H190 V190 H120 Z" fill="#8a3a3a"/>
    <path d="M120 70 V190" stroke="#c5a059" stroke-width="3"/>
    <path d="M62 90 H108 M62 110 H108 M132 90 H178" stroke="#e6d5b3" stroke-width="2"/>
  </g>`;
}
function letter() {
  return `<g>
    <rect x="48" y="78" width="144" height="100" rx="4" fill="#efe6cf" stroke="#5a4630" stroke-width="2"/>
    <path d="M48 78 L120 138 L192 78" fill="none" stroke="#8a6a32" stroke-width="2.4"/>
  </g>`;
}
function man() {
  return `<g>
    <circle cx="120" cy="72" r="24" fill="#e2c8a4"/>
    <path d="M78 210 V128 C78 108 162 108 162 128 V210 Z" fill="#2a3d5c"/>
    <rect x="96" y="128" width="48" height="16" fill="#c5a059"/>
  </g>`;
}
function woman() {
  return `<g>
    <circle cx="120" cy="72" r="24" fill="#e2c8a4"/>
    <path d="M120 108 C70 108 52 210 52 210 H188 C188 210 170 108 120 108 Z" fill="#6b2a44"/>
    <path d="M96 60 Q120 20 144 60" fill="#3d2a12"/>
  </g>`;
}
function lily() {
  return `<g>
    <path d="M120 210 C124 150 118 110 120 70" stroke="#2f6b3a" stroke-width="5" fill="none"/>
    <path d="M120 88 C86 50 70 88 120 118 C170 88 154 50 120 88" fill="#efe6cf" stroke="#c5a059" stroke-width="2"/>
    <circle cx="120" cy="96" r="8" fill="#e8c45a"/>
  </g>`;
}
function sun() {
  return `<g>
    <circle cx="120" cy="120" r="42" fill="#e8c45a"/>
    ${Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      const x1 = 120 + Math.cos(a) * 52;
      const y1 = 120 + Math.sin(a) * 52;
      const x2 = 120 + Math.cos(a) * 78;
      const y2 = 120 + Math.sin(a) * 78;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e8c45a" stroke-width="5"/>`;
    }).join("")}
  </g>`;
}
function moon() {
  return `<g>
    <circle cx="128" cy="118" r="52" fill="#e6d5b3"/>
    <circle cx="148" cy="104" r="44" fill="#f4ead4"/>
    <circle cx="110" cy="108" r="4" fill="#c5b48a"/>
    <circle cx="128" cy="140" r="3" fill="#c5b48a"/>
  </g>`;
}
function key() {
  return `<g fill="none" stroke="#c5a059" stroke-width="8" stroke-linecap="round">
    <circle cx="86" cy="86" r="28"/>
    <path d="M108 108 L186 186"/>
    <path d="M158 158 L178 148 M172 172 L190 164"/>
  </g>`;
}
function fish() {
  return `<g fill="#3d6b8a">
    <ellipse cx="118" cy="120" rx="58" ry="28"/>
    <path d="M176 120 L214 88 L214 152 Z"/>
    <circle cx="86" cy="112" r="5" fill="#efe6cf"/>
  </g>`;
}
function anchor() {
  return `<g fill="none" stroke="#3d4d6b" stroke-width="8" stroke-linecap="round">
    <circle cx="120" cy="70" r="16"/>
    <path d="M120 86 V188"/>
    <path d="M70 140 H170"/>
    <path d="M54 168 C54 200 90 210 120 188 C150 210 186 200 186 168"/>
  </g>`;
}
function cross() {
  return `<g fill="#6b4e1e">
    <rect x="104" y="48" width="32" height="150" rx="4"/>
    <rect x="52" y="92" width="136" height="32" rx="4"/>
  </g>`;
}

for (const card of CARDS) {
  const [rank, suit] = card.inset;
  const svg = frame(card.id, card.name, card.art, rank, suit);
  writeFileSync(join(outDir, `${String(card.id).padStart(2, "0")}.svg`), svg);
}

writeFileSync(
  join(outDir, "ATTRIBUTION.txt"),
  "Petit Lenormand 36 张牌面为迷宫坛原创矢量绘制，母题与角标花色遵循传统对应。\n未使用受版权保护的现代商业牌组扫描。\n",
);
console.log(`wrote 36 faces -> ${outDir}`);
