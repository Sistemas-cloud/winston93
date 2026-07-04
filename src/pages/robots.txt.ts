// 2026-07-04: Endpoint /robots.txt vía Pages Router (compatible con despliegue actual).
// Indica a los crawlers dónde encontrar el sitemap XML.

import type { GetServerSideProps } from 'next'
import { buildRobotsTxt } from '@/lib/seo/robots-txt'

function RobotsTxt() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robots = buildRobotsTxt()

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800'
  )
  res.write(robots)
  res.end()

  return { props: {} }
}

export default RobotsTxt
