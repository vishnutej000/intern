import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/incidents',
        destination: `${backendUrl}/api/incidents`,
      },
      {
        source: '/api/incidents/:id/resolve',
        destination: `${backendUrl}/api/incidents/:id/resolve`,
      },
    ];
  },
};

export default nextConfig;
