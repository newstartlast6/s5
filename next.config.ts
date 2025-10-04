import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  // @ts-ignore - allowedDevOrigins is an experimental feature
  allowedDevOrigins: ["*"],
};

export default nextConfig;
