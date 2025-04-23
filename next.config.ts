import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This produces a single javascript file
  output: "standalone",

  images: {
    remotePatterns: [
      {
        // This is a fix for the app to be able to be accessed from a docker container
        protocol: "http",
        hostname: "**",
      },
      {
        // This is to allow images to be loaded from the internet
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
