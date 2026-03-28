import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/xingyun", destination: "/hub", permanent: false },
      { source: "/nebula", destination: "/hub", permanent: false },
      { source: "/luopan", destination: "/compass", permanent: false },
    ];
  },
};

export default nextConfig;
