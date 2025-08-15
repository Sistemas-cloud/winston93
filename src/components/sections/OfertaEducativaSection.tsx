import { useEffect, useRef, useState } from 'react'
import Footer from '@/components/Footer'
import AnimatedElement from '@/components/AnimatedElement'

export default function OfertaEducativaSection() {
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

  const educationalLevels = [
    {
      name: 'KÍNDER',
      image: '/images/education/kinder.png',
      bgColor: 'bg-green-600',
      textColor: 'text-white',
      delay: '200ms',
      link: '/kinder'
    },
    {
      name: 'PRIMARIA',
      image: '/images/education/primaria.png',
      bgColor: 'bg-yellow-500',
      textColor: 'text-white',
      delay: '400ms',  
      link: '/primaria'
    },
    {
      name: 'SECUNDARIA',
      image: '/images/education/secundaria.png',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      delay: '600ms',
      link: '/secundaria'
    }
  ]

  return (
    <div ref={sectionRef} className="w-full relative h-screen flex flex-col">
      {/* Contenido de la sección */}
      <div className="bg-white py-3 sm:py-4 md:py-6 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-14">
            {/* Título principal */}
            <div className={`transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 -translate-y-8 scale-95'
            }`} style={{ transitionDelay: '100ms' }}>
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-900 mb-1 sm:mb-2 md:mb-4">
                OFERTA
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-600">
                EDUCATIVA
              </h2>
            </div>
          </div>

          {/* Tarjetas de niveles educativos - Grid responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-8 max-w-6xl mx-auto">
            {educationalLevels.map((level, index) => {
              // Función para manejar la navegación
              const handleNavigation = () => {
                if (level.link.startsWith('http')) {
                  // Enlace externo - abrir en nueva pestaña
                  window.open(level.link, '_blank', 'noopener,noreferrer')
                } else {
                  // Enlace interno - navegar en la misma pestaña
                  window.location.href = level.link
                }
              }

              return (
                <div
                  key={level.name}
                  onClick={handleNavigation}
                  className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transition-all duration-1000 ease-out transform cursor-pointer group hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-12 scale-95'
                  }`}
                  style={{ transitionDelay: level.delay }}
                >
                  {/* Imagen del nivel educativo que ocupa la mayor parte de la tarjeta */}
                  <div className="relative h-32 sm:h-36 md:h-44 lg:h-56 xl:h-64 2xl:h-72 overflow-hidden">
                    <img
                      src={level.image}
                      alt={`Estudiantes de ${level.name} - Instituto Winston Churchill`}
                      className="w-full h-full object-contain md:object-cover object-center transition-all duration-200 ease-out group-hover:scale-105 group-hover:brightness-105"
                      style={{ objectPosition: 'center 0%' }}
                    />
                    
                    {/* Overlay de hover - Color sólido transparente que abarca toda la imagen */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                  </div>

                  {/* Sección inferior con color de fondo y texto */}
                  <div className={`${level.bgColor} px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5`}>
                    <div className="text-center">
                      <h3 className={`text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold ${level.textColor} tracking-wider transition-all duration-150 group-hover:scale-110 group-hover:tracking-widest`}>
                        {level.name}
                      </h3>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Elementos decorativos adicionales */}
        <div className="hidden md:block absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
        <div className="hidden md:block absolute bottom-56 right-32 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
        <div className="hidden md:block absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-50"></div>
        <div className="hidden md:block absolute bottom-[30%] left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-40"></div>
      </div>

      {/* Footer anclado al fondo de esta sección */}
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  )
} 