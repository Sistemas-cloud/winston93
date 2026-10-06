/** @type {import('next').NextConfig} */
// 2026-07-03: Optimizaciones SEO/rendimiento — sin header X-Powered-By y formatos modernos de imagen.
// 2026-09-22: Cache largo para estáticos + preconnect implícito vía Vercel CDN.
// 2026-10-06: Okara SEO/GEO — security headers: X-Frame-Options, X-Content-Type-Options,
//             Referrer-Policy, Permissions-Policy y CSP-Report-Only.
//             CSP en modo report-only para no romper GTM/Ads/Framer en producción;
//             allowlist incluye todas las fuentes actuales del sitio.

/**
 * Content-Security-Policy permitiendo las fuentes actuales del sitio:
 *   - GTM, Google Analytics, Google Ads, doubleclick (cargados tras consentimiento)
 *   - next/font auto-aloja las fuentes en /_next, por eso font-src 'self' es suficiente
 *   - Framer Motion opera 100% en el cliente con JS local
 *   - agendaw.vercel.app se referencia como href de <a>, no requiere frame-src a menos
 *     que se incruste en <iframe> (no se hace actualmente)
 * Se usa report-only para no arriesgar rotura en producción mientras se valida en GA/Ads.
 * Cuando el equipo confirme 0 violaciones, cambiar la clave a Content-Security-Policy.
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  // GTM y Google Ads inyectan scripts inline; unsafe-inline es necesario mientras se usen sin nonce.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://connect.facebook.net",
  // Tailwind + Framer Motion usan estilos inline; sin unsafe-inline la UI se rompe.
  "style-src 'self' 'unsafe-inline'",
  // Imágenes: data: para íconos SVG inline; blob: para previews; https: para píxeles de tracking.
  "img-src 'self' data: blob: https:",
  // Fuentes: self cubre /_next/static/media/ donde next/font auto-aloja Poppins.
  "font-src 'self'",
  // Conexiones XHR/fetch a Analytics y GTM.
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://www.googletagmanager.com",
  // GTM iframe de depuración y DoubleClick conversion frame.
  "frame-src https://www.googletagmanager.com https://td.doubleclick.net",
  // Sin plugins Flash/Silverlight.
  "object-src 'none'",
  // Prevenir base-tag hijacking.
  "base-uri 'self'",
  // Prevenir form hijacking.
  "form-action 'self' https://agendaw.vercel.app",
].join('; ')

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      // ── Security headers ────────────────────────────────────────────────
      // Aplica a todas las rutas del sitio.
      {
        source: '/(.*)',
        headers: [
          // Previene que el sitio sea embebido en iframes de dominios externos (clickjacking).
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Previene MIME-sniffing (cargar JS como HTML, etc.).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Envía origin+path al mismo dominio; solo origin a HTTPS externos; nada a HTTP.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Deshabilita APIs sensibles no usadas por el sitio.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // CSP en modo observación: registra violaciones sin bloquear.
          // Cambiar a Content-Security-Policy cuando se valide que no hay violaciones en prod.
          { key: 'Content-Security-Policy-Report-Only', value: CSP_REPORT_ONLY },
        ],
      },
      // ── Cache de assets estáticos ────────────────────────────────────────
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // 2026-08-20: Hannia — URL legacy indexada por GTM/Google → página nueva de admisiones.
  async redirects() {
    return [
      {
        source: '/admisiones/solicitud',
        destination: '/admisiones',
        permanent: true,
      },
      {
        source: '/admisiones/solicitud/',
        destination: '/admisiones',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
