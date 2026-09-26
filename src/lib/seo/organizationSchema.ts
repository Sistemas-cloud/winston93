// 2026-07-03: JSON-LD Schema.org tipo School para rich results de Google.
// School es subtipo de EducationalOrganization, recomendado para colegios.
// 2026-09-26: Enriquecer School existente (horarios + areaServed Cd. Madero/Tampico); sin duplicar ni sameAs a winstonkinder.

import {
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_LOGO_PATH,
  SITE_NAME,
  SITE_PHONE,
  SITE_SOCIAL_LINKS,
  SITE_URL,
  absoluteUrl,
} from './site-config'

export interface OrganizationSchema {
  '@context': 'https://schema.org'
  '@type': 'School'
  name: string
  url: string
  logo: string
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

/** Genera el objeto JSON-LD de la institución educativa. */
export function getOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(SITE_LOGO_PATH),
    image: absoluteUrl(SITE_LOGO_PATH),
    description: SITE_DESCRIPTION,
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
    // 2026-09-26: Área de servicio local (sin vincular otras instituciones).
    areaServed: [
      { '@type': 'City', name: 'Ciudad Madero' },
      { '@type': 'City', name: 'Tampico' },
    ],
    // 2026-09-26: sameAs solo redes oficiales; sin winstonkinder.edu.mx.
    sameAs: SITE_SOCIAL_LINKS,
  }
}
