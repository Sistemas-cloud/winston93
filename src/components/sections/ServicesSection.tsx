import AnimatedElement from '@/components/AnimatedElement'
import { useEffect, useRef, useState } from 'react'

export default function EducationalOfferSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="h-full w-full relative overflow-hidden bg-white">
      {/* Contenido principal */}
      <div className="h-full flex items-center py-6 md:py-0 relative">
        {/* 2026-04-16: Barra azul decorativa movida al contenedor superior; ocupa la mitad desde la derecha. */}
        <div className={`absolute top-16 md:top-24 right-0 h-4 w-1/2 bg-[#0050ce] transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`} style={{ transitionDelay: '300ms' }} />
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between h-full relative">
            
            {/* Lado izquierdo - Imagen de estudiantes */}
            <div className="w-full md:w-1/2 relative flex items-center justify-center mb-0 md:mb-0">
              <div className={`relative transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-12'
              }`} style={{ transitionDelay: '200ms' }}>
                {/* Formas geométricas de fondo - Responsive */}
                 {/* 2026-03-27: Escala responsive de imagen para evitar recortes en móvil/tablet manteniendo el diseño base. */}
                {/* 2026-09-22: Dimensiones + lazy para no competir con LCP */}
                <img
                  src="/images/students/niños_left.jpg"
                  alt="Estudiantes del Instituto Winston Churchill"
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 h-[260px] sm:h-[320px] md:h-[500px] lg:h-[620px] xl:h-[700px] w-auto max-w-none object-contain"
                />
              </div>
            </div>

            {/* Lado derecho - Contenido de texto */}
            <div className="w-full md:w-1/2 text-center px-4 md:px-0 flex flex-col justify-center">
              {/* Títulos - Entran desde arriba */}
              <div className={`mb-2 md:mb-8 transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 -translate-y-8 scale-95'
              }`} style={{ transitionDelay: '400ms' }}>
                <h2 className="mb-2 text-2xl font-bold leading-tight text-[#0050ce] md:mb-4 md:text-3xl lg:text-4xl xl:text-5xl">
                  Instituto Winston Churchill
                </h2>
                <p className="mb-2 text-lg font-normal text-[#0050ce] md:mb-6 md:text-xl lg:text-2xl xl:text-3xl">
                  Formamos líderes con visión global. Más de 30 años de experiencia.
                </p>
              </div>

              <p
                className={`mx-auto max-w-full text-base leading-relaxed text-gray-700 transition-all duration-1000 ease-out md:max-w-lg md:text-lg ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                Ofrecemos una educación integral. Impulsamos el pensamiento crítico, los
                valores y el desarrollo emocional. Con alianzas académicas internacionales,
                preparamos a cada estudiante para los retos de hoy.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 