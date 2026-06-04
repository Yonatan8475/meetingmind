/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow fetching from local Docker API
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
