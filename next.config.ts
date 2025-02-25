import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_KAKAO_MAP_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY,
    NEXT_PUBLIC_KAKAO_REST_API_KEY: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
  },
};

console.log("next.config.ts - 카카오맵 API KEY:", process.env.NEXT_PUBLIC_KAKAO_MAP_KEY);

export default nextConfig;
