import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { motion } from 'framer-motion'

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
            className="text-white hover:text-gray-300 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Contenedor de la imagen */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Botón anterior */}
            {images.length > 1 && (
              <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                ←
              </button>
            )}
            
            {/* Botón siguiente */}
            {images.length > 1 && (
              <button
                onClick={onNext}
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

  return (
    <>
      <Head>
        <title>Winston Life - Colegio Winston</title>
        <meta name="description" content="Conoce la vida estudiantil en Colegio Winston" />
      </Head>

      {/* Header */}
      <Navigation currentSection={0} />

      <div className="min-h-screen">
        {/* Banner Principal */}
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/Winston Life/portada.jpg"
              alt="Winston Life"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <div className="text-center text-white mb-16">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-6xl md:text-8xl font-bold mb-4"
              >
                WINSTON
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-[#ccfb00]"
              >
                LIFE
              </motion.h2>
            </div>

            {/* Cintilla con iconos - Completamente unida con colores sólidos */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute bottom-0 left-0 right-0 h-32 flex"
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
                {/* Icono con z-index muy alto para asegurar visibilidad */}
                <div className={`relative ${activeRibbon === 'winston-olympics' ? 'z-[9999]' : 'z-20'}`}>
                  <img
                    src="/images/Winston Life/iconos/CARA_LEON.png"
                    alt="Winston Olympics"
                    className={`w-16 h-16 mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'winston-olympics' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-sm font-bold text-center relative z-40">WINSTON OLYMPICS</span>
              </div>

              {/* Entrepreneurs - Verde lima sólido */}
              <div
                className="relative flex-1 cursor-pointer transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-black bg-[#ccfb00] bg-opacity-80 overflow-visible"
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
                    className={`w-16 h-16 mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'entrepreneurs' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-sm font-bold text-center relative z-40">ENTREPRENEURS</span>
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
                    className={`w-16 h-16 mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'soy-winston' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-sm font-bold text-center relative z-40">#SOYWINSTON</span>
              </div>
              {/* Iconos superpuestos para evitar ser enmascarados y asegurar visibilidad */}
              <div
                className="absolute z-[10000] pointer-events-none transition-opacity duration-700 ease-out"
                style={{ left: '16.6667%', transform: 'translateX(-50%)', top: '-28px', opacity: activeRibbon === 'winston-olympics' ? 1 : 0 }}
              >
                <img
                  src="/images/Winston Life/iconos/CARA_LEON.png"
                  alt="Winston Olympics"
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
                  alt="Entrepreneurs"
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
                  alt="#Soy Winston"
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
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            preload="auto"
          >
            <source src="/images/Winston Life/video1.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </section>

        {/* Sección ENTREPRENEURS */}
        <section id="entrepreneurs" className="py-20 bg-white overflow-hidden">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
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
                          <img src={`/images/Winston Life/emprendedores/emprendedores${num}.${num === 2 ? 'png' : 'jpg'}`} alt={`Programa Entrepreneurs - Actividad ${num}`} className="w-[420px] h-[300px] object-cover rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:brightness-110" />
                          <div className="absolute inset-4 bg-gradient-to-t from-blue-700/60 via-blue-500/20 to-[#ccfb00]/25 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <p className="text-blue-900 text-sm font-bold text-center uppercase tracking-wide">Programa Entrepreneurs</p>
                            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-1 rounded-full"></div>
                          </div>
                          <div className="absolute top-2 left-2 w-3 h-3 bg-[#ccfb00] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
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
                          <img src={`/images/Winston Life/emprendedores/emprendedores${num}.${num === 2 ? 'png' : 'jpg'}`} alt={`Programa Entrepreneurs - Actividad ${num}`} className="w-[420px] h-[300px] object-cover rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:brightness-110" />
                          <div className="absolute inset-4 bg-gradient-to-t from-blue-700/60 via-blue-500/20 to-[#ccfb00]/25 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <p className="text-blue-900 text-sm font-bold text-center uppercase tracking-wide">Programa Entrepreneurs</p>
                            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-1 rounded-full"></div>
                          </div>
                          <div className="absolute top-2 left-2 w-3 h-3 bg-[#ccfb00] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Elementos decorativos flotantes */}
            <div className="absolute top-8 left-1/4 w-2 h-2 bg-[#ccfb00] rounded-full animate-bounce opacity-60"></div>
            <div className="absolute bottom-8 right-1/3 w-3 h-3 bg-blue-600 rounded-full animate-pulse opacity-50"></div>
            <div className="absolute top-12 right-1/4 w-1.5 h-1.5 bg-[#ccfb00] rounded-full animate-ping opacity-40"></div>
            
            {/* Bordes sutiles y desvanecidos full-bleed */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2 z-20">
              <div className="wl-cintilla-track flex w-max">
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#ccfb00]/40 to-blue-100/20"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#ccfb00]/40 to-blue-100/20"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#ccfb00]/40 to-blue-100/20"></div>
                {/* duplicado */}
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#ccfb00]/40 to-blue-100/20" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#ccfb00]/40 to-blue-100/20" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#ccfb00]/40 to-blue-100/20" aria-hidden="true"></div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 z-20">
              <div className="wl-cintilla-track flex w-max">
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#ccfb00]/40"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#ccfb00]/40"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#ccfb00]/40"></div>
                {/* duplicado */}
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#ccfb00]/40" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#ccfb00]/40" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#ccfb00]/40" aria-hidden="true"></div>
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
              animation: wl-marquee-x 24s linear infinite;
            }
          `}</style>
        </section>

        {/* Sección #SOY WINSTON */}
        <section id="soy-winston" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                #SOY WINSTON
              </h2>
            </div>
            
            {/* Grid de imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {galleries.soyWinston.gridImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => openGallery('soyWinston', index)}
                >
                  <img
                    src={image}
                    alt={`#Soy Winston ${index + 1}`}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-60 px-4 py-2 rounded-full">
                        <span className="text-blue-900 font-medium text-sm uppercase tracking-wide">
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

        {/* Video Final - Pantalla completa */}
        <section className="relative h-screen overflow-hidden">
          <video
            ref={video2Ref}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            preload="auto"
          >
            <source src="/images/Winston Life/video2.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
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
