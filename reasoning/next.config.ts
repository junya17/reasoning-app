import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: "export", // 静的サイトとしてエクスポート
  reactStrictMode: true,
  images: {
    unoptimized: true, // 画像最適化を無効化（静的エクスポート用）
  },
};

export default nextConfig;
