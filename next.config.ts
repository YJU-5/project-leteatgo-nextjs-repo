import { Configuration } from "webpack";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    styledComponents: true,
    emotion: true,
    reactRemoveProperties: false,
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

export default nextConfig;
