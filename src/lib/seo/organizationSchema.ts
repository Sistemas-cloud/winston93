// 2026-07-03: JSON-LD Schema.org tipo School para rich results de Google.
// School es subtipo de EducationalOrganization, recomendado para colegios.
// 2026-09-26: Enriquecer School existente (horarios + areaServed Cd. Madero/Tampico); sin duplicar ni sameAs a winstonkinder.
// 2026-10-06: Okara SEO/GEO — añadir @graph con @id canónico y co-tipo LocalBusiness para local search;
//             permite que Google asocie el panel de conocimiento con la entidad física.
//             Solo datos públicos reales; sin inventar coords, email ni año de fundación.

import {
  SITE_ADDRESS,
  SITE_LOGO_PATH,
  SITE_NAME,
  SITE_PHONE,
  SITE_SOCIAL_LINKS,
  SITE_URL,
  absoluteUrl,
} from './site-config'

/** @id canónico que vincula todas las páginas con la misma entidad. */
const ORG_ID = `${SITE_URL}/#organization` as const

export interface OrganizationGraphDocument {
  '@context': 'https://schema.org'
  '@graph': [OrganizationNode]
}

export interface OrganizationNode {
  '@type': ['School', 'LocalBusiness']
  '@id': string
  name: string
  url: string
  logo: {
    '@type': 'ImageObject'
    url: string
    width: number
    height: number
  }
  image: string
  description: string
  telephone: string
  address: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  openingHoursSpecification: ReadonlyArray<{
    '@type': 'OpeningHoursSpecification'
    dayOfWeek: string | readonly string[]
    opens: string
    closes: string
  }>
  areaServed: ReadonlyArray<{
    '@type': 'City'
    name: string
  }>
  sameAs: readonly string[]
}

// Alias para compatibilidad con imports existentes
export type OrganizationSchema = OrganizationGraphDocument

/** Genera el JSON-LD @graph de la institución educativa.
 *  Usa co-tipos School + LocalBusiness para cubrir tanto rich results
 *  educativos como el panel de negocio local de Google.
 */
export function getOrganizationSchema(): OrganizationGraphDocument {
  const node: OrganizationNode = {
    '@type': ['School', 'LocalBusiness'],
    // @id estable permite que cualquier página que emita este grafo
    // contribuya al mismo Knowledge Graph entity.
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(SITE_LOGO_PATH),
      // Dimensiones reales del logo institucional (PNG)
      width: 200,
      height: 200,
    },
    image: absoluteUrl(SITE_LOGO_PATH),
    // 2026-09-28: Descripción JSON-LD con francés desde 4.º de primaria y doble titulación MX/US.
    description:
      'Instituto Winston Churchill: colegio bilingüe en Ciudad Madero. Kínder, primaria y secundaria con más de 30 años. Respaldo de University of Cambridge. Francés desde 4.º de primaria y en secundaria. Doble titulación con validez en México y Estados Unidos.',
    telephone: SITE_PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_ADDRESS.streetAddress,
      addressLocality: SITE_ADDRESS.addressLocality,
      addressRegion: SITE_ADDRESS.addressRegion,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.addressCountry,
    },
    // 2026-09-26: Horarios permitidos Lun–Vie 7:00–19:30 y Sáb 9:00–13:00.
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '07:00',
        closes: '19:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    // 2026-09-26: Área de servicio local.
    areaServed: [
      { '@type': 'City', name: 'Ciudad Madero' },
      { '@type': 'City', name: 'Tampico' },
    ],
    // 2026-09-26: sameAs solo redes oficiales; sin winstonkinder.edu.mx.
    sameAs: SITE_SOCIAL_LINKS,
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [node],
  }
}
