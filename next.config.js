/** @type {import('next').NextConfig} */
// 2026-07-03: Optimizaciones SEO/rendimiento — sin header X-Powered-By y formatos modernos de imagen.
// 2026-09-22: Cache largo para estáticos + preconnect implícito vía Vercel CDN.
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
