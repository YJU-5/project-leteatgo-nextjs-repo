import { Configuration } from "webpack";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_KAKAO_MAP_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY,
    NEXT_PUBLIC_KAKAO_REST_API_KEY: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    styledComponents: true,
    emotion: true,
    reactRemoveProperties: true,
  },
  webpack: (config: Configuration) => {
    if (!config.optimization) {
      config.optimization = {};
    }

    config.optimization.splitChunks = {
      chunks: "all",
      minSize: 20000,
      maxSize: 100000,
    };

    return config;
  },
};

console.log(
  "next.config.ts - 카카오맵 API KEY:",
  process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
);

export default nextConfig;
