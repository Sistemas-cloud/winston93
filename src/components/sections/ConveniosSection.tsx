import { useEffect, useRef, useState } from 'react'

export default function ConveniosSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Detectar si es tablet
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height
      
      // Tablet: (768-1024px) O (landscape con altura <= 900px) - incluye Nest Hub y Nest Hub Max
      const isTabletDevice = (width >= 768 && width <= 1024) || (isLandscape && height <= 900)
      setIsTablet(isTabletDevice)
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

  return (
    <div ref={sectionRef} className="h-full w-full relative overflow-hidden bg-white">
      {/* Contenido principal */}
      <div className="h-full flex items-center justify-center">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-center h-full">
            
            {/* Imagen de convenios más grande y mejor centrada */}
            <div className="relative flex items-center justify-center w-full max-w-7xl ml-4 md:ml-12 lg:ml-16">
              <div className={`relative w-full flex items-center justify-center transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`} style={{ transitionDelay: '200ms' }}>
                {/* Imagen de convenios - Responsive - Tamaño perfecto */}
                <img
                  src="/images/logos/convenios.png"
                  alt="Convenios y Alianzas Académicas - Instituto Winston Churchill"
                  className={`w-auto h-auto object-contain scale-110 md:scale-120 lg:scale-140 xl:scale-160 2xl:scale-180`}
                />
                
                {/* Texto vertical volteado DENTRO del contorno azul - Aún más a la derecha */}
                <div className={`absolute right-[0%] sm:right-[0%] md:right-[0%] lg:right-[-1%] top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-8'
                }`} style={{ transitionDelay: '600ms' }}>
                  <div className="text-white transform rotate-90 origin-center whitespace-nowrap">
                    <h2 className={`font-bold tracking-widest ${
                      isTablet 
                        ? 'text-base' 
                        : 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'
                    }`}>
                      CONVENIOS Y CERTIFICACIONES
                    </h2>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 