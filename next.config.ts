import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true, // เปิดใช้ Emotion
  },
};

export default nextConfig;
