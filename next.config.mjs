/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {

    domains: ["adoptamena-api.rodrigomaidana.com/**", "https://adoptamena-api.rodrigomaidana.com/api/**"],

  },
};

export default nextConfig;