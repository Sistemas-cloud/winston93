// 2026-07-03: Componente SEO reutilizable para Pages Router (next/head).
// Centraliza title, description, keywords, authors, canonical, Open Graph,
// Twitter Cards y JSON-LD Schema.org en todas las páginas.
// 2026-10-06: Okara CWV — prop opcional preloadImage para hint <link rel="preload">
//             de la imagen LCP en páginas que no tienen hero propio.

import Head from 'next/head'
import { getOrganizationSchema } from '@/lib/seo/organizationSchema'
import {
  SITE_AUTHOR,
  SITE_CREATOR,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  SITE_PUBLISHER,
  SITE_TWITTER_CREATOR,
  absoluteUrl,
} from '@/lib/seo/site-config'

export interface SeoProps {
  title: string
  description: string
  path?: string
  keywords?: readonly string[] | string
  ogImage?: string
  /** Si es true, no se indexa la página (útil para previews). */
  noindex?: boolean
  /** Incluye JSON-LD de la organización (por defecto true en todas las páginas). */
  includeOrganizationSchema?: boolean
  /**
   * Ruta (pública) de la imagen LCP de esta página.
   * Si se pasa, se emite <link rel="preload" as="image"> para acortar el LCP
   * en páginas interiores sin hero de video/imagen propio.
   * Ejemplo: "/images/logos/logo_winston.png"
   */
  preloadImage?: string
}

function formatKeywords(keywords?: readonly string[] | string): string {
  if (!keywords) {
    return SITE_KEYWORDS.join(', ')
  }
  if (typeof keywords === 'string') {
    return keywords
  }
  return keywords.join(', ')
}

export default function Seo({
  title,
  description,
  path = '/',
  keywords,
  ogImage,
  noindex = false,
  includeOrganizationSchema = true,
  preloadImage,
}: SeoProps) {
  const canonicalUrl = absoluteUrl(path)
  const imageUrl = absoluteUrl(ogImage ?? SITE_OG_IMAGE_PATH)
  const keywordsContent = formatKeywords(keywords)
  const organizationSchema = includeOrganizationSchema
    ? getOrganizationSchema()
    : null

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsContent} />
      <meta name="author" content={SITE_AUTHOR} />
      <meta name="creator" content={SITE_CREATOR} />
      <meta name="publisher" content={SITE_PUBLISHER} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow'}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Preload LCP image si la página lo especifica (páginas sin hero propio) */}
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={SITE_LOCALE} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={SITE_NAME} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content={SITE_TWITTER_CREATOR} />

      {/* JSON-LD Schema.org */}
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      )}
    </Head>
  )
}
