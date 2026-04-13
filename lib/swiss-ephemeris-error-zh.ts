/**
 * 将瑞士星历（WASM / 网络 / 底层库）抛出的原始错误转为界面用中文说明。
 * 原始信息可写入控制台或「技术详情」供排查。
 */
export type SwissErrorDisplay = {
  /** 主文案：不含英文技术词（尽量） */
  title: string;
  /** 操作建议（中文） */
  hints: readonly string[];
  /** 原始或半原始信息，可能含英文；仅用于控制台或折叠展示 */
  technical?: string;
};

const HINT_RETRY = "请点击下方「重新计算」，或稍后再试。";

const HINT_NETWORK = "请检查本机网络；若在公司网络或防火墙后，可能无法加载星历数据。";

const HINT_LOCAL_EPHE =
  "本地开发时可在项目根目录执行 npm run ephe:fetch，将星历文件放入 public/swiss-ephe/ 后重启开发服务。";

const HINT_REFRESH = "也可尝试刷新整个页面（会依次尝试本地星历目录与备用镜像）。";

function looksMostlyAscii(s: string): boolean {
  const trimmed = s.replace(/\s/g, "");
  if (!trimmed) return false;
  let ascii = 0;
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed.charCodeAt(i) < 128) ascii++;
  }
  return ascii / trimmed.length > 0.85;
}

export function formatSwissEphemerisError(rawUnknown: unknown): SwissErrorDisplay {
  if (rawUnknown instanceof Error && rawUnknown.name === "AbortError") {
    return {
      title: "加载瑞士星历或 WASM 的请求已被中止（多为等待过久或网络中断）。",
      hints: [HINT_NETWORK, HINT_LOCAL_EPHE, HINT_RETRY, HINT_REFRESH],
      technical: rawUnknown.message || "AbortError",
    };
  }

  const raw =
    rawUnknown instanceof Error
      ? rawUnknown.message.trim()
      : String(rawUnknown ?? "")
          .trim();

  const lower = raw.toLowerCase();

  if (!raw) {
    return {
      title: "瑞士星历计算未完成，原因未知。",
      hints: [HINT_RETRY, HINT_REFRESH, HINT_LOCAL_EPHE],
      technical: undefined,
    };
  }

  if (raw.includes("初始化超时") || (raw.includes("已超过") && raw.includes("秒"))) {
    return {
      title: "瑞士星历初始化耗时过长，可能网络卡住或无法访问星历镜像。",
      hints: [HINT_NETWORK, HINT_LOCAL_EPHE, HINT_RETRY, HINT_REFRESH],
      technical: raw,
    };
  }

  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("load failed") ||
    lower.includes("network request failed") ||
    lower.includes("err_connection") ||
    lower.includes("ecconnrefused")
  ) {
    return {
      title: "无法通过网络加载瑞士星历所需的数据文件。",
      hints: [HINT_NETWORK, HINT_RETRY, HINT_LOCAL_EPHE, HINT_REFRESH],
      technical: raw,
    };
  }

  if (
    lower.includes("wasm") ||
    lower.includes("webassembly") ||
    lower.includes("instantiate") ||
    lower.includes("compileerror")
  ) {
    return {
      title: "星历计算模块未能正确加载（网页端组件初始化失败）。",
      hints: [
        "请先刷新页面；若安装了脚本拦截类扩展，可暂时关闭后重试。",
        HINT_RETRY,
        HINT_REFRESH,
      ],
      technical: raw,
    };
  }

  if (raw.includes("宫位计算返回异常")) {
    return {
      title: "宫位计算返回了异常数据，本轮无法绘制可靠宫位。",
      hints: [HINT_RETRY, HINT_REFRESH, HINT_LOCAL_EPHE],
      technical: raw,
    };
  }

  if (lower.includes("cusps") || lower.includes("ascmc")) {
    return {
      title: "宫位数据不完整，无法完成与瑞士星历一致的排盘。",
      hints: [HINT_RETRY, HINT_REFRESH, HINT_LOCAL_EPHE],
      technical: raw,
    };
  }

  const stripped = raw.replace(/^瑞士星历[：:]\s*/i, "").replace(/^Swiss Ephemeris[：:]\s*/i, "");

  if (looksMostlyAscii(stripped)) {
    return {
      title: "瑞士星历在计算过程中报错，暂时无法显示与星历一致的盘面与数据表。",
      hints: [HINT_RETRY, HINT_NETWORK, HINT_LOCAL_EPHE, HINT_REFRESH],
      technical: raw,
    };
  }

  const title = raw.startsWith("瑞士星历") ? raw : `瑞士星历：${raw}`;
  return {
    title,
    hints: [HINT_RETRY, HINT_REFRESH, HINT_LOCAL_EPHE],
    technical: raw,
  };
}
