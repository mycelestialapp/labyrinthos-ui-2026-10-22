/** Emit astro-transit-natal-major-narrative-zh.ts (ASCII-only: \\u escapes in templates). */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "lib", "astro-transit-natal-major-narrative-zh.ts");

const u = (s) => s;

const head = `import type {
  AspectType,
  AstroChartWheelData,
  AstroTransitNatalAspectDatum,
  PlanetId,
} from "@/lib/astro-chart-wheel";
import { PLANET_NAME_ZH } from "@/lib/astro-chart-wheel";
import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";

function findTN(
  rows: AstroTransitNatalAspectDatum[],
  transit: PlanetId,
  natal: PlanetId,
  type: AspectType,
): AstroTransitNatalAspectDatum | null {
  return rows.find((r) => r.transit === transit && r.natal === natal && r.type === type) ?? null;
}

function orbStr(d: AstroTransitNatalAspectDatum): string {
  return d.orbDeg.toFixed(2);
}

function aspectKey(a: AstroTransitNatalAspectDatum): string {
  return \`\${a.transit}\\0\${a.natal}\\0\${a.type}\`;
}

/** \\u58f0\\u90e8 1 \\u9ed8\\u8ba4\\u6536\\u675f\\uff1b2\\u201310 \\u89c1 \`astro-transit-natal-major-narrative-voice-zh\` */
export const TRANSIT_NATAL_MAJOR_NARRATIVE_CLOSING_ZH =
  ${JSON.stringify(
    u(
      "\u5148\u6309\u4e0a\u9762\u8bfb\u5230\u7684\u4ea4\u4f1a\u70b9\u8fa8\u8ba4\u538b\u529b\u4e0e\u987a\u51fa\u53e3\uff1b\u771f\u8981\u5b9a\u8c03\uff0c\u7559\u4e00\u53e5\u7ed9\u81ea\u5df1\u590d\u6838\u7684\u4f59\u5730\uff0c\u522b\u628a\u4e00\u53e3\u6c14\u8d4c\u5728\u4e00\u5929\u4e0a\u3002",
    ),
  )};

function planetZh(id: PlanetId): string {
  return PLANET_NAME_ZH[id] ?? id;
}

type PriorClause = { id: string; text: string; keys: string[] };

function genericTransitNatalClause(a: AstroTransitNatalAspectDatum, variant: number): string {
  const t = planetZh(a.transit);
  const n = planetZh(a.natal);
  const lab = aspectTypeLabelZh(a.type);
  const o = orbStr(a);
  const v = variant % 3;

  if (a.transit === a.natal) {
    return [
`;

const self0 = u(
  `\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${t}\u5f62\u6210\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u50cf\u5728\u540c\u4e00\u6761\u7ef3\u4e0a\u81ea\u5df1\u631d\u81ea\u5df1\uff1a\u5148\u522b\u7528\u4e00\u53e5\u8bdd\u628a\u65e5\u5b50\u9489\u6b7b\uff0c\u7559\u4e00\u70b9\u590d\u6838\u4f59\u5730\u3002`,
);
const self1 = u(
  `\u884c\u8fd0\${t}\u56de\u5230\u672c\u547d\${t}\u7684\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u4f53\u611f\u4e0a\u5bb9\u6613\u300c\u81ea\u6211\u8f83\u52b2\u300d\uff1a\u628a\u627f\u8bfa\u653e\u6162\u534a\u6b65\uff0c\u5148\u628a\u7761\u7720\u4e0e\u8282\u594f\u7a33\u4f4f\u3002`,
);
const self2 = u(
  `\u884c\u8fd0\${t}\u5bf9\u672c\u547d\${t}\u6210\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u66f4\u50cf\u662f\u5185\u5728\u53e3\u5f84\u5728\u6253\u67b6\uff1a\u5c11\u5f53\u573a\u62cd\u677f\uff0c\u5148\u628a\u4e8b\u5b9e\u4e0e\u611f\u53d7\u5206\u5f00\u5199\u6e05\u3002`,
);

const sq0 = u(
  `\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u6210\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u5f20\u529b\u4f1a\u88ab\u653e\u5927\uff1a\u5148\u8fa8\u8ba4\u54ea\u91cc\u5728\u6025\u3001\u54ea\u91cc\u5728\u625b\uff0c\u518d\u51b3\u5b9a\u8981\u4e0d\u8981\u5f53\u573a\u8868\u6001\u3002`,
);
const sq1 = u(
  `\u884c\u8fd0\${t}\u538b\u5230\u672c\u547d\${n}\u7684\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u50cf\u4e24\u6761\u7ebf\u62e7\u5728\u4e00\u8d77\uff1a\u628a\u300c\u5fc5\u987b\u73b0\u5728\u89e3\u51b3\u300d\u7684\u5ff5\u5934\u5148\u964d\u4e00\u6863\u3002`,
);
const sq2 = u(
  `\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u7684\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\u5e26\u6765\u786c\u78b0\u53e3\u611f\uff1a\u6c9f\u901a\u7559\u4f59\u5730\uff0c\u522b\u628a\u9762\u5b50\u4e0e\u4e8b\u5b9e\u6346\u6b7b\u5728\u540c\u4e00\u53e5\u91cc\u3002`,
);

const tr0 = u(
  `\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u6210\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u987a\u6d41\u66f4\u660e\u663e\uff1a\u628a\u529b\u6c14\u7528\u5728\u300c\u628a\u4e8b\u60c5\u63a8\u8fdb\u4e00\u5c0f\u6b65\u300d\uff0c\u522b\u8d2a\u4e00\u53e3\u5403\u6ee1\u3002`,
);
const tr1 = u(
  `\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u7684\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\u50cf\u5f00\u4e86\u8f85\u52a9\u8f6e\uff1a\u9002\u5408\u4fee\u8865\u5173\u7cfb\u4e0e\u6d41\u7a0b\uff0c\u4f46\u522b\u56e0\u6b64\u5ffd\u7565\u5e95\u7ebf\u3002`,
);
const tr2 = u(
  `\u884c\u8fd0\${t}\u7167\u5230\u672c\u547d\${n}\u7684\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u624b\u611f\u504f\u987a\uff1a\u6293\u4f4f\u7a97\u53e3\u628a\u8be5\u5bf9\u9f50\u7684\u5bf9\u9f50\uff0c\u522b\u53ea\u505c\u5728\u611f\u89c9\u826f\u597d\u3002`,
);

const co0 = u(
  `\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u5408\u76f8\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u4e3b\u9898\u4f1a\u88ab\u300c\u53e0\u5728\u4e00\u8d77\u300d\uff1a\u5148\u5206\u6e05\u54ea\u4e9b\u662f\u65e7\u811a\u672c\u3001\u54ea\u4e9b\u662f\u65b0\u4e8b\u5b9e\u3002`,
);
const co1 = u(
  `\u884c\u8fd0\${t}\u8d34\u4e0a\u672c\u547d\${n}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u6545\u4e8b\u7ebf\u4f1a\u53d8\u5f97\u66f4\u663e\u773c\uff1a\u628a\u5173\u952e\u8bcd\u5199\u4e0b\u6765\uff0c\u6bd4\u5728\u5fc3\u91cc\u53cd\u590d\u66f4\u7701\u529b\u6c14\u3002`,
);
const co2 = u(
  `\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u5728\u540c\u4e00\u523b\u5ea6\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff1a\u522b\u6025\u7740\u8d34\u6807\u7b7e\uff0c\u5148\u628a\u300c\u6211\u60f3\u8981\u4ec0\u4e48\u7ed3\u679c\u300d\u8bf4\u5177\u4f53\u3002`,
);

const fallback = u(
  `\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u6210\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u628a\u611f\u53d7\u4e0e\u52a8\u4f5c\u62c6\u5f00\u534a\u6b65\uff0c\u518d\u51b3\u5b9a\u4e0b\u4e00\u6b65\u3002`,
);

const mid = `
      \`${self0}\`,
      \`${self1}\`,
      \`${self2}\`,
    ][v];
  }

  if (a.type === "square" || a.type === "opposition") {
    return [
      \`${sq0}\`,
      \`${sq1}\`,
      \`${sq2}\`,
    ][v];
  }

  if (a.type === "trine" || a.type === "sextile") {
    return [
      \`${tr0}\`,
      \`${tr1}\`,
      \`${tr2}\`,
    ][v];
  }

  if (a.type === "conjunction") {
    return [
      \`${co0}\`,
      \`${co1}\`,
      \`${co2}\`,
    ][v];
  }

  return \`${fallback}\`;
}

function buildPriorQueue(rows: AstroTransitNatalAspectDatum[]): PriorClause[] {
  const q: PriorClause[] = [];
  const nepSn = findTN(rows, "neptune", "south_node", "square");
  const nepNn = findTN(rows, "neptune", "north_node", "square");

  if (nepSn && nepNn) {
    q.push({
      id: "nep",
      text: \`${u(
        `\u6d77\u738b\u661f\u540c\u65f6\u4e0e\u672c\u547d\u5357\u4ea4\u70b9\u3001\u5317\u4ea4\u70b9\u5f62\u6210\u56db\u5206\uff08\u5bb9\u8bb8\u5206\u522b\u7ea6 \${orbStr(
          nepSn,
        )} \u5ea6 / \${orbStr(nepNn)} \u5ea6\uff09\uff0c\u53d9\u4e8b\u4e0e\u8fb9\u754c\u5bb9\u6613\u88ab\u300c\u6ce1\u8f6f\u300d\uff1a\u8fd9\u51e0\u5929\u5c11\u505a\u53e3\u5934\u5927\u5305\u5927\u63fd\uff0c\u91cd\u8981\u7ea6\u5b9a\u843d\u5b57\u6216\u7559\u590d\u6838\u3002`,
      )}\`,
      keys: [aspectKey(nepSn), aspectKey(nepNn)],
    });
  } else if (nepSn) {
    q.push({
      id: "nep",
      text: \`${u(
        `\u6d77\u738b\u661f\u56db\u5206\u672c\u547d\u5357\u4ea4\u70b9\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          nepSn,
        )} \u5ea6\uff09\uff0c\u65e7\u4e60\u60ef\u91cc\u7684\u542b\u7cca\u4f1a\u88ab\u653e\u5927\uff1a\u9047\u5230\u300c\u597d\u50cf\u53ef\u4ee5\u300d\u7684\u9080\u8bf7\uff0c\u5148\u95ee\u4e00\u53e5\u4ee3\u4ef7\u4e0e\u671f\u9650\u3002`,
      )}\`,
      keys: [aspectKey(nepSn)],
    });
  } else if (nepNn) {
    q.push({
      id: "nep",
      text: \`${u(
        `\u6d77\u738b\u661f\u56db\u5206\u672c\u547d\u5317\u4ea4\u70b9\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          nepNn,
        )} \u5ea6\uff09\uff0c\u65b9\u5411\u611f\u5bb9\u6613\u53d1\u96fe\uff1a\u522b\u7528\u611f\u89c9\u4ee3\u66ff\u8ba1\u5212\uff0c\u628a\u4e0b\u4e00\u6b65\u62c6\u6210\u53ef\u68c0\u67e5\u7684\u5c0f\u52a8\u4f5c\u3002`,
      )}\`,
      keys: [aspectKey(nepNn)],
    });
  }

  const mv = findTN(rows, "mars", "venus", "square");
  if (mv) {
    q.push({
      id: "mars",
      text: \`${u(
        `\u706b\u661f\u4e0e\u672c\u547d\u91d1\u661f\u56db\u5206\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          mv,
        )} \u5ea6\uff09\uff0c\u6b32\u671b\u4e0e\u8282\u594f\u5bb9\u6613\u4e0d\u540c\u6b65\uff1a\u4eb2\u5bc6\u5173\u7cfb\u4e0e\u5de5\u4f5c\u534f\u4f5c\u91cc\uff0c\u5148\u964d\u8bed\u901f\u518d\u8c08\u6761\u4ef6\u3002`,
      )}\`,
      keys: [aspectKey(mv)],
    });
  }

  const uc = findTN(rows, "uranus", "chiron", "square");
  if (uc) {
    q.push({
      id: "uc",
      text: \`${u(
        `\u5929\u738b\u661f\u4e0e\u672c\u547d\u51ef\u9f99\u56db\u5206\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          uc,
        )} \u5ea6\uff09\uff0c\u65e7\u4f24\u89e6\u70b9\u53ef\u80fd\u88ab\u610f\u5916\u4e8b\u4ef6\u78b0\u5230\uff1a\u7ed9\u81ea\u5df1\u7559\u9000\u51fa\u4e0e\u6682\u505c\u7684\u9009\u9879\uff0c\u4e0d\u5fc5\u5f53\u573a\u89e3\u91ca\u6e05\u695a\u3002`,
      )}\`,
      keys: [aspectKey(uc)],
    });
  }

  const sp = findTN(rows, "saturn", "pluto", "square");
  if (sp) {
    q.push({
      id: "sp",
      text: \`${u(
        `\u571f\u661f\u4e0e\u672c\u547d\u51a5\u738b\u661f\u56db\u5206\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          sp,
        )} \u5ea6\uff09\uff0c\u7ed3\u6784\u538b\u529b\u4e0e\u6267\u5ff5\u5bb9\u6613\u9876\u725b\uff1a\u628a\u300c\u5fc5\u987b\u63a7\u5236\u300d\u7684\u8303\u56f4\u7f29\u5c0f\u5230\u4e00\u4ef6\u5177\u4f53\u5c0f\u4e8b\u3002`,
      )}\`,
      keys: [aspectKey(sp)],
    });
  }

  const vNn = findTN(rows, "venus", "north_node", "trine");
  const vSn = findTN(rows, "venus", "south_node", "sextile");
  if (vNn && vSn) {
    q.push({
      id: "ven",
      text: \`${u(
        `\u91d1\u661f\u4e0e\u672c\u547d\u5317\u4ea4\u4e09\u5408\u3001\u4e0e\u5357\u4ea4\u516d\u5408\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          vNn,
        )} \u5ea6 / \${orbStr(vSn)} \u5ea6\uff09\uff0c\u5173\u7cfb\u4e0e\u5ba1\u7f8e\u8bae\u9898\u4f1a\u88ab\u8f7b\u8f7b\u5411\u524d\u63a8\uff1a\u9002\u5408\u4fee\u8865\u8bed\u6c14\u4e0e\u4eea\u5f0f\u611f\uff0c\u4e0d\u8d2a\u4e00\u6b65\u767b\u5929\u3002`,
      )}\`,
      keys: [aspectKey(vNn), aspectKey(vSn)],
    });
  } else if (vNn) {
    q.push({
      id: "ven",
      text: \`${u(
        `\u91d1\u661f\u4e0e\u672c\u547d\u5317\u4ea4\u4e09\u5408\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          vNn,
        )} \u5ea6\uff09\uff0c\u5408\u4f5c\u4e0e\u4ef7\u503c\u53d6\u5411\u66f4\u5bb9\u6613\u5bf9\u9f50\uff1a\u628a\u300c\u6211\u559c\u6b22\u300d\u7ffb\u8bd1\u6210\u300c\u6211\u53ef\u4ee5\u7ed9\u4ec0\u4e48\u300d\u3002`,
      )}\`,
      keys: [aspectKey(vNn)],
    });
  } else if (vSn) {
    q.push({
      id: "ven",
      text: \`${u(
        `\u91d1\u661f\u4e0e\u672c\u547d\u5357\u4ea4\u516d\u5408\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          vSn,
        )} \u5ea6\uff09\uff0c\u65e7\u8212\u9002\u533a\u91cc\u7684\u751c\u5934\u4f1a\u62db\u624b\uff1a\u4eab\u53d7\u53ef\u4ee5\uff0c\u4f46\u522b\u7528\u5b83\u66ff\u4ee3\u8868\u6001\u4e0e\u8fb9\u754c\u3002`,
      )}\`,
      keys: [aspectKey(vSn)],
    });
  }

  const nj = findTN(rows, "neptune", "jupiter", "conjunction");
  if (nj) {
    q.push({
      id: "nj",
      text: \`${u(
        `\u6d77\u738b\u661f\u4e0e\u672c\u547d\u6728\u661f\u5408\u76f8\uff08\u5bb9\u8bb8\u7ea6 \${orbStr(
          nj,
        )} \u5ea6\uff09\uff0c\u671f\u5f85\u5bb9\u6613\u88ab\u653e\u5927\uff1a\u82b1\u94b1\u3001\u627f\u8bfa\u3001\u4fe1\u4ef0\u4e09\u7c7b\u4e8b\u5148\u8bbe\u4e0a\u9650\uff0c\u518d\u8c08\u6295\u5165\u3002`,
      )}\`,
      keys: [aspectKey(nj)],
    });
  }

  return q;
}

function minorTransitNatalClause(a: AstroTransitNatalAspectDatum, variant: number): string {
  const t = planetZh(a.transit);
  const n = planetZh(a.natal);
  const lab = aspectTypeLabelZh(a.type);
  const o = orbStr(a);
  const v = variant % 3;

  if (a.type === "square" || a.type === "opposition") {
    return [
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\${lab}\u672c\u547d\${n}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u50cf\u80cc\u666f\u91cc\u7684\u7ec6\u523a\uff1a\u4e0d\u5fc5\u620f\u5267\u5316\uff0c\u4f46\u522b\u5b8c\u5168\u5ffd\u7565\u8eab\u4f53\u4e0e\u65e5\u7a0b\u4fe1\u53f7\u3002`,
      )}\`,
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\u5bf9\u672c\u547d\${n}\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u5c0f\u4e8b\u4e5f\u53ef\u80fd\u8fde\u73af\uff1a\u628a\u63d0\u9192\u4e0e\u5907\u4efd\u5f53\u4f5c\u793c\u8c8c\uff0c\u4e0d\u662f\u8ff7\u4fe1\u3002`,
      )}\`,
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u7684\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u538b\u529b\u504f\u300c\u6162\u6027\u300d\uff1a\u7528\u56fa\u5b9a\u65f6\u6bb5\u5904\u7406\uff0c\u6bd4\u4e00\u76f4\u60ac\u5728\u5fc3\u4e0a\u66f4\u7701\u3002`,
      )}\`,
    ][v];
  }

  if (a.type === "trine" || a.type === "sextile") {
    return [
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\${lab}\u672c\u547d\${n}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u5c0f\u987a\u6d41\u53ef\u7528\u6765\u4fee\u7ec6\u8282\uff1a\u6574\u7406\u3001\u5bf9\u9f50\u3001\u8865\u8bfe\u90fd\u5408\u9002\u3002`,
      )}\`,
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\u5bf9\u672c\u547d\${n}\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u9002\u5408\u628a\u8bdd\u8bf4\u5706\u3001\u628a\u5173\u7cfb\u78e8\u987a\uff0c\u4e0d\u8d2a\u5927\u52a8\u4f5c\u3002`,
      )}\`,
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u7684\${lab}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u624b\u611f\u504f\u8f7b\uff1a\u6293\u4f4f\u4e00\u4e2a\u5177\u4f53\u5c0f\u76ee\u6807\u5b8c\u6210\u5b83\u3002`,
      )}\`,
    ][v];
  }

  if (a.type === "conjunction") {
    return [
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\u8d34\u8fd1\u672c\u547d\${n}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u4e3b\u9898\u4f1a\u591a\u4e00\u5c42\u53e0\u5f71\uff1a\u5148\u89c2\u5bdf\u4e00\u5468\u518d\u5b9a\u8c03\u3002`,
      )}\`,
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\u4e0e\u672c\u547d\${n}\u5408\u76f8\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u50cf\u591a\u5f00\u4e86\u4e00\u6761\u652f\u7ebf\uff1a\u8bb0\u5f55\u89e6\u53d1\u70b9\u6bd4\u6025\u7740\u89e3\u91ca\u66f4\u6709\u7528\u3002`,
      )}\`,
      \`${u(
        `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\u53e0\u4e0a\u672c\u547d\${n}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u4fe1\u606f\u5bc6\u5ea6\u504f\u9ad8\uff1a\u628a\u300c\u4e8b\u5b9e / \u63a8\u6d4b / \u611f\u53d7\u300d\u5206\u4e09\u884c\u5199\u3002`,
      )}\`,
    ][v];
  }

  return \`${u(
    `\u6b21\u8981\uff1a\u884c\u8fd0\${t}\${lab}\u672c\u547d\${n}\uff08\u5bb9\u8bb8\u7ea6 \${o} \u5ea6\uff09\uff0c\u5f53\u4f5c\u80cc\u666f\u566a\u58f0\u8c03\u6821\u65e5\u7a0b\u5373\u53ef\u3002`,
  )}\`;
}

`;

const tail = `
/**
 * \\u884c\\u8fd0\\u00d7\\u672c\\u547d\\uff1a\\u4e3b\\u76f8\\u4f4d\\u53d9\\u4e8b\\u6b63\\u6587\\uff08L1+L2 \\u6df7\\u6392\\uff09\\u3002
 */
export function buildTransitNatalMajorNarrativeBodyZh(chart: AstroChartWheelData): string | null {
  const majorRows = chart.transitNatalAspects ?? [];
  if (majorRows.length === 0) return null;

  const minorRows = chart.transitNatalMinorAspects ?? [];
  const hasMinor = minorRows.length > 0;

  const MAX_MAJOR_SENTENCES = hasMinor ? 7 : 6;
  const MAX_MINOR_SENTENCES = hasMinor ? 4 : 0;
  const MAX_SPECIAL_SENTENCES = hasMinor ? 5 : 4;

  const consumed = new Set<string>();
  const majorParts: string[] = [];

  const priorQueue = buildPriorQueue(majorRows);
  const pickedPrior = priorQueue.slice(0, MAX_SPECIAL_SENTENCES);
  for (const p of pickedPrior) {
    majorParts.push(p.text);
    for (const k of p.keys) consumed.add(k);
  }

  const hardFirst = (a: AstroTransitNatalAspectDatum) => (a.type === "square" || a.type === "opposition" ? 0 : 1);
  const remaining = [...majorRows]
    .filter((a) => !consumed.has(aspectKey(a)))
    .sort((a, b) => hardFirst(a) - hardFirst(b) || a.orbDeg - b.orbDeg);

  for (let i = 0; i < remaining.length && majorParts.length < MAX_MAJOR_SENTENCES; i++) {
    majorParts.push(genericTransitNatalClause(remaining[i]!, i));
    consumed.add(aspectKey(remaining[i]!));
  }

  const minorParts: string[] = [];
  if (hasMinor && MAX_MINOR_SENTENCES > 0) {
    const hardMinor = [...minorRows]
      .filter((a) => a.type === "square" || a.type === "opposition")
      .sort((a, b) => a.orbDeg - b.orbDeg);
    const softMinor = [...minorRows]
      .filter((a) => a.type === "trine" || a.type === "sextile")
      .sort((a, b) => a.orbDeg - b.orbDeg);
    const conjMinor = [...minorRows]
      .filter((a) => a.type === "conjunction")
      .sort((a, b) => a.orbDeg - b.orbDeg);

    const picked: AstroTransitNatalAspectDatum[] = [];
    picked.push(...hardMinor.slice(0, 2));
    if (picked.length < MAX_MINOR_SENTENCES) picked.push(...softMinor.slice(0, 1));
    if (picked.length < MAX_MINOR_SENTENCES) picked.push(...conjMinor.slice(0, 1));

    if (picked.length < MAX_MINOR_SENTENCES) {
      const allSorted = [...minorRows].sort((a, b) => a.orbDeg - b.orbDeg);
      for (const a of allSorted) {
        if (picked.length >= MAX_MINOR_SENTENCES) break;
        if (picked.some((x) => aspectKey(x) === aspectKey(a))) continue;
        picked.push(a);
      }
    }

    for (let i = 0; i < picked.length; i++) {
      minorParts.push(minorTransitNatalClause(picked[i]!, i));
    }
  }

  if (majorParts.length === 0) return null;

  const parts: string[] = [];
  parts.push(majorParts.join(""));
  if (minorParts.length > 0) {
    parts.push(\`\\n\\n\${minorParts.join("")}\`);
  }
  return parts.join("");
}

export function buildTransitNatalMajorNarrativeZh(chart: AstroChartWheelData): string | null {
  const body = buildTransitNatalMajorNarrativeBodyZh(chart);
  if (!body) return null;
  return body + TRANSIT_NATAL_MAJOR_NARRATIVE_CLOSING_ZH;
}
`;

writeFileSync(out, head + mid + tail, "utf8");
console.log("wrote", out);
