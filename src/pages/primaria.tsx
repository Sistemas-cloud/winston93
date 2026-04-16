import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// 2026-04-10: Overlay de carga con slogan institucional animado — brillo tipo shimmer y flotación juguetona por palabra.
const SloganLoadingOverlay = ({ visible }: { visible: boolean }) => {
  const words = [
    { text: 'WORKING',  delay: '0s',    ml: '-10px', size: '1.5rem',  rot: '-2deg'  },
    { text: 'FOR A',    delay: '0.25s', ml: '16px',  size: '1.05rem', rot: '1.5deg' },
    { text: 'BRIGHTER', delay: '0.5s',  ml: '0px',   size: '1.35rem', rot: '-1deg'  },
    { text: 'FUTURE',   delay: '0.75s', ml: '12px',  size: '1.6rem',  rot: '2deg'   },
  ]
  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center overflow-hidden transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'linear-gradient(150deg, #010f3a 0%, #013BDF 55%, #0050ff 100%)' }}
    >
      <style>{`
        @keyframes wfbf-shimmer {
          0%   { background-position: -400% center; }
          100% { background-position: 400% center; }
        }
        @keyframes wfbf-fa { 0%,100%{transform:translateY(0) rotate(-2deg)}  50%{transform:translateY(-7px) rotate(-2deg)}  }
        @keyframes wfbf-fb { 0%,100%{transform:translateY(0) rotate(1.5deg)} 50%{transform:translateY(-5px) rotate(1.5deg)} }
        @keyframes wfbf-fc { 0%,100%{transform:translateY(0) rotate(-1deg)}  50%{transform:translateY(-8px) rotate(-1deg)}  }
        @keyframes wfbf-fd { 0%,100%{transform:translateY(0) rotate(2deg)}   50%{transform:translateY(-6px) rotate(2deg)}   }
        @keyframes wfbf-star { 0%,100%{opacity:.3;transform:scale(.7) rotate(0deg)} 50%{opacity:1;transform:scale(1.4) rotate(180deg)} }
      `}</style>
      <div className="flex flex-col items-center select-none px-4 gap-0.5">
        {words.map(({ text, delay, ml, size, rot }, i) => (
          <span
            key={text}
            style={{
              fontSize: size,
              fontWeight: 900,
              letterSpacing: '0.13em',
              marginLeft: ml,
              display: 'block',
              background: 'linear-gradient(90deg,#fff 15%,#E3FB07 32%,#fff 50%,#b8d8ff 65%,#fff 78%,#E3FB07 94%)',
              backgroundSize: '400% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: `wfbf-f${['a','b','c','d'][i]} 2.2s ease-in-out infinite, wfbf-shimmer 2.6s linear infinite`,
              animationDelay: delay,
            }}
          >
            {text}
          </span>
        ))}
        <span style={{ fontSize: '1rem', marginTop: '6px', color: '#E3FB07', animation: 'wfbf-star 1.8s ease-in-out infinite', display: 'block' }}>
          ✦
        </span>
      </div>
    </div>
  )
}

// 2026-04-10: Tarjeta extracurricular con overlay de slogan animado mientras carga la imagen.
const ExtracurricularCard = ({
  src,
  alt,
  overlayColor,
  textColor = 'text-white',
  onClick,
  children,
}: {
  src: string
  alt: string
  overlayColor: string
  textColor?: string
  onClick: () => void
  children: React.ReactNode
}) => {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative group overflow-hidden rounded-none cursor-pointer" onClick={onClick}>
      <SloganLoadingOverlay visible={!loaded} />
      {/* 2026-04-10: opacity-0 hasta carga completa; evita renderizado progresivo visible detrás del overlay */}
      <img
        src={src}
        alt={alt}
        className={`w-80 h-80 object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <div className={`absolute bottom-0 left-0 right-0 ${overlayColor} p-3 transition-all duration-700 ease-in-out group-hover:bottom-0 group-hover:top-0 group-hover:bg-opacity-90 group-hover:flex group-hover:items-center group-hover:justify-center`}>
        <div className={`${textColor} text-xl font-bold transition-all duration-700 group-hover:text-2xl flex items-center`}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Componente de Galería Modal
const GalleryModal = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onNext, 
  onPrev, 
  title 
}: {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  title: string
}) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="relative max-w-6xl max-h-[95vh] w-full mx-4">
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white text-4xl hover:text-gray-300 transition-colors"
          >
            ×
          </button>

          {/* Título */}
          <div className="absolute top-4 left-4 z-10 text-white text-2xl font-bold">
            {title}
          </div>

          {/* Imagen principal */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${title} - Imagen ${currentIndex + 1}`}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          </motion.div>

          {/* Navegación */}
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              className="pointer-events-auto bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="pointer-events-auto bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
            >
              ›
            </button>
          </div>



          {/* Contador */}
          <div className="absolute bottom-4 right-4 text-white text-lg">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function PrimariaPage() {
  const [scrolled, setScrolled] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })
  const { scrollYProgress } = useScroll()

  // Estados para la galería
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentGallery, setCurrentGallery] = useState<string | null>(null)

  // Configuración de galerías
  const galleries: Record<string, { title: string; images: string[] }> = {
    mindfulness: {
      title: "MINDFULNESS",
      images: [
        "/images/mindfulness/mindfulness1.jpg",
        "/images/mindfulness/mindfulness2.png",
        "/images/mindfulness/mindfulness3.jpg",
        "/images/mindfulness/mindfulness4.jpg"
      ]
    },
    robotica: {
      title: "ROBÓTICA",
      images: [
        "/images/robotica/robotica1.jpg",
        "/images/robotica/robotica2.jpg",
        "/images/robotica/robotica3.jpg",
        "/images/robotica/robotica4.jpg"
      ]
    },
    artes: {
      title: "ARTES",
      images: [
        "/images/artes/artes1.jpg",
        "/images/artes/artes2.jpg",
        "/images/artes/artes3.JPG",
        "/images/artes/artes4.jpg",
        "/images/artes/artes5.jpg"
      ]
    },
    tecnologia: {
      title: "TECNOLOGÍA",
      images: [
        "/images/tecnologia/tec1.png",
        "/images/tecnologia/tec2.png"
      ]
    },
    entrepreneurs: {
      title: "ENTREPRENEURS",
      images: [
        "/images/entrepreneurs/emprendedores1.jpg",
        "/images/entrepreneurs/emprendedores2.png",
        "/images/entrepreneurs/emprendedores3.jpg",
        "/images/entrepreneurs/emprendedores4.jpg",
        "/images/entrepreneurs/emprendedores5.jpg",
        "/images/entrepreneurs/emprendedores6.jpg",
        "/images/entrepreneurs/emprendedores7.jpg",
        "/images/entrepreneurs/emprendedores8.jpg",
        "/images/entrepreneurs/emprendedores9.jpg",
        "/images/entrepreneurs/emprendedores10.jpg"
      ]
    },
    fe: {
      title: "EDUCACIÓN EN LA FE",
      images: [
        "/images/fe/fe1.jpg",
        "/images/fe/fe2.jpg",
        "/images/fe/fe3.jpg",
        "/images/fe/fe4.jpg",
        "/images/fe/fe5.jpg"
      ]
    }
  }

  // Funciones para la galería
  const openGallery = (galleryKey: string) => {
    setCurrentGallery(galleryKey)
    setCurrentImageIndex(0)
    setGalleryOpen(true)
  }

  const closeGallery = () => {
    setGalleryOpen(false)
    setCurrentGallery(null)
  }

  const nextImage = () => {
    if (currentGallery) {
      const totalImages = galleries[currentGallery].images.length
      setCurrentImageIndex((prev) => (prev + 1) % totalImages)
    }
  }

  const prevImage = () => {
    if (currentGallery) {
      const totalImages = galleries[currentGallery].images.length
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100
      setScrolled(isScrolled)
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Establecer tamaño inicial
    handleResize()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="primaria-page">
      <Head>
        <title>Primaria - Instituto Winston Churchill</title>
        <meta name="description" content="Educación primaria bilingüe de excelencia en el Instituto Winston Churchill. Formamos estudiantes con pensamiento crítico y valores sólidos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="primaria, educación bilingüe, Winston Churchill, educación integral, valores, pensamiento crítico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation - transparente al inicio, azul al hacer scroll */}
      <Navigation currentSection={scrolled ? 1 : 0} />

      {/* Hero Section con imagen de fondo fija - 1/3 en móvil */}
      <section className="relative h-[33vh] md:h-screen w-full overflow-hidden">
        {/* Imagen de fondo fija con fundido suave - fachada completa visible */}
        <motion.div 
          className="absolute inset-0 bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/facilities/fondo_escuela.png')`,
            // 2026-04-10: En móvil evitamos bg-fixed (inestable) y estiramos al 100% para rellenar todo el hero.
            backgroundAttachment: windowSize.width < 768 ? 'scroll' : 'fixed',
            backgroundSize: windowSize.width < 768 ? '100% 100%' : 'contain'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {/* Overlay con gradiente más suave para no opacar la fachada */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 to-transparent"></div>
        </motion.div>

        {/* Nueva imagen de bandas horizontales con movimiento de izquierda a derecha */}
        <motion.div 
          className="absolute inset-0 z-[1] flex items-center justify-center"
          initial={{ x: -1000, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/images/facilities/pleca_verde.png"
            alt="Bandas decorativas"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Imagen del estudiante — debajo del texto para no tapar el copy (2026-04-11). */}
        <motion.div 
          className="absolute bottom-0 left-0 z-[5] w-full h-full pointer-events-none"
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/images/facilities/niño.png"
            alt="Estudiante de Primaria - Instituto Winston Churchill"
            width={800}
            height={1080}
            className="absolute bottom-0 left-2 md:left-16 h-full w-auto object-cover object-bottom"
          />
        </motion.div>

        {/* 2026-04-11: Capa propia z-30 encima del niño; móvil solo título, md+ título + párrafos; tablet grande alineado al lado derecho del personaje. */}
        {/* 2026-04-11: Más padding izquierdo en md+ para separar el copy del personaje. */}
        <div className="absolute inset-0 z-[30] flex flex-col justify-center items-center px-4 pt-10 pb-6 text-center md:items-stretch md:justify-center md:text-left md:pl-[50%] lg:pl-[52%] xl:pl-[50%] md:pr-6 lg:pr-10 xl:pr-16 md:pt-16 md:pb-8 pointer-events-none">
          <div className="pointer-events-auto max-w-[22rem] sm:max-w-md md:max-w-lg lg:max-w-xl w-full">
            <h1 className="text-white text-2xl md:text-5xl lg:text-6xl font-bold tracking-wider mb-2 md:mb-4 drop-shadow-lg">PRIMARIA</h1>
            <div className="hidden md:block text-white text-sm md:text-base leading-relaxed space-y-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              <p className="font-semibold">Etapa avalada por el respaldo académico de Cambridge.</p>
              <p>Con una formación académica de calidad y el inglés como parte esencial del aprendizaje, acompañamos a nuestros alumnos en una etapa clave para fortalecer su pensamiento crítico y sus valores.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Sección Unificada con Fondo Continuo */}
      <section className="relative overflow-hidden">
        {/* Imagen de fondo continua */}
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'url(/images/primaria/fondo_linea.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Contenido de Educación Bilingüe */}
        <div className="py-8 md:py-20 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8 md:gap-80 items-start justify-center">
              {/* Título a la izquierda */}
              <div className="flex-shrink-0 text-center md:text-left mb-6 md:mb-0">
                {/* 2026-04-14: "EDUCACIÓN" en #0038e4 y el resto del título en #156dff por solicitud del usuario. */}
                <h2 className="text-2xl md:text-6xl font-bold text-[#0038e4]">EDUCACIÓN</h2>
                <h3 className="text-2xl md:text-6xl font-bold text-[#156dff]">BILINGÜE</h3>
                <div className="ml-0">
                  <p className="text-lg md:text-2xl text-[#156dff] font-medium">QUE FORMA</p>
                  <p className="text-lg md:text-2xl text-[#156dff] font-medium">CON PROPÓSITO</p>
                </div>
              </div>

              {/* Texto descriptivo a la derecha */}
              <div className="w-full md:w-96 relative">
                {/* Plaquita verde - tira vertical simple - oculta en móvil */}
                <div className="hidden md:block absolute -right-32 -top-8 w-20 h-64 pointer-events-none">
                  <div className="relative w-full h-full">
                    {/* Tira verde vertical principal */}
                                          <div 
                        className="absolute inset-0"
                        style={{ backgroundColor: '#ccfb00' }}
                      ></div>
                    {/* Mueca inferior derecha (blanca) - más grande */}
                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-white rounded-tl-full"></div>
                  </div>
                </div>
                <div className="space-y-2 text-gray-600 leading-relaxed text-justify px-4 md:px-0">
                  <p>
                    En primaria, nuestros alumnos aprenden en un modelo bilingüe con inmersión total en inglés, logrando comprender y expresarse con fluidez. La otra mitad se imparte en español, cumpliendo con el programa oficial de la SEP.
                  </p>                
                  <div className="ml-8">
                    <p>
                      Desde esta etapa, promovemos el pensamiento emprendedor y la autonomía, fortaleciendo su seguridad, creatividad y habilidades para enfrentar con éxito los retos del mundo actual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de Materias Extracurriculares */}
        <div className="py-2 md:py-4 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-2 md:mb-4">
            {/* 2026-04-14: Se unifica color del título de extracurriculares y se quita negrita en la segunda línea. */}
            <h2 className="text-2xl md:text-4xl font-bold text-[#0038e4] mb-2 md:mb-4">
              Materias extracurriculares que
            </h2>
            <h3 className="text-2xl md:text-4xl font-normal text-[#0038e4]">
              enriquecen su formación:
            </h3>
          </div>

          {/* 2026-04-10: Tarjetas migradas a ExtracurricularCard para mostrar overlay de carga por imagen. */}
          {/* Grid de materias extracurriculares */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 mb-4 max-w-7xl mx-auto justify-items-center">
            {/* 2026-04-14: Ajuste de tono azul en hover de extracurriculares al color institucional #0038e4. */}
            <ExtracurricularCard src="/images/extracurriculares/mindfulness.jpg" alt="Mindfulness" overlayColor="bg-[#0038e4] bg-opacity-60" onClick={() => openGallery('mindfulness')}>
              MINDFULNESS
            </ExtracurricularCard>

            {/* 2026-04-14: En tarjetas verde fosforescente, texto de materias en azul #0038e4. */}
            <ExtracurricularCard src="/images/extracurriculares/robotica.png" alt="Robótica" overlayColor="bg-[#E3FB07] bg-opacity-60" textColor="text-[#0038e4]" onClick={() => openGallery('robotica')}>
              ROBÓTICA
            </ExtracurricularCard>

            <ExtracurricularCard src="/images/extracurriculares/artes.jpg" alt="Artes" overlayColor="bg-[#0038e4] bg-opacity-60" onClick={() => openGallery('artes')}>
              ARTES
            </ExtracurricularCard>
          </div>

          {/* Segunda fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-w-7xl mx-auto justify-items-center">
            <ExtracurricularCard src="/images/extracurriculares/tecnologia.png" alt="Tecnología" overlayColor="bg-[#E3FB07] bg-opacity-60" textColor="text-[#0038e4]" onClick={() => openGallery('tecnologia')}>
              TECNOLOGÍA
            </ExtracurricularCard>

            <ExtracurricularCard src="/images/extracurriculares/entrepreneurs.jpg" alt="Entrepreneurs" overlayColor="bg-[#0038e4] bg-opacity-60" onClick={() => openGallery('entrepreneurs')}>
              ENTREPRENEURS
            </ExtracurricularCard>

            <ExtracurricularCard src="/images/extracurriculares/fe.png" alt="Educación en la Fe" overlayColor="bg-[#E3FB07] bg-opacity-60" textColor="text-[#0038e4]" onClick={() => openGallery('fe')}>
              EDUCACIÓN EN LA FE <span className="text-xs ml-2">(OPCIONAL)</span>
            </ExtracurricularCard>
          </div>
        </div>
      </div>

        {/* Contenido de Certificaciones */}
        <div className="py-2 md:py-4 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Certificación Internacional */}
              <div className="bg-blue-600 text-white p-8 rounded-2xl relative">
                <h3 className="text-2xl font-bold mb-4">CERTIFICACIÓN INTERNACIONAL</h3>
                {/* 2026-04-14: Se justifica el texto informativo de ambas tarjetas. */}
                <p className="mb-6 leading-relaxed text-justify">
                  Contamos con el respaldo del prestigioso programa de Cambridge, diseñado para elevar los estándares educativos en el idioma inglés y proporcionar a nuestros estudiantes las mejores herramientas para su aprendizaje.
                </p>
                {/* 2026-04-14: Logo Cambridge centrado horizontalmente dentro del bloque de certificación. */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <img
                    src="/images/logos/cambridge.png"
                    alt="University of Cambridge"
                    className="h-16 w-auto"
                  />
                </div>
              </div>

              {/* Servicio de Estancia */}
              {/* 2026-04-14: Ajuste de legibilidad en bloque verde fosforescente usando tono negro-gris para el texto. */}
              <div className="bg-[#E3FB07] text-gray-900 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">SERVICIO DE ESTANCIA</h3>
                {/* 2026-04-16: Se actualiza texto de Servicio de Estancia con copia oficial y horarios correctos. */}
                <p className="mb-4 leading-relaxed text-justify">
                  <strong>FLEXIBILIDAD PARA TI, ACOMPAÑAMIENTO PARA ELLOS.</strong>
                </p>
                <p className="leading-relaxed text-justify">
                  Sabemos que cada familia tiene diferentes horarios, por eso ofrecemos un servicio de estancia que cuida, acompaña y apoya a nuestros alumnos al terminar su jornada escolar.
                </p>
                {/* 2026-04-16: Se unifica el horario en formato de rango para evitar ambigüedad. */}
                <div className="mt-4">
                  <p>5:00 PM a 7:00 PM</p>
                </div>
              </div>
            </div>

            {/* 2026-04-16: Botón de admisión centrado debajo de las tarjetas de certificación y estancia. */}
            <div className="mt-8 flex justify-center">
              <a
                href="https://agendaw.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#013BDF] text-white font-bold text-lg uppercase tracking-widest px-10 py-4 rounded-xl shadow-lg hover:bg-[#0050ce] hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                COMIENZA TU PROCESO DE ADMISIÓN
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer global se renderiza desde Layout */}

      {/* Modal de Galería */}
      {galleryOpen && currentGallery && (
        <GalleryModal
          isOpen={galleryOpen}
          onClose={closeGallery}
          images={galleries[currentGallery].images}
          currentIndex={currentImageIndex}
          onNext={nextImage}
          onPrev={prevImage}
          title={galleries[currentGallery].title}
        />
      )}
    </div>
  )
} 
