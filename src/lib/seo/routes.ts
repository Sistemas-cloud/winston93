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
    // 2026-09-25: Title SEO local (spam update Sep 2026) — solo home.
    title: 'Instituto Winston Churchill | Colegio bilingüe en Cd. Madero',
    // 2026-09-22: Meta con keyword principal + oraciones cortas (SEO/GEO).
    description:
      'Instituto Winston Churchill: colegio bilingüe en Ciudad Madero. Kínder, primaria y secundaria con más de 30 años. Respaldo de University of Cambridge.',
    keywords: [
      'Instituto Winston Churchill',
      'instituto',
      'educación',
      'bilingüe',
      'kínder',
      'primaria',
      'secundaria',
      'Winston Churchill',
      'Cambridge',
      'Ciudad Madero',
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
    title: 'Primaria bilingüe, Cambridge y estancia | Instituto Winston Churchill',
    // 2026-09-22: Título alineado al contenido + keyword Primaria.
    description:
      'Primaria bilingüe en el Instituto Winston Churchill: inglés diario, respaldo Cambridge, extracurriculares y servicio de estancia en Ciudad Madero.',
    keywords: [
      'Primaria',
      'primaria bilingüe',
      'Instituto Winston Churchill',
      'Cambridge',
      'estancia',
      'Cd. Madero',
      'educación integral',
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
    // 2026-09-22: Meta con keyword "Winston Life" + copy legible.
    description:
      'Winston Life: vida estudiantil en el Instituto Winston Churchill. Deportes, emprendimiento y comunidad #SoyWinston en Ciudad Madero.',
    keywords: [
      'Winston Life',
      'vida estudiantil',
      'deportes',
      'emprendimiento',
      'SoyWinston',
      'Instituto Winston Churchill',
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
