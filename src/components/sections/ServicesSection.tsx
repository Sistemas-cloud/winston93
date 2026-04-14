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
      <div className="h-full flex items-center py-6 md:py-0">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between h-full">
            
            {/* Lado izquierdo - Imagen de estudiantes */}
            <div className="w-full md:w-1/2 relative flex items-center justify-center mb-0 md:mb-0">
              <div className={`relative transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-12'
              }`} style={{ transitionDelay: '200ms' }}>
                {/* Formas geométricas de fondo - Responsive */}
                 {/* 2026-03-27: Escala responsive de imagen para evitar recortes en móvil/tablet manteniendo el diseño base. */}
                <img
                  src="/images/students/niños_left.jpg"
                  alt="Estudiantes del Instituto Winston Churchill"
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
                {/* 2026-04-14: Ajuste solicitado del título: color #0050ce, nombre del colegio en bold y subtítulo en peso normal. */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0050ce] leading-tight mb-2 md:mb-4">
                  INSTITUTO WINSTON CHURCHILL
                </h1>
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-[#0050ce] mb-2 md:mb-6">
                  Formando líderes con visión global desde hace más de 30 años.
                </h2>
              </div>

              {/* Descripción - Entra desde abajo */}
              <p className={`text-base md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-full md:max-w-lg mx-auto transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '600ms' }}>
                Ofrecemos una educación integral que impulsa el pensamiento crítico, los valores y 
                el desarrollo emocional de nuestros alumnos. Respaldados por alianzas 
                académicas internacionales, preparamos a cada estudiante para enfrentar con éxito los 
                retos del mundo actual.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 