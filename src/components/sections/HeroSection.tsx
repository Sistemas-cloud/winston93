// 2026-08-20: Hannia — overlay de marca + CTA suave al final del hero (sin romper full-bleed).
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [isAndroid, setIsAndroid] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showPlayOverlay, setShowPlayOverlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent.toLowerCase()
      
      // Detectar si es Android
      const isAndroidDevice = /android/.test(userAgent)
      setIsAndroid(isAndroidDevice)
      
      // Detectar tipo de dispositivo
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    
    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    window.addEventListener('orientationchange', updateDeviceType)
    
    return () => {
      window.removeEventListener('resize', updateDeviceType)
      window.removeEventListener('orientationchange', updateDeviceType)
    }
  }, [])

  // 2026-04-10: Se unifica el intento de autoplay para todos los dispositivos.
  // Los navegadores modernos (iOS Safari, Android Chrome) permiten muted+playsInline.
  // Si falla, se muestra overlay de Play sobre el poster en lugar de fondo blanco.
  useEffect(() => {
    const tryAutoplay = async () => {
      if (!videoRef.current) return
      try {
        videoRef.current.muted = true
        videoRef.current.playsInline = true
        await videoRef.current.play()
        setVideoLoaded(true)
        setShowPlayOverlay(false)
      } catch {
        // El autoplay fue bloqueado; se muestra overlay de Play sobre el poster
        setShowPlayOverlay(true)
        setVideoLoaded(false)
      }
    }
    if (typeof window !== 'undefined') {
      tryAutoplay()
    }
  }, [])

  const handlePlayClick = async () => {
    if (!videoRef.current) return
    try {
      // Mantener muted inicialmente para evitar bloqueos, luego permitir sonido
      videoRef.current.muted = true
      videoRef.current.playsInline = true
      await videoRef.current.play()
      // Una vez que reproduce, permitir sonido
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.muted = false
        }
      }, 500)
      setVideoLoaded(true)
      setShowPlayOverlay(false)
    } catch (err) {
      console.error('Error al reproducir video:', err)
      // Si falla, intentar con muted permanente
      try {
        if (videoRef.current) {
          videoRef.current.muted = true
          await videoRef.current.play()
          setVideoLoaded(true)
          setShowPlayOverlay(false)
        }
      } catch (err2) {
        console.error('Error al reproducir video muted:', err2)
        setShowPlayOverlay(true)
      }
    }
  }

  return (
    // 2026-04-10: min-h garantiza altura en móvil donde h-full puede colapsar sin padre con altura fija
    <div className="h-full min-h-[85vh] md:min-h-screen w-full relative overflow-hidden">
      {/* Overlay móvil: botón de Play si autoplay es bloqueado */}
      {showPlayOverlay && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
          <button
            onClick={handlePlayClick}
            aria-label="Reproducir video"
            className="bg-white/90 hover:bg-white text-blue-700 font-semibold px-5 py-3 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Reproducir
          </button>
        </div>
      )}

      {/* 2026-04-10: Spinner sobre el poster (fondo ya no es blanco); solo visible mientras carga y sin overlay de play */}
      {!videoLoaded && !showPlayOverlay && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-base md:text-lg font-semibold drop-shadow">Cargando video...</p>
            <div className="w-48 md:w-64 bg-white/30 rounded-full h-2 mt-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-white/80 text-xs md:text-sm mt-2">{Math.round(loadingProgress)}% cargado</p>
          </div>
        </div>
      )}
      
      {/* 2026-04-10: Poster como fondo mientras carga el video; evita el fondo blanco en móvil/tablet */}
      <div 
        className="absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out bg-black"
        style={{ 
          minHeight: '100vh',
          opacity: videoLoaded ? 0 : 1,
          backgroundImage: 'url(/images/slider/SLIDE_INICIO_1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Video de fondo con reproducción progresiva */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/slider/SLIDE_INICIO_1.jpg"
        controls={false}
        className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-1000 ease-in-out`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: videoLoaded ? 1 : 0,
          // Ajustes específicos para Android
          ...(isAndroid && {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            transform: 'translateZ(0)', // Forzar aceleración por hardware
            willChange: 'transform'
          })
        }}
        onLoadStart={() => {
          console.log('Video empezando a cargar...')
          setVideoLoaded(false)
        }}
        onCanPlay={() => {
          console.log('Video puede reproducirse')
          setVideoLoaded(true)
          setShowPlayOverlay(false)
        }}
        onCanPlayThrough={() => {
          console.log('Video puede reproducirse completamente')
          setVideoLoaded(true)
          setShowPlayOverlay(false)
        }}
        onProgress={(e) => {
          const video = e.currentTarget
          if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1)
            const duration = video.duration
            if (duration > 0) {
              const progress = (bufferedEnd / duration) * 100
              setLoadingProgress(progress)
            }
          }
        }}
      >
        <source src="/videos/winston-video.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Gradiente inferior + brand signal (hipótesis: claridad de marca sin saturar el video) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/30 to-transparent pb-0 pt-24 md:pt-32">
        <div className="pointer-events-auto mx-auto flex max-w-4xl flex-col items-center px-4 pb-4 text-center md:pb-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E3FB07] md:text-xs">
            Instituto Winston Churchill
          </p>
          <p className="mb-4 text-lg font-bold text-white drop-shadow md:text-2xl">
            Working for a Brighter Future
          </p>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/admisiones"
              className="rounded-full bg-[#E3FB07] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-black shadow-lg transition hover:scale-[1.02] md:text-sm"
            >
              Admisiones
            </Link>
            {/* 2026-08-21: Agenda una cita → apartado examen de admisión. */}
            <Link
              href="/admisiones#examen-admision"
              className="rounded-full border border-white/50 bg-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-[#E3FB07] hover:text-[#E3FB07] md:text-sm"
            >
              Agenda una cita
            </Link>
          </div>
        </div>
        {/* 2026-08-20: Trust bar integrada al hero para verse también en FullPageScroll desktop */}
        <div className="pointer-events-auto border-t border-white/15 bg-[#012A9E]/95 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
            {/* 2026-08-21: Sin Oxford; misma fila de confianza que TrustBar. */}
            {[
              { label: '30+ años', sub: 'de experiencia' },
              { label: 'Bilingüe', sub: 'formación integral' },
              { label: 'Cambridge', sub: 'University' },
              { label: 'Cd. Madero', sub: 'Tamaulipas' },
            ].map((item) => (
              <div key={item.label} className="px-2 py-3 text-center md:py-3.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#E3FB07] md:text-sm">
                  {item.label}
                </p>
                <p className="text-[10px] text-white/75 md:text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}