import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.31.78.43', 'localhost', '127.0.0.1', 'ec2-18-232-124-196.compute-1.amazonaws.com'], // change to your IP in production
  // sequelize v3's dynamic require() pattern breaks Turbopack's static bundling; keep it external.
  serverExternalPackages: ['sequelize', 'sqlite3'],
};
export default nextConfig;