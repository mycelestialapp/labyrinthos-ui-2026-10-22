import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/numerology",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" }],
      },
      {
        source: "/numerology/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" }],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/xingyun", destination: "/hub", permanent: false },
      { source: "/nebula", destination: "/hub", permanent: false },
      { source: "/luopan", destination: "/compass", permanent: false },
    ];
  },
};

export default nextConfig;
