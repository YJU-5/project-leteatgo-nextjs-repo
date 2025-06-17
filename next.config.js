import { Configuration } from "webpack";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
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
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "nestjs-image-bucket.s3.ap-northeast-2.amazonaws.com",
      "leteatgo-s3-bucket.s3.ap-northeast-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
