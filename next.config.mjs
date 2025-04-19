/** @type {import('next').NextConfig} */

const isDev = process.env.NEXT_PUBLIC_IS_DEV === "true";

const nextConfig = {
  async headers() {
    // Definimos fuentes de scripts y estilos sin usar nonces
    const scriptSrc = isDev ? `'self' 'unsafe-inline' 'unsafe-eval'` : `'self'`;
    const styleSrc = isDev ? `'self' 'unsafe-inline'` : `'self'`;

    const csp = [
      `default-src 'self'`,
      `script-src ${scriptSrc}`,
      `style-src ${styleSrc}`,
      `img-src 'self' data: https://adoptamena-api.rodrigomaidana.com https://*.tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/`,
      `connect-src 'self' https://adoptamena-api.rodrigomaidana.com`,
      `font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com`,
      `object-src 'none'`,
      `frame-ancestors 'none'`,
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
          // Se eliminan COOP/COEP para permitir tiles de OpenStreetMap sin bloqueos
        ],
      },
    ];
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
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
