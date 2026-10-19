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
  const [prevSlideIdx, setPrevSlideIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const touchStartX = useRef<number>(0)
  const slide = slides[currentSlide]

  const goTo = (next: number) => {
    if (fading || next === currentSlide) return
    setPrevSlideIdx(currentSlide)
    setCurrentSlide(next)
    setFading(true)
    window.setTimeout(() => setFading(false), 700)
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      goTo((currentSlide + 1) % slides.length)
    }, slide.openHouse ? 8000 : 5000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo usa currentSlide actual
  }, [currentSlide, slide.openHouse])

  const nextSlide = () => goTo((currentSlide + 1) % slides.length)
  const prevSlide = () => goTo((currentSlide - 1 + slides.length) % slides.length)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide()
  }

  return (
    <div
      className="relative h-full min-h-[70vh] w-full overflow-hidden md:min-h-[75vh] lg:min-h-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Capas con crossfade (difuminado al cambiar) */}
      <div className="absolute inset-0">
        {fading && (
          <div
            className="absolute inset-0 z-[5]"
            style={{ animation: 'wlCarouselOut 0.7s ease-out forwards' }}
          >
            <Image
              src={slides[prevSlideIdx].image}
              alt=""
              fill
              sizes="100vw"
              className={
                slides[prevSlideIdx].openHouse
                  ? 'object-cover object-[96%_center] md:object-center'
                  : 'object-cover'
              }
              aria-hidden
            />
          </div>
        )}
        <div
          key={currentSlide}
          className="absolute inset-0 z-10"
          style={{
            animation: fading ? 'wlCarouselIn 0.7s ease-out' : undefined,
          }}
        >
          <Image
            src={slide.image}
            alt={slide.openHouse ? OPEN_HOUSE_ALT : `${slide.title} ${slide.subtitle}`}
            fill
            sizes="100vw"
            loading="lazy"
            decoding="async"
            className={
              slide.openHouse
                ? 'object-cover object-[96%_center] md:object-center'
                : 'object-cover'
            }
          />
        </div>
        {!slide.openHouse && (
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-black/30 to-black/10 md:bg-black/25 lg:bg-black/20" />
        )}
        {/* Difuminado lateral del carrete */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[28] w-16 bg-gradient-to-r from-black/55 via-black/25 to-transparent md:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[28] w-16 bg-gradient-to-l from-black/55 via-black/25 to-transparent md:w-28"
          aria-hidden
        />
        {/* Vignette suave arriba/abajo */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[28] h-16 bg-gradient-to-b from-black/30 to-transparent md:h-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[28] h-20 bg-gradient-to-t from-black/40 to-transparent md:h-28"
          aria-hidden
        />
      </div>

      <style>{`
        @keyframes wlCarouselIn {
          from { opacity: 0; filter: blur(12px); transform: scale(1.05); }
          to { opacity: 1; filter: blur(0); transform: scale(1); }
        }
        @keyframes wlCarouselOut {
          from { opacity: 1; filter: blur(0); }
          to { opacity: 0; filter: blur(8px); }
        }
      `}</style>

      <button
        onClick={prevSlide}
        aria-label="Slide anterior"
        className="absolute left-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:bg-black/60 md:left-4 md:h-12 md:w-12 lg:left-6 lg:h-14 lg:w-14"
      >
        <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide siguiente"
        className="absolute right-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:bg-black/60 md:right-4 md:h-12 md:w-12 lg:right-6 lg:h-14 lg:w-14"
      >
        <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {slide.openHouse ? (
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
        <div className="absolute inset-0 z-30 flex flex-col justify-end pb-10 md:justify-center md:pb-0">
          <div className="container mx-auto px-14 md:px-16 lg:px-20">
            <div
              className={`text-white ${
                slide.alignRight ? 'md:ml-auto md:w-1/2 md:max-w-lg md:pl-4' : 'md:w-1/2 md:max-w-lg'
              }`}
            >
              <AnimatedElement>
                <h2 className="mb-1 text-[clamp(1.6rem,5vw,3rem)] font-bold leading-tight tracking-wide drop-shadow-lg md:mb-3">
                  {slide.title}
                </h2>
                <h3 className="mb-4 text-[clamp(1rem,3.5vw,2.25rem)] font-bold leading-tight text-blue-300 drop-shadow-md md:mb-6">
                  {slide.subtitle}
                </h3>
                <button
                  onClick={() => {
                    window.location.href = 'https://agendaw.vercel.app/'
                  }}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-blue-700 active:bg-blue-800 md:px-6 md:py-3 md:text-base"
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
