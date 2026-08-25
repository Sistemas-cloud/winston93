import { useState, useRef, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { motion } from 'framer-motion'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'

// Componente Modal para la galería
interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  title: string
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
  title
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative max-w-4xl max-h-full w-full h-full flex flex-col">
        {/* Header del modal */}
        <div className="flex justify-between items-center p-4 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar galería"
            className="text-white hover:text-gray-300 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Contenedor de la imagen */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 2026-07-03: Dimensiones y aria-labels en modal de galería. */}
            <img
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Botón anterior */}
            {images.length > 1 && (
              <button
                onClick={onPrev}
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                ←
              </button>
            )}
            
            {/* Botón siguiente */}
            {images.length > 1 && (
              <button
                onClick={onNext}
                aria-label="Imagen siguiente"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                →
              </button>
            )}
          </div>
        </div>

        {/* Contador de imágenes */}
        {images.length > 1 && (
          <div className="text-center text-white p-4">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  )
}

export default function WinstonLife() {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentGallery, setCurrentGallery] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeRibbon, setActiveRibbon] = useState<string | null>(null)
  const [video1Muted, setVideo1Muted] = useState(true)
  const [video2Muted, setVideo2Muted] = useState(true)
  const [video1ManuallyPaused, setVideo1ManuallyPaused] = useState(false)
  const [video2ManuallyPaused, setVideo2ManuallyPaused] = useState(false)
  
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)

  // Precarga de videos
  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.load()
    }
    if (video2Ref.current) {
      video2Ref.current.load()
    }
  }, [])

  // Sincronizar el estado muted con los elementos de video
  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.muted = video1Muted
    }
  }, [video1Muted])

  useEffect(() => {
    if (video2Ref.current) {
      video2Ref.current.muted = video2Muted
    }
  }, [video2Muted])


  // Intersection Observer para video 1 - pausar cuando no está visible
  useEffect(() => {
    const video1 = video1Ref.current
    if (!video1) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video está visible, reproducir solo si no fue pausado manualmente
            if (!video1ManuallyPaused) {
              video1.play().catch((error) => {
                console.log('Error al reproducir video 1:', error)
              })
            }
          } else {
            // Video no está visible, pausar (solo si no fue pausado manualmente)
            if (!video1ManuallyPaused) {
              video1.pause()
            }
          }
        })
      },
      {
        threshold: 0.5 // Se considera visible cuando al menos el 50% está en pantalla
      }
    )

    observer.observe(video1)

    return () => {
      observer.disconnect()
    }
  }, [video1ManuallyPaused])

  // Intersection Observer para video 2 - pausar cuando no está visible
  useEffect(() => {
    const video2 = video2Ref.current
    if (!video2) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video está visible, reproducir solo si no fue pausado manualmente
            if (!video2ManuallyPaused) {
              video2.play().catch((error) => {
                console.log('Error al reproducir video 2:', error)
              })
            }
          } else {
            // Video no está visible, pausar (solo si no fue pausado manualmente)
            if (!video2ManuallyPaused) {
              video2.pause()
            }
          }
        })
      },
      {
        threshold: 0.5 // Se considera visible cuando al menos el 50% está en pantalla
      }
    )

    observer.observe(video2)

    return () => {
      observer.disconnect()
    }
  }, [video2ManuallyPaused])

  const toggleVideo1Audio = () => {
    setVideo1Muted(!video1Muted)
  }

  const toggleVideo2Audio = () => {
    setVideo2Muted(!video2Muted)
  }

  const toggleVideo1PlayPause = () => {
    if (video1Ref.current) {
      if (video1Ref.current.paused) {
        video1Ref.current.play()
        setVideo1ManuallyPaused(false)
      } else {
        video1Ref.current.pause()
        setVideo1ManuallyPaused(true)
      }
    }
  }

  const toggleVideo2PlayPause = () => {
    if (video2Ref.current) {
      if (video2Ref.current.paused) {
        video2Ref.current.play()
        setVideo2ManuallyPaused(false)
      } else {
        video2Ref.current.pause()
        setVideo2ManuallyPaused(true)
      }
    }
  }

  // Galerías de imágenes
  const galleries = {
    soyWinston: {
      title: "#SOY WINSTON",
      gridImages: [
        "/images/Winston Life/galeria soy winston/xantolo.png",
        "/images/Winston Life/galeria soy winston/xantolo1.png",
        "/images/Winston Life/galeria soy winston/posada.png",
        "/images/Winston Life/galeria soy winston/niño.png",
        "/images/Winston Life/galeria soy winston/navidad_primaria.png",
        "/images/Winston Life/galeria soy winston/navidad.png",
        "/images/Winston Life/galeria soy winston/halloween.png",
        "/images/Winston Life/galeria soy winston/acción.png",
        "/images/Winston Life/galeria soy winston/estudiante.png"
      ],
      galleryImages: [
        "/images/Winston Life/galeria soy winston/xantolo_banner.jpg",
        "/images/Winston Life/galeria soy winston/xantolo1_banner.jpg",
        "/images/Winston Life/galeria soy winston/posada_banner.jpg",
        "/images/Winston Life/galeria soy winston/niño_banner.jpg",
        "/images/Winston Life/galeria soy winston/navidad_primaria_banner.jpg",
        "/images/Winston Life/galeria soy winston/navidad_banner.jpg",
        "/images/Winston Life/galeria soy winston/halloween_banner.jpg",
        "/images/Winston Life/galeria soy winston/accion_banner.png",
        "/images/Winston Life/galeria soy winston/estudiante_banner.JPG"
      ]
    }
  }


  const openGallery = (galleryName: string, imageIndex = 0) => {
    setCurrentGallery(galleryName)
    setCurrentImageIndex(imageIndex)
    setGalleryOpen(true)
  }

  const closeGallery = () => {
    setGalleryOpen(false)
    setCurrentGallery(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (currentGallery && galleries[currentGallery as keyof typeof galleries]) {
      const gallery = galleries[currentGallery as keyof typeof galleries]
      setCurrentImageIndex((prev) => (prev + 1) % gallery.galleryImages.length)
    }
  }

  const prevImage = () => {
    if (currentGallery && galleries[currentGallery as keyof typeof galleries]) {
      const gallery = galleries[currentGallery as keyof typeof galleries]
      setCurrentImageIndex((prev) => (prev - 1 + gallery.galleryImages.length) % gallery.galleryImages.length)
    }
  }

  const handleRibbonClick = (section: string) => {
    // Cambiar a la nueva sección seleccionada (la anterior se desactiva automáticamente)
    setActiveRibbon(section)
    
    // Navegar al ancla correspondiente después de que termine la transición de la mueca
    setTimeout(() => {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 650)
  }

  // 2026-07-03: Metadata SEO centralizada para /winston-life.
  const pageSeo = SITE_ROUTES.find((route) => route.path === '/winston-life')!

  return (
    <>
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />

      {/* Header */}
      <Navigation currentSection={0} />

      {/* 2026-04-10: Sin pt superior; el hero arranca en y=0 y el nav fijo/transparente se superpone a la portada (igual que home en móvil/tablet). */}
      <div className="min-h-screen">
        {/* Banner Principal */}
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            {/* 2026-07-03: Dimensiones explícitas en portada para reducir CLS. */}
            <img
              src="/images/Winston Life/portada.jpg"
              alt="Winston Life - Instituto Winston Churchill"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <div className="text-center text-white mb-12 md:mb-16">
              {/* 2026-07-03: H1 semántico real conservando las mismas clases visuales. */}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-4xl sm:text-6xl md:text-8xl font-bold leading-tight"
              >
                <span className="block text-white">WINSTON</span>
                <span className="block text-[#E3FB07] text-3xl sm:text-4xl md:text-6xl">LIFE</span>
              </motion.h1>
            </div>

            {/* Cintilla con iconos - Completamente unida con colores sólidos */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute bottom-0 left-0 right-0 h-28 sm:h-32 flex"
            >
              {/* Winston Olympics - Azul sólido */}
              <div
                className="relative flex-1 cursor-pointer transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-white bg-blue-600 bg-opacity-80 overflow-visible"
                onClick={() => handleRibbonClick('winston-olympics')}
                style={{
                  maskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  WebkitMaskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  transition: '--hole-r 600ms ease',
                  ['--hole-r' as any]: activeRibbon === 'winston-olympics' ? '80px' : '0px'
                }}
              >
                {/* 2026-03-27: Optimización responsive de cintilla para mantener legibilidad/tacto en móvil. */}
                {/* Icono con z-index muy alto para asegurar visibilidad */}
                <div className={`relative ${activeRibbon === 'winston-olympics' ? 'z-[9999]' : 'z-20'}`}>
                  {/* 2026-07-03: Dimensiones explícitas en iconos de cintilla para reducir CLS. */}
                  <img
                    src="/images/Winston Life/iconos/CARA_LEON.png"
                    alt="Winston Olympics"
                    width={64}
                    height={64}
                    className={`w-11 h-11 sm:w-16 sm:h-16 mb-1 sm:mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'winston-olympics' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-[11px] sm:text-lg md:text-xl text-center relative z-40 text-white px-1">WINSTON OLYMPICS</span>
              </div>

              {/* Entrepreneurs - Verde lima sólido */}
              <div
                className="relative flex-1 cursor-pointer transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-black bg-[#E3FB07] bg-opacity-80 overflow-visible"
                onClick={() => handleRibbonClick('entrepreneurs')}
                style={{
                  maskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  WebkitMaskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  transition: '--hole-r 600ms ease',
                  ['--hole-r' as any]: activeRibbon === 'entrepreneurs' ? '80px' : '0px'
                }}
              >
                {/* Icono con z-index muy alto para asegurar visibilidad */}
                <div className={`relative ${activeRibbon === 'entrepreneurs' ? 'z-[9999]' : 'z-20'}`}>
                  <img
                    src="/images/Winston Life/iconos/FOCO.png"
                    alt="Entrepreneurs"
                    width={64}
                    height={64}
                    className={`w-11 h-11 sm:w-16 sm:h-16 mb-1 sm:mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'entrepreneurs' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-[11px] sm:text-lg md:text-xl text-center relative z-40 text-blue-600 px-1">ENTREPRENEURS</span>
              </div>

              {/* #Soy Winston - Azul sólido */}
              <div
                className="relative flex-1 cursor-pointer transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-white bg-blue-600 bg-opacity-80 overflow-visible"
                onClick={() => handleRibbonClick('soy-winston')}
                style={{
                  maskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  WebkitMaskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  transition: '--hole-r 600ms ease',
                  ['--hole-r' as any]: activeRibbon === 'soy-winston' ? '80px' : '0px'
                }}
              >
                {/* Icono con z-index muy alto para asegurar visibilidad */}
                <div className={`relative ${activeRibbon === 'soy-winston' ? 'z-[9999]' : 'z-20'}`}>
                  <img
                    src="/images/Winston Life/iconos/icono_winston.png"
                    alt="#Soy Winston"
                    width={64}
                    height={64}
                    className={`w-11 h-11 sm:w-16 sm:h-16 mb-1 sm:mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'soy-winston' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-[11px] sm:text-lg md:text-xl text-center relative z-40 text-white px-1">#SOYWINSTON</span>
              </div>
              {/* Iconos superpuestos para evitar ser enmascarados y asegurar visibilidad */}
              <div
                className="absolute z-[10000] pointer-events-none transition-opacity duration-700 ease-out"
                style={{ left: '16.6667%', transform: 'translateX(-50%)', top: '-28px', opacity: activeRibbon === 'winston-olympics' ? 1 : 0 }}
              >
                <img
                  src="/images/Winston Life/iconos/CARA_LEON.png"
                  alt=""
                  aria-hidden="true"
                  width={64}
                  height={64}
                  className={`w-16 h-16 transition-transform duration-700 ease-out ${
                    activeRibbon === 'winston-olympics' ? 'scale-150 -translate-y-3' : 'scale-100 translate-y-0'
                  }`}
                />
              </div>
              <div
                className="absolute z-[10000] pointer-events-none transition-opacity duration-700 ease-out"
                style={{ left: '50%', transform: 'translateX(-50%)', top: '-28px', opacity: activeRibbon === 'entrepreneurs' ? 1 : 0 }}
              >
                <img
                  src="/images/Winston Life/iconos/FOCO.png"
                  alt=""
                  aria-hidden="true"
                  width={64}
                  height={64}
                  className={`w-16 h-16 transition-transform duration-700 ease-out ${
                    activeRibbon === 'entrepreneurs' ? 'scale-150 -translate-y-3' : 'scale-100 translate-y-0'
                  }`}
                />
              </div>
              <div
                className="absolute z-[10000] pointer-events-none transition-opacity duration-700 ease-out"
                style={{ left: '83.3333%', transform: 'translateX(-50%)', top: '-28px', opacity: activeRibbon === 'soy-winston' ? 1 : 0 }}
              >
                <img
                  src="/images/Winston Life/iconos/icono_winston.png"
                  alt=""
                  aria-hidden="true"
                  width={64}
                  height={64}
                  className={`w-16 h-16 transition-transform duration-700 ease-out ${
                    activeRibbon === 'soy-winston' ? 'scale-150 -translate-y-3' : 'scale-100 translate-y-0'
                  }`}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video Principal - Pantalla completa */}
        <section id="winston-olympics" className="relative h-screen overflow-hidden">
          <video
            ref={video1Ref}
            autoPlay
            loop
            muted={video1Muted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            preload="auto"
            onClick={toggleVideo1PlayPause}
          >
            <source src="/images/Winston Life/video1.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          {/* Botón de control de audio */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleVideo1Audio()
            }}
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110"
            aria-label={video1Muted ? "Activar audio" : "Desactivar audio"}
          >
            {video1Muted ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </section>

        {/* Sección ENTREPRENEURS */}
        <section id="entrepreneurs" className="py-14 md:py-20 bg-white overflow-hidden">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-600 mb-4">
              ENTREPRENEURS
            </h2>
          </div>
          <div className="w-full">
            {/* Track duplicado: dos grupos idénticos para loop perfecto */}
            <div className="relative z-10 overflow-hidden">
              <div className="wl-cintilla-track flex w-max">
                {/* Grupo A */}
                <div className="flex items-center gap-4">
                  {[1,2,3,4,5,6,7].map((num) => (
                    <div key={`a-${num}`} className="flex-shrink-0">
                      <div className="relative group">
                        <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 rounded-2xl shadow-lg border-2 border-blue-200 transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-400 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:via-white group-hover:to-blue-50 group-hover:-translate-y-2">
                          {/* 2026-07-03: Dimensiones explícitas en carrusel Entrepreneurs para reducir CLS. */}
                          <img src={`/images/Winston Life/emprendedores/emprendedores${num}.${num === 2 ? 'png' : 'jpg'}`} alt={`Programa Entrepreneurs - Actividad ${num}`} width={420} height={300} className="w-[280px] sm:w-[340px] md:w-[420px] h-[210px] sm:h-[250px] md:h-[300px] object-cover rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:brightness-110" />
                          <div className="absolute inset-4 bg-gradient-to-t from-blue-700/60 via-blue-500/20 to-[#E3FB07]/25 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <p className="text-blue-900 text-sm font-bold text-center uppercase tracking-wide">Programa Entrepreneurs</p>
                            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-1 rounded-full"></div>
                          </div>
                          <div className="absolute top-2 left-2 w-3 h-3 bg-[#E3FB07] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Grupo B (duplicado) */}
                <div className="flex items-center gap-4" aria-hidden="true">
                  {[1,2,3,4,5,6,7].map((num) => (
                    <div key={`b-${num}`} className="flex-shrink-0">
                      <div className="relative group">
                        <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 rounded-2xl shadow-lg border-2 border-blue-200 transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-400 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:via-white group-hover:to-blue-50 group-hover:-translate-y-2">
                          {/* 2026-07-03: Dimensiones explícitas en carrusel Entrepreneurs para reducir CLS. */}
                          <img src={`/images/Winston Life/emprendedores/emprendedores${num}.${num === 2 ? 'png' : 'jpg'}`} alt={`Programa Entrepreneurs - Actividad ${num}`} width={420} height={300} className="w-[280px] sm:w-[340px] md:w-[420px] h-[210px] sm:h-[250px] md:h-[300px] object-cover rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:brightness-110" />
                          <div className="absolute inset-4 bg-gradient-to-t from-blue-700/60 via-blue-500/20 to-[#E3FB07]/25 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <p className="text-blue-900 text-sm font-bold text-center uppercase tracking-wide">Programa Entrepreneurs</p>
                            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-1 rounded-full"></div>
                          </div>
                          <div className="absolute top-2 left-2 w-3 h-3 bg-[#E3FB07] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bordes sutiles y desvanecidos full-bleed */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2 z-20">
              <div className="wl-cintilla-track flex w-max">
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20"></div>
                {/* duplicado */}
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20" aria-hidden="true"></div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 z-20">
              <div className="wl-cintilla-track flex w-max">
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40"></div>
                {/* duplicado */}
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40" aria-hidden="true"></div>
              </div>
            </div>
          </div>
          {/* Animación de marquee verdaderamente continua para la cintilla */}
          <style jsx>{`
            @keyframes wl-marquee-x {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .wl-cintilla-track {
              will-change: transform;
              /* 2026-04-16: Se ajusta la velocidad del slider a 52 segundos por solicitud del usuario. */
              animation: wl-marquee-x 52s linear infinite;
            }
          `}</style>
        </section>

        {/* Sección #SOY WINSTON */}
        <section id="soy-winston" className="py-14 md:py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-600 mb-4">
                #SOY WINSTON
              </h2>
            </div>
            
            {/* Grid de imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 max-w-6xl mx-auto">
              {galleries.soyWinston.gridImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => openGallery('soyWinston', index)}
                >
                  {/* 2026-07-03: Dimensiones explícitas en galería #SoyWinston para reducir CLS. */}
                  <img
                    src={image}
                    alt={`#Soy Winston ${index + 1}`}
                    width={640}
                    height={320}
                    className="w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-60 px-4 py-2 rounded-full">
                        <span className="text-blue-900 font-medium text-xs sm:text-sm uppercase tracking-wide">
                          VER COMPLETA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2026-08-24: Video final sin recorte agresivo — object-contain + fondo marca. */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0A1F44] md:min-h-screen">
          <video
            ref={video2Ref}
            autoPlay
            loop
            muted={video2Muted}
            playsInline
            className="relative z-10 mx-auto max-h-[100vh] w-full cursor-pointer object-contain"
            preload="auto"
            onClick={toggleVideo2PlayPause}
          >
            <source src="/images/Winston Life/video2.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          {/* Botón de control de audio */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleVideo2Audio()
            }}
            className="absolute bottom-4 right-4 z-20 rounded-full bg-black bg-opacity-50 p-3 text-white transition-all duration-300 hover:scale-110 hover:bg-opacity-75 md:bottom-8 md:right-8 md:p-4"
            aria-label={video2Muted ? "Activar audio" : "Desactivar audio"}
          >
            {video2Muted ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </section>

        {/* Modal de Galería */}
        {galleryOpen && currentGallery && (
          <GalleryModal
            isOpen={galleryOpen}
            onClose={closeGallery}
            images={galleries[currentGallery as keyof typeof galleries].galleryImages}
            currentIndex={currentImageIndex}
            onNext={nextImage}
            onPrev={prevImage}
            title={galleries[currentGallery as keyof typeof galleries].title}
          />
        )}
      </div>
      
    </>
  )
}
