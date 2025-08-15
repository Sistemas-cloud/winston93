import { useEffect, useRef, useState } from 'react'

export default function ConveniosSection() {
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
    <div ref={sectionRef} className="h-screen w-full relative overflow-hidden bg-white">
      {/* Contenido principal */}
      <div className="h-full flex items-center justify-center py-2 md:py-4">
        <div className="w-full px-2 md:px-4">
          <div className="flex items-center justify-center h-full">
            
            {/* Imagen de convenios más grande y mejor centrada */}
            <div className="relative flex items-center justify-center w-full max-w-7xl">
              <div className={`relative w-full flex items-center justify-center transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`} style={{ transitionDelay: '200ms' }}>
                {/* Imagen de convenios - Responsive */}
                <img
                  src="/images/logos/convenios.png"
                  alt="Convenios y Alianzas Académicas - Instituto Winston Churchill"
                  className="w-full h-auto object-contain max-h-[70vh] md:max-h-[80vh] max-w-[98vw] md:max-w-[95vw]"
                />
                
                {/* Texto vertical volteado DENTRO del contorno azul - Responsive */}
                <div className={`absolute right-[8%] sm:right-[7%] md:right-[8%] lg:right-[5%] top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-8'
                }`} style={{ transitionDelay: '600ms' }}>
                  <div className="text-white transform rotate-90 origin-center whitespace-nowrap">
                    <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold tracking-widest">
                      CONVENIOS Y CERTIFICACIONES
                    </h2>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Elementos decorativos adicionales */}
      <div className="hidden md:block absolute top-20 left-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
      <div className="hidden md:block absolute bottom-32 right-32 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-70"></div>
      <div className="hidden md:block absolute top-1/3 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-50"></div>
    </div>
  )
} 