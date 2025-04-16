/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
                default-src 'self';
                script-src 'self' 'unsafe-inline' 'unsafe-eval' https://adoptamena-api.rodrigomaidana.com;
                style-src 'self' 'unsafe-inline';
                img-src 'self' data: https://adoptamena-api.rodrigomaidana.com;
                connect-src 'self' https://adoptamena-api.rodrigomaidana.com;
                font-src 'self' https://fonts.googleapis.com/css2 ;
                object-src 'none';
                frame-ancestors 'none';
              `
              .replace(/\s+/g, " ")
              .trim(),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
