import type { ChartKindId } from "@/lib/astro-chart-kinds";

export type AstroBenchmarkSample = {
  id: string;
  title: string;
  chartKind: ChartKindId;
  birth: {
    ymd: string;
    hm: string;
    timezone: string;
    latitudeDeg: number;
    longitudeDeg: number;
  };
  note?: string;
  expected?: {
    sunLonDeg?: number;
    moonLonDeg?: number;
    ascLonDeg?: number;
    mcLonDeg?: number;
  };
};

// Baseline pack for mainstream software comparison.
export const ASTRO_BENCHMARK_PACK_VERSION = "v0.1";

export const ASTRO_BENCHMARK_SAMPLES: AstroBenchmarkSample[] = [
  {
    id: "natal-shanghai-1990-01-01",
    title: "Natal baseline / Shanghai / 1990-01-01",
    chartKind: "natal",
    birth: {
      ymd: "1990-01-01",
      hm: "12:00",
      timezone: "Asia/Shanghai",
      latitudeDeg: 31.2304,
      longitudeDeg: 121.4737,
    },
    note: "Used to compare core planets + ASC/MC with mainstream software.",
  },
  {
    id: "transit-shanghai-now",
    title: "Transit baseline / Shanghai / now",
    chartKind: "transit",
    birth: {
      ymd: "1990-01-01",
      hm: "12:00",
      timezone: "Asia/Shanghai",
      latitudeDeg: 31.2304,
      longitudeDeg: 121.4737,
    },
    note: "Used to compare transit-to-natal major aspects and orb formatting.",
  },
];
