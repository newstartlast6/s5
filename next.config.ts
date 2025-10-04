import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  devIndicators: {
    appIsrStatus: false,
  },
  allowedDevOrigins: ["*"],
};

export default nextConfig;
