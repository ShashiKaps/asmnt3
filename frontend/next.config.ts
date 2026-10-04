import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '172.31.78.43', 'localhost', '127.0.0.1','ec2-100-27-243-86.compute-1.amazonaws.com',], // change to your IP in production
};
export default nextConfig;