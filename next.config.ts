import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tuetppybguivjsvevuvj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/avatars/**',
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
