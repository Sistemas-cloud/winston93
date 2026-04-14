import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import Navigation from '@/components/Navigation'

export default function ConocenosPage() {
  const [misionVisible, setMisionVisible] = useState(false)
  const [visionVisible, setVisionVisible] = useState(false)
  const misionRef = useRef<HTMLDivElement>(null)
  const visionRef = useRef<HTMLDivElement>(null)

  // 2026-04-14: IntersectionObserver para animar entrada de secciones.
  useEffect(() => {
    const opts = { threshold: 0.15 }
    const misionObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setMisionVisible(true)
    }, opts)
    const visionObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisionVisible(true)
    }, opts)
    if (misionRef.current) misionObs.observe(misionRef.current)
    if (visionRef.current) visionObs.observe(visionRef.current)
    return () => { misionObs.disconnect(); visionObs.disconnect() }
  }, [])

  return (
    <>
      <Head>
        <title>Conócenos - Instituto Winston Churchill</title>
        <meta name="description" content="Conoce la misión, visión e historia del Instituto Winston Churchill. Más de 30 años formando líderes con visión global." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Instituto Winston Churchill, conócenos, misión, visión, historia, educación" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      {/* ── Banner principal — pantalla completa ── */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/images/conocenos/portada-conoce.png"
          alt="Conócenos - Instituto Winston Churchill"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          {/* 2026-04-14: Tipografía fluida para que el banner se adapte a cualquier ancho. */}
          <h1 className="text-[clamp(2rem,8vw,5rem)] font-bold text-white drop-shadow-lg tracking-widest">
            CONÓCENOS
          </h1>
        </div>
      </section>

      {/* ── Sección Misión ── */}
      {/* 2026-04-14: /adapt — columna única en móvil, dos columnas en md+.
          Imagen tiene overflow visible para que la pleca sobresalga sin cortarse.
          Pleca reposicionada más arriba y hacia la derecha. */}
      <section ref={misionRef} className="bg-white py-14 md:py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6 sm:px-10 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 lg:gap-20">

            {/* Texto — columna izquierda */}
            <div
              className={`w-full md:w-1/2 transition-all duration-1000 ease-out ${
                misionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <h2
                className="text-[clamp(1.8rem,5vw,3.25rem)] font-bold mb-4 md:mb-6 leading-tight"
                style={{ color: '#0050ce' }}
              >
                MISIÓN
              </h2>
              {/* Mínimo 16px en móvil para legibilidad táctil */}
              <p className="text-gray-600 leading-relaxed text-justify text-[clamp(1rem,1.5vw,1.125rem)]">
                Somos una Institución comprometida con la educación de sus hijos.
                Nuestro lema &quot;Trabajar por un futuro brillante&quot; tiene la finalidad de
                formar personas integrales capaces de cambiar nuestra sociedad.
              </p>
            </div>

            {/* Imagen + pleca — columna derecha */}
            {/* overflow-visible permite que la pleca sobresalga del contenedor sin cortarse */}
            <div
              className={`w-full md:w-1/2 relative transition-all duration-1000 ease-out overflow-visible ${
                misionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              {/* Pleca reposicionada: más arriba (-top-8) y más a la derecha (-right-8) */}
              <img
                src="/images/conocenos/pleca-verde.png"
                alt=""
                aria-hidden="true"
                className="absolute -top-8 -right-8 z-10 w-24 md:w-28 lg:w-32 pointer-events-none select-none"
              />
              <img
                src="/images/conocenos/pza1.png"
                alt="Estudiantes del Instituto Winston Churchill"
                className="w-full h-auto rounded-2xl object-contain relative z-0"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── Sección Visión ── */}
      {/* 2026-04-14: /adapt — en móvil el texto aparece primero (flex-col), imagen debajo.
          En desktop la imagen va a la izquierda y el texto a la derecha. */}
      <section ref={visionRef} className="bg-white py-14 md:py-20 lg:py-28">
        <div className="container mx-auto px-6 sm:px-10 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-14 lg:gap-20">

            {/* Texto — en móvil primero, en desktop columna derecha */}
            <div
              className={`w-full md:w-1/2 transition-all duration-1000 ease-out ${
                visionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <h2
                className="text-[clamp(1.8rem,5vw,3.25rem)] font-bold mb-4 md:mb-6 leading-tight"
                style={{ color: '#0050ce' }}
              >
                VISIÓN
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify text-[clamp(1rem,1.5vw,1.125rem)]">
                Somos una Institución comprometida con la educación de sus hijos.
                Nuestro lema &quot;Trabajar por un futuro brillante&quot; tiene la finalidad de
                formar personas integrales capaces de cambiar nuestra sociedad.
              </p>
            </div>

            {/* Imagen — en móvil segundo, en desktop columna izquierda */}
            <div
              className={`w-full md:w-1/2 relative transition-all duration-1000 ease-out ${
                visionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <img
                src="/images/conocenos/pza2.png"
                alt="Estudiantes del Instituto Winston Churchill"
                className="w-full h-auto rounded-2xl object-contain"
              />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
