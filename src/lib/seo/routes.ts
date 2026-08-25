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
    // 2026-08-21: Meta home sin Oxford.
    description:
      'Instituto educativo con 30 años de experiencia. Educación bilingüe integral: Kínder, Primaria y Secundaria. Respaldados por University of Cambridge.',
    keywords: [
      'instituto',
      'educación',
      'bilingüe',
      'kínder',
      'primaria',
      'secundaria',
      'Winston Churchill',
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
  // 2026-08-20: Hannia — página de admisiones (proceso, requisitos, FAQ).
  {
    path: '/admisiones',
    title: 'Admisiones - Instituto Winston Churchill',
    description:
      'Proceso de admisión al Instituto Winston Churchill: agenda tu cita, requisitos por nivel y preguntas frecuentes. Educación bilingüe en Cd. Madero.',
    keywords: [
      'admisiones',
      'inscripciones',
      'requisitos',
      'examen de admisión',
      'Winston Churchill',
      'Cd. Madero',
    ],
    changeFrequency: 'weekly',
    priority: 0.95,
  },
  // 2026-08-20: Slot SEO para guía visual / requisitos (infografía pendiente).
  {
    path: '/admisiones/requisitos',
    title: 'Guía de registro y requisitos - Admisiones Winston',
    description:
      'Guía visual del registro para examen de admisión y requisitos por nivel en el Instituto Winston Churchill.',
    keywords: [
      'requisitos admisión',
      'registro examen',
      'guía admisión',
      'Winston Churchill',
    ],
    changeFrequency: 'monthly',
    priority: 0.7,
  },
] as const
