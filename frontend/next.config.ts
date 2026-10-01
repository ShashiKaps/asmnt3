import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '172.31.78.43', 'localhost', '127.0.0.1','ec2-13-222-13-140.compute-1.amazonaws.com',], // change to your IP in production
};
export default nextConfig;