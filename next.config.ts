import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.irys.xyz",
      }
    ]
  }
};

export default nextConfig;
