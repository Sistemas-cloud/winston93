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
      
      // Tablet horizontal: (768-1024px) O (landscape con altura <= 900px) - incluye Nest Hub y Nest Hub Max
      const newIsTabletHorizontal = (width >= 768 && width <= 1024) || (isLandscape && height <= 900)
      
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
      link: 'https://educativo-winston.vercel.app/'
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
    <div ref={sectionRef} className="w-full relative min-h-screen flex flex-col">
      
      {/* Contenido de la sección */}
      <div className={`bg-white flex-1 flex flex-col justify-start ${
        // 2026-04-14: Se baja más el bloque de contenido (título + tarjetas) para aprovechar el espacio ganado.
        // 2026-04-14: Se incrementa offset superior para evitar que el navbar tape el título "OFERTA EDUCATIVA".
        isTabletHorizontal ? 'pt-10 pb-4' : isMobile ? 'pt-12 pb-4' : 'pt-20 pb-4'
      }`}>
        <div className={`container mx-auto mb-0 relative ${
          // Móvil: padding normal para legibilidad
          isTabletHorizontal ? 'px-1' : isMobile ? 'px-4' : 'px-4 md:px-8'
        }`}>
          {/* 2026-04-14: Se agrega pleca verde decorativa en el lateral izquierdo, como en la referencia visual. */}
          <img
            src="/images/primaria/pleca_verde.png"
            alt="Pleca verde decorativa"
            className={`absolute z-0 pointer-events-none select-none ${
              isTabletHorizontal
                ? 'left-1 top-12 w-12'
                : isMobile
                  ? 'left-0 top-16 w-8'
                  : 'left-0 md:left-2 lg:left-4 top-24 md:top-20 lg:top-16 w-12 md:w-16 lg:w-20'
            }`}
          />
          {/* 2026-04-14: Título alineado a la izquierda para posicionarlo casi sobre la tarjeta de KÍNDER. */}
          <div className={`max-w-5xl mx-auto w-full text-left relative z-10 ${
            isTabletHorizontal ? 'mb-1 pl-2' : isMobile ? 'mb-2 pl-1' : 'mb-4 pl-2 sm:pl-4 md:pl-6'
          }`}>
            {/* 2026-04-14: Título ajustado para coincidir con la imagen de referencia:
                "OFERTA" en peso normal y "EDUCATIVA" en bold, ambos en #0050ce. */}
            <div className={`transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 -translate-y-8 scale-95'
            }`} style={{ transitionDelay: '100ms' }}>
              <h1
                className={`font-normal leading-tight ${
                  isTabletHorizontal 
                    ? 'text-sm mb-0' 
                    : isMobile 
                      ? 'text-2xl mb-0' 
                      : 'text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl mb-0 sm:mb-1 md:mb-2'
                }`}
                style={{ color: '#0050ce' }}
              >
                OFERTA
              </h1>
              <h2
                className={`font-bold leading-tight ${
                  isTabletHorizontal 
                    ? 'text-sm' 
                    : isMobile 
                      ? 'text-2xl' 
                      : 'text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl'
                }`}
                style={{ color: '#0050ce' }}
              >
                EDUCATIVA
              </h2>
            </div>
          </div>

          {/* 2026-04-14: Margen superior aumentado para bajar las tarjetas respecto al título. */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto mb-0 relative z-10 ${
            isTabletHorizontal ? 'gap-0 mt-4' : isMobile ? 'gap-0 mt-6' : 'gap-0 sm:gap-1 md:gap-1 mt-10 md:mt-14 lg:mt-20'
          }`}>
            {/* 2026-04-14: Cada tarjeta ahora navega a su sección correspondiente al hacer click. */}
            {educationalLevels.map((level, index) => {
              return (
                <a
                  key={level.name}
                  href={level.link}
                  className={`bg-white overflow-hidden transition-all duration-1000 ease-out transform group hover:scale-105 hover:-translate-y-2 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-12 scale-95'
                  } cursor-pointer block`}
                  style={{ transitionDelay: level.delay }}
                >
                  {/* 2026-04-14: Imágenes levemente más grandes y títulos de tarjeta más pequeños. */}
                  <div className="relative overflow-hidden py-0">
                    <img
                      src={level.image}
                      alt={`Estudiantes de ${level.name} - Instituto Winston Churchill`}
                      className="w-full h-auto max-w-[185px] md:max-w-[215px] lg:max-w-[250px] mx-auto object-contain transition-all duration-200 ease-out group-hover:scale-105 group-hover:brightness-105"
                    />

                  {/* Texto en la parte inferior de la imagen */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ paddingTop: isTabletHorizontal ? '24px' : isMobile ? '28px' : '32px', paddingBottom: isTabletHorizontal ? '16px' : isMobile ? '20px' : '24px' }}>
                    <div className="text-center">
                      <h3 className={`font-bold ${level.textColor} tracking-wider transition-all duration-150 group-hover:scale-110 group-hover:tracking-widest drop-shadow-lg ${
                        isTabletHorizontal 
                          ? 'text-[10px]' 
                          : isMobile 
                            ? 'text-sm' 
                            : 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl'
                      }`}>
                        {level.name}
                      </h3>
                    </div>
                    </div>
                  </div>

                  {/* 2026-04-14: Botón "Agendar" eliminado por solicitud del usuario. */}
                </a>
              )
            })}
          </div>

        </div>
      </div>

      {/* 2026-04-14: Footer de sección con menor altura para ocupar menos viewport. */}
      <div className={`flex-shrink-0 ${
        // Solo aplicar margen negativo en desktop
        isMobile || isTabletHorizontal ? '' : '-mt-32'
      }`}>
        <footer className={`relative text-white overflow-hidden ${
          isMobile ? 'h-[170px]' : 'h-[24vh]'
        }`}>
          {/* Fondo: azul sólido */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: '#013BDF' }}
          />

          {/* Contenido principal - Layout móvil optimizado */}
          {isMobile ? (
            <div className="relative z-10 h-full flex flex-col justify-between px-4 py-2">
              {/* Contenido superior */}
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <img src="/images/logos/logo_winston.png" alt="Winston" width={60} height={16} className="h-4 w-auto" />
                </div>
                <h2 className="text-[9px] font-extrabold tracking-wide uppercase mb-2 leading-tight">
                  WORKING FOR BRIGHTER FUTURES
                </h2>
                <p className="text-[7px] opacity-90 mb-3">#soywinston</p>

                <div className="space-y-1 text-[7px] leading-relaxed">
                  <p>CALLE 3 #309</p>
                  <p>COL. JARDÍN 20 DE NOVIEMBRE,</p>
                  <p>CD. MADERO TAMPS.</p>
                  <p className="mt-3 font-semibold">
                    <a href="tel:8332150951" className="hover:text-yellow-400 transition-colors">
                      📞 833 215 0951
                    </a>
                  </p>
                </div>
              </div>

              {/* Aviso de privacidad e iconos en la parte inferior */}
              <div className="flex flex-col items-center space-y-2 mt-2">
                {/* Aviso de privacidad arriba */}
                <div className="text-center">
                  <a
                    href="#"
                    className="font-medium uppercase tracking-wide text-[6px] hover:text-yellow-400 transition-colors block"
                  >
                    AVISO DE PRIVACIDAD
                  </a>
                </div>
                
                {/* 2026-04-14: Enlaces oficiales de redes sociales; WhatsApp queda pendiente por solicitud del usuario. */}
                {/* Iconos sociales abajo */}
                <div className="flex items-center gap-2">
                  <a href="https://www.facebook.com/institutowinstonchurchill/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@imagenwinston" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="WhatsApp" className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.815 0 0020.885 3.488"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/institutowinstonchurchill/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/@institutowinstonchurchill5194" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 py-4 md:py-6">
              {/* Columna izquierda */}
              <div className="max-w-2xl">
                <div className="flex items-center mb-3 md:mb-4">
                  <img src="/images/logos/logo_winston.png" alt="Winston" width={70} height={19} className="h-5 md:h-6 w-auto" />
                </div>
                <h2 className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide uppercase mb-1 md:mb-2 leading-snug">
                  WORKING FOR BRIGHTER FUTURES
                </h2>
                <p className="text-[10px] sm:text-xs opacity-90 mb-3 md:mb-4">#soywinston</p>

                <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs md:text-sm leading-relaxed">
                  <p>CALLE 3 #309</p>
                  <p>COL. JARDÍN 20  DE NOVIEMBRE,</p>
                  <p>CD. MADERO TAMPS.</p>
                  <p className="mt-2 sm:mt-3 font-semibold">
                    <a href="tel:8332150951" className="hover:text-yellow-400 transition-colors">
                      📞 833 215 0951
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Solo para desktop/tablet - iconos posicionados absolutamente */}
          {!isMobile && (
            <>
              <div className="absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <a href="https://www.facebook.com/institutowinstonchurchill/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@imagenwinston" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="WhatsApp" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.815 0 0020.885 3.488"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/institutowinstonchurchill/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/@institutowinstonchurchill5194" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <a
                href="#"
                className="absolute right-4 md:right-10 bottom-24 md:bottom-28 font-semibold uppercase tracking-wide text-[8px] sm:text-[10px] hover:text-yellow-400 transition-colors"
              >
                AVISO DE PRIVACIDAD
              </a>
            </>
          )}
        </footer>
      </div>
    </div>
  )
} 