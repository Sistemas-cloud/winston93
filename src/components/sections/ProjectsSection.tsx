import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import AnimatedElement from '@/components/AnimatedElement'
import { OPEN_HOUSE_ALT, OPEN_HOUSE_BANNER_SRC, OPEN_HOUSE_FORM_URL } from '@/lib/open-house'

type Slide = {
  image: string
  title: string
  subtitle: string
  alignRight?: boolean
  openHouse?: boolean
}

// 2026-10-13: Primera diapositiva = banner Open House 21 nov (la imagen ya trae su texto; lleva botón al formulario).
const slides: Slide[] = [
  {
    image: OPEN_HOUSE_BANNER_SRC,
    title: 'OPEN HOUSE',
    subtitle: '21 DE NOVIEMBRE 2026',
    openHouse: true,
  },
  {
    image: '/images/slider/SLIDE_INICIO.jpg',
    title: 'FORMA PARTE',
    subtitle: 'DE LA FAMILIA WINSTON CHURCHILL',
  },
  {
    image: '/images/slider/SLIDE_INICIO_1.jpg',
    title: 'WORKING FOR A',
    subtitle: 'BRIGHTER FUTURE',
  },
  {
    image: '/images/slider/SLIDE_INICIO_2.jpg',
    title: 'EDUCACIÓN QUE',
    subtitle: 'TRASCIENDE',
    alignRight: true,
  },
]

export default function SliderSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  // 2026-04-14: Ref para swipe táctil en móvil, elimina dependencia de estado JS para detectar dispositivo.
  const touchStartX = useRef<number>(0)
  const slide = slides[currentSlide]

  // Auto-avance cada 5 s; 2026-10-13: el Open House se queda 8 s porque trae más texto.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, slide.openHouse ? 8000 : 5000)
    return () => window.clearTimeout(t)
  }, [currentSlide, slide.openHouse])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  // 2026-04-14: Soporte de swipe táctil para móvil/tablet, umbral de 50px para evitar activaciones accidentales.
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide()
  }

  return (
    // 2026-10-13: min-h igual a la sección contenedora; en móvil/tablet h-full no aplica (padre sin altura fija).
    <div
      className="w-full h-full min-h-[70vh] md:min-h-[75vh] lg:min-h-0 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Imágenes de fondo — solo la activa en DOM para no descargar 3 JPG grandes */}
      <div className="absolute inset-0">
        {/* 2026-09-26: next/image fill + sizes (sección diferida); sin priority ni recomprimir JPG. */}
        {/* 2026-10-13: En móvil el Open House se encuadra a la derecha, donde está el texto del evento. */}
        <div key={currentSlide} className="absolute inset-0 z-10 opacity-100">
          <Image
            src={slide.image}
            alt={slide.openHouse ? OPEN_HOUSE_ALT : `${slide.title} ${slide.subtitle}`}
            fill
            sizes="100vw"
            loading="lazy"
            decoding="async"
            className={slide.openHouse ? 'object-cover object-[96%_center] md:object-center' : 'object-cover'}
          />
        </div>
        {!slide.openHouse && (
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-black/30 to-black/10 md:bg-black/25 lg:bg-black/20"></div>
        )}
      </div>

      {/* 2026-04-14: Flechas posicionadas absolutas a los lados, sin indicadores (quitados en todos los dispositivos). */}
      {/* Flecha izquierda */}
      <button
        onClick={prevSlide}
        aria-label="Slide anterior"
        className="
          absolute left-3 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40
          h-11 w-11 md:h-12 md:w-12 lg:h-14 lg:w-14
          bg-black/30 hover:bg-black/50 active:bg-black/60
          text-white rounded-full flex items-center justify-center
          border border-white/30 transition-all duration-300 backdrop-blur-sm
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
        "
      >
        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Flecha derecha */}
      <button
        onClick={nextSlide}
        aria-label="Slide siguiente"
        className="
          absolute right-3 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40
          h-11 w-11 md:h-12 md:w-12 lg:h-14 lg:w-14
          bg-black/30 hover:bg-black/50 active:bg-black/60
          text-white rounded-full flex items-center justify-center
          border border-white/30 transition-all duration-300 backdrop-blur-sm
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
        "
      >
        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {slide.openHouse ? (
        // 2026-10-13: Botón al formulario de registro del Open House.
        <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center px-14 md:bottom-12">
          <h2 className="sr-only">Open House — 21 de noviembre de 2026, Primaria y Secundaria</h2>
          <a
            href={OPEN_HOUSE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#E3FB07] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#013BDF] md:px-8 md:py-4 md:text-base"
          >
            Regístrate al Open House
            <span aria-hidden="true">→</span>
          </a>
        </div>
      ) : (
      /* 2026-04-14: Texto al fondo en móvil (justify-end + pb) para no competir con las flechas;
          centrado vertical en tablet/desktop. Padding horizontal amplio para no solapar con flechas.
          2026-10-13: absolute inset-0 para que el texto siga abajo ahora que el slider tiene alto mínimo en móvil. */
      <div className="absolute inset-0 z-30 flex flex-col justify-end md:justify-center pb-10 md:pb-0">
        <div className="container mx-auto px-14 md:px-16 lg:px-20">
          <div
            className={`text-white ${
              slide.alignRight
                ? 'md:w-1/2 md:max-w-lg md:ml-auto md:pl-4'
                : 'md:w-1/2 md:max-w-lg'
            }`}
          >
            <AnimatedElement>
              <h2 className="text-[clamp(1.6rem,5vw,3rem)] font-bold mb-1 md:mb-3 tracking-wide leading-tight drop-shadow-lg">
                {slide.title}
              </h2>
              <h3 className="text-[clamp(1rem,3.5vw,2.25rem)] font-bold mb-4 md:mb-6 text-blue-300 leading-tight drop-shadow-md">
                {slide.subtitle}
              </h3>
              <button
                // 2026-04-14: El CTA del slider ahora dirige al sistema de agenda externo.
                onClick={() => {
                  window.location.href = 'https://agendaw.vercel.app/'
                }}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold transition-colors duration-300 text-sm md:text-base shadow-lg"
              >
                Agendar cita
              </button>
            </AnimatedElement>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
