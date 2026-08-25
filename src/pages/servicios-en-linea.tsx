// 2026-08-20: Hannia — manita de gato a /servicios-en-linea (brand, jerarquía, CTAs; mismos enlaces).
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'

interface ServicioEnLinea {
  id: string
  nombre: string
  descripcion: string
  icono: string
  link?: string
  isNuevo?: boolean
  enConstruccion?: boolean
}

export default function ServiciosEnLinea() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const servicios: ServicioEnLinea[] = [
    {
      id: 'alta-de-facturacion',
      nombre: 'Alta de facturación',
      descripcion: 'Registra o actualiza tus datos fiscales.',
      icono: '/images/servicios/alta.png',
      link: 'https://servicios-admin.vercel.app/',
    },
    {
      id: 'colegiaturas',
      nombre: 'Colegiaturas',
      descripcion: 'Consulta y paga colegiaturas en línea.',
      icono: '/images/servicios/colegiaturas.png',
      link: 'https://servicios-admin.vercel.app/',
    },
    {
      id: 'inscripciones',
      nombre: 'Inscripciones',
      descripcion: 'Portal de inscripción y trámites administrativos.',
      icono: '/images/servicios/usuario.png',
      link: 'https://servicios-admin.vercel.app/',
    },
    {
      id: 'servicios-internos',
      nombre: 'Servicios internos',
      descripcion: 'Acceso interno próximamente disponible.',
      icono: '/images/servicios/servicios_internos.png',
      enConstruccion: true,
    },
    {
      id: 'registro-para-examen',
      nombre: 'Registro para examen',
      descripcion: 'Agenda tu registro al examen de admisión.',
      icono: '/images/servicios/registro.png',
      link: 'https://agendaw.vercel.app/',
    },
    {
      id: 'ssiw-login',
      nombre: 'Entrega a pie',
      descripcion: 'Portal SSIW para entrega a pie.',
      icono: '/images/servicios/caminando-a-la-escuela.png',
      link: 'https://ssiw.vercel.app/login',
      isNuevo: true,
    },
  ]

  const handleServiceActivate = (id: string) => {
    setActiveServiceId(id)
    setTimeout(() => setActiveServiceId(null), prefersReducedMotion ? 20 : 170)
  }

  const pageSeo = SITE_ROUTES.find((route) => route.path === '/servicios-en-linea')!

  const badgePulse = prefersReducedMotion
    ? undefined
    : {
        scale: [1, 1.06, 1],
        opacity: [1, 0.85, 1],
      }

  const badgeTransition = prefersReducedMotion
    ? undefined
    : { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }

  const cardBase =
    'relative flex h-full flex-col items-center rounded-2xl bg-white p-6 pt-12 text-center shadow-sm ring-1 ring-gray-100 transition md:p-8 md:pt-14'

  const renderBadge = (servicio: ServicioEnLinea) => (
    <>
      {servicio.isNuevo && (
        <motion.span
          className="absolute right-3 top-3 z-10 rounded-full bg-[#E3FB07] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-sm md:text-xs"
          animate={badgePulse}
          transition={badgeTransition}
        >
          Nuevo
        </motion.span>
      )}
      {servicio.enConstruccion && (
        <motion.span
          className="absolute left-1/2 top-3 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E3FB07] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-sm md:text-xs"
          animate={badgePulse}
          transition={badgeTransition}
        >
          En construcción
        </motion.span>
      )}
    </>
  )

  const renderBody = (servicio: ServicioEnLinea, interactive: boolean) => (
    <>
      {renderBadge(servicio)}
      <motion.div
        className={`mb-5 flex h-24 w-24 items-center justify-center rounded-2xl md:h-28 md:w-28 ${
          interactive
            ? 'bg-[#F0F4FF] transition-colors duration-300 group-hover:bg-[#013BDF]'
            : 'bg-gray-100'
        }`}
        animate={
          activeServiceId === servicio.id && !prefersReducedMotion && interactive
            ? { scale: [1, 1.05, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 0.28 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={servicio.icono}
          alt=""
          width={80}
          height={80}
          className={`h-14 w-14 object-contain md:h-16 md:w-16 ${
            interactive
              ? 'opacity-80 transition duration-300 group-hover:brightness-0 group-hover:invert group-hover:opacity-100'
              : 'opacity-50 grayscale'
          }`}
          aria-hidden
        />
      </motion.div>
      <h2
        className={`mb-2 text-sm font-extrabold uppercase tracking-wide md:text-base ${
          interactive
            ? 'text-gray-900 transition-colors group-hover:text-white'
            : 'text-gray-500'
        }`}
      >
        {servicio.nombre}
      </h2>
      <p
        className={`text-xs leading-relaxed md:text-sm ${
          interactive
            ? 'text-gray-600 transition-colors group-hover:text-white/90'
            : 'text-gray-400'
        }`}
      >
        {servicio.descripcion}
      </p>
      {interactive && (
        <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#013BDF] transition-colors group-hover:text-[#E3FB07] md:text-xs">
          Abrir portal →
        </span>
      )}
    </>
  )

  return (
    <div className="servicios-en-linea-page bg-[#F7F8FC]">
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />

      <Navigation currentSection={1} />

      {/* Hero marca */}
      <section
        className="relative overflow-hidden px-4 pb-12 pt-28 md:pb-16 md:pt-32"
        style={{ backgroundColor: '#013BDF' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 85% 20%, rgba(227,251,7,0.22), transparent 50%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(255,255,255,0.1), transparent 45%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#E3FB07]">
            Instituto Winston Churchill
          </p>
          <h1 className="mb-4 text-3xl font-extrabold uppercase tracking-wide text-white md:text-5xl">
            Servicios en línea
          </h1>
          <p className="mx-auto max-w-xl text-sm text-white/90 md:text-base">
            Pagos, inscripciones, facturación y trámites desde un solo lugar. Elige el portal que
            necesitas.
          </p>
        </div>
      </section>

      <div className="px-4 py-12 md:py-16">
        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'show'}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          {servicios.map((servicio) => {
            const motionProps = {
              initial: prefersReducedMotion ? false : { opacity: 0, y: 20 },
              animate: prefersReducedMotion ? undefined : { opacity: 1, y: 0 },
              transition: prefersReducedMotion
                ? undefined
                : { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const },
            }

            if (servicio.enConstruccion) {
              return (
                <motion.div
                  key={servicio.id}
                  role="group"
                  aria-label={`${servicio.nombre} — en construcción`}
                  aria-disabled="true"
                  className={`${cardBase} cursor-not-allowed opacity-90`}
                  {...motionProps}
                >
                  {renderBody(servicio, false)}
                </motion.div>
              )
            }

            if (servicio.link) {
              return (
                <motion.a
                  key={servicio.id}
                  href={servicio.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${servicio.nombre} (se abre en una nueva pestaña)`}
                  className={`${cardBase} group no-underline hover:bg-[#013BDF] hover:shadow-lg hover:ring-[#013BDF]`}
                  onClick={() => handleServiceActivate(servicio.id)}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                  {...motionProps}
                >
                  {renderBody(servicio, true)}
                </motion.a>
              )
            }

            return (
              <motion.button
                key={servicio.id}
                type="button"
                aria-label={servicio.nombre}
                className={`${cardBase} group w-full border-0`}
                onClick={() => handleServiceActivate(servicio.id)}
                {...motionProps}
              >
                {renderBody(servicio, true)}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Ayuda */}
        <div className="mx-auto mt-14 max-w-2xl rounded-2xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-gray-100 md:px-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#013BDF]">
            ¿Necesitas ayuda?
          </p>
          <h2 className="mb-3 text-xl font-extrabold text-gray-900 md:text-2xl">
            Te orientamos con tu trámite
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            Si no encuentras el portal o tienes dudas sobre pagos e inscripciones, escríbenos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/528334378743"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#E3FB07] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:shadow-md"
            >
              WhatsApp
            </a>
            <Link
              href="/contacto"
              className="rounded-full bg-[#013BDF] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#012A9E]"
            >
              Contacto
            </Link>
            <Link
              href="/admisiones"
              className="rounded-full border border-[#013BDF] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#013BDF] transition hover:bg-[#013BDF] hover:text-white"
            >
              Admisiones
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
