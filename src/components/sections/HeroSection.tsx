import { useEffect, useRef, useState } from 'react'

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

  // En móvil, forzar overlay de Play siempre para garantizar reproducción
  useEffect(() => {
    const tryAutoplay = async () => {
      if (!videoRef.current) return
      
      // En móvil, siempre mostrar overlay de Play para evitar problemas de autoplay
      if (isMobile) {
        setShowPlayOverlay(true)
        setVideoLoaded(false)
        return
      }
      
      try {
        // Asegurar flags antes de intentar reproducir (solo desktop/tablet)
        videoRef.current.muted = true
        videoRef.current.playsInline = true
        await videoRef.current.play()
        setVideoLoaded(true)
        setShowPlayOverlay(false)
      } catch (err) {
        // Requiere interacción del usuario
        setShowPlayOverlay(true)
        setVideoLoaded(false)
      }
    }
    // Solo intentar una vez en cliente
    if (typeof window !== 'undefined') {
      tryAutoplay()
    }
  }, [isMobile])

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
    <div className="h-full w-full relative overflow-hidden">
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

      {/* Indicador de carga (no tapa overlay de play). Reducimos opacidad en móvil */}
      {!videoLoaded && !showPlayOverlay && (
        <div className="absolute inset-0 bg-white/80 md:bg-white/90 flex items-center justify-center z-20">
          <div className="text-center px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-800 text-base md:text-lg font-semibold">Cargando video...</p>
            <div className="w-48 md:w-64 bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-xs md:text-sm mt-2">{Math.round(loadingProgress)}% cargado</p>
          </div>
        </div>
      )}
      
      {/* Fundido blanco con transición suave */}
      <div 
        className={`absolute inset-0 bg-white z-10 transition-opacity duration-1000 ease-in-out`}
        style={{ 
          minHeight: '100vh',
          opacity: videoLoaded ? 0 : 1
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
        controls={isMobile}
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
    </div>
  )
}