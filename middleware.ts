import { NextRequest, NextResponse } from "next/server";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const phase = PHASE_DEVELOPMENT_SERVER
    ? "development"
    : process.env.VERCEL_ENV === "preview"
    ? "preview"
    : "production";

  const apiUrl = process.env.API_URL || "https://adoptamena-api.rodrigomaidana.com";

  const defaultCSPDirectives = `
    default-src 'self';
    base-uri 'self';
    object-src 'none';
    form-action 'self';
    frame-ancestors 'none';
    worker-src 'self' blob:;
    child-src 'self' blob:;
    manifest-src 'self';
  `;

  let csp = "";

  if (phase === "development") {
    csp = `
      ${defaultCSPDirectives}
      script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline' blob:;
      style-src 'self' 'unsafe-inline' ;
      img-src 'self' data: https://*.tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/ https://adoptamena-api.rodrigomaidana.com;
      connect-src 'self' ws: ${apiUrl};
      font-src 'self';
      frame-src 'none';
      media-src 'self'  ${apiUrl};
    `;
  } else if (phase === "preview") {
    csp = `
      ${defaultCSPDirectives}
      font-src 'self' https://vercel.live/ https://assets.vercel.com https://fonts.gstatic.com;
      style-src 'self' https://vercel.live/fonts 'nonce-${nonce}';
      script-src 'self' https://vercel.live/ 'nonce-${nonce}';
      connect-src 'self' https://vercel.live/ https://vitals.vercel-insights.com wss://*.pusher.com/ https://*.pusher.com/ ${apiUrl};
      img-src 'self' data: https://*.tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/ https://adoptamena-api.rodrigomaidana.com https://vercel.com/ https://vercel.live/;
      frame-src 'self' https://vercel.live/;
      media-src 'self'  ${apiUrl};
    `;
  } else {
    csp = `
      ${defaultCSPDirectives}
      font-src 'self' https://fonts.gstatic.com;
      style-src 'self' 'nonce-${nonce}';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
      connect-src 'self' https://vitals.vercel-insights.com ${apiUrl};
      img-src 'self' data: https://*.tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/ https://adoptamena-api.rodrigomaidana.com https://vercel.com/ https://vercel.live/;
      frame-src 'none';
      media-src 'self'  ${apiUrl};
    `;
  }

  const finalCsp = csp.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", finalCsp);
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
