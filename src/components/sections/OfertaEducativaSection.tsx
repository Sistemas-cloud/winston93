import { useEffect, useRef, useState } from 'react'
import Footer from '@/components/Footer'
import AnimatedElement from '@/components/AnimatedElement'

export default function OfertaEducativaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTabletHorizontal, setIsTabletHorizontal] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Detectar tipo de dispositivo específicamente
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height
      
      // Móvil: width < 768 (vertical)
      const newIsMobile = width < 768
      
      // Tablet horizontal: 768 <= width < 1024 Y landscape
      const newIsTabletHorizontal = width >= 768 && width < 1024 && isLandscape
      
      setIsMobile(newIsMobile)
      setIsTabletHorizontal(newIsTabletHorizontal)
    }
    
    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    window.addEventListener('orientationchange', updateDeviceType)
    
    return () => {
      window.removeEventListener('resize', updateDeviceType)
      window.removeEventListener('orientationchange', updateDeviceType)
    }
  }, [])

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
      textColor: 'text-white',
      delay: '200ms',
      link: '/kinder'
    },
    {
      name: 'PRIMARIA',
      image: '/images/education/primaria.png',
      textColor: 'text-white',
      delay: '400ms',  
      link: '/primaria'
    },
    {
      name: 'SECUNDARIA',
      image: '/images/education/secundaria.png',
      textColor: 'text-white',
      delay: '600ms',
      link: '/secundaria'
    }
  ]

  return (
    <div ref={sectionRef} className="w-full relative h-full flex flex-col">
      
      {/* Contenido de la sección */}
      <div className={`bg-white flex-1 flex flex-col justify-center ${
        // Móvil: padding normal, Tablet horizontal: sin padding, Desktop: padding normal
        isTabletHorizontal ? 'py-0' : isMobile ? 'py-2' : 'py-3 sm:py-4 md:py-6'
      }`}>
        <div className={`container mx-auto ${
          // Móvil: padding normal, Tablet horizontal: mínimo, Desktop: normal
          isTabletHorizontal ? 'px-1' : isMobile ? 'px-3' : 'px-4 md:px-8'
        }`}>
          <div className={`text-center ${
            // Móvil: margen normal, Tablet horizontal: sin margen, Desktop: margen normal
            isTabletHorizontal ? 'mb-0' : isMobile ? 'mb-3' : 'mb-6 sm:mb-8 md:mb-14'
          }`}>
            {/* Título principal */}
            <div className={`transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 -translate-y-8 scale-95'
            }`} style={{ transitionDelay: '100ms' }}>
              <h1 className={`font-bold text-blue-900 ${
                // Móvil: text-lg (más grande), Tablet horizontal: text-sm (pequeño), Desktop: text-xl+
                isTabletHorizontal 
                  ? 'text-sm mb-0' 
                  : isMobile 
                    ? 'text-lg mb-1' 
                    : 'text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl mb-1 sm:mb-2 md:mb-4'
              }`}>
                OFERTA
              </h1>
              <h2 className={`font-bold text-blue-600 ${
                // Móvil: text-lg (más grande), Tablet horizontal: text-sm (pequeño), Desktop: text-xl+
                isTabletHorizontal 
                  ? 'text-sm' 
                  : isMobile 
                    ? 'text-lg' 
                    : 'text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl'
              }`}>
                EDUCATIVA
              </h2>
            </div>
          </div>

          {/* Tarjetas de niveles educativos - Grid responsive */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto ${
            // Móvil: gap normal, Tablet horizontal: gap mínimo, Desktop: gap normal
            isTabletHorizontal ? 'gap-0.5' : isMobile ? 'gap-2' : 'gap-3 sm:gap-4 md:gap-5 lg:gap-8'
          }`}>
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
                  className={`bg-white overflow-hidden transition-all duration-1000 ease-out transform cursor-pointer group hover:scale-105 hover:-translate-y-2 ${
                    isTabletHorizontal ? 'rounded-md' : isMobile ? 'rounded-lg' : 'rounded-2xl sm:rounded-3xl'
                  } ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-12 scale-95'
                  }`}
                  style={{ transitionDelay: level.delay }}
                >
                  {/* Imagen del nivel educativo que se ajusta a su tamaño natural */}
                  <div className="relative overflow-hidden">
                    <img
                      src={level.image}
                      alt={`Estudiantes de ${level.name} - Instituto Winston Churchill`}
                      className="w-full h-auto max-w-[200px] md:max-w-[240px] lg:max-w-[280px] mx-auto object-contain transition-all duration-200 ease-out group-hover:scale-105 group-hover:brightness-105"
                    />
                    

                  </div>

                  {/* Texto en la parte inferior de la imagen */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2">
                    <div className="text-center">
                      <h3 className={`font-bold ${level.textColor} tracking-wider transition-all duration-150 group-hover:scale-110 group-hover:tracking-widest drop-shadow-lg ${
                        // Móvil: text-sm (más grande), Tablet horizontal: text-xs (pequeño), Desktop: text-sm+
                        isTabletHorizontal 
                          ? 'text-xs' 
                          : isMobile 
                            ? 'text-sm' 
                            : 'text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'
                      }`}>
                        {level.name}
                      </h3>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      
      </div>

      {/* Footer anclado al fondo de esta sección */}
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  )
} 