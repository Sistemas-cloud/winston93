import { useState, useEffect, useRef } from 'react'
import AnimatedElement from '@/components/AnimatedElement'

export default function SliderSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  // 2026-04-14: Ref para swipe táctil en móvil, elimina dependencia de estado JS para detectar dispositivo.
  const touchStartX = useRef<number>(0)

  const slides = [
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
    },
  ]

  // Auto-avance cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

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
    <div
      className="w-full h-full relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Imágenes de fondo con transición */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* 2026-04-14: Gradiente móvil desde abajo para texto legible; overlay sutil en desktop. */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-black/30 to-black/10 md:bg-black/25 lg:bg-black/20"></div>
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

      {/* 2026-04-14: Texto al fondo en móvil (justify-end + pb) para no competir con las flechas;
          centrado vertical en tablet/desktop. Padding horizontal amplio para no solapar con flechas. */}
      <div className="relative z-30 h-full flex flex-col justify-end md:justify-center pb-10 md:pb-0">
        <div className="container mx-auto px-14 md:px-16 lg:px-20">
          <div
            className={`text-white ${
              currentSlide === 2
                ? 'md:w-1/2 md:max-w-lg md:ml-auto md:pl-4'
                : 'md:w-1/2 md:max-w-lg'
            }`}
          >
            <AnimatedElement>
              <h2 className="text-[clamp(1.6rem,5vw,3rem)] font-bold mb-1 md:mb-3 tracking-wide leading-tight drop-shadow-lg">
                {slides[currentSlide].title}
              </h2>
              <h3 className="text-[clamp(1rem,3.5vw,2.25rem)] font-bold mb-4 md:mb-6 text-blue-300 leading-tight drop-shadow-md">
                {slides[currentSlide].subtitle}
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
    </div>
  )
}
