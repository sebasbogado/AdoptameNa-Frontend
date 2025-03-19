/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["https://adoptamena-api.rodrigomaidana.com/**"],
  },
};

export default nextConfig;
