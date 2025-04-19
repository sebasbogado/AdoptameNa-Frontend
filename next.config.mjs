import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const nextConfig = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    console.log("Estamos en modo desarrollo, suerte!");
  }

  return {
    reactStrictMode: true,
    poweredByHeader: false,
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
    experimental: {
      typedRoutes: true,
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: securityHeadersConfig(phase),
        },
      ];
    },
  };
};

const securityHeadersConfig = (phase) => {
  const cspReportOnly = false;

  const upgradeInsecure =
    phase !== PHASE_DEVELOPMENT_SERVER && !cspReportOnly
      ? "upgrade-insecure-requests;"
      : "";

  const defaultCSPDirectives = `
    default-src 'self';
    base-uri 'none';
    form-action 'none';
    frame-ancestors 'none';
    object-src 'none';
    manifest-src 'self';
    worker-src 'self' blob:;
    child-src 'self' blob:;
    ${upgradeInsecure}
  `;

  const environment = process.env.VERCEL_ENV;

  const cspDirectives = (() => {
    if (environment === "preview") {
      return `
        ${defaultCSPDirectives}
        font-src 'self' https://vercel.live/ https://assets.vercel.com https://fonts.gstatic.com https://fonts.googleapis.com/css2;
        style-src 'self' 'unsafe-inline' https://vercel.live/fonts;
        script-src 'self' 'unsafe-inline' https://vercel.live/ https://adoptamena-api.rodrigomaidana.com;
        connect-src 'self' https://vercel.live/ https://vitals.vercel-insights.com https://adoptamena-api.rodrigomaidana.com https://*.pusher.com/ wss://*.pusher.com/;
        img-src 'self' data: https://vercel.com/ https://vercel.live/ https://adoptamena-api.rodrigomaidana.com https://*.tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/;
        frame-src 'self' https://vercel.live/;
      `;
    }

    if (environment === "production") {
      return `
        ${defaultCSPDirectives}
        font-src 'self' https://fonts.googleapis.com/css2;
        style-src 'self' 'unsafe-inline';
        script-src 'self' 'unsafe-inline' https://adoptamena-api.rodrigomaidana.com;
        connect-src 'self' https://vitals.vercel-insights.com https://adoptamena-api.rodrigomaidana.com;
        img-src 'self' data: https://adoptamena-api.rodrigomaidana.com https://*.tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/;
        frame-src 'none';
      `;
    }

    // dev
    return `
      ${defaultCSPDirectives}
      font-src 'self' https://fonts.googleapis.com/css2;
      style-src 'self' 'unsafe-inline';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://adoptamena-api.rodrigomaidana.com;
      connect-src 'self' https://adoptamena-api.rodrigomaidana.com;
      img-src 'self' data: https://adoptamena-api.rodrigomaidana.com https://*.tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/;
      frame-src 'none';
    `;
  })();

  return [
    {
      key: cspReportOnly
        ? "Content-Security-Policy-Report-Only"
        : "Content-Security-Policy",
      value: cspDirectives.replace(/\n/g, "").replace(/\s+/g, " ").trim(),
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
  ];
};

export default nextConfig;
