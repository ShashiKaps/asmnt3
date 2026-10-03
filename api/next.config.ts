import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep sequelize/sqlite3 as real Node requires instead of bundling them,
  // otherwise Turbopack tries to statically resolve optional dialect deps (e.g. pg-hstore)
  serverExternalPackages: ['sequelize', 'sqlite3'],
  allowedDevOrigins: ['172.31.78.43', 'localhost', '127.0.0.1','ec2-18-208-126-137.compute-1.amazonaws.com',], // change to your IP in production
};
export default nextConfig;