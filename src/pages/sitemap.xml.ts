// 2026-07-04: Endpoint /sitemap.xml vía Pages Router (compatible con despliegue actual).
// Sirve el mapa del sitio en formato XML para motores de búsqueda.

import type { GetServerSideProps } from 'next'
import { buildSitemapXml } from '@/lib/seo/sitemap-xml'

function SiteMap() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = buildSitemapXml()

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800'
  )
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default SiteMap
