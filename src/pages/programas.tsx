// 2026-08-24: Hannia — /programas aesthetic new-era 2026: luz, tipografía editorial,
// motion suave y asimetría. Fotos landscape completas (sin recorte).
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'

interface Program {
  id: string
  num: string
  title: string
  subtitle: string
  lead: string
  body: string
  image: string
  w: number
  h: number
  imageAlt: string
  glow: string
}

const PROGRAMS: Program[] = [
  {
    id: 'educacion-financiera',
    num: '01',
    title: 'Educación financiera',
    subtitle: 'Entrepreneurs',
    lead: 'Fomentamos la cultura del emprendimiento desde edades tempranas.',
    body: 'Nuestros alumnos no sólo imaginan ideas innovadoras: aprenden a construir un negocio desde cero. Desarrollan planes de negocio reales, crean estrategias de marketing, realizan proyecciones financieras básicas y presentan sus proyectos de forma profesional, fortaleciendo liderazgo, pensamiento estratégico y toma de decisiones.',
    image: '/images/PROGRAMAS/emprende.jpg',
    w: 1920,
    h: 1280,
    imageAlt: 'Programa Entrepreneurs — Instituto Winston Churchill',
    glow: 'rgba(255, 180, 42, 0.28)',
  },
  {
    id: 'mindfulness',
    num: '02',
    title: 'Mindfulness',
    subtitle: 'Bienestar y concentración',
    lead: 'Atención plena para el bienestar emocional y la concentración.',
    body: 'Con ejercicios de respiración, enfoque y relajación, nuestros alumnos aprenden a gestionar sus emociones y mejorar su rendimiento académico.',
    image: '/images/PROGRAMAS/socioemocional.jpg',
    w: 6000,
    h: 4000,
    imageAlt: 'Programa Mindfulness — Instituto Winston Churchill',
    glow: 'rgba(1, 59, 223, 0.22)',
  },
  {
    id: 'formacion-social',
    num: '03',
    title: 'Formación social y humana',
    subtitle: 'Comunidad y valores',
    lead: 'Entendimiento del mundo a través del respeto y la participación.',
    body: 'Promovemos la conciencia social, la identidad cultural y el compromiso con la comunidad mediante actividades integradoras y experiencias significativas.',
    image: '/images/secundaria/formacion/formacion1.JPG',
    w: 4032,
    h: 2584,
    imageAlt: 'Formación social y humana — Instituto Winston Churchill',
    glow: 'rgba(227, 251, 7, 0.35)',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

function ProgramBlock({ program, index }: { program: Program; index: number }) {
  const reverse = index % 2 === 1
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // 2026-08-24: Parallax suave en la foto (scale 1→1.04), sin recortar el contenido.
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1])

  return (
    <section
      ref={ref}
      id={program.id}
      className="scroll-mt-28 relative overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            index % 2 === 0
              ? 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FD 100%)'
              : 'linear-gradient(180deg, #F8F9FD 0%, #FFFFFF 100%)',
        }}
      />
      {/* Orbe de color 2026 — atmósfera, no ruido */}
      <div
        className="pointer-events-none absolute -z-0 blur-3xl"
        style={{
          width: '42vw',
          height: '42vw',
          maxWidth: 480,
          maxHeight: 480,
          borderRadius: '50%',
          background: program.glow,
          opacity: 0.55,
          top: reverse ? '10%' : 'auto',
          bottom: reverse ? 'auto' : '8%',
          left: reverse ? 'auto' : '-8%',
          right: reverse ? '-8%' : 'auto',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28 lg:px-10">
        <div
          className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 ${
            reverse ? '' : ''
          }`}
        >
          {/* Media */}
          <motion.div
            className={`lg:col-span-7 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="group relative">
              {/* Marco flotante */}
              <div
                className="absolute -inset-3 rounded-[1.75rem] opacity-0 transition duration-500 group-hover:opacity-100 md:-inset-4"
                style={{
                  background: `linear-gradient(135deg, ${program.glow}, transparent 60%)`,
                }}
              />
              <div className="relative overflow-hidden rounded-[1.25rem] bg-white shadow-[0_24px_80px_rgba(1,59,223,0.12)] ring-1 ring-black/[0.04] md:rounded-[1.5rem]">
                <motion.div style={{ scale: imgScale }} className="origin-center">
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    width={program.w}
                    height={program.h}
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="h-auto w-full"
                    priority={index === 0}
                  />
                </motion.div>
              </div>
              {/* Chip de programa */}
              <div className="absolute -bottom-4 left-6 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-md ring-1 ring-black/5 md:left-8">
                <span className="h-2 w-2 rounded-full bg-[#E3FB07]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#013BDF]">
                  {program.subtitle}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Copy editorial */}
          <motion.div
            className={`lg:col-span-5 ${reverse ? 'lg:order-1 lg:pr-4' : 'lg:order-2 lg:pl-2'}`}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-10 select-none text-[7rem] font-extrabold leading-none text-[#013BDF]/[0.06] md:-top-14 md:text-[9rem]"
              >
                {program.num}
              </span>

              <p className="relative mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#013BDF]">
                Programa {program.num}
              </p>
              <h2 className="relative text-[1.85rem] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-gray-900 sm:text-4xl md:text-[2.65rem]">
                {program.title}
              </h2>
              <p className="relative mt-3 text-lg font-semibold text-[#013BDF]/90 md:text-xl">
                {program.subtitle}
              </p>

              <motion.div
                className="relative my-7 h-[3px] w-16 origin-left rounded-full bg-[#E3FB07]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
              />

              <p className="relative mb-4 text-base font-semibold leading-relaxed text-gray-900 md:text-lg">
                {program.lead}
              </p>
              <p className="relative text-[0.95rem] leading-[1.75] text-gray-500 md:text-base">
                {program.body}
              </p>

              <div className="relative mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/admisiones#examen-admision"
                  className="group/btn inline-flex items-center gap-2 rounded-full bg-[#013BDF] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_32px_rgba(1,59,223,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#012A9E] hover:shadow-[0_16px_40px_rgba(1,59,223,0.4)]"
                >
                  Admisiones
                  <span className="inline-block text-[#E3FB07] transition group-hover/btn:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/contacto"
                  className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400 transition hover:text-[#013BDF]"
                >
                  Hablar con nosotros
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function ProgramasPage() {
  const pageSeo = SITE_ROUTES.find((route) => route.path === '/programas')!

  return (
    <div className="overflow-x-hidden bg-[#FAFBFF]">
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />
      <Navigation currentSection={1} />

      {/* Hero 2026 — mesh suave + tipografía grande */}
      <header className="relative overflow-hidden px-4 pb-20 pt-28 md:pb-28 md:pt-36">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 15% 20%, rgba(227,251,7,0.22) 0%, transparent 50%), radial-gradient(ellipse 70% 60% at 90% 80%, rgba(255,255,255,0.12) 0%, transparent 45%), linear-gradient(160deg, #013BDF 0%, #012A9E 52%, #011F75 100%)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E3FB07]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/90">
              Instituto Winston Churchill · #soywinston
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-[3.25rem] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05, ease }}
          >
            Programas
          </motion.h1>

          <motion.p
            className="mx-auto max-w-xl text-sm leading-relaxed text-white/85 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease }}
          >
            Emprendimiento, mindfulness y formación humana — experiencias que forman carácter
            más allá del aula, en Ciudad Madero.
          </motion.p>

          <motion.nav
            className="mt-12 flex flex-wrap items-center justify-center gap-2.5"
            aria-label="Saltar a programa"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease }}
          >
            {PROGRAMS.map((p, i) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className={`rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 ${
                  i === 0
                    ? 'bg-[#E3FB07] text-[#012A9E] shadow-lg shadow-black/15'
                    : 'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-[#E3FB07]/60 hover:bg-white/10'
                }`}
              >
                <span className="mr-1.5 opacity-50">{p.num}</span>
                {p.subtitle}
              </a>
            ))}
          </motion.nav>
        </div>

        {/* Indicador scroll */}
        <motion.div
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">
            Scroll
          </span>
          <motion.span
            className="h-8 w-px bg-gradient-to-b from-white/50 to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </motion.div>
      </header>

      {/* Intro strip */}
      <div className="border-b border-[#013BDF]/5 bg-white/80 px-4 py-8 backdrop-blur-sm md:py-10">
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-gray-500 md:text-base">
          Tres caminos. Una misma familia{' '}
          <span className="font-semibold text-[#013BDF]">Winston</span>. Diseñados para acompañar
          el crecimiento académico con propósito.
        </p>
      </div>

      {PROGRAMS.map((program, index) => (
        <ProgramBlock key={program.id} program={program} index={index} />
      ))}

      {/* 2026-08-24: Un solo CTA de cierre (sin EnrollmentCTA duplicado). */}
      <section className="relative overflow-hidden px-4 py-20 md:py-24">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #013BDF 0%, #012A9E 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: '#E3FB07' }}
        />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E3FB07]">
            Working for a Brighter Future
          </p>
          <h2 className="mb-4 text-2xl font-extrabold uppercase tracking-wide text-white md:text-4xl">
            El siguiente paso es tuyo
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm text-white/80">
            Agenda tu visita y conoce cómo estos programas viven en el campus Winston.
          </p>
          <Link
            href="/admisiones#examen-admision"
            className="inline-flex rounded-full bg-[#E3FB07] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#012A9E] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Ir a admisiones
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
