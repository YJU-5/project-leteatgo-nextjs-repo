import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true, //SWC 최적화
  webpack: (config, { dev, isServer }) => {
    // 프로덕션 빌드 최적화
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
