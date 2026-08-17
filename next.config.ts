import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A lockfile in the parent directory makes Turbopack infer the wrong workspace
  // root; pin it to this project so builds resolve modules from here.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // This allows all images from Unsplash
      },
    ],
  },
};

export default nextConfig;
