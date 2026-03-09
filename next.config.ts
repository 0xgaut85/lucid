import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@solana/web3.js'],
  output: 'standalone',
};

export default nextConfig;
