import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Profile Pics
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com", // AWS S3 Buckets
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary (if still using it)
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // Facebook Profile Pics
      },
      {
        protocol: "https",
        hostname: "**.giphy.com",
      },
      {
        protocol: "https",
        hostname: "media*.giphy.com",
      },
      { protocol: "https", hostname: "themes.3rdwavemedia.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "image.mux.com" },
      { protocol: "https", hostname: "d1csarkz8obe9u.cloudfront.net" },
      { protocol: "https", hostname: "visme.co" },
      { protocol: "https", hostname: "brandpacks.com" },
      {
        protocol: "https",
        hostname: "**", // Matches any hostname [45]
      },
    ],
  },
};

export default nextConfig;
