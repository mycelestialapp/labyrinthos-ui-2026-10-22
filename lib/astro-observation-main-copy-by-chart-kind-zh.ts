/**
 * 五联观测主解读：按 ChartKindId 叠在出生盘句库上（核心快照 / 逻辑推演 / 执行备忘；原始读数里部分宫头锚点句亦随盘型）。
 * 表层「本表在说什么」与矩阵标题仍由 `astro-observation-five-chart-kind-layer-zh` 覆盖。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import { deepMergePlain } from "@/lib/astro-copy-deep-merge";
import type { AngleAspectCopyConfigZh } from "@/lib/astro-angle-aspect-copy-config-zh";
import { angleAspectNatalBaseForVoice } from "@/lib/astro-angle-aspect-natal-voice-patches-zh";
import type { MajorAspectCopyConfigZh } from "@/lib/astro-major-aspect-copy-config-zh";
import { majorAspectNatalBaseForVoice } from "@/lib/astro-major-aspect-natal-voice-patches-zh";
import type { HouseCuspCopyConfigZh } from "@/lib/astro-house-cusp-copy-config-zh";
import { houseCuspNatalBaseForVoice } from "@/lib/astro-house-cusp-natal-voice-patches-zh";
import type { MinorAspectCopyConfigZh } from "@/lib/astro-minor-aspect-copy-config-zh";
import { minorAspectNatalBaseForVoice } from "@/lib/astro-minor-aspect-natal-voice-patches-zh";
import type { PlanetPositionsCopyConfigZh } from "@/lib/astro-planet-positions-copy-config-zh";
import { PLANET_POSITIONS_MAIN_PATCH_BY_KIND } from "@/lib/astro-observation-main-copy-planet-by-kind-zh";
import { planetPositionsNatalBaseForVoice } from "@/lib/astro-planet-positions-natal-voice-patches-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const HOUSE_L3_PLAIN: object = {
  precision: {
    anchorAsc: "[ASC] 1宫 {c1} —— 出场气质：先看场合再表态",
    anchorIc: "[IC] 4宫 {c4} —— 心里踏实：家与日常根基",
    anchorDes: "[DES] 7宫 {c7} —— 一对一：边界与期待要说清",
    anchorMc: "[MC] 10宫 {c10} —— 对外名片：{mcMode}",
    turn6: "{c6} —— 日常执行：琐事与健康节奏",
    turn8: "{c8} —— 信任与共有：钱、亲密与放手",
  },
};

const HOUSE_MAIN_PATCH_BY_KIND: Record<ChartKindId, object> = {
  natal: {},
  synastry: deepMergePlain(HOUSE_L3_PLAIN, {
    answer: {
      happened:
        "案主本命：十二宫头是十二道门槛，进关系、钱、工作这些门时，默认偏紧还是偏松，案主会先这么接招。双人咬合请看合盘 Tab。",
      coreTemplate:
        "案主侧：给人的第一印象偏「{interfaceMode}」；真要动到根上的事，更像「{transformMode}」。上升在 {c1}，8 宫在 {c8}，一个是「怎么上场」，一个是「敢不敢彻底翻新」。",
      riskTemplate: "案主「自己怎么出场」和「一对一里期待的玩法」本来就不对称（上升 {c1}，下降 {c7}）。{axisRisk}",
      todayTemplate: "今天可以：跟人打交道时先记住——{todayProtocol}。别把案主习惯当成对方的默认。",
    },
    pro: {
      ascTemplate: "案主人格面（ASC / 1宫 {c1}）：对环境信号先掂量，再决定敞开多少。",
      valueAxisTemplate:
        "案主资源轴（2/8：2宫 {c2} ↔ 8宫 {c8}）：进项与共有、信任绑在一起；大钱大承诺慢一步。",
      mcTemplate: "案主社会面（MC / 10宫 {c10}）：外在可见的路线偏{mcMode}，适合边走边调。",
    },
    actions: {
      align7: "对齐 7 宫边界：合作时同步案主 7宫 {c7} 的期待，少把 1宫 {c1} 的情绪直接甩给对方。",
      clean4: "整理 4 宫根基：用 4宫 {c4} 的细致，收拾私密与日常流程，给心里腾地方。",
      release10: "释放 10 宫可见度：公众表达里保留 10宫 {c10} 的{mcMode}空间，同时补上可验证动作。",
    },
  }),
  transit: deepMergePlain(HOUSE_L3_PLAIN, {
    answer: {
      happened:
        "行运盘宫头：按当下时刻切的十二道门槛，用来理解「此刻故事从哪扇门进」，对照本命看哪些是旧题，不当终身判决书。",
      coreTemplate:
        "此刻叙事：给人的第一印象偏「{interfaceMode}」；深层翻新感更像「{transformMode}」。上升在 {c1}，8 宫在 {c8}。",
      riskTemplate: "此刻「你怎么出场」和「一对一里期待的玩法」容易拧（上升 {c1}，下降 {c7}）。{axisRisk}",
      todayTemplate: "今天可以：跟人打交道时先记住——{todayProtocol}。行运是天气，别一次盖章。",
    },
    pro: {
      ascTemplate: "此刻人格面（ASC / 1宫 {c1}）：当下对环境信号更敏感，先观察再表态。",
      valueAxisTemplate: "此刻资源轴（2/8：2宫 {c2} ↔ 8宫 {c8}）：进项与共有、信任线更吃紧或更松，看当下现场。",
      mcTemplate: "此刻社会面（MC / 10宫 {c10}）：对外可见的路线偏{mcMode}，宜小步验证。",
    },
    actions: {
      align7: "此刻合作：先对齐 7宫 {c7} 的期待，再动 1宫 {c1} 的自我表达。",
      clean4: "此刻根基：用 4宫 {c4} 整理私密与日常，给情绪降噪。",
      release10: "此刻公众面：10宫 {c10} 的{mcMode}表达配上一条可核对动作。",
    },
  }),
  ephemeris: deepMergePlain(HOUSE_L3_PLAIN, {
    answer: {
      happened:
        "时刻盘宫头：事件现场的十二道门槛，用来理解「这一刻从哪扇门进」，不接人格终身定调。",
      coreTemplate:
        "此刻剖面：第一印象偏「{interfaceMode}」；深层翻新感像「{transformMode}」。上升在 {c1}，8 宫在 {c8}。",
      riskTemplate: "现场「出场方式」和「一对一期待」容易错位（上升 {c1}，下降 {c7}）。{axisRisk}",
      todayTemplate: "可以：现场先记住——{todayProtocol}。这是切片，不是判决书。",
    },
    pro: {
      ascTemplate: "现场人格面（ASC / 1宫 {c1}）：这一刻先感受场合再表态。",
      valueAxisTemplate: "现场资源轴（2/8：2宫 {c2} ↔ 8宫 {c8}）：共有与信任在现场更敏感。",
      mcTemplate: "现场社会面（MC / 10宫 {c10}）：对外可见偏{mcMode}，宜先小步。",
    },
    actions: {
      align7: "现场一对一：先对齐 7宫 {c7}，再展开 1宫 {c1}。",
      clean4: "现场根基：借 4宫 {c4} 稳住私密与流程。",
      release10: "现场公众：10宫 {c10} 留一条可验证动作。",
    },
  }),
  secondary: deepMergePlain(HOUSE_L3_PLAIN, {
    answer: {
      happened:
        "次限宫头：年尺度推进下的十二道门槛，用来理解这几年生活各场的默认气氛，不当每日天气预报。",
      coreTemplate:
        "次限叙事：第一印象偏「{interfaceMode}」；深层翻新感像「{transformMode}」。上升在 {c1}，8 宫在 {c8}。",
      riskTemplate: "这几年「出场方式」和「一对一期待」容易长期拧（上升 {c1}，下降 {c7}）。{axisRisk}",
      todayTemplate: "可以：跟人打交道时先记住——{todayProtocol}。年景要拆成季、再拆成周。",
    },
    pro: {
      ascTemplate: "次限人格面（ASC / 1宫 {c1}）：这几年对环境信号偏谨慎或偏快，先看自己的默认。",
      valueAxisTemplate: "次限资源轴（2/8：2宫 {c2} ↔ 8宫 {c8}）：进项与共有、信任是几年里的慢变量。",
      mcTemplate: "次限社会面（MC / 10宫 {c10}）：对外路线偏{mcMode}，适合阶段式调整。",
    },
    actions: {
      align7: "几年尺度：合作里定期对齐 7宫 {c7}，少让 1宫 {c1} 情绪单方面主导。",
      clean4: "几年尺度：用 4宫 {c4} 维护根基与流程，防拖垮。",
      release10: "几年尺度：10宫 {c10} 的{mcMode}路线按季复盘一次。",
    },
  }),
  tertiary: deepMergePlain(HOUSE_L3_PLAIN, {
    answer: {
      happened:
        "三限宫头：月尺度推进下的十二道门槛，用来理解这几周生活各场的默认气氛，不当终身定调。",
      coreTemplate:
        "三限叙事：第一印象偏「{interfaceMode}」；深层翻新感像「{transformMode}」。上升在 {c1}，8 宫在 {c8}。",
      riskTemplate: "这几周「出场方式」和「一对一期待」容易拧（上升 {c1}，下降 {c7}）。{axisRisk}",
      todayTemplate: "可以：跟人打交道时先记住——{todayProtocol}。几周窗口里先小步。",
    },
    pro: {
      ascTemplate: "三限人格面（ASC / 1宫 {c1}）：这几周对环境信号反应更快或更收。",
      valueAxisTemplate: "三限资源轴（2/8：2宫 {c2} ↔ 8宫 {c8}）：共有与信任在这几周更吃现场。",
      mcTemplate: "三限社会面（MC / 10宫 {c10}）：对外可见偏{mcMode}，宜周复盘。",
    },
    actions: {
      align7: "几周尺度：合作先对齐 7宫 {c7}，再动 1宫 {c1}。",
      clean4: "几周尺度：用 4宫 {c4} 稳住起居与私密节奏。",
      release10: "几周尺度：10宫 {c10} 每周留一条可见动作。",
    },
  }),
  solar_return: deepMergePlain(HOUSE_L3_PLAIN, {
    answer: {
      happened:
        "日返宫头：这一公历年的十二道门槛，用来理解年度主题里各生活场的默认气氛，不当每日指令。",
      coreTemplate:
        "年度叙事：第一印象偏「{interfaceMode}」；深层翻新感像「{transformMode}」。上升在 {c1}，8 宫在 {c8}。",
      riskTemplate: "这一年「出场方式」和「一对一期待」容易全年拧（上升 {c1}，下降 {c7}）。{axisRisk}",
      todayTemplate: "可以：跟人打交道时先记住——{todayProtocol}。年景拆季、季拆周。",
    },
    pro: {
      ascTemplate: "年度人格面（ASC / 1宫 {c1}）：这一年对环境信号的先发反应。",
      valueAxisTemplate: "年度资源轴（2/8：2宫 {c2} ↔ 8宫 {c8}）：进项与共有、信任是全年慢变量。",
      mcTemplate: "年度社会面（MC / 10宫 {c10}）：对外路线偏{mcMode}，按季调整更稳。",
    },
    actions: {
      align7: "年度合作：按季对齐 7宫 {c7}，少让 1宫 {c1} 情绪单方面主导。",
      clean4: "年度根基：用 4宫 {c4} 维护家与流程，防全年拖垮。",
      release10: "年度公众：10宫 {c10} 的{mcMode}路线每季复盘。",
    },
  }),
  lunar_return: deepMergePlain(HOUSE_L3_PLAIN, {
    answer: {
      happened:
        "月返宫头：这一小段回归窗口里的十二道门槛，用来理解短周期里起居与情绪的接口，不当终身定调。",
      coreTemplate:
        "月返叙事：第一印象偏「{interfaceMode}」；深层翻新感像「{transformMode}」。上升在 {c1}，8 宫在 {c8}。",
      riskTemplate: "这一小段「出场方式」和「一对一期待」容易拧（上升 {c1}，下降 {c7}）。{axisRisk}",
      todayTemplate: "可以：跟人打交道时先记住——{todayProtocol}。短窗先小步。",
    },
    pro: {
      ascTemplate: "月返人格面（ASC / 1宫 {c1}）：这几天对环境信号的先发反应。",
      valueAxisTemplate: "月返资源轴（2/8：2宫 {c2} ↔ 8宫 {c8}）：共有与信任在短窗里更敏感。",
      mcTemplate: "月返社会面（MC / 10宫 {c10}）：对外可见偏{mcMode}，宜几天一复盘。",
    },
    actions: {
      align7: "短窗合作：先对齐 7宫 {c7}，再展开 1宫 {c1}。",
      clean4: "短窗根基：用 4宫 {c4} 稳住起居。",
      release10: "短窗公众：10宫 {c10} 留一条可见动作即可。",
    },
  }),
};

const MAJOR_MAIN_PATCH_BY_KIND: Record<ChartKindId, object> = {
  natal: {},
  synastry: {
    answer: {
      happenedHighPressure:
        "案主本命里主轴拉得紧：旧目标或习惯跟当下处境对不上，心里会逼案主取舍。双人互动仍以合盘为准。",
      happenedCalibrate: "案主本命里在悄悄调整：哪些事还值得投入、哪些该放手。合盘里再看相处怎么接。",
      riskWithHardTemplate:
        "{hardAspects} 这组容易非黑即白——硬顶或躺平。案主侧先找中间路，别把关系题单独押在这一屏。",
      riskNoHard: "案主侧同时惦记的事太多，脑子会「结论过载」：以为都想清了，其实还在打转。",
      synergyTemplate: "{aspect} 像一条缓冲带，能帮案主稳住情绪；与对象的互助仍以合盘为准。",
      todayTemplate:
        "先处理案主最较劲的一两组（越紧越优先），别的先记下；借钱、扩团队、大投入隔 {hours} 小时再拍板。合盘结论另看。",
    },
    pro: {
      centerTemplate: "案主本命绝对中心相位：{aspect}。性格主线围绕它展开。",
      conflictWithHardTemplate: "案主高压点：{hardAspects}。冲劲与限制同时抬升。",
      conflictNoHard: "案主侧硬相位密度有限，主要矛盾更像执行噪声而非结构对撞。",
      driveTemplate: "案主驱动力：{aspect}。意志与行动能同向，但目标要先收窄。",
    },
    actions: {
      stabilizeTemplate: "先稳住：用 {aspect} 这条线处理案主最高压的议题，事实摆清再谈情绪。",
      growthDelayTemplate: "大决定缓一缓：借贷、扩编或大额投入，统一延后 {hours} 小时复核；关系大动作看合盘。",
      burstTemplate: "单点突破：用 {aspect} 的执行力，只打一个硬任务，禁止多线并发。",
    },
  },
  transit: {
    answer: {
      happenedHighPressure:
        "行运盘里主轴拉得紧：当下现场在逼你换招，旧习惯容易卡壳。对照本命看哪些是旧题。",
      happenedCalibrate: "行运盘里在微调：哪些事此刻还值得跟、哪些可以先放手。",
      riskWithHardTemplate:
        "{hardAspects} 这组当下容易非黑即白——硬顶或躺平。中间那条路才是解药。",
      riskNoHard: "此刻惦记的事太多，脑子容易「结论过载」：以为都想清了，其实还在打转。",
      synergyTemplate: "{aspect} 像当下的缓冲带，能帮你缓一口气，别浪费这条线。",
      todayTemplate:
        "先处理此刻最较劲的一两组（越紧越优先），别的先记下；借钱、扩团队、大投入隔 {hours} 小时再拍板。",
    },
    pro: {
      centerTemplate: "行运绝对中心相位：{aspect}。当下主线围绕它展开。",
      conflictWithHardTemplate: "行运高压点：{hardAspects}。当下冲劲与限制同时抬升。",
      conflictNoHard: "行运硬相位密度有限，主要矛盾更像现场噪声而非结构对撞。",
      driveTemplate: "行运驱动力：{aspect}。此刻意志与行动能同向，目标要先收窄。",
    },
    actions: {
      stabilizeTemplate: "先稳住：用 {aspect} 处理当下最高压的议题，事实摆清再谈情绪。",
      growthDelayTemplate: "大决定缓一缓：借贷、扩编或大额投入，统一延后 {hours} 小时复核。",
      burstTemplate: "单点突破：用 {aspect} 的执行力，只打一个硬任务，禁止多线并发。",
    },
  },
  ephemeris: {
    answer: {
      happenedHighPressure:
        "这一刻盘面上主轴拉得紧：现场在逼你立刻表态或改招。用来理解切片，不当做人格判决书。",
      happenedCalibrate: "这一刻盘面在微调：哪些接口此刻敏感、哪些可以暂缓。",
      riskWithHardTemplate: "{hardAspects} 在现场容易走极端——硬顶或缩掉。先找中间动作。",
      riskNoHard: "这一刻惦记的线太多，容易现场过载：先抓一条可见动作。",
      synergyTemplate: "{aspect} 像现场的缓冲带，能帮你缓一口气。",
      todayTemplate:
        "现场先处理最紧的一两组，别的记下；涉及钱与承诺的决定，隔 {hours} 小时再拍板。",
    },
    pro: {
      centerTemplate: "此刻中心相位：{aspect}。现场力学围绕它最明显。",
      conflictWithHardTemplate: "此刻高压点：{hardAspects}。现场冲劲与限制同时抬升。",
      conflictNoHard: "此刻硬相位不多，矛盾更像场面噪声。",
      driveTemplate: "此刻驱动力：{aspect}。先收窄目标再动。",
    },
    actions: {
      stabilizeTemplate: "现场稳住：用 {aspect} 处理最烫的议题，先对齐事实。",
      growthDelayTemplate: "现场大决定：隔 {hours} 小时再复核。",
      burstTemplate: "现场单点：用 {aspect} 只完成一件硬动作。",
    },
  },
  secondary: {
    answer: {
      happenedHighPressure:
        "次限盘里主轴拉得紧：几年尺度里旧目标跟现实对不上，心里会逼你换剧本。",
      happenedCalibrate: "次限盘里在慢慢调：哪些事这几年还值得跟、哪些该放手。",
      riskWithHardTemplate:
        "{hardAspects} 在次限里容易走极端——硬扛或躺平。几年尺度更要找中间路。",
      riskNoHard: "次限里同时惦记的线太多，容易年尺度过载：先定一条主线。",
      synergyTemplate: "{aspect} 像这几年的缓冲带，能帮你稳住节奏。",
      todayTemplate:
        "先处理几年里最较劲的一两组，别的分季记下；大投入隔 {hours} 小时再拍板，并拆到季度。",
    },
    pro: {
      centerTemplate: "次限绝对中心相位：{aspect}。几年主线围绕它展开。",
      conflictWithHardTemplate: "次限高压点：{hardAspects}。几年里冲劲与限制同步抬升。",
      conflictNoHard: "次限硬相位密度有限，主要矛盾更像执行拖慢。",
      driveTemplate: "次限驱动力：{aspect}。阶段目标要先收窄。",
    },
    actions: {
      stabilizeTemplate: "年尺度稳住：用 {aspect} 处理最高压议题，按季复盘。",
      growthDelayTemplate: "年尺度大决定：隔 {hours} 小时再拍板，并写入季度检查点。",
      burstTemplate: "年尺度单点：用 {aspect} 只攻一条硬任务，别全年多线。",
    },
  },
  tertiary: {
    answer: {
      happenedHighPressure:
        "三限盘里主轴拉得紧：几周尺度里旧习惯跟现场对不上，心里会催你调整。",
      happenedCalibrate: "三限盘里在微调：哪些事这几周还跟、哪些可以先放。",
      riskWithHardTemplate: "{hardAspects} 在三限里容易走极端——硬顶或缩掉。先找中间动作。",
      riskNoHard: "这几周线太多，容易周尺度过载：先抓一条可见动作。",
      synergyTemplate: "{aspect} 像这几周的缓冲带，能帮你缓一口气。",
      todayTemplate:
        "先处理这几周最紧的一两组，别的记下；钱与承诺隔 {hours} 小时再拍板。",
    },
    pro: {
      centerTemplate: "三限绝对中心相位：{aspect}。几周主线围绕它展开。",
      conflictWithHardTemplate: "三限高压点：{hardAspects}。几周里冲劲与限制同步抬升。",
      conflictNoHard: "三限硬相位不多，矛盾更像周节奏噪声。",
      driveTemplate: "三限驱动力：{aspect}。本周目标先收窄。",
    },
    actions: {
      stabilizeTemplate: "几周尺度稳住：用 {aspect} 处理最烫的议题。",
      growthDelayTemplate: "几周尺度大决定：隔 {hours} 小时再复核。",
      burstTemplate: "几周单点：用 {aspect} 只完成一件硬任务。",
    },
  },
  solar_return: {
    answer: {
      happenedHighPressure:
        "日返盘里主轴拉得紧：这一公历年旧目标或习惯跟现实对不上，心里会逼你换剧本。",
      happenedCalibrate: "日返盘里在调整：哪些事这一年还值得跟、哪些该放手。",
      riskWithHardTemplate:
        "{hardAspects} 在日返里容易走极端——硬扛或躺平。年度更要找中间路。",
      riskNoHard: "日返里同时惦记的线太多，容易全年过载：先定年度一条主线。",
      synergyTemplate: "{aspect} 像这一年的缓冲带，能帮你稳住节奏。",
      todayTemplate:
        "先处理年度最较劲的一两组，别的分季记下；大投入隔 {hours} 小时再拍板，并拆到季度。",
    },
    pro: {
      centerTemplate: "日返绝对中心相位：{aspect}。年度主线围绕它展开。",
      conflictWithHardTemplate: "日返高压点：{hardAspects}。全年冲劲与限制同步抬升。",
      conflictNoHard: "日返硬相位密度有限，主要矛盾更像执行拖慢。",
      driveTemplate: "日返驱动力：{aspect}。年度目标要先收窄。",
    },
    actions: {
      stabilizeTemplate: "年度稳住：用 {aspect} 处理最高压议题，按季复盘。",
      growthDelayTemplate: "年度大决定：隔 {hours} 小时再拍板，并写入季度检查点。",
      burstTemplate: "年度单点：用 {aspect} 只攻一条硬任务，别全年多线。",
    },
  },
  lunar_return: {
    answer: {
      happenedHighPressure:
        "月返盘里主轴拉得紧：这一小段日子旧节奏跟现场对不上，心里会催你调整。",
      happenedCalibrate: "月返盘里在微调：哪些事这几天还跟、哪些可以先放。",
      riskWithHardTemplate: "{hardAspects} 在月返里容易走极端——硬顶或缩掉。短窗先找中间动作。",
      riskNoHard: "这一小段线太多，容易短窗过载：先抓一条可见动作。",
      synergyTemplate: "{aspect} 像这一小段的缓冲带，能帮你缓一口气。",
      todayTemplate:
        "先处理短窗最紧的一两组，别的记下；钱与承诺隔 {hours} 小时再拍板。",
    },
    pro: {
      centerTemplate: "月返绝对中心相位：{aspect}。短窗主线围绕它展开。",
      conflictWithHardTemplate: "月返高压点：{hardAspects}。短窗里冲劲与限制同步抬升。",
      conflictNoHard: "月返硬相位不多，矛盾更像几天节奏噪声。",
      driveTemplate: "月返驱动力：{aspect}。短窗目标先收窄。",
    },
    actions: {
      stabilizeTemplate: "短窗稳住：用 {aspect} 处理最烫的议题。",
      growthDelayTemplate: "短窗大决定：隔 {hours} 小时再复核。",
      burstTemplate: "短窗单点：用 {aspect} 只完成一件硬任务。",
    },
  },
};

const MINOR_MAIN_PATCH_BY_KIND: Record<ChartKindId, object> = {
  natal: {},
  synastry: {
    answer: {
      happened:
        "案主本命里次要相位像鞋里的沙：一天两天没事，久了脚疼。说不清的小别扭常从这里起。双人相处仍以合盘为准。",
      risk: "风险是什么：别忽略这些小信号；它们不会上头条，却会带偏案主侧判断。",
      synergyTemplate: "协同建议：留意 {aspect} ——压力大时可能给案主「旁门灵感」；关系题看合盘。",
      today: "今天可以：扫一眼案主表里最紧的几条次要相位，当后台提醒。",
    },
    pro: {
      compensationTemplate: "案主补偿线：{aspect}。隐性缓冲，乱的时候便于重组。",
      frictionTemplate: "案主损耗线：{aspect}。意志与价值轻微磨，执行易迟滞。",
      coordinationTemplate: "案主协同线：{aspect}。表达与审美弱协同，可当沟通润滑。",
    },
    actions: {
      inspirationTemplate: "逻辑卡壳时，先试 {aspect} 的跳跃想法，别硬线性硬磕。",
      tolerateTemplate: "容忍微观磨损：{aspect} 的不适像余热，不据此改写主方向。",
      smoothingTemplate: "关键沟通里借 {aspect} 加一点表达修饰，减少误会。",
    },
  },
  transit: {
    answer: {
      happened:
        "行运次要相位像当下的细沙：几天里不起眼，久了烦。用来对照本命，不当终身定调。",
      risk: "风险是什么：别忽略这些小信号；它们会带偏当下判断。",
      synergyTemplate: "协同建议：留意 {aspect} ——压力大时可能给当下「旁门灵感」。",
      today: "今天可以：扫一眼行运表里最紧的几条次要相位，当后台提醒。",
    },
    pro: {
      compensationTemplate: "行运补偿线：{aspect}。当下隐性缓冲。",
      frictionTemplate: "行运损耗线：{aspect}。当下轻微磨。",
      coordinationTemplate: "行运协同线：{aspect}。沟通润滑。",
    },
    actions: {
      inspirationTemplate: "当下卡壳时，先试 {aspect} 的跳跃想法。",
      tolerateTemplate: "容忍当下磨损：{aspect} 不必改写长期方向。",
      smoothingTemplate: "当下沟通借 {aspect} 加一点修饰。",
    },
  },
  ephemeris: {
    answer: {
      happened:
        "时刻盘次要相位是现场的细线：用来理解这一刻的小别扭，不当做人格判决书。",
      risk: "风险是什么：别忽略小信号；现场判断会被带偏。",
      synergyTemplate: "协同建议：留意 {aspect} ——现场可能给「旁门灵感」。",
      today: "可以：扫一眼此刻表里最紧的几条次要相位。",
    },
    pro: {
      compensationTemplate: "现场补偿线：{aspect}。",
      frictionTemplate: "现场损耗线：{aspect}。",
      coordinationTemplate: "现场协同线：{aspect}。",
    },
    actions: {
      inspirationTemplate: "现场卡壳时，先试 {aspect} 的跳跃想法。",
      tolerateTemplate: "现场磨损：{aspect} 不必过度解读。",
      smoothingTemplate: "现场沟通借 {aspect} 加一点修饰。",
    },
  },
  secondary: {
    answer: {
      happened:
        "次限次要相位像年尺度里的细沙：用来理解几年里的手感与慢变量，不当每日指令。",
      risk: "风险是什么：小信号会带偏几年里的判断。",
      synergyTemplate: "协同建议：留意 {aspect} ——几年里可能给「旁门灵感」。",
      today: "可以：扫一眼次限表里最紧的几条次要相位，按季回看。",
    },
    pro: {
      compensationTemplate: "次限补偿线：{aspect}。",
      frictionTemplate: "次限损耗线：{aspect}。",
      coordinationTemplate: "次限协同线：{aspect}。",
    },
    actions: {
      inspirationTemplate: "年尺度卡壳时，试 {aspect} 的跳跃想法。",
      tolerateTemplate: "年尺度磨损：{aspect} 不单独改主方向。",
      smoothingTemplate: "年尺度沟通借 {aspect} 加修饰。",
    },
  },
  tertiary: {
    answer: {
      happened:
        "三限次要相位像几周里的细沙：用来理解短窗手感，不当终身定调。",
      risk: "风险是什么：小信号会带偏这几周判断。",
      synergyTemplate: "协同建议：留意 {aspect} ——几周里可能给「旁门灵感」。",
      today: "可以：扫一眼三限表里最紧的几条次要相位。",
    },
    pro: {
      compensationTemplate: "三限补偿线：{aspect}。",
      frictionTemplate: "三限损耗线：{aspect}。",
      coordinationTemplate: "三限协同线：{aspect}。",
    },
    actions: {
      inspirationTemplate: "几周卡壳时，试 {aspect} 的跳跃想法。",
      tolerateTemplate: "几周磨损：{aspect} 不必改写长期方向。",
      smoothingTemplate: "几周沟通借 {aspect} 加修饰。",
    },
  },
  solar_return: {
    answer: {
      happened:
        "日返次要相位像年度里的细线：用来理解全年手感与旁支，不当每日指令。",
      risk: "风险是什么：小信号会带偏全年判断。",
      synergyTemplate: "协同建议：留意 {aspect} ——全年可能给「旁门灵感」。",
      today: "可以：扫一眼日返表里最紧的几条次要相位，按月回看。",
    },
    pro: {
      compensationTemplate: "日返补偿线：{aspect}。",
      frictionTemplate: "日返损耗线：{aspect}。",
      coordinationTemplate: "日返协同线：{aspect}。",
    },
    actions: {
      inspirationTemplate: "年度卡壳时，试 {aspect} 的跳跃想法。",
      tolerateTemplate: "年度磨损：{aspect} 不单独改主方向。",
      smoothingTemplate: "年度沟通借 {aspect} 加修饰。",
    },
  },
  lunar_return: {
    answer: {
      happened:
        "月返次要相位像短窗里的细线：用来理解这几天手感，不当终身定调。",
      risk: "风险是什么：小信号会带偏短窗判断。",
      synergyTemplate: "协同建议：留意 {aspect} ——短窗可能给「旁门灵感」。",
      today: "可以：扫一眼月返表里最紧的几条次要相位。",
    },
    pro: {
      compensationTemplate: "月返补偿线：{aspect}。",
      frictionTemplate: "月返损耗线：{aspect}。",
      coordinationTemplate: "月返协同线：{aspect}。",
    },
    actions: {
      inspirationTemplate: "短窗卡壳时，试 {aspect} 的跳跃想法。",
      tolerateTemplate: "短窗磨损：{aspect} 不必过度解读。",
      smoothingTemplate: "短窗沟通借 {aspect} 加修饰。",
    },
  },
};

const ANGLE_MAIN_PATCH_BY_KIND: Record<ChartKindId, object> = {
  natal: {},
  synastry: {
    answer: {
      happened:
        "案主本命里，星体碰上升、天顶，像心里要的和社会名片之间容易拧。双人相处仍以合盘为准。",
      risk: "风险是什么：外面越要体面，独处越容易憋或炸；主轴紧时更明显。别把关系题单独押在这一屏。",
      synergyTemplate:
        "协同建议：留意 {aspect} ——有时示弱、把伤口说清楚，反而松一点；与对象的轴点互动看合盘。",
      todayTemplate: "今天可以：对外别排太满，留大约 {reserve} 空白；合盘层面另看双人轴点。",
    },
    pro: {
      socialFrictionTemplate:
        "案主侧角色与心情：{aspect}。公众或关系想要的，和情绪底色不一定同频。",
      entryPressureTemplate: "案主出场压力：{aspect}。新环境更慢热，更像自我保护。",
      interfaceMicroAdjustWithMinorTemplate: "案主细节微调：{snippet}。多一句确认往往省事。",
      interfaceMicroAdjustEmpty: "案主细节微调：次要轴点不多，先把主轴理顺。",
    },
    actions: {
      a0Template: "别把别扭当结论：{aspect} 多是案主侧节奏问题，不必否定长期方向。",
      a1Template: "边界软一点：{aspect} 容易绷太紧，正式场合也可留一小处缝隙。",
      a2: "个人立场先听清对方一句、再回一句，避免抢话。",
    },
  },
  transit: {
    answer: {
      happened:
        "行运盘里，星体碰上升、天顶，像当下心情和社会角色容易拧。用来对照本命，不当终身定调。",
      risk: "风险是什么：此刻外面越要体面，心里越容易憋或炸。",
      synergyTemplate: "协同建议：留意 {aspect} ——当下示弱、说清楚，反而松一点。",
      todayTemplate: "今天可以：对外别排太满，留大约 {reserve} 空白。",
    },
    pro: {
      socialFrictionTemplate: "行运角色与心情：{aspect}。此刻想要的与情绪底色不一定同频。",
      entryPressureTemplate: "行运出场压力：{aspect}。此刻进新场合更谨慎。",
      interfaceMicroAdjustWithMinorTemplate: "行运细节微调：{snippet}。",
      interfaceMicroAdjustEmpty: "行运细节微调：次要轴点不多，先把主轴理顺。",
    },
    actions: {
      a0Template: "别把当下别扭当终审：{aspect} 多是节奏问题。",
      a1Template: "此刻边界软一点：{aspect} 易绷太紧。",
      a2: "个人立场先听再回，避免抢话。",
    },
  },
  ephemeris: {
    answer: {
      happened:
        "时刻盘里，星体碰上升、天顶，像现场角色与内心容易拧。切片理解，不当做人格判决书。",
      risk: "风险是什么：现场越要体面，心里越容易憋或炸。",
      synergyTemplate: "协同建议：留意 {aspect} ——现场有时说清楚反而松一点。",
      todayTemplate: "可以：现场别排太满，留大约 {reserve} 空白。",
    },
    pro: {
      socialFrictionTemplate: "现场角色与心情：{aspect}。",
      entryPressureTemplate: "现场出场压力：{aspect}。",
      interfaceMicroAdjustWithMinorTemplate: "现场细节：{snippet}。",
      interfaceMicroAdjustEmpty: "现场细节：次要轴点不多。",
    },
    actions: {
      a0Template: "现场别扭：{aspect} 先当节奏问题。",
      a1Template: "现场边界：{aspect} 别太硬。",
      a2: "现场先听再回一句。",
    },
  },
  secondary: {
    answer: {
      happened:
        "次限盘里，星体碰上升、天顶，像几年里社会角色与内心容易拧。年尺度理解，不当每日指令。",
      risk: "风险是什么：几年里外面越要体面，心里越容易憋或炸。",
      synergyTemplate: "协同建议：留意 {aspect} ——几年里肯说清楚反而松一点。",
      todayTemplate: "可以：年景里对外别全年排满，留大约 {reserve} 空白，并拆到季。",
    },
    pro: {
      socialFrictionTemplate: "次限角色与心情：{aspect}。几年里同频不易。",
      entryPressureTemplate: "次限出场压力：{aspect}。几年里进新环境更慢。",
      interfaceMicroAdjustWithMinorTemplate: "次限细节：{snippet}。",
      interfaceMicroAdjustEmpty: "次限细节：次要轴点不多。",
    },
    actions: {
      a0Template: "年尺度：{aspect} 先当节奏问题。",
      a1Template: "年尺度：{aspect} 边界分季软一点。",
      a2: "年尺度立场：先听再回，按季复盘。",
    },
  },
  tertiary: {
    answer: {
      happened:
        "三限盘里，星体碰上升、天顶，像几周里角色与内心容易拧。短窗理解，不当终身定调。",
      risk: "风险是什么：这几周外面越要体面，心里越容易憋或炸。",
      synergyTemplate: "协同建议：留意 {aspect} ——这几周说清楚反而松一点。",
      todayTemplate: "可以：这几周对外别排太满，留大约 {reserve} 空白。",
    },
    pro: {
      socialFrictionTemplate: "三限角色与心情：{aspect}。",
      entryPressureTemplate: "三限出场压力：{aspect}。",
      interfaceMicroAdjustWithMinorTemplate: "三限细节：{snippet}。",
      interfaceMicroAdjustEmpty: "三限细节：次要轴点不多。",
    },
    actions: {
      a0Template: "几周尺度：{aspect} 先当节奏问题。",
      a1Template: "几周尺度：{aspect} 别太硬。",
      a2: "几周里先听再回。",
    },
  },
  solar_return: {
    answer: {
      happened:
        "日返盘里，星体碰上升、天顶，像这一年度角色与内心容易拧。年度理解，不当每日指令。",
      risk: "风险是什么：全年外面越要体面，心里越容易憋或炸。",
      synergyTemplate: "协同建议：留意 {aspect} ——这一年说清楚反而松一点。",
      todayTemplate: "可以：年度里对外别全年排满，留大约 {reserve} 空白，并拆到季。",
    },
    pro: {
      socialFrictionTemplate: "年度角色与心情：{aspect}。",
      entryPressureTemplate: "年度出场压力：{aspect}。",
      interfaceMicroAdjustWithMinorTemplate: "年度细节：{snippet}。",
      interfaceMicroAdjustEmpty: "年度细节：次要轴点不多。",
    },
    actions: {
      a0Template: "年度：{aspect} 先当节奏问题。",
      a1Template: "年度：{aspect} 边界按季软一点。",
      a2: "年度立场：先听再回，按季复盘。",
    },
  },
  lunar_return: {
    answer: {
      happened:
        "月返盘里，星体碰上升、天顶，像这一小段日子角色与内心容易拧。短窗理解，不当终身定调。",
      risk: "风险是什么：这几天外面越要体面，心里越容易憋或炸。",
      synergyTemplate: "协同建议：留意 {aspect} ——这一小段说清楚反而松一点。",
      todayTemplate: "可以：短窗里对外别排太满，留大约 {reserve} 空白。",
    },
    pro: {
      socialFrictionTemplate: "月返角色与心情：{aspect}。",
      entryPressureTemplate: "月返出场压力：{aspect}。",
      interfaceMicroAdjustWithMinorTemplate: "月返细节：{snippet}。",
      interfaceMicroAdjustEmpty: "月返细节：次要轴点不多。",
    },
    actions: {
      a0Template: "短窗：{aspect} 先当节奏问题。",
      a1Template: "短窗：{aspect} 别太硬。",
      a2: "短窗先听再回。",
    },
  },
};

export function planetPositionsCopyForChartKind(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): PlanetPositionsCopyConfigZh {
  return deepMergePlain(planetPositionsNatalBaseForVoice(voiceStyleId), PLANET_POSITIONS_MAIN_PATCH_BY_KIND[kind]);
}

export function majorAspectCopyForChartKind(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): MajorAspectCopyConfigZh {
  return deepMergePlain(majorAspectNatalBaseForVoice(voiceStyleId), MAJOR_MAIN_PATCH_BY_KIND[kind]);
}

export function houseCuspCopyForChartKind(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): HouseCuspCopyConfigZh {
  return deepMergePlain(houseCuspNatalBaseForVoice(voiceStyleId), HOUSE_MAIN_PATCH_BY_KIND[kind]);
}

export function minorAspectCopyForChartKind(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): MinorAspectCopyConfigZh {
  return deepMergePlain(minorAspectNatalBaseForVoice(voiceStyleId), MINOR_MAIN_PATCH_BY_KIND[kind]);
}

export function angleAspectCopyForChartKind(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): AngleAspectCopyConfigZh {
  return deepMergePlain(angleAspectNatalBaseForVoice(voiceStyleId), ANGLE_MAIN_PATCH_BY_KIND[kind]);
}
