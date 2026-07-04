// 2026-07-04: Generador XML del sitemap para Pages Router (/sitemap.xml).
// Reutiliza SITE_ROUTES como fuente única de URLs indexables.

import { SITE_ROUTES } from '@/lib/seo/routes'
import { absoluteUrl } from '@/lib/seo/site-config'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemapXml(lastModified: Date = new Date()): string {
  const lastmod = lastModified.toISOString()
  const urls = SITE_ROUTES.map((route) => {
    const loc = escapeXml(absoluteUrl(route.path))
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
