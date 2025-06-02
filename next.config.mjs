/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "adoptamena-api.rodrigomaidana.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "adoptamena-api.rodrigomaidana.com",
        pathname: "/api/**",
      },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
