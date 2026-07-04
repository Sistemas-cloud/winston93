// 2026-07-04: Generador de robots.txt para Pages Router (/robots.txt).
// Permite indexación y referencia explícita al sitemap XML.

import { SITE_URL } from '@/lib/seo/site-config'

export function buildRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /api/

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`
}
