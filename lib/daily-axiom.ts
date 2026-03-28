import { ZODIAC_CN, type NatalBig3, type ZodiacKey } from "@/lib/natal-chart";
import { pickAxiomBySeed, type AxiomEntry } from "@/constants/axioms";

export type EnvElement = "土" | "水" | "火" | "风";

export type DailyCalibration = {
  seed: number;
  anchor: number;
  hex: string;
  axiom: AxiomEntry;
  envElement: EnvElement;
  envIntensity: number;
};

export type DeepObservationCopy = {
  anchor: string;
  spectral: string;
  manifest: string;
  envLine: string;
  statusA: string;
  statusB: string;
  statusC: string;
  collisionMeta: string;
  collisionA: string;
  collisionB: string;
  collisionC: string;
};

type DailyTemplateInput = {
  risingCn: string;
  sunCn: string;
  moonCn: string;
};

type DailyInjectionInput = {
  anchor: string;
  hex: string;
  scene: string;
  action: string;
  advice: string;
};

type TrinityStatus =
  | "FOCUS_MATCH"
  | "FOCUS_STEADY"
  | "SUN_FRICTION"
  | "SUN_BOOST"
  | "MOON_BURN"
  | "MOON_FREEZE"
  | "MOON_GROWTH"
  | "MOON_STABLE";

const SPECTRAL_PALETTE = [
  "#1A0B2E",
  "#2A1B3D",
  "#23152F",
  "#3B234A",
  "#4B2C5E",
  "#6A4A2E",
  "#C5A059",
] as const;

const ENV_ELEMENTS: readonly EnvElement[] = ["土", "水", "火", "风"];

const AxiomLibrary: Record<TrinityStatus, readonly string[]> = {
  FOCUS_MATCH: [
    "Number {{Number}} 与出生日尾数同频，说明你今天不用扩张，只要把 Sun {{Sun}} 的执行力接上就够了。",
    "今天是“对焦日”，Rising {{Rising}} 不必到处试探，盯住 Number {{Number}} 做一件事。",
    "当 Number {{Number}} 对上生日尾数，代表路就在脚下，别再分心看远处。",
  ],
  FOCUS_STEADY: [
    "今天不是秒解题的日子，先让 Rising {{Rising}} 收心，再让 Sun {{Sun}} 一步步推进。",
    "Number {{Number}} 没对上生日尾数，节奏要稳，不求快赢，只求不失误。",
    "先把 Hex {{Hex}} 当作定心色，稳住心气后再动主任务。",
  ],
  SUN_FRICTION: [
    "环境{{Env}}与 Sun {{Sun}} 不同调，今天硬冲会掉速，先减损再发力。",
    "你会感觉有点别扭，这是 Sun {{Sun}} 和外场{{Env}}顶着干，先缩动作面。",
    "外场{{Env}}压着 Sun {{Sun}}，今天赢法不是硬拼，是少犯错。",
  ],
  SUN_BOOST: [
    "环境{{Env}}托着 Sun {{Sun}}，你今天的推进效率会更高，适合定关键节点。",
    "Sun {{Sun}} 和外场{{Env}}同向，先做最难的一步，成功率会比平时高。",
    "今天是“顺风用力”型，Sun {{Sun}} 的长板值得前置。",
  ],
  MOON_BURN: [
    "环境在“灼烧” Moon {{Moon}}，你的防御会进入焦灼态，先降温再回应。",
    "Moon {{Moon}} 今天容易被火气推着走，先慢半拍，避免说重话。",
    "当 Moon {{Moon}} 被灼烧，边界比表达更重要。",
  ],
  MOON_FREEZE: [
    "环境在“冰封” Moon {{Moon}}，情绪会发木，先活动身体再做判断。",
    "Moon {{Moon}} 今天不太想动，不要自责，先从一件小事启动。",
    "当 Moon {{Moon}} 被冰封，先让自己回暖，决策才会准。",
  ],
  MOON_GROWTH: [
    "环境在滋养 Moon {{Moon}}，今天适合修复关系与补情绪账户。",
    "Moon {{Moon}} 得到外场托举，会进入情感滋养态，柔和沟通回报更高。",
    "今天先照顾感受，再推进事务，反而更快闭环。",
  ],
  MOON_STABLE: [
    "Moon {{Moon}} 今天整体稳定，守住边界就够了，不必过度解读。",
    "外场对 Moon {{Moon}} 影响中性，保持日常节律就是最优解。",
    "情绪盘面平稳，按原计划推进即可。",
  ],
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** seed = hash(userId + YYYY-MM-DD)，同日同用户绝对锁定 */
export function buildDailyCalibration(userId: string, dayKey: string): DailyCalibration {
  const seed = hashString(`${userId}${dayKey}`);
  const rand = mulberry32(seed);
  const anchor = Number((rand() * 9.9999).toFixed(4));
  const hex = SPECTRAL_PALETTE[Math.floor(rand() * SPECTRAL_PALETTE.length)]!;
  const axiom = pickAxiomBySeed(seed);
  const envElement = ENV_ELEMENTS[seed % ENV_ELEMENTS.length]!;
  const envIntensity = Number((0.35 + ((seed >>> 3) % 60) / 100).toFixed(2));
  return { seed, anchor, hex, axiom, envElement, envIntensity };
}

function zodiacElementOf(z: ZodiacKey): EnvElement {
  if (z === "TAURUS" || z === "VIRGO" || z === "CAPRICORN") return "土";
  if (z === "CANCER" || z === "SCORPIO" || z === "PISCES") return "水";
  if (z === "ARIES" || z === "LEO" || z === "SAGITTARIUS") return "火";
  return "风";
}

function buildDailyTemplate(input: DailyTemplateInput): DeepObservationCopy {
  return {
    anchor: `你[上升${input.risingCn}]今天容易分心，先把注意力收回来，让[太阳${input.sunCn}]先主导动作。`,
    spectral: `这层色值先帮你稳住[月亮${input.moonCn}]，不硬碰，先立边界。`,
    manifest: `今天按“小步闭环”执行，先做对，再做快。`,
    envLine: "",
    statusA: "",
    statusB: "",
    statusC: "",
    collisionMeta: "",
    collisionA: "",
    collisionB: "",
    collisionC: "",
  };
}

function buildDailyInjection(injection: DailyInjectionInput): DeepObservationCopy {
  return {
    anchor: `今日频率 ${injection.anchor}。`,
    spectral: `今日波长 ${injection.hex}。`,
    manifest: `今日判词：[象] ${injection.scene} / [定] ${injection.action}。${injection.advice}`,
    envLine: "",
    statusA: "",
    statusB: "",
    statusC: "",
    collisionMeta: "",
    collisionA: "",
    collisionB: "",
    collisionC: "",
  };
}

function pickLibraryLine(status: TrinityStatus, seed: number) {
  const lines = AxiomLibrary[status];
  return lines[seed % lines.length]!;
}

function fill(line: string, vars: Record<string, string>) {
  return line.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

/** Result = Template(UserStaticProfile) + Injection(DailyHashParams) */
export function buildDeepObservationCopy(
  data: DailyCalibration,
  big3: NatalBig3 | null,
  userBirthDay: number | null,
): DeepObservationCopy {
  const sunKey: ZodiacKey = big3?.sun ?? "CAPRICORN";
  const moonKey: ZodiacKey = big3?.moon ?? "CANCER";
  const risingKey: ZodiacKey = big3?.rising ?? "PISCES";
  const template = buildDailyTemplate({
    risingCn: ZODIAC_CN[risingKey],
    sunCn: ZODIAC_CN[sunKey],
    moonCn: ZODIAC_CN[moonKey],
  });
  const injection = buildDailyInjection({
    anchor: data.anchor.toFixed(4),
    hex: data.hex,
    scene: data.axiom.scene,
    action: data.axiom.action,
    advice: data.axiom.advice,
  });

  const numberTail = Number(data.anchor.toFixed(4).replace(".", "").slice(-1));
  const birthTail = userBirthDay === null ? -1 : userBirthDay % 10;
  const focusStatus: TrinityStatus =
    birthTail !== -1 && numberTail === birthTail ? "FOCUS_MATCH" : "FOCUS_STEADY";

  const sunEnvSame = zodiacElementOf(sunKey) === data.envElement;
  const sunStatus: TrinityStatus = sunEnvSame ? "SUN_BOOST" : "SUN_FRICTION";

  const moonElement = zodiacElementOf(moonKey);
  let moonStatus: TrinityStatus = "MOON_STABLE";
  if (data.envElement === "火" && moonElement === "水") moonStatus = "MOON_BURN";
  else if (data.envElement === "水" && moonElement === "火") moonStatus = "MOON_FREEZE";
  else if (
    (data.envElement === "水" && moonElement === "水") ||
    (data.envElement === "土" && moonElement === "水") ||
    (data.envElement === "风" && moonElement === "火")
  ) {
    moonStatus = "MOON_GROWTH";
  }

  const vars = {
    Sun: ZODIAC_CN[sunKey],
    Moon: ZODIAC_CN[moonKey],
    Rising: ZODIAC_CN[risingKey],
    Number: data.anchor.toFixed(4),
    Hex: data.hex,
    Env: `${data.envElement}${data.envIntensity.toFixed(2)}`,
  };

  const statusBMemo = sunStatus === "SUN_BOOST" ? "增强" : "损耗";
  const statusCMemo =
    moonStatus === "MOON_BURN"
      ? "灼烧"
      : moonStatus === "MOON_FREEZE"
        ? "冰封"
        : moonStatus === "MOON_GROWTH"
          ? "滋养"
          : "稳定";

  return {
    anchor:
      `${injection.anchor}${template.anchor}` +
      fill(pickLibraryLine(focusStatus, data.seed), vars) +
      ` [Sun:${vars.Sun}][Moon:${vars.Moon}][Rising:${vars.Rising}][Number:${vars.Number}][Hex:${vars.Hex}]`,
    spectral:
      `${injection.spectral}${template.spectral}` +
      fill(pickLibraryLine(sunStatus, data.seed >>> 1), vars) +
      ` [Sun:${vars.Sun}][Moon:${vars.Moon}][Rising:${vars.Rising}][Number:${vars.Number}][Hex:${vars.Hex}]`,
    manifest:
      `${injection.manifest}${template.manifest}` +
      fill(pickLibraryLine(moonStatus, data.seed >>> 2), vars) +
      ` [Sun:${vars.Sun}][Moon:${vars.Moon}][Rising:${vars.Rising}][Number:${vars.Number}][Hex:${vars.Hex}]`,
    envLine: `环境常量：${data.envElement} / 强度 ${data.envIntensity.toFixed(2)} / Hex ${vars.Hex} / Number ${vars.Number}`,
    statusA: `A 频率对焦：${focusStatus === "FOCUS_MATCH" ? "命中 FocusTemplate" : "稳态对焦"}`,
    statusB: `B 太阳对冲：${sunStatus === "SUN_BOOST" ? "增强分析" : "损耗分析"}`,
    statusC:
      `C 月亮防御：${
        moonStatus === "MOON_BURN"
          ? "灼烧"
          : moonStatus === "MOON_FREEZE"
            ? "冰封"
            : moonStatus === "MOON_GROWTH"
              ? "滋养"
              : "稳定"
      }`,
    collisionMeta: `[ 环境增量：${data.envElement} // 烈度：${(data.envIntensity * 10).toFixed(2)} // 波长：${vars.Hex} ]`,
    collisionA: `频率 ${vars.Number} 已锁定。注意，今日“${data.envElement}”的增量偏重，你的 [上升${vars.Rising}] 容易被乱流带跑。锁定这个锚点，不是为了给你答案，而是为了强行关闭那些让你心散的非必要通道。`,
    collisionB: `对撞预警：今日环境正在磨损你 [太阳${vars.Sun}] 的骨架。你习惯的做法在今天更容易出现空转${statusBMemo}。别去求大，先去求准。今天少动一手，就是在为明天的动能止血。`,
    collisionC: `核心装甲评估：外界杂音对 [月亮${vars.Moon}] 的穿透力偏强（判定：${statusCMemo}）。检测到你的防御机制正在抬高负载。建议执行物理断联：不要试图理解那些无效恶意。盯住今日光谱 ${vars.Hex}，那是你今天唯一合法的安全出口。`,
  };
}
