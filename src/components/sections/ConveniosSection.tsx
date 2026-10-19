// 2026-10-19: Banner original de convenios + carrete de marcas con difuminado (sin sección blanca aparte).
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const MARCAS = [
  'UNE',
  'IEST Anáhuac',
  'Tecmilenio',
  'Pemex',
  'IMSS',
  'CFE',
  'Telmex',
  'Cambridge',
  'Narrative 4',
  'COPARMEX',
  'AMMJE',
] as const

export default function ConveniosSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const loop = [...MARCAS, ...MARCAS]

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height
      setIsMobile(width < 768)
      const isTabletDevice =
        (width >= 768 && width <= 1024) || (isLandscape && height <= 900)
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
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.25 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={sectionRef}
      id="convenios-alianzas"
      className="relative flex h-full w-full flex-col overflow-hidden bg-white"
    >
      {/* Banner original */}
      <div className="relative min-h-0 flex-1">
        {isMobile && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-6">
            <div
              className={`transition-all duration-700 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <h2 className="text-center text-2xl font-bold uppercase tracking-widest text-[#013BDF]">
                CONVENIOS Y CERTIFICACIONES
              </h2>
            </div>
            <div
              className={`flex w-full justify-center transition-all duration-1000 ease-out ${
                isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <Image
                src="/images/logos/convenios.png"
                alt="Convenios y Alianzas Académicas - Instituto Winston Churchill"
                width={1200}
                height={600}
                sizes="(max-width: 768px) 100vw, 90vw"
                loading="lazy"
                decoding="async"
                className="h-auto w-[108%] max-w-none translate-x-3 object-contain"
              />
            </div>
          </div>
        )}

        {!isMobile && (
          <div className="flex h-full items-center justify-center md:h-full">
            <div className="w-full px-4 md:px-8">
              <div className="relative mx-auto ml-2 flex w-full max-w-7xl items-center justify-center sm:ml-4 md:ml-12 lg:ml-16">
                <div
                  className={`relative flex w-full items-center justify-center transition-all duration-1000 ease-out ${
                    isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <Image
                    src="/images/logos/convenios.png"
                    alt="Convenios y Alianzas Académicas - Instituto Winston Churchill"
                    width={1200}
                    height={600}
                    sizes="(max-width: 1024px) 90vw, 80vw"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-auto scale-90 object-contain sm:scale-95 md:scale-100 lg:scale-110 xl:scale-125 2xl:scale-140"
                  />
                  <div
                    className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out sm:right-3 md:right-4 lg:right-6 xl:right-8 ${
                      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                    }`}
                    style={{ transitionDelay: '600ms' }}
                  >
                    <div className="origin-center rotate-90 whitespace-nowrap text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                      <h2
                        className={`font-bold tracking-widest ${
                          isTablet
                            ? 'text-sm'
                            : 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl'
                        }`}
                      >
                        CONVENIOS Y CERTIFICACIONES
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Carrete de marcas con difuminado — dentro de la misma sección (no pantalla blanca) */}
      <div
        className="relative shrink-0 border-t border-[#013BDF]/10 py-4"
        style={{ backgroundColor: '#F9F9F9' }}
        aria-label="Marcas y socios"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F9F9F9] via-[#F9F9F9]/90 to-transparent md:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F9F9F9] via-[#F9F9F9]/90 to-transparent md:w-28"
          aria-hidden
        />
        <div className="wl-convenios-marquee flex w-max gap-10 px-6 md:gap-14">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 text-xs font-extrabold uppercase tracking-[0.18em] text-[#013BDF]/75 md:text-sm"
            >
              {name}
            </span>
          ))}
        </div>
        <style>{`
          .wl-convenios-marquee {
            animation: wlConveniosMarquee 38s linear infinite;
          }
          @keyframes wlConveniosMarquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .wl-convenios-marquee { animation: none; }
          }
        `}</style>
      </div>
    </div>
  )
}
