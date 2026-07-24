import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Add real asset CDNs here when production media is finalized.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Keep the production bundle lean; heavy client islands are dynamically imported.
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "framer-motion"],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
