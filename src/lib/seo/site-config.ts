// 2026-07-03: Configuración SEO centralizada del Instituto Winston Churchill.
// Fuente única de verdad para metadata, canonical, Open Graph, Twitter Cards y Schema.org.

export const SITE_URL = 'https://www.winston93.edu.mx' as const

// 2026-08-19: Google Tag Manager — override opcional con NEXT_PUBLIC_GTM_ID en .env.local
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-57SXS2C5'

// 2026-08-19: Google Ads — etiqueta gtag.js para conversiones/remarketing (AW-11289279900)
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? 'AW-11289279900'

export const SITE_NAME = 'Instituto Winston Churchill' as const

export const SITE_TAGLINE = 'Working for a Brighter Future' as const

export const SITE_DESCRIPTION =
  'Instituto educativo con 30 años de experiencia. Educación bilingüe integral: Kínder, Primaria y Secundaria. Respaldados por Oxford University Press y University of Cambridge.' as const

export const SITE_KEYWORDS = [
  'Instituto Winston Churchill',
  'educación bilingüe',
  'kínder',
  'primaria',
  'secundaria',
  'Cd. Madero',
  'Tamaulipas',
  'Cambridge',
  'Oxford',
  'colegio bilingüe',
] as const

export const SITE_AUTHOR = 'Instituto Winston Churchill' as const
export const SITE_CREATOR = 'Instituto Winston Churchill' as const
export const SITE_PUBLISHER = 'Instituto Winston Churchill' as const

/** Logo institucional (también usado como favicon). */
export const SITE_LOGO_PATH = '/images/logos/logo_winston.png' as const

/** Imagen Open Graph / Twitter Card por defecto (1200x630). */
export const SITE_OG_IMAGE_PATH = '/og-image.jpg' as const

export const SITE_LOCALE = 'es_MX' as const
export const SITE_LANG = 'es' as const

export const SITE_PHONE = '+528334378743' as const
export const SITE_PHONE_DISPLAY = '833 437 8743' as const

export const SITE_ADDRESS = {
  streetAddress: 'Calle 3 #309, Col. Jardín 20 de Noviembre',
  addressLocality: 'Ciudad Madero',
  addressRegion: 'Tamaulipas',
  postalCode: '89440',
  addressCountry: 'MX',
} as const

/** Redes sociales oficiales (sameAs en Schema.org). */
export const SITE_SOCIAL_LINKS = [
  // 2026-08-15: URL canónica de Facebook sin ?locale= (evita redirecciones 3XX reportadas en SEO).
  'https://www.facebook.com/institutowinstonchurchill/',
  'https://www.instagram.com/institutowinstonchurchill/',
  'https://www.tiktok.com/@imagenwinston',
  'https://www.youtube.com/@institutowinstonchurchill5194',
  'https://wa.me/528334378743',
] as const

export const SITE_TWITTER_CREATOR = '@imagenwinston' as const

/** Construye URL absoluta a partir de una ruta relativa. */
export function absoluteUrl(path: string = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (normalized === '/') {
    return SITE_URL
  }
  return `${SITE_URL}${normalized}`
}
