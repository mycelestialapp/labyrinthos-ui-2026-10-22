"use client";

import React, { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { JetBrains_Mono, Noto_Serif_SC, Playfair_Display } from "next/font/google";
import { playClick, playPortalEnter, playUnlock } from "../../lib/sfx";
import { HOME_SCREEN_MIN_HEIGHT, HOME_SCREEN_PAD_X, HOME_SCREEN_PAD_Y } from "@/lib/home-screen";
import {
  THEME_CATALOG,
  THEME_IDS,
  generateOracleLetter,
  type OracleLetter,
  type OracleMood,
  type OracleTheme,
} from "../../lib/oracle";
import HomeScreenFooter from "./HomeScreenFooter";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Header / Mandate：JetBrains Mono
const jetMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** 中文正文：Noto Serif SC（Google 版思源宋体），与 Playfair 叠用 */
const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

/** 神谕正文：Playfair Display + 思源宋体系（及本地字体名回退）；字间距在使用处设为 0.5em */
const ORACLE_BODY_FONT_FAMILY = `${playfair.style.fontFamily}, ${notoSerifSC.style.fontFamily}, "Source Han Serif SC", "Noto Serif SC", serif`;

const ORBS = ["CHAOS", "STILLNESS", "SEEKING", "SURGE", "FISSURE"] as const;

const ORB_LABEL_ZH: Record<(typeof ORBS)[number], string> = {
  CHAOS: "混沌",
  STILLNESS: "静息",
  SEEKING: "寻迹",
  SURGE: "涌动",
  FISSURE: "裂隙",
};

const ORB_META: Record<(typeof ORBS)[number], { subtitle: string }> = {
  CHAOS: { subtitle: "混乱中的秩序" },
  STILLNESS: { subtitle: "沉静后的回响" },
  SEEKING: { subtitle: "迷雾里的指针" },
  SURGE: { subtitle: "跃迁前的脉冲" },
  FISSURE: { subtitle: "裂隙中的微光" },
};

function arcTrail(startX: number, startY: number, endX: number, endY: number) {
  const points = 30;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t - 120 * t * (1 - t);
    xs.push(x);
    ys.push(y);
  }
  return { xs, ys };
}

const THEME_TILE_CONTENT: Record<
  OracleTheme,
  {
    observe: string;
    impression: string;
    carry: string; // “轻行”那段：宜/忌合并成一句更适合塞进按键
  }
> = {
  ORDER_REBUILD: {
    observe: "观照：房间、日程、关系里，同时有几件事在漏。",
    impression: "印心：塌的不是你，是旧办法扛不住现在的体量；先减负，再谈重建。",
    carry: "轻行：宜：把桌面清空到只剩一件正在做的事。忌：今天新开三条长线。",
  },
  EMOTION_REPAIR: {
    observe: "观照：胸口发紧，像有人把湿毛巾压在那里。",
    impression: "印心：哭、发抖、发呆，都是神经系统在排水；不必给情绪写判决书。",
    carry: "轻行：宜：用温水洗脸，顺便把毛巾拧干挂好。忌：追问自己「我为什么还这样」。",
  },
  BOUNDARY: {
    observe: "观照：消息提示一响，你的肩就先耸起来。",
    impression: "印心：不回不是冷漠，是把电留给自己；解释常常换来二次索取。",
    carry: "轻行：宜：把非紧急群聊静音到明天中午。忌：为维持和气而秒回。",
  },
  MOMENTUM: {
    observe: "观照：清单很长，人却像卡在第一个字上。",
    impression: "印心：低压时别谈志向，先让手碰到一件具体物；动一下，回路才会亮。",
    carry: "轻行：宜：用计时器做 7 分钟，只处理一件小事。忌：盯着整张清单自责。",
  },
  DECISION: {
    observe: "观照：两个选项各有利弊，脑子像在拉锯。",
    impression: "印心：信息够了还在磨，多半是怕承担后果；先选「此刻更不后悔的那条」。",
    carry: "轻行：宜：写两行：选 A 的最坏结果 / 选 B 的最坏结果，然后定一个。忌：再找第三个人替你背锅。",
  },
  RESOURCE_FLOW: {
    observe: "观照：一花钱就心慌，一存钱又觉得自己可怜。",
    impression: "印心：匮乏感会把账目读成判决书；数字只是事实，不是你的身价。",
    carry: "轻行：宜：打开账单，只核对本周三笔固定支出。忌：翻旧账算「我亏了多少」。",
  },
  CAREER_PATH: {
    observe: "观照：努力在，反馈不在；像对着山谷喊话。",
    impression: "印心：瓶颈常常是技能粒度太粗；把「我会」拆成「我能重复做出来」。",
    carry: "轻行：宜：今天只练一个基础动作，做满二十次。忌：在公开场合诉苦换同情。",
  },
  BODY_RHYTHM: {
    observe: "观照：眼皮发沉，却还在用短视频硬撑清醒。",
    impression: "印心：疲惫时社交是加倍耗电；关机不是堕落，是维修。",
    carry: "轻行：宜：提前关灯，躺平听一段白噪音 10 分钟。忌：为了「像正常人」硬赴约。",
  },
  CREATION: {
    observe: "观照：脑子里很吵，落笔却一片空白。",
    impression: "印心：好作品常从垃圾草稿开始；先弄脏纸，再谈像不像样。",
    carry: "轻行：宜：设定闹钟 5 分钟，写满半页废话不停笔。忌：边写边改第一句。",
  },
  CYCLE_END: {
    observe: "观照：你还在给已经结束的关系交租——时间、情绪、幻想。",
    impression: "印心：结束不需要仪式感的完美句点；沉默的句号也是句号。",
    carry: "轻行：宜：删掉一个不再使用的聊天置顶或收藏夹。忌：把旧对话从头翻到尾。",
  },
  SYNCHRONICITY: {
    observe: "观照：计划被打断，你立刻判定「今天废了」。",
    impression: "印心：偶发失序里会夹带新路——不是玄学，是你终于有空看见旁枝。",
    carry: "轻行：宜：绕路回家时故意走一条没走过的街，记下三个细节。忌：用加速奔跑报复意外。",
  },
  SOUL_INTEGRATION: {
    observe: "观照：你讨厌自己身上软、慢、怂的那部分。",
    impression: "印心：阴影不是敌人，是还没被安置的旧伤；赶它走，它会更大声。",
    carry: "轻行：宜：对镜子说三句事实：「我累了」「我还在」「这就够」。忌：用侮辱性外号骂自己。",
  },
};

export default function CosmicEnvelope() {
  const [selected, setSelected] = useState<number | null>(null);
  const [opened, setOpened] = useState(false);
  const [trailKey, setTrailKey] = useState(0);
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null);
  const [bgPulseKey, setBgPulseKey] = useState(0);
  const [letter, setLetter] = useState<OracleLetter | null>(null);
  /** 主题矩阵 hover（2×6 格内收光晕） */
  const [hoverThemeIdx, setHoverThemeIdx] = useState<number | null>(null);

  const trail = useMemo(() => {
    if (selected === null) return null;
    // 5个光点大致布局：-160 -80 0 80 160，注入到上方封印中心
    const startX = -160 + selected * 80;
    return arcTrail(startX, 0, 0, -235);
  }, [selected]);

  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const glowXRaw = useMotionValue(50);
  const glowYRaw = useMotionValue(50);
  const tiltX = useSpring(tiltXRaw, { stiffness: 160, damping: 18, mass: 0.3 });
  const tiltY = useSpring(tiltYRaw, { stiffness: 160, damping: 18, mass: 0.3 });
  const glowX = useSpring(glowXRaw, { stiffness: 160, damping: 20, mass: 0.35 });
  const glowY = useSpring(glowYRaw, { stiffness: 160, damping: 20, mass: 0.35 });
  const specX = useTransform(glowX, (v) => `${v}%`);
  const specY = useTransform(glowY, (v) => `${v}%`);
  const chartOffsetX = useTransform(tiltY, (v) => v * 1.6);
  const chartOffsetY = useTransform(tiltX, (v) => v * 1.2);

  const resolveUserSeed = () => {
    try {
      const raw = window.localStorage.getItem("user_profile");
      return raw || "guest-seed";
    } catch {
      return "guest-seed";
    }
  };

  return (
    <motion.section
      className={`relative flex w-full flex-col ${HOME_SCREEN_MIN_HEIGHT} ${HOME_SCREEN_PAD_Y}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {/* 确保 next/font 注入 Playfair + Noto Serif SC（供神谕正文 fontFamily 字符串使用） */}
      <span className={`sr-only ${playfair.className}`} aria-hidden>
        .
      </span>
      <span className={`sr-only ${notoSerifSC.className}`} aria-hidden>
        .
      </span>
      <div
        className="pointer-events-none absolute inset-0 z-[0]"
        style={{
          background:
            "radial-gradient(circle at 44% 40%, #0D0B1F 0%, #080713 48%, #050505 100%)",
        }}
      />
      {/* 星尘颗粒感 */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        animate={{ scale: opened ? [1, 0.95, 1.05] : 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1]"
          animate={{ opacity: [0.18, 0.26, 0.18] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.12) 0.6px, transparent 0.6px), radial-gradient(rgba(212,175,55,0.12) 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px, 42px 42px",
            backgroundPosition: "0 0, 12px 8px",
            mixBlendMode: "screen",
          }}
        />
      </motion.div>
      <div
        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col ${HOME_SCREEN_PAD_X}`}
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
        <div className="text-center">
          <div
            className={`${playfair.className} text-base md:text-lg tracking-[0.42em] text-[#d4c4a8]/95`}
            style={{ textShadow: "0 0 14px rgba(212,175,55,0.2)" }}
          >
            寰宇共振
          </div>
          <div
            className={`${playfair.className} mt-4 md:mt-5 text-4xl md:text-5xl text-[#d9c7a0]/85`}
            style={{ letterSpacing: "1em", textShadow: "0 0 16px rgba(212,175,55,0.18)" }}
          >
            寰宇信笺
          </div>
        </div>

        <motion.div
          layout
          className="relative mt-8 rounded-3xl overflow-hidden"
          animate={{ minHeight: opened ? 460 : 500 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            background:
              "radial-gradient(circle at 50% 46%, rgba(212,175,55,0.1) 0%, rgba(62,45,82,0.2) 38%, rgba(17,14,34,0.78) 62%, rgba(10,10,17,0.82) 100%), linear-gradient(135deg, rgba(17,14,34,0.74) 0%, rgba(10,10,17,0.68) 100%)",
            backdropFilter: "blur(60px) saturate(125%)",
            WebkitBackdropFilter: "blur(60px) saturate(125%)",
            boxShadow:
              "0 0 0 0.5px rgba(144,117,62,0.5), 0 24px 74px rgba(0,0,0,0.45)",
          }}
        >
          {/* 1px 实体厚度边（流金） */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[8] w-px bg-gradient-to-b from-[#c39d55]/25 via-[#e0be78]/65 to-[#8b6a36]/25" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[8] w-px bg-gradient-to-b from-[#c39d55]/25 via-[#e0be78]/65 to-[#8b6a36]/25" />

          {/* Specular highlight follows tilt */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[6]"
            style={{
              background:
                "radial-gradient(220px circle at var(--sx) var(--sy), rgba(255,233,176,0.16), rgba(255,233,176,0.04) 42%, rgba(0,0,0,0) 72%)",
              ["--sx" as string]: specX,
              ["--sy" as string]: specY,
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 z-[4]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(17,12,29,0.12) 46%, rgba(6,4,12,0.36) 100%)",
            }}
          />
          {/* 0.5px 暗金呼吸边线 */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 rounded-3xl border"
            animate={{ borderColor: ["rgba(144,117,62,0.38)", "rgba(197,166,104,0.62)", "rgba(144,117,62,0.38)"] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ borderWidth: 0.5 }}
          />
          {/* Muted gold etched grain */}
          <div
            className="pointer-events-none absolute inset-0 z-[5] rounded-3xl"
            style={{
              opacity: 0.12,
              backgroundImage:
                "radial-gradient(rgba(184,149,85,0.5) 0.5px, transparent 0.7px), radial-gradient(rgba(84,65,35,0.35) 0.4px, transparent 0.6px)",
              backgroundSize: "2px 2px, 3px 3px",
              mixBlendMode: "soft-light",
            }}
          />
          {/* 空间暗场 */}
          <motion.div
            key={`bg-pulse-${bgPulseKey}`}
            className="pointer-events-none absolute inset-0 z-[2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.62, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle at 50% 44%, rgba(235,205,132,0.28) 0%, rgba(235,205,132,0.1) 24%, rgba(0,0,0,0) 60%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(39,30,70,0.25)_0%,rgba(13,11,31,0.22)_54%,rgba(0,0,0,0)_86%)]" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, rgba(153,120,54,0.20) 0%, rgba(73,57,30,0.08) 38%, rgba(0,0,0,0) 74%)",
            }}
          />
          {/* 古老星图底纹（低透明 + 蚀刻颗粒） */}
          <motion.svg
            viewBox="0 0 1000 700"
            className="pointer-events-none absolute inset-0 z-[7] h-full w-full"
            style={{ opacity: 0.08, x: chartOffsetX, y: chartOffsetY }}
          >
            <defs>
              <filter id="ancientNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="19" />
                <feDisplacementMap in="SourceGraphic" scale="0.9" />
              </filter>
            </defs>
            <g fill="none" stroke="rgba(170,138,78,0.74)" strokeWidth="0.7" filter="url(#ancientNoise)">
              <circle cx="500" cy="350" r="120" />
              <circle cx="500" cy="350" r="178" />
              <circle cx="500" cy="350" r="236" />
              <circle cx="500" cy="350" r="296" />
              <ellipse cx="500" cy="350" rx="360" ry="210" transform="rotate(-14 500 350)" />
              <ellipse cx="500" cy="350" rx="360" ry="210" transform="rotate(14 500 350)" />
              <path d="M170 418 C280 220, 420 178, 560 214 S822 358, 900 246" />
              <path d="M120 518 C280 428, 420 468, 600 398 S842 268, 922 318" />
              <path d="M210 210 L340 290 L470 240 L610 320 L760 260" />
              <path d="M248 248 L500 350 L752 248" />
              <path d="M248 452 L500 350 L752 452" />
            </g>
            <g fill="none" stroke="rgba(170,138,78,0.66)" strokeWidth="0.55" filter="url(#ancientNoise)">
              <path d="M500 54 L500 646" />
              <path d="M204 350 L796 350" />
              <path d="M376 166 L624 166" />
              <path d="M376 534 L624 534" />
              <path d="M440 112 L448 126 M552 126 L560 112 M440 588 L448 574 M552 574 L560 588" />
            </g>
            <g fill="rgba(196,161,95,0.9)">
              <circle cx="340" cy="290" r="1.4" />
              <circle cx="470" cy="240" r="1.2" />
              <circle cx="610" cy="320" r="1.4" />
              <circle cx="760" cy="260" r="1.3" />
              <circle cx="500" cy="350" r="1.8" />
              <circle cx="248" cy="248" r="1.2" />
              <circle cx="752" cy="248" r="1.2" />
              <circle cx="248" cy="452" r="1.2" />
              <circle cx="752" cy="452" r="1.2" />
            </g>
          </motion.svg>

          {/* 四角炼金术符文（浮雕） */}
          {[
            { pos: "left-3 top-3", type: "relicA" },
            { pos: "right-3 top-3", type: "relicB" },
            { pos: "right-3 bottom-3", type: "relicA" },
            { pos: "left-3 bottom-3", type: "relicB" },
          ].map((c) => (
            <div
              key={c.pos}
              className={`pointer-events-none absolute z-40 ${c.pos} h-20 w-20 opacity-85`}
            >
              <svg viewBox="0 0 64 64" className="h-full w-full">
                <defs>
                  <filter id={`noise-${c.type}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
                    <feDisplacementMap in="SourceGraphic" scale="0.6" />
                  </filter>
                </defs>
                <g
                  fill="none"
                  stroke="rgba(188,151,82,0.86)"
                  strokeWidth="0.9"
                  style={{
                    filter:
                      "drop-shadow(0 1px 1px rgba(0,0,0,0.58)) drop-shadow(0 2px 3px rgba(0,0,0,0.42)) drop-shadow(0 0 4px rgba(180,145,78,0.28))",
                  }}
                  filter={`url(#noise-${c.type})`}
                >
                  {c.type === "relicA" ? (
                    <>
                      {/* 仿图1：古金符文（竖骨+三横+拱足） */}
                      <path d="M32 8 v42" />
                      <path d="M16 16 h32" />
                      <path d="M14 24 h36" />
                      <path d="M12 33 h40" />
                      <path d="M18 52 q6 -10 14 -10" />
                      <path d="M46 52 q-6 -10 -14 -10" />
                      <path d="M32 6 l4 4 h-8 z" />
                      <path d="M26 40 h12" opacity="0.8" />
                      {/* 裂纹 */}
                      <path d="M38 18 l-4 8 l3 7 l-6 9" opacity="0.6" />
                      <path d="M24 29 l5 6 l-3 5" opacity="0.55" />
                    </>
                  ) : null}
                  {c.type === "relicB" ? (
                    <>
                      {/* 仿图2：哥特符文（双竖骨+斜切） */}
                      <path d="M18 52 v-34 l10 -8 v42" />
                      <path d="M46 52 v-34 l-10 -8 v42" />
                      <path d="M28 24 l8 -6 M36 32 l-8 6" />
                      <path d="M20 14 h10 M34 14 h10" />
                      <path d="M26 52 h12" />
                      {/* 裂纹 */}
                      <path d="M34 18 l-3 8 l4 8 l-4 10" opacity="0.62" />
                      <path d="M22 36 l5 5 l-2 5" opacity="0.55" />
                    </>
                  ) : null}
                </g>
              </svg>
            </div>
          ))}

          {/* 仪式光环 */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[170px] z-0 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9c7a3f]/35"
            animate={{ rotate: [0, 360], opacity: [0.26, 0.38, 0.26] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />

          {/* 蜡封呼吸光 */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[185px] z-20 h-20 w-20 -translate-x-1/2 rounded-full"
            animate={{ opacity: [0.22, 0.5, 0.22], scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(circle, rgba(174,131,54,0.35) 0%, rgba(174,131,54,0) 70%)",
              filter: "blur(15px)",
            }}
          />

          {/* 3D 信封：关闭时居中门体，开启后扩成整张主卡 */}
          <motion.div
            className="relative z-10 mt-2 flex w-full items-center justify-center"
            initial={false}
            animate={{ height: opened ? 590 : 420, y: opened ? -4 : -22 }}
            transition={{ duration: 0.86, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="relative"
              initial={false}
              animate={{
                width: opened ? "calc(100% - 24px)" : "min(920px, 96%)",
                height: opened ? "calc(100% - 12px)" : 340,
              }}
              transition={{ duration: 0.86, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "1200px" }}
            >
            {/* 内层长方形：流动金色边线 */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[18] rounded-[24px]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 9.5, repeat: Infinity, ease: "linear" }}
              style={{
                background:
                  "linear-gradient(120deg, rgba(212,175,55,0.08) 0%, rgba(246,224,161,0.86) 35%, rgba(212,175,55,0.12) 55%, rgba(212,175,55,0.08) 100%)",
                backgroundSize: "200% 200%",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                padding: "1px",
                filter: "drop-shadow(0 0 8px rgba(212,175,55,0.38))",
              }}
            />

            {/* 门内古老星图/符文纹理（底层） */}
            <svg
              viewBox="0 0 1200 600"
              className="pointer-events-none absolute inset-0 z-[9] h-full w-full opacity-20"
            >
              <g fill="none" stroke="rgba(192,156,86,0.38)" strokeWidth="0.8">
                <circle cx="600" cy="300" r="120" />
                <circle cx="600" cy="300" r="190" />
                <ellipse cx="600" cy="300" rx="310" ry="180" />
                <path d="M220 340 L360 250 L500 310 L630 220 L760 290 L930 220" />
                <path d="M250 420 C380 280, 540 450, 720 330 S930 260, 980 310" />
                <path d="M600 120 L600 480" />
              </g>
              <g fill="rgba(212,175,90,0.72)">
                <circle cx="360" cy="250" r="2" />
                <circle cx="500" cy="310" r="1.8" />
                <circle cx="630" cy="220" r="2" />
                <circle cx="760" cy="290" r="1.8" />
                <circle cx="600" cy="300" r="2.4" />
              </g>
            </svg>

            {/* 门内显性符文层（高可见） */}
            <motion.svg
              viewBox="0 0 1200 600"
              className="pointer-events-none absolute inset-0 z-[16] h-full w-full"
              animate={{ opacity: opened ? 0.42 : 0.56 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <defs>
                <filter id="etchedRune">
                  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="13" />
                  <feDisplacementMap in="SourceGraphic" scale="1.2" />
                </filter>
                <filter id="noise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="23" />
                  <feDisplacementMap in="SourceGraphic" scale="0.7" />
                </filter>
              </defs>
              {/* 远古环形星盘：交错金属轨道 + 星点连线 */}
              <g fill="none" filter="url(#noise)">
                <ellipse cx="600" cy="300" rx="168" ry="118" stroke="rgba(196,158,87,0.75)" strokeWidth="12" />
                <ellipse cx="600" cy="300" rx="168" ry="118" transform="rotate(58 600 300)" stroke="rgba(196,158,87,0.72)" strokeWidth="12" />
                <ellipse cx="600" cy="300" rx="168" ry="118" transform="rotate(-58 600 300)" stroke="rgba(196,158,87,0.72)" strokeWidth="12" />
                <ellipse cx="600" cy="300" rx="214" ry="74" transform="rotate(22 600 300)" stroke="rgba(182,145,79,0.66)" strokeWidth="10" />
                <ellipse cx="600" cy="300" rx="214" ry="74" transform="rotate(-22 600 300)" stroke="rgba(182,145,79,0.66)" strokeWidth="10" />
              </g>
              <g fill="none" stroke="rgba(173,138,74,0.62)" strokeWidth="0.9" filter="url(#noise)">
                <path d="M420 220 L500 256 L600 232 L700 256 L780 220" />
                <path d="M420 380 L500 344 L600 368 L700 344 L780 380" />
                <path d="M446 190 L468 222 M732 190 L710 222 M446 410 L468 378 M732 410 L710 378" />
                <path d="M600 164 L600 438" />
                <path d="M470 300 L730 300" />
              </g>
              <g fill="rgba(235,203,139,0.9)">
                <circle cx="420" cy="220" r="2.2" />
                <circle cx="500" cy="256" r="2" />
                <circle cx="600" cy="232" r="2.2" />
                <circle cx="700" cy="256" r="2" />
                <circle cx="780" cy="220" r="2.2" />
                <circle cx="420" cy="380" r="2.2" />
                <circle cx="500" cy="344" r="2" />
                <circle cx="600" cy="368" r="2.2" />
                <circle cx="700" cy="344" r="2" />
                <circle cx="780" cy="380" r="2.2" />
              </g>
              {/* 金属裂纹感 */}
              <g fill="none" stroke="rgba(112,84,45,0.62)" strokeWidth="1.2" filter="url(#noise)">
                <path d="M540 228 L552 246 L544 266 L560 284" />
                <path d="M682 334 L668 348 L674 366 L662 382" />
                <path d="M610 204 L598 220 L606 238 L594 252" />
              </g>
              {/* 宇宙心脏：极细同心环 + 跳动奇点 */}
              <g fill="none" stroke="rgba(222,184,110,0.78)" strokeWidth="0.7" filter="url(#noise)">
                <circle cx="600" cy="300" r="18" />
                <circle cx="600" cy="300" r="38" />
                <circle cx="600" cy="300" r="62" />
              </g>
              <motion.circle
                cx="600"
                cy="300"
                r="3"
                fill="rgba(244,220,167,0.95)"
                animate={{ r: [2.6, 4.2, 2.6], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* 线条交汇金尘 */}
              {[
                [600, 300],
                [520, 280],
                [680, 280],
                [512, 324],
                [688, 324],
                [420, 244],
                [780, 244],
              ].map(([x, y], idx) => (
                <motion.circle
                  key={`dust-${idx}`}
                  cx={x}
                  cy={y}
                  r="1.6"
                  fill="rgba(239,209,146,0.9)"
                  animate={{ opacity: [0.25, 0.9, 0.25] }}
                  transition={{ duration: 2.6 + idx * 0.2, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </motion.svg>

            {/* 做旧质感：岁月斑驳与刮痕 */}
            <div
              className="pointer-events-none absolute inset-0 z-[17] rounded-[24px]"
              style={{
                opacity: 0.28,
                backgroundImage:
                  "radial-gradient(circle at 50% 42%, rgba(216,182,112,0.18) 0%, rgba(216,182,112,0.05) 28%, transparent 58%), radial-gradient(circle at 18% 26%, rgba(137,109,61,0.35) 0%, transparent 28%), radial-gradient(circle at 78% 68%, rgba(137,109,61,0.28) 0%, transparent 24%), radial-gradient(circle at 0% 50%, rgba(36,28,58,0.5) 0%, transparent 44%), radial-gradient(circle at 100% 50%, rgba(36,28,58,0.5) 0%, transparent 44%), linear-gradient(112deg, transparent 0%, rgba(168,132,72,0.17) 48%, transparent 52%), linear-gradient(78deg, transparent 0%, rgba(116,88,44,0.14) 50%, transparent 54%)",
                mixBlendMode: "soft-light",
              }}
            />

            {/* 灵动力量横向划过 */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 z-[12] w-[22%]"
              animate={{ x: ["-120%", "520%"], opacity: [0, 0.45, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.22) 50%, rgba(212,175,55,0) 100%)",
                filter: "blur(8px)",
              }}
            />

            {/* 中轴竖向光缝 */}
            <motion.div
              className="pointer-events-none absolute inset-y-4 left-1/2 z-[15] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#d5b16e]/70 to-transparent"
              animate={{ opacity: opened ? 0 : 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />

            {/* 开门后淡金铺光 */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-[8]"
              animate={{ opacity: opened ? 0.56 : 0.08 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                background:
                  "radial-gradient(circle at center, rgba(212,175,55,0.34) 0%, rgba(212,175,55,0.18) 48%, rgba(0,0,0,0.04) 100%)",
              }}
            />

            <motion.div
              className="absolute inset-y-0 left-0 w-[calc(50%-0.5px)] origin-right rounded-l-[24px] border border-[#D4AF37]/18"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.24) 0%, rgba(212,175,55,0.12) 48%, rgba(120,90,34,0.18) 100%)",
                backdropFilter: "blur(14px)",
                boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.30), -8px 0 26px rgba(0,0,0,0.20)",
              }}
              animate={{
                rotateY: opened ? -74 : 0,
                x: opened ? -22 : 0,
                opacity: opened ? 0 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.div
              className="absolute inset-y-0 right-0 w-[calc(50%-0.5px)] origin-left rounded-r-[24px] border border-[#D4AF37]/18"
              style={{
                background:
                  "linear-gradient(225deg, rgba(212,175,55,0.24) 0%, rgba(212,175,55,0.12) 48%, rgba(120,90,34,0.18) 100%)",
                backdropFilter: "blur(14px)",
                boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.30), 8px 0 26px rgba(0,0,0,0.20)",
              }}
              animate={{
                rotateY: opened ? 74 : 0,
                x: opened ? 22 : 0,
                opacity: opened ? 0 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* 开门后：淡金面板铺满整块大矩形 */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-[11] rounded-[24px]"
              initial={false}
              animate={{
                opacity: opened ? 1 : 0,
                scale: opened ? 1 : 0.72,
              }}
              transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.24) 44%, rgba(166,126,52,0.2) 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(212,175,55,0.5), inset 0 0 72px rgba(212,175,55,0.24), 0 0 62px rgba(212,175,55,0.14)",
                backdropFilter: "blur(12px)",
              }}
            />

            {/* 展开后文案：直接出现在铺满后的整卡内部 */}
            {opened ? (
              <motion.div
                className="absolute inset-0 z-[22] overflow-y-auto px-2 py-2.5 md:px-2.5 md:py-2.5
                  [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
                }}
              >
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-full"
                  animate={{ x: ["-110%", "130%"] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
                  style={{
                    background:
                      "linear-gradient(105deg, rgba(212,175,55,0) 42%, rgba(212,175,55,0.15) 50%, rgba(212,175,55,0) 58%)",
                  }}
                />
                {(letter
                  ? ([
                      { k: "hdr", mono: true, main: false, text: letter.header },
                      { k: "thm", mono: true, main: false, text: `[主题：${letter.themeLabel}]` },
                      {
                        k: "main",
                        mono: false,
                        main: true,
                        text: THEME_TILE_CONTENT[letter.theme].observe,
                      },
                      {
                        k: "nrg",
                        mono: true,
                        main: false,
                        text: `[能量参数：${letter.colorId} ${letter.colorHex} / ${letter.numberId} ${letter.numberValue}]`,
                      },
                      {
                        k: "mdt",
                        mono: true,
                        main: false,
                        text: "[ 敕令 ]",
                      },
                      { k: "ido", mono: false, main: false, text: THEME_TILE_CONTENT[letter.theme].impression },
                      { k: "idn", mono: false, main: false, text: THEME_TILE_CONTENT[letter.theme].carry },
                    ] as const)
                  : ([
                      { k: "hdr", mono: true, main: false, text: "[页眉：加密身份]" },
                      { k: "thm", mono: true, main: false, text: "[主题：档案未启封]" },
                      { k: "main", mono: false, main: true, text: "[主文：模糊不可读]" },
                      { k: "nrg", mono: true, main: false, text: "[能量参数：C-XX / N-XX]" },
                      { k: "mdt", mono: true, main: false, text: "[ 敕令 ]" },
                      { k: "ido", mono: false, main: false, text: "[宜：… · 宜：…]" },
                      { k: "idn", mono: false, main: false, text: "[忌：… · 忌：…]" },
                      { k: "cls", mono: false, main: false, text: "[页脚：行动句]" },
                    ] as const)
                ).map((row, idx) => {
                  const { mono, main, text, k } = row;
                  const marginTop = idx === 0 ? "mt-0" : main ? "mt-6" : "mt-4";
                  const serifBody =
                    !mono &&
                    (() => {
                      if (main) {
                        return {
                          fontFamily: ORACLE_BODY_FONT_FAMILY,
                          letterSpacing: "0.8em",
                        } as const;
                      }
                      return {
                        fontFamily: ORACLE_BODY_FONT_FAMILY,
                        letterSpacing: "0.5em",
                      } as const;
                    })();
                  return (
                    <motion.div
                      key={k}
                      lang={mono ? undefined : "zh-Hans"}
                      variants={{
                        hidden: { opacity: 0, y: 12, filter: "blur(20px)" },
                        show: { opacity: 1, y: 0, filter: "blur(0px)" },
                      }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      onAnimationStart={() => {
                        // 文本每一行淡入时，触发一次极低频脉冲震动音
                        if (opened) void playPortalEnter();
                      }}
                      className={`${mono ? `${jetMono.className} tracking-[0.34em]` : ""} ${marginTop} ${
                        main
                          ? "text-2xl md:text-3xl text-[#fff6e6] leading-[1.55]"
                          : k === "hdr"
                            ? "text-[10px] text-zinc-300/70 leading-none opacity-40"
                            : k === "mdt"
                              ? "text-[10px] text-zinc-300/70 leading-none"
                              : "text-sm text-[#f3ead7] leading-relaxed"
                      }`}
                      style={{
                        textShadow: "0 0 14px rgba(212,175,55,0.12)",
                        ...(mono
                          ? {}
                          : (serifBody as React.CSSProperties)),
                      }}
                    >
                      {text}
                    </motion.div>
                  );
                })}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
                    show: { opacity: 1, y: 0, filter: "blur(0px)" },
                  }}
                className="mt-8 flex w-full justify-center px-0 pb-0"
                >
                  {/* 2×6：两排紧凑呈现“观照/印心/轻行”文案（通过 line-clamp 控高度） */}
                  <div className="grid w-full max-w-[720px] grid-cols-6 grid-rows-2 gap-x-2 gap-y-2 md:max-w-[820px] md:gap-x-2.5 md:gap-y-2.5">
                    {THEME_CATALOG.map((theme, idx) => {
                      const active = letter?.themeLabel === theme;
                      const hovered = !active && hoverThemeIdx === idx;
                      const num = String(idx + 1).padStart(2, "0");
                      const themeTip = `${theme}（${THEME_IDS[idx]}）`;
                      const cellShadow = active
                        ? "inset 0 0 0 0.7px rgba(230,210,170,0.92), inset 0 0 30px rgba(196,165,116,0.28), 0 0 28px rgba(212,175,55,0.10)"
                        : hovered
                          ? "inset 0 0 0 0.6px rgba(212,185,130,0.70), inset 0 0 26px rgba(196,165,116,0.16), 0 0 22px rgba(212,175,55,0.07)"
                          : "inset 0 0 0 0.6px rgba(196,165,116,0.40), 0 0 18px rgba(212,175,55,0.04)";
                      return (
                        <button
                          key={theme}
                          type="button"
                          title={themeTip}
                          onClick={() => {
                            if (selected === null) return;
                            const mood = ORBS[selected] as OracleMood;
                            const next = generateOracleLetter({
                              mood,
                              date: new Date(),
                              userSeed: resolveUserSeed(),
                              forcedTheme: THEME_IDS[idx],
                            });
                            setLetter(next);
                          }}
                          onMouseEnter={() => setHoverThemeIdx(idx)}
                          onMouseLeave={() => setHoverThemeIdx((h) => (h === idx ? null : h))}
                          className={`flex flex-col items-center gap-[4px] rounded-xl border border-[#D4AF37]/25 bg-black/30 px-1.5 py-1.5 text-center transition-[transform,box-shadow,border-color,background-color] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:bg-black/35 md:px-2 md:py-1 ${
                            active ? "scale-[0.99]" : "hover:scale-[0.98]"
                          }`}
                          style={{
                            cursor: "pointer",
                            boxShadow: cellShadow,
                            minHeight: 0,
                            background: active
                              ? "linear-gradient(180deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.06) 100%)"
                              : hovered
                                ? "linear-gradient(180deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.05) 100%)"
                                : "rgba(5,4,12,0.26)",
                            backdropFilter: "blur(12px)",
                          }}
                        >
                          <span
                            className={`${jetMono.className} text-[0.56rem] font-medium leading-none tracking-[0.14em] text-[#d4b574]/82`}
                          >
                            {num}
                          </span>
                          <span
                            className={`${notoSerifSC.className} line-clamp-1 text-[11px] font-semibold leading-[1.05] tracking-[0.05em] text-[#f3ead7]/94`}
                          >
                            {theme}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
                <motion.button
                  type="button"
                  onClick={() => {
                    setOpened(false);
                    setSelected(null);
                    setLetter(null);
                    setHoverThemeIdx(null);
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 rounded-full border border-[#b8924f]/55 px-5 py-2 text-[11px] tracking-[0.3em] text-[#e8d8b4]"
                  style={{ boxShadow: "0 0 14px rgba(184,146,79,0.22)" }}
                >
                  RETURN
                </motion.button>
              </motion.div>
            ) : null}
            </motion.div>
          </motion.div>

          {/* 对开拉伸叶片（气场辅助） */}
          <motion.div
            className="absolute inset-x-0 top-0 z-10 h-1/2 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"
            animate={{ y: opened ? -72 : 0, opacity: opened ? 0 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
            animate={{ y: opened ? 72 : 0, opacity: opened ? 0 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* 调频点 */}
          {!opened ? (
            <div className="relative z-20 px-2 pb-10 pt-2 md:pb-12">
              <div
                className={`${playfair.className} text-center text-sm md:text-base tracking-[0.28em] text-[#e6d5b8]`}
                style={{ textShadow: "0 0 14px rgba(153,120,54,0.28)" }}
              >
                选择你当下的灵频
              </div>
              <div className="mt-8 flex flex-wrap items-end justify-center gap-x-10 gap-y-6 md:gap-x-12 md:gap-y-7 lg:gap-x-14">
                {ORBS.map((name, i) => (
                  <motion.button
                    key={name}
                    type="button"
                    onClick={async () => {
                      await playClick();
                      const mood = ORBS[i] as OracleMood;
                      const nextLetter = generateOracleLetter({
                        mood,
                        date: new Date(),
                        userSeed: resolveUserSeed(),
                      });
                      setLetter(nextLetter);
                      setSelected(i);
                      setTrailKey((k) => k + 1);
                      setBgPulseKey((k) => k + 1);
                      await new Promise((resolve) => setTimeout(resolve, 520));
                      await playUnlock();
                      setOpened(true);
                      window.dispatchEvent(new CustomEvent("star:scene-shift", { detail: { x: 16, y: -10 } }));
                    }}
                    className="group flex min-w-[4.5rem] flex-col items-center gap-3 md:min-w-[5.25rem] md:gap-3.5"
                    onHoverStart={() => setHoveredOrb(i)}
                    onHoverEnd={() => setHoveredOrb((prev) => (prev === i ? null : prev))}
                    whileTap={{ scale: 0.96 }}
                  >
                    <motion.span
                      className="relative block h-9 w-9 rounded-full md:h-11 md:w-11"
                      animate={
                        name === "CHAOS"
                          ? { x: [0, -2.6, 2.8, -1.8, 1.6, 0], y: [0, 1.8, -1.4, 1.2, -1, 0], opacity: [0.4, 1, 0.35] }
                          : name === "STILLNESS"
                            ? { scale: [0.92, 1, 0.92], opacity: [0.35, 0.75, 0.35] }
                            : name === "SEEKING"
                              ? { scale: [0.88, 1.08, 0.88], opacity: [0.45, 0.9, 0.45] }
                              : name === "SURGE"
                                ? { y: [0, -3.2, 0], opacity: [0.5, 1, 0.5] }
                                : { opacity: [0.4, 0.95, 0.4], scale: [0.95, 1.02, 0.95] }
                      }
                      transition={{
                        duration: name === "CHAOS" ? 0.38 : name === "STILLNESS" ? 4.2 : 2.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        background:
                          name === "CHAOS"
                            ? "radial-gradient(circle, rgba(255,230,170,1) 0%, rgba(120,79,174,0.7) 55%, rgba(71,43,112,0.2) 100%)"
                            : name === "STILLNESS"
                              ? "radial-gradient(circle, rgba(255,235,180,1) 0%, rgba(94,130,201,0.55) 58%, rgba(58,82,138,0.12) 100%)"
                              : name === "SURGE"
                                ? "radial-gradient(circle, rgba(255,248,218,1) 0%, rgba(255,227,161,0.85) 50%, rgba(180,130,56,0.2) 100%)"
                                : name === "FISSURE"
                                  ? "radial-gradient(circle, rgba(255,232,198,1) 0%, rgba(208,132,164,0.62) 58%, rgba(128,70,95,0.2) 100%)"
                                  : "radial-gradient(circle, rgba(255,236,190,1) 0%, rgba(182,148,83,0.72) 55%, rgba(95,72,34,0.2) 100%)",
                        boxShadow:
                          name === "STILLNESS"
                            ? "0 0 40px rgba(115,152,230,0.55), 0 0 18px rgba(225,201,149,0.35)"
                            : name === "CHAOS"
                              ? "0 0 28px rgba(123,84,186,0.6), 0 0 16px rgba(238,204,145,0.35)"
                              : name === "FISSURE"
                                ? "0 0 24px rgba(201,124,156,0.52), 0 0 14px rgba(238,204,145,0.32)"
                                : "0 0 24px rgba(236,202,136,0.52), 0 0 14px rgba(255,244,216,0.32)",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                      }}
                    >
                      <span className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff4da] md:h-3 md:w-3" />
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.35, 0, 0.35] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        style={{
                          background:
                            "radial-gradient(circle, rgba(214,184,120,0.45) 0%, rgba(170,137,69,0) 70%)",
                        }}
                      />
                      {name === "SURGE" ? (
                        <>
                          <motion.span
                            className="pointer-events-none absolute left-1/2 top-0 h-[2px] w-[2px] -translate-x-1/2 rounded-full bg-[#ffe9b9]"
                            animate={{ y: [0, -22, -36], opacity: [0, 1, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
                          />
                          <motion.span
                            className="pointer-events-none absolute left-1/2 top-0 h-[1.8px] w-[1.8px] -translate-x-1/2 rounded-full bg-[#fff6de]"
                            animate={{ x: [0, 3, -2], y: [0, -18, -28], opacity: [0, 0.9, 0] }}
                            transition={{ duration: 1.05, repeat: Infinity, ease: "easeOut", delay: 0.15 }}
                          />
                        </>
                      ) : null}
                      {name === "FISSURE" ? (
                        <motion.span
                          className="pointer-events-none absolute left-1/2 top-1/2 h-[14px] w-px -translate-x-1/2 -translate-y-1/2 bg-[#f4d5df] md:h-[18px]"
                          animate={{ rotate: [22, 28, 18, 24], opacity: [0.35, 0.8, 0.35] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ) : null}
                    </motion.span>
                    <span
                      className={`${playfair.className} text-xs tracking-[0.28em] text-[#dcc9a4] group-hover:text-[#f0e4c8] md:text-sm md:tracking-[0.3em]`}
                      style={{ textShadow: "0 0 8px rgba(153,120,54,0.18)" }}
                    >
                      {ORB_LABEL_ZH[name]}
                    </span>
                    <motion.span
                      className={`${playfair.className} text-[10px] tracking-[0.22em] text-[#b8a583]/85 md:text-[11px]`}
                      initial={false}
                      animate={{ opacity: hoveredOrb === i ? 0.88 : 0, y: hoveredOrb === i ? 0 : -2 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {ORB_META[name].subtitle}
                    </motion.span>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : null}

          {/* 粒子流注入 */}
          {trail && !opened ? (
            <motion.div
              key={`trail-${trailKey}`}
              className="pointer-events-none absolute left-1/2 bottom-[118px] z-30 md:bottom-[128px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.78, ease: "easeOut" }}
            >
              <motion.div
                className="h-[1.5px] w-[42px] rounded-full bg-[#f8e8b8]"
                style={{
                  boxShadow: "0 0 22px rgba(248,232,184,0.95)",
                  transformOrigin: "left center",
                }}
                animate={{ x: trail.xs, y: trail.ys, scaleX: [0.2, 1, 0.2], opacity: [0, 1, 0] }}
                transition={{ duration: 0.78, ease: "easeInOut" }}
              />
            </motion.div>
          ) : null}

          {/* 展开后文案已嵌入铺满门体内部 */}
        </motion.div>
        </div>

        <HomeScreenFooter />
      </div>
    </motion.section>
  );
}

