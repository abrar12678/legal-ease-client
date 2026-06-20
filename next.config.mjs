
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.ibb.co" },
    ],
  },
  async rewrites() {
    const backend = "https://legal-ease-server.vercel.app";
    return {
      beforeFiles: [
        {
          source: "/api/hirings/:path*",
          destination: `${backend}/api/hirings/:path*`,
        },
        {
          source: "/api/comments/:path*",
          destination: `${backend}/api/comments/:path*`,
        },
        {
          source: "/api/admin/:path*",
          destination: `${backend}/api/admin/:path*`,
        },
        {
          source: "/api/lawyers/:path*",
          destination: `${backend}/api/lawyers/:path*`,
        },
        {
          source: "/api/transactions/:path*",
          destination: `${backend}/api/transactions/:path*`,
        },
        {
          source: "/api/users/:path*",
          destination: `${backend}/api/users/:path*`,
        },
        {
          source: "/api/payments/:path*",
          destination: `${backend}/api/payments/:path*`,
        },
        {
          source: "/api/shortlist/:path*",
          destination: `${backend}/api/shortlist/:path*`,
        },
        {
          source: "/api/test/:path*",
          destination: `${backend}/api/test/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
