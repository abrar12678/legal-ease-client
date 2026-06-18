/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // All API routes EXCEPT /api/auth → forward to Express backend (port 5000)
        source: "/api/hirings/:path*",
        destination: "http://localhost:5000/api/hirings/:path*",
      },
      {
        source: "/api/comments/:path*",
        destination: "http://localhost:5000/api/comments/:path*",
      },
      {
        source: "/api/admin/:path*",
        destination: "http://localhost:5000/api/admin/:path*",
      },
      {
        source: "/api/lawyers/:path*",
        destination: "http://localhost:5000/api/lawyers/:path*",
      },
      {
        source: "/api/transactions/:path*",
        destination: "http://localhost:5000/api/transactions/:path*",
      },
    ];
  },
};

export default nextConfig;