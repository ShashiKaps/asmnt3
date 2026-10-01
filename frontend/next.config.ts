import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '172.31.78.43', 'localhost', '127.0.0.1','ec2-3-235-23-170.compute-1.amazonaws.com',], // change to your IP in production
};
export default nextConfig;