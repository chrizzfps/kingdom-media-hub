import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes a plain folder (out/) that is
  // uploaded to Hostinger over FTP. No Node server runs in production.
  output: "export",
  // Apache serves /en/ from out/en/index.html without rewrite rules.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Keep the production bundle lean; heavy client islands are dynamically imported.
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "framer-motion"],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
