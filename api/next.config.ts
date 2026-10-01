import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sequelize's dynamic require() pattern breaks Turbopack's static bundling; keep it external.
  serverExternalPackages: ['sequelize', 'sqlite3'],
};
export default nextConfig;
