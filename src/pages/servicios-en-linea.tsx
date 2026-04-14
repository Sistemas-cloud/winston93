import Head from 'next/head'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Navigation from '@/components/Navigation'

export default function ServiciosEnLinea() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const servicios = [
    {
      id: 'alta-de-facturacion',
      nombre: 'ALTA DE FACTURACIÓN',
      icono: '/images/servicios/alta.png',
      link: 'https://www.winston93.edu.mx/pagos/login.php',
      destacado: false
    },
    {
      id: 'colegiaturas',
      nombre: 'COLEGIATURAS',
      icono: '/images/servicios/colegiaturas.png',
      link: 'https://www.winston93.edu.mx/enlinea3',
      destacado: false
    },
    {
      id: 'inscripciones',
      nombre: 'INSCRIPCIONES',
      icono: '/images/servicios/usuario.png',
      link: 'https://www.winston93.edu.mx/admisiones',
      destacado: false
    },
    {
      id: 'tareas-en-linea',
      nombre: 'TAREAS EN LÍNEA',
      icono: '/images/servicios/tareas.png',
      destacado: false
    },
    {
      id: 'servicios-internos',
      nombre: 'SERVICIOS INTERNOS',
      icono: '/images/servicios/servicios_internos.png',
      link: 'https://www.winston93.edu.mx/news-lunch/',
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

  const handleServiceClick = (id: string, link?: string) => {
    // 2026-03-27: Micro-interacción de click para dar feedback visual antes de navegar.
    setActiveServiceId(id)
    setTimeout(() => {
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer')
      }
      setActiveServiceId(null)
    }, prefersReducedMotion ? 20 : 170)
  }

  return (
    <div className="servicios-en-linea-page">
      <Head>
        <title>Servicios en Línea - Instituto Winston Churchill</title>
        <meta name="description" content="Accede a nuestros servicios en línea: colegiaturas, inscripciones, tareas y más." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style jsx global>{`
          .service-icon {
            filter: grayscale(100%) opacity(60%);
            transition: all 0.3s ease;
          }
          .group:hover .service-icon {
            filter: grayscale(0%) brightness(0) invert(1) !important;
            opacity: 1 !important;
          }
          /* Estilo más específico para asegurar que funcione */
          .service-card:hover .service-icon {
            filter: grayscale(0%) brightness(0) invert(1) !important;
            opacity: 1 !important;
          }
        `}</style>
      </Head>

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

          {/* Grid de servicios */}
          {/* 2026-03-27: Entrada escalonada para iconos/cards de servicios. */}
          <motion.div
            className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 max-w-6xl mx-auto"
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'show'}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.09,
                  delayChildren: 0.1
                }
              }
            }}
          >
            {servicios.map((servicio) => (
              <motion.div
                key={servicio.id}
                className={`flex flex-col items-center p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-lg rounded-lg cursor-pointer group service-card relative overflow-hidden ${
                  servicio.id === 'ssiw-login' ? 'md:col-span-2 lg:col-span-3 md:max-w-md lg:max-w-sm md:mx-auto lg:justify-self-center' : ''
                }`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={prefersReducedMotion ? undefined : { duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                onClick={() => handleServiceClick(servicio.id, servicio.link)}
                onMouseEnter={(e) => {
                  const icon = e.currentTarget.querySelector('.service-icon') as HTMLImageElement;
                  if (icon) {
                    icon.style.filter = 'grayscale(0%) brightness(0) invert(1)';
                    icon.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  const icon = e.currentTarget.querySelector('.service-icon') as HTMLImageElement;
                  if (icon) {
                    icon.style.filter = 'grayscale(100%) opacity(60%)';
                    icon.style.opacity = '0.6';
                  }
                }}
              >
                {servicio.isNuevo && (
                  // 2026-04-14: Badge animado para destacar visualmente el nuevo servicio.
                  <motion.span
                    className="absolute top-3 right-3 z-10 rounded-full bg-yellow-400 px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-900 shadow-md"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { scale: [1, 1.12, 1], rotate: [0, -4, 4, 0], boxShadow: ['0 0 0 0 rgba(250,204,21,0.55)', '0 0 0 8px rgba(250,204,21,0)', '0 0 0 0 rgba(250,204,21,0)'] }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                    }
                  >
                    Nuevo
                  </motion.span>
                )}
                <motion.div
                  className="mb-5 p-5 md:p-6 rounded-lg bg-gray-100 group-hover:bg-blue-600 transition-colors duration-300"
                  animate={
                    activeServiceId === servicio.id && !prefersReducedMotion
                      ? { scale: [1, 1.06, 0.98, 1], rotate: [0, -3, 2, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.img
                    src={servicio.icono}
                    alt={servicio.nombre}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain service-icon"
                    style={{
                      filter: 'grayscale(100%) opacity(60%)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                  />
                </motion.div>
                <h3 className="text-center font-semibold uppercase tracking-wide text-base md:text-lg text-gray-700 group-hover:text-white transition-colors duration-300">
                  {servicio.nombre}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 