import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    env: {
        NEXT_PUBLIC_WORDUL_SECRET: process.env.NEXT_PUBLIC_WORDUL_SECRET
    }
};

export default nextConfig;
