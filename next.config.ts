import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** 按需转译大包的 barrel export，减轻 dev 编译与路由首 chunk 体积 */
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/fiber", "@react-three/drei"],
  },
  async redirects() {
    return [
      { source: "/xingyun", destination: "/hub", permanent: false },
      { source: "/nebula", destination: "/hub", permanent: false },
      { source: "/luopan", destination: "/compass", permanent: false },
      { source: "/numerology/archive", destination: "/numerology", permanent: false },
    ];
  },
};

export default nextConfig;
