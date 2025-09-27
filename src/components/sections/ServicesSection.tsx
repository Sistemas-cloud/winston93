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
    <div ref={sectionRef} className="min-h-screen md:h-screen w-full relative overflow-hidden bg-white">
      {/* Contenido principal */}
      <div className="h-full flex items-center py-4 sm:py-6 md:py-0">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between h-full py-4 md:py-0">
            
            {/* Lado izquierdo - Imagen de estudiantes */}
            <div className="w-full md:w-1/2 relative flex items-center justify-center mb-4 sm:mb-6 md:mb-0">
              <div className={`relative transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-12'
              }`} style={{ transitionDelay: '200ms' }}>
                {/* Formas geométricas de fondo - Responsive */}
                <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 md:-top-10 md:-left-10 w-8 h-8 sm:w-12 sm:h-12 md:w-32 md:h-32 bg-blue-600 rounded-lg transform rotate-12"></div>
                <div className="absolute -bottom-1 left-6 sm:-bottom-2 sm:left-10 md:-bottom-5 md:left-20 w-6 h-6 sm:w-9 sm:h-9 md:w-24 md:h-24 bg-yellow-400 rounded-lg transform -rotate-6"></div>
                <div className="absolute top-1 -right-1 sm:top-2 sm:-right-2 md:top-5 md:-right-5 w-5 h-5 sm:w-8 sm:h-8 md:w-20 md:h-20 bg-green-500 rounded-lg transform rotate-45"></div>
                
                {/* Imagen de estudiantes - Responsive - Más grande */}
                <img
                  src="/images/students/niños_left.jpg"
                  alt="Estudiantes del Instituto Winston Churchill"
                  className="relative z-10 h-[220px] sm:h-[280px] md:h-[600px] lg:h-[700px] xl:h-[800px] w-auto max-w-none object-contain"
                />
              </div>
            </div>

            {/* Lado derecho - Contenido de texto */}
            <div className="w-full md:w-1/2 text-center px-3 md:px-0 flex flex-col justify-center">
              {/* Títulos - Entran desde arriba */}
              <div className={`mb-3 sm:mb-4 md:mb-8 transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 -translate-y-8 scale-95'
              }`} style={{ transitionDelay: '400ms' }}>
                <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-900 leading-tight mb-1 sm:mb-2 md:mb-4">
                  INSTITUTO WINSTON CHURCHILL
                </h1>
                <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-700 mb-2 sm:mb-3 md:mb-6">
                  Formando líderes con visión global desde hace más de 30 años.
                </h2>
              </div>

              {/* Descripción - Entra desde abajo */}
              <p className={`text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-full md:max-w-lg mx-auto transition-all duration-1000 ease-out line-clamp-4 md:line-clamp-none ${
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

      {/* Elementos decorativos adicionales - Ocultos en móvil */}
      <div className="hidden md:block absolute top-20 right-40 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
      <div className="hidden md:block absolute bottom-32 left-32 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
      <div className="hidden md:block absolute top-1/3 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-50"></div>
    </div>
  )
} 