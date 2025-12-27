import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "popshow.vercel.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
  
};

export default nextConfig;
