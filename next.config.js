/** @type {import('next').NextConfig} */
// 2026-07-03: Optimizaciones SEO/rendimiento — sin header X-Powered-By y formatos modernos de imagen.
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
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