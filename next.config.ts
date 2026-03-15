import type { NextConfig } from "next";

function getAllowedDevOrigins() {
  const origins = new Set<string>(["*.up.railway.app"]);
  const baseUrl = process.env.BASE_URL;

  if (baseUrl) {
    try {
      origins.add(new URL(baseUrl).hostname);
    } catch {
      // Ignore invalid BASE_URL values; fallback wildcard remains.
    }
  }

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
