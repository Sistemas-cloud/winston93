import { useEffect, useRef, useState } from 'react'

export default function ConveniosSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  // 2026-09-22: Mobile-first SSR — evita descargar layout desktop + PNG grande en móvil.
  const [isMobile, setIsMobile] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Detectar dispositivo
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height
      
      // Móvil: < 768px
      setIsMobile(width < 768)
      
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

      {/* 2026-04-10: Layout móvil — título encima e imagen centrada */}
      {isMobile && (
        <div className="flex flex-col items-center justify-center h-full py-6 px-4 gap-4">
          <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            style={{ transitionDelay: '150ms' }}>
            {/* 2026-04-10: Titulo móvil aumentado para equiparar jerarquía visual con Oferta Educativa (text-2xl). */}
            <h2 className="font-bold tracking-widest text-2xl text-[#013BDF] uppercase text-center">
              CONVENIOS Y CERTIFICACIONES
            </h2>
          </div>
          <div className={`w-full flex justify-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
            style={{ transitionDelay: '300ms' }}>
            {/* 2026-04-10: Imagen móvil más grande y con leve desplazamiento a la derecha para centrar visualmente. */}
            {/* 2026-07-03: Dimensiones explícitas para reducir CLS. */}
            <img
              src="/images/logos/convenios.png"
              alt="Convenios y Alianzas Académicas - Instituto Winston Churchill"
              width={1200}
              height={600}
              loading="lazy"
              decoding="async"
              className="w-[108%] max-w-none h-auto object-contain translate-x-3"
            />
          </div>
        </div>
      )}

      {/* Layout tablet / desktop — sin cambios respecto al diseño original */}
      {!isMobile && (
        <div className="h-[300px] md:h-full flex items-center justify-center">
          <div className="w-full px-4 md:px-8">
            <div className="flex items-center justify-center h-full">
              
              {/* 2026-03-27: Corrección de escalas responsive válidas para conservar proporciones en tablet/desktop. */}
              <div className="relative flex items-center justify-center w-full max-w-7xl ml-2 sm:ml-4 md:ml-12 lg:ml-16">
                <div className={`relative w-full flex items-center justify-center transition-all duration-1000 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`} style={{ transitionDelay: '200ms' }}>
                  {/* 2026-03-27: Escala reducida para evitar solape con texto lateral. */}
                  {/* 2026-07-03: Dimensiones explícitas para reducir CLS. */}
                  <img
                    src="/images/logos/convenios.png"
                    alt="Convenios y Alianzas Académicas - Instituto Winston Churchill"
                    width={1200}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-auto h-auto object-contain scale-90 sm:scale-95 md:scale-100 lg:scale-110 xl:scale-125 2xl:scale-140"
                  />
                  
                  {/* 2026-03-27: Texto vertical anclado al margen derecho del bloque. */}
                  <div className={`absolute right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                  }`} style={{ transitionDelay: '600ms' }}>
                    <div className="text-white transform rotate-90 origin-center whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                      <h2 className={`font-bold tracking-widest ${
                        isTablet 
                          ? 'text-sm' 
                          : 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl'
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
      )}

    </div>
  )
} 