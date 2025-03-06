import { Configuration } from "webpack";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
  webpack: (config: Configuration) => {
    // 기존 webpack 설정 유지
    if (!config.optimization) {
      config.optimization = {};
    }

    if (!config.optimization.splitChunks) {
      config.optimization.splitChunks = {};
    }

    config.optimization.splitChunks = {
      chunks: "all",
      minSize: 20000,
      maxSize: 100000,
    };

    return config;
  },
};

export default nextConfig;
