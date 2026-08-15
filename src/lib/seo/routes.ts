// 2026-07-03: Rutas estáticas del sitio para sitemap y metadata por página.
// Añadir nuevas páginas aquí para que se incluyan automáticamente en el sitemap.

export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export interface SiteRoute {
  path: string
  title: string
  description: string
  keywords?: readonly string[]
  changeFrequency: ChangeFrequency
  priority: number
}

export const SITE_ROUTES: readonly SiteRoute[] = [
  {
    path: '/',
    title: 'Instituto Winston Churchill - Working for a Brighter Future',
    description:
      // 2026-08-15: Meta description ~155 chars (atractiva + keywords; antes ~174).
      'Colegio bilingüe en Cd. Madero con más de 30 años. Kínder, Primaria y Secundaria. Educación integral respaldada por Oxford y Cambridge.',
    keywords: [
      'instituto',
      'educación',
      'bilingüe',
      'kínder',
      'primaria',
      'secundaria',
      'Winston Churchill',
      'Oxford',
      'Cambridge',
    ],
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    path: '/conocenos',
    title: 'Conócenos - Instituto Winston Churchill',
    description:
      'Conoce la misión, visión e historia del Instituto Winston Churchill. Más de 30 años formando líderes con visión global.',
    keywords: [
      'Instituto Winston Churchill',
      'conócenos',
      'misión',
      'visión',
      'historia',
      'educación',
    ],
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    path: '/oferta-educativa',
    title: 'Oferta Educativa - Instituto Winston Churchill',
    description:
      'Descubre nuestra oferta educativa: Kínder, Primaria y Secundaria. Formación integral para un futuro brillante.',
    keywords: [
      'oferta educativa',
      'kínder',
      'primaria',
      'secundaria',
      'Winston Churchill',
    ],
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    path: '/primaria',
    title: 'Primaria - Instituto Winston Churchill',
    description:
      'Educación primaria bilingüe de excelencia en el Instituto Winston Churchill. Formamos estudiantes con pensamiento crítico y valores sólidos.',
    keywords: [
      'primaria',
      'educación bilingüe',
      'Winston Churchill',
      'educación integral',
      'valores',
      'pensamiento crítico',
    ],
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    path: '/secundaria',
    title: 'Secundaria - Instituto Winston Churchill',
    description:
      'Educación secundaria bilingüe de excelencia en el Instituto Winston Churchill. Formamos estudiantes con pensamiento crítico y formación integral.',
    keywords: [
      'secundaria',
      'educación bilingüe',
      'Winston Churchill',
      'pensamiento crítico',
      'formación integral',
      'idiomas',
    ],
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    path: '/programas',
    title: 'Programas de Mindfulness y Emprendimiento | Winston Churchill',
    description:
      'Descubre nuestros programas especializados en formación social, educación financiera y mindfulness en el Instituto Winston Churchill.',
    keywords: [
      'programas',
      'mindfulness',
      'emprendimiento',
      'educación financiera',
      'Winston Churchill',
    ],
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    path: '/winston-life',
    title: 'Winston Life - Instituto Winston Churchill',
    description:
      'Conoce la vida estudiantil en el Instituto Winston Churchill: deportes, emprendimiento y comunidad #SoyWinston.',
    keywords: [
      'Winston Life',
      'vida estudiantil',
      'deportes',
      'emprendimiento',
      'SoyWinston',
    ],
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    path: '/servicios-en-linea',
    title: 'Servicios en Línea - Instituto Winston Churchill',
    // 2026-08-04: SEO sin "tareas"; servicios internos queda como acceso en construcción.
    description:
      'Accede a nuestros servicios en línea: colegiaturas, inscripciones, facturación y más.',
    keywords: [
      'servicios en línea',
      'colegiaturas',
      'inscripciones',
      'facturación',
      'Winston Churchill',
    ],
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/contacto',
    title: 'Contáctanos - Instituto Winston Churchill',
    description:
      'Agenda una cita y conoce más sobre el Instituto Winston Churchill. Estamos para ayudarte.',
    keywords: [
      'contacto',
      'agenda cita',
      'admisiones',
      'Winston Churchill',
      'Cd. Madero',
    ],
    changeFrequency: 'monthly',
    priority: 0.8,
  },
] as const
