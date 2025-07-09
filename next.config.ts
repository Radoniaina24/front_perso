import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dbpoyo4gw/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
