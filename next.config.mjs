/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adoptamena-api.rodrigomaidana.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'adoptamena-api.rodrigomaidana.com',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;