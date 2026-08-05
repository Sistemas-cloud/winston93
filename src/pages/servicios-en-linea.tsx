import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'

// 2026-07-03: Tipo de servicio en línea con enlace opcional para accesibilidad SEO.
interface ServicioEnLinea {
  id: string
  nombre: string
  icono: string
  link?: string
  destacado: boolean
  isNuevo?: boolean
  // 2026-08-04: Marca servicios visibles pero aún no disponibles (sin enlace / no clicables).
  enConstruccion?: boolean
}

export default function ServiciosEnLinea() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const servicios: ServicioEnLinea[] = [
    {
      id: 'alta-de-facturacion',
      nombre: 'ALTA DE FACTURACIÓN',
      icono: '/images/servicios/alta.png',
      // 2026-07-22: Redirigido al portal unificado de servicios administrativos.
      link: 'https://servicios-admin.vercel.app/',
      destacado: false
    },
    {
      id: 'colegiaturas',
      nombre: 'COLEGIATURAS',
      icono: '/images/servicios/colegiaturas.png',
      // 2026-07-22: Redirigido al portal unificado de servicios administrativos.
      link: 'https://servicios-admin.vercel.app/',
      destacado: false
    },
    {
      id: 'inscripciones',
      nombre: 'INSCRIPCIONES',
      icono: '/images/servicios/usuario.png',
      // 2026-07-22: Redirigido al portal unificado de servicios administrativos.
      link: 'https://servicios-admin.vercel.app/',
      destacado: false
    },
    // 2026-08-04: Se elimina por completo "TAREAS EN LÍNEA" del catálogo.
    {
      id: 'servicios-internos',
      nombre: 'SERVICIOS INTERNOS',
      icono: '/images/servicios/servicios_internos.png',
      // 2026-08-04: Se mantiene visible pero sin enlace; badge "En construcción".
      enConstruccion: true,
      destacado: false
    },
    {
      id: 'registro-para-examen',
      nombre: 'REGISTRO PARA EXAMEN',
      icono: '/images/servicios/registro.png',
      link: 'https://agendaw.vercel.app/',
      destacado: false
    },
    {
      // 2026-04-14: Nuevo acceso directo al portal SSIW con icono institucional de "caminando a la escuela".
      id: 'ssiw-login',
      // 2026-04-14: Ajuste de copy solicitado por el usuario para mostrar el nombre correcto del servicio.
      nombre: 'ENTREGA A PIE',
      icono: '/images/servicios/caminando-a-la-escuela.png',
      link: 'https://ssiw.vercel.app/login',
      // 2026-04-14: Bandera para marcar visualmente este servicio como nuevo.
      isNuevo: true,
      destacado: false
    }
  ]

  // 2026-07-03: Feedback visual al activar un servicio (sin window.open; el enlace es nativo).
  const handleServiceActivate = (id: string) => {
    setActiveServiceId(id)
    setTimeout(() => {
      setActiveServiceId(null)
    }, prefersReducedMotion ? 20 : 170)
  }

  // 2026-07-03: Metadata SEO centralizada para /servicios-en-linea.
  const pageSeo = SITE_ROUTES.find((route) => route.path === '/servicios-en-linea')!

  // 2026-08-04: Misma animación de baile/parpadeo para badges "Nuevo" y "En construcción".
  const badgePulse = prefersReducedMotion
    ? undefined
    : {
        scale: [1, 1.12, 1],
        rotate: [0, -4, 4, 0],
        opacity: [1, 0.65, 1],
        boxShadow: [
          '0 0 0 0 rgba(250,204,21,0.55)',
          '0 0 0 8px rgba(250,204,21,0)',
          '0 0 0 0 rgba(250,204,21,0)',
        ],
      }

  const badgeTransition = prefersReducedMotion
    ? undefined
    : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const }

  // 2026-08-04: Grid 2×3 uniforme (sin span especial) para que todas las tarjetas queden alineadas.
  const cardClassName = (servicio: ServicioEnLinea) =>
    `flex flex-col items-center justify-start p-6 md:p-8 pt-10 md:pt-12 rounded-lg service-card relative overflow-visible no-underline h-full ${
      servicio.enConstruccion
        ? 'cursor-not-allowed opacity-90 pointer-events-none'
        : 'group transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-lg cursor-pointer'
    }`

  const renderServiceContent = (servicio: ServicioEnLinea) => (
    <>
      {servicio.isNuevo && (
        // 2026-04-14: Badge animado para destacar visualmente el nuevo servicio.
        <motion.span
          className="absolute top-3 right-3 z-10 rounded-full bg-yellow-400 px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-900 shadow-md"
          animate={badgePulse}
          transition={badgeTransition}
        >
          Nuevo
        </motion.span>
      )}
      {/* 2026-08-04: Badge "En construcción" con el mismo baile/parpadeo que "Nuevo", arriba del bloque. */}
      {servicio.enConstruccion && (
        <motion.span
          className="absolute top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E3FB07] px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-900 shadow-md"
          animate={badgePulse}
          transition={badgeTransition}
        >
          En construcción
        </motion.span>
      )}
      <motion.div
        className={`mb-5 p-5 md:p-6 rounded-lg bg-gray-100 transition-colors duration-300 ${
          servicio.enConstruccion ? '' : 'group-hover:bg-blue-600'
        }`}
        animate={
          activeServiceId === servicio.id && !prefersReducedMotion && !servicio.enConstruccion
            ? { scale: [1, 1.06, 0.98, 1], rotate: [0, -3, 2, 0] }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 2026-07-03: width/height explícitos para reducir CLS en iconos de servicios. */}
        <motion.img
          src={servicio.icono}
          alt={servicio.nombre}
          width={80}
          height={80}
          className="w-16 h-16 md:w-20 md:h-20 object-contain service-icon"
          style={{
            filter: 'grayscale(100%) opacity(60%)',
            transition: 'all 0.3s ease',
          }}
          whileHover={
            prefersReducedMotion || servicio.enConstruccion ? undefined : { scale: 1.04 }
          }
          whileTap={
            prefersReducedMotion || servicio.enConstruccion ? undefined : { scale: 0.95 }
          }
        />
      </motion.div>
      <h3
        className={`text-center font-semibold uppercase tracking-wide text-base md:text-lg text-gray-700 transition-colors duration-300 leading-snug min-h-[2.5rem] flex items-center justify-center ${
          servicio.enConstruccion ? '' : 'group-hover:text-white'
        }`}
      >
        {servicio.nombre}
      </h3>
    </>
  )

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const icon = e.currentTarget.querySelector('.service-icon') as HTMLImageElement | null
      if (icon) {
        icon.style.filter = 'grayscale(0%) brightness(0) invert(1)'
        icon.style.opacity = '1'
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const icon = e.currentTarget.querySelector('.service-icon') as HTMLImageElement | null
      if (icon) {
        icon.style.filter = 'grayscale(100%) opacity(60%)'
        icon.style.opacity = '0.6'
      }
    },
  }

  return (
    <div className="servicios-en-linea-page">
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />

      <style jsx global>{`
        /* 2026-08-04: Hover de icono solo en tarjetas activas (.group), no en "en construcción". */
        .service-icon {
          filter: grayscale(100%) opacity(60%);
          transition: all 0.3s ease;
        }
        .group:hover .service-icon {
          filter: grayscale(0%) brightness(0) invert(1) !important;
          opacity: 1 !important;
        }
      `}</style>

      {/* Header con navegación */}
      <Navigation currentSection={1} />

      {/* Contenido principal */}
      <div className="min-h-screen bg-white pt-16 md:pt-[72px]">
        {/* Título de la página */}
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="text-center">
            {/* 2026-03-27: Ajuste de tipografía y espaciado para lectura en móvil sin cambiar estructura de sección. */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-700 uppercase tracking-wide mb-4">
              Servicios en Línea
            </h1>
            <div className="w-32 h-0.5 bg-gray-400 mx-auto"></div>
          </div>

          {/* Grid de servicios — 2026-08-04: 6 ítems en filas pareja (2×3 en desktop) con altura uniforme. */}
          {/* 2026-03-27: Entrada escalonada para iconos/cards de servicios. */}
          {/* 2026-07-03: Tarjetas como <a> reales (o <button> sin enlace) para SEO y accesibilidad. */}
          <motion.div
            className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-stretch"
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'show'}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.09,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {servicios.map((servicio) => {
              const motionProps = {
                initial: prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.97 },
                animate: prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 },
                transition: prefersReducedMotion
                  ? undefined
                  : { duration: 0.45, ease: [0.25, 1, 0.5, 1] as const },
                whileTap:
                  prefersReducedMotion || servicio.enConstruccion
                    ? undefined
                    : { scale: 0.985 },
              }

              // 2026-08-04: Servicio en construcción — visible, sin enlace ni interacción.
              if (servicio.enConstruccion) {
                return (
                  <motion.div
                    key={servicio.id}
                    role="group"
                    aria-label={`${servicio.nombre} — en construcción`}
                    aria-disabled="true"
                    className={cardClassName(servicio)}
                    {...motionProps}
                  >
                    {renderServiceContent(servicio)}
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
                    className={cardClassName(servicio)}
                    onClick={() => handleServiceActivate(servicio.id)}
                    {...hoverHandlers}
                    {...motionProps}
                  >
                    {renderServiceContent(servicio)}
                  </motion.a>
                )
              }

              return (
                <motion.button
                  key={servicio.id}
                  type="button"
                  aria-label={servicio.nombre}
                  className={`${cardClassName(servicio)} border-0 bg-transparent w-full`}
                  onClick={() => handleServiceActivate(servicio.id)}
                  {...hoverHandlers}
                  {...motionProps}
                >
                  {renderServiceContent(servicio)}
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
