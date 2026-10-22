import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** 按需转译大包的 barrel export，减轻 dev 编译与路由首 chunk 体积 */
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/fiber", "@react-three/drei"],
  },
  async headers() {
    return [
      {
        source: "/tarot-master.html",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
      {
        source: "/tarotQuestionResolve.js",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
      {
        source: "/tarot-dev-stamp.txt",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/xingyun", destination: "/hub", permanent: false },
      { source: "/nebula", destination: "/hub", permanent: false },
      { source: "/luopan", destination: "/compass", permanent: false },
      { source: "/numerology/archive", destination: "/numerology", permanent: false },
      /** 炼金工具已下线：旧书签与外链落到寰宇之门 */
      { source: "/numerology/lab", destination: "/numerology", permanent: true },
    ];
  },
};

export default nextConfig;
