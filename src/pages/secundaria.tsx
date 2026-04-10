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
  title,
  description
}: {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  title: string
  description?: string[]
}) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-y-auto"
        onClick={onClose}
      >
        <div className="relative max-w-6xl w-full mx-4 my-8">
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white text-4xl hover:text-gray-300 transition-colors"
          >
            ×
          </button>

          {/* Título */}
          <div className="absolute top-4 left-4 z-10 text-white text-2xl font-bold drop-shadow-lg">
            {title}
          </div>

          {/* Contenedor principal */}
          <div className="flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
            {/* Imagen principal */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative mt-16"
            >
              <img
                src={images[currentIndex]}
                alt={`${title} - Imagen ${currentIndex + 1}`}
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
              />
              
              {/* Navegación */}
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPrev()
                  }}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110 text-3xl w-12 h-12 flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onNext()
                  }}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110 text-3xl w-12 h-12 flex items-center justify-center"
                >
                  ›
                </button>
              </div>

              {/* Contador */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-lg px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            </motion.div>

            {/* Descripción */}
            {description && description.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white bg-opacity-95 rounded-lg p-6 md:p-8 shadow-xl"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">{title}</h3>
                <div className="space-y-3 text-gray-700 text-base md:text-lg leading-relaxed">
                  {description.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? 'font-semibold text-blue-800' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function SecundariaPage() {
  const [scrolled, setScrolled] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })
  const { scrollYProgress } = useScroll()

  // Estados para la galería
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentGallery, setCurrentGallery] = useState<string | null>(null)

  // Configuración de galerías para secundaria
  const galleries: Record<string, { title: string; images: string[]; description: string[] }> = {
    educacionFinanciera: {
      title: "EDUCACIÓN FINANCIERA",
      images: [
        "/images/secundaria/emprende/emprendedores1.jpg",
        "/images/secundaria/emprende/emprendedores2.jpg",
        "/images/secundaria/emprende/emprendedores3.jpg",
        "/images/secundaria/emprende/emprendedores4.jpg",
        "/images/secundaria/emprende/emprendedores5.jpg",
        "/images/secundaria/emprende/emprendedores6.jpg",
        "/images/secundaria/emprende/emprendedores7.jpg"
      ],
      description: [
        "Fomentamos la cultura del emprendimiento desde edades tempranas.",
        "Nuestros alumnos no sólo imaginan ideas innovadoras: aprenden a construir un negocio desde cero.",
        "Desarrollan planes de negocio reales, crean estrategias de marketing, realizan proyecciones financieras básicas y presentan sus proyectos de forma profesional, todo esto con la finalidad de fortalecer su liderazgo, pensamiento estratégico y toma de decisiones."
      ]
    },
    robotica: {
      title: "ROBÓTICA",
      images: [
        "/images/secundaria/robotica/robotica1.jpg",
        "/images/secundaria/robotica/robotica2.jpg",
        "/images/secundaria/robotica/robotica3.png",
        "/images/secundaria/robotica/robotica4.jpg",
        "/images/secundaria/robotica/robotica5.jpg"
      ],
      description: [
        "Tecnología aplicada al pensamiento lógico y la creatividad.",
        "A través de actividades prácticas, los alumnos diseñan, construyen y programan, desarrollando habilidades de resolución de problemas y trabajo en equipo."
      ]
    },
    artes: {
      title: "ARTES",
      images: [
        "/images/secundaria/arte/arte1.jpg",
        "/images/secundaria/arte/arte2.jpg",
        "/images/secundaria/arte/arte3.JPG",
        "/images/secundaria/arte/arte4.jpg",
        "/images/secundaria/arte/arte5.jpg",
        "/images/secundaria/arte/arte6.jpg"
      ],
      description: []
    },
    tecnologia: {
      title: "TECNOLOGÍA",
      images: [
        "/images/entrepreneurs/tec1.jpg",
        "/images/entrepreneurs/tec2.jpg",
        "/images/entrepreneurs/tec3.jpg"
      ],
      description: [
        "Herramientas para tomar decisiones responsables desde hoy.",
        "Nuestros alumnos aprenden sobre el valor del dinero, ahorro, inversión y consumo consciente de forma práctica y adaptada a su edad."
      ]
    },
    mindfulness: {
      title: "MINDFULNESS",
      images: [
        "/images/secundaria/mindfulness/mind1.jpg",
        "/images/secundaria/mindfulness/mind2.png",
        "/images/secundaria/mindfulness/mind3.jpg"
      ],
      description: [
        "Atención plena para el bienestar emocional y la concentración.",
        "Con ejercicios de respiración, enfoque y relajación, nuestros alumnos aprenden a gestionar sus emociones y mejorar su rendimiento académico."
      ]
    },
    formacionSocial: {
      title: "FORMACIÓN SOCIAL Y HUMANA",
      images: [
        "/images/secundaria/formacion/formacion1.JPG",
        "/images/secundaria/formacion/formacion2.png",
        "/images/secundaria/formacion/formacion3.JPG",
        "/images/secundaria/formacion/formacion4.png",
        "/images/secundaria/formacion/formacion5.JPG",
        "/images/secundaria/formacion/formacion6.JPG"
      ],
      description: [
        "Entendimiento del mundo a través del respeto y la participación.",
        "Promovemos la conciencia social, la identidad cultural y el compromiso con la comunidad mediante actividades integradoras y experiencias significativas."
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
    <div className="secundaria-page">
      <Head>
        <title>Secundaria - Instituto Winston Churchill</title>
        <meta name="description" content="Educación secundaria bilingüe de excelencia en el Instituto Winston Churchill. Formamos estudiantes con pensamiento crítico y formación integral." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="secundaria, educación bilingüe, Winston Churchill, pensamiento crítico, formación integral, idiomas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation - transparente al inicio, azul al hacer scroll */}
      <Navigation currentSection={scrolled ? 1 : 0} />

      {/* Hero Section con imagen de fondo fija - pantalla completa */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Imagen de fondo fija con fundido suave */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('/images/secundaria/PORTADA_SECUNDARIA.jpg')`,
            backgroundAttachment: 'fixed'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        </motion.div>



        {/* Texto SECUNDARIA centrado pero más abajo */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
        >
          <div className="transform translate-y-32 max-w-4xl px-4 md:px-8 text-center">
            <h1 className="text-white text-4xl md:text-7xl font-bold tracking-wider drop-shadow-2xl mb-4 md:mb-8">
              SECUNDARIA
            </h1>
            <div className="text-white text-sm md:text-lg leading-relaxed drop-shadow-lg">
              <p>Formación en inglés con respaldo Cambridge para una titulación internacional y formación en francés, preparamos a nuestros estudiantes para destacar en un entorno global y en constante evolución.</p>
            </div>
          </div>
        </motion.div>

      </section>

      {/* Sección de Pensamiento Crítico e Idiomas */}
      <section className="py-8 md:py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-80 items-start justify-center">
            {/* Título a la izquierda */}
            <div className="flex-shrink-0 text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-2xl md:text-6xl font-bold text-blue-900">PENSAMIENTO</h2>
              <h3 className="text-2xl md:text-6xl font-bold text-blue-600">CRÍTICO</h3>
              <div className="ml-0">
                <p className="text-lg md:text-2xl text-blue-700 font-medium">IDIOMAS Y</p>
                <p className="text-lg md:text-2xl text-blue-700 font-medium">FORMACIÓN INTEGRAL</p>
              </div>
            </div>

            {/* Texto descriptivo a la derecha */}
            <div className="w-full md:w-96 relative">
              {/* Plaquita naranja decorativa - oculta en móvil */}
              <div className="hidden md:block absolute -right-32 -top-8 w-20 h-64 pointer-events-none">
                <div className="relative w-full h-full">
                  {/* Tira naranja vertical principal */}
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: '#ffb600' }}
                  ></div>
                  {/* Mueca inferior derecha (blanca) - más grande */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-white rounded-tl-full"></div>
                </div>
              </div>
              <div className="space-y-2 text-gray-600 leading-relaxed text-justify px-4 md:px-0">
                <p>
                  En nuestra secundaria, fomentamos que nuestros alumnos piensen, cuestionen y resuelvan problemas, 
                  construyendo conocimiento a través del análisis, la reflexión y la experimentación en un ambiente 
                  que estimula la curiosidad y la toma de decisiones independientes.
                </p>                
                <div className="ml-8">
                  <p>
                    Además del programa oficial de la SEP, fortalecemos su educación con inglés avanzado y francés, 
                    integrando el desarrollo cívico, social, deportivo y de valores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Materias Extracurriculares y Francés con imagen de fondo */}
      <div className="relative overflow-hidden bg-white">
        {/* Imagen de fondo del león - solo mitad derecha */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('/images/secundaria/leon_cabeza_gris.png')`,
              backgroundPosition: 'calc(100% + 520px) center',
              backgroundSize: 'auto 130%',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </motion.div>
        
        {/* Sección de Materias Extracurriculares */}
        <section className="py-2 md:py-4 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-2 md:mb-4 flex flex-col items-center justify-center">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2 md:mb-4 text-center">
              Materias extracurriculares que
            </h2>
            <h3 className="text-2xl md:text-4xl font-bold text-blue-600 text-center">
              enriquecen su formación:
            </h3>
          </div>

          {/* 2026-04-10: Tarjetas migradas a ExtracurricularCard para mostrar overlay de carga por imagen. */}
          {/* Grid de materias extracurriculares */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 mb-4 max-w-7xl mx-auto justify-items-center">
            <ExtracurricularCard src="/images/secundaria/emprende.png" alt="Entrepreneurs" overlayColor="bg-blue-900 bg-opacity-40" onClick={() => openGallery('educacionFinanciera')}>
              ENTREPRENEURS
            </ExtracurricularCard>

            <ExtracurricularCard src="/images/secundaria/robotica.png" alt="Robótica" overlayColor="bg-[#ffb600] bg-opacity-60" textColor="text-black" onClick={() => openGallery('robotica')}>
              ROBÓTICA
            </ExtracurricularCard>

            <ExtracurricularCard src="/images/secundaria/artes.png" alt="Artes" overlayColor="bg-blue-900 bg-opacity-40" onClick={() => openGallery('artes')}>
              ARTES
            </ExtracurricularCard>
          </div>

          {/* Segunda fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-w-7xl mx-auto justify-items-center">
            <ExtracurricularCard src="/images/secundaria/TECNOLOGIA.png" alt="Educación Financiera" overlayColor="bg-[#ffb600] bg-opacity-60" textColor="text-black" onClick={() => openGallery('tecnologia')}>
              EDUCACIÓN FINANCIERA
            </ExtracurricularCard>

            <ExtracurricularCard src="/images/extracurriculares/mindfulness.jpg" alt="Mindfulness" overlayColor="bg-blue-900 bg-opacity-40" onClick={() => openGallery('mindfulness')}>
              MINDFULNESS
            </ExtracurricularCard>

            <ExtracurricularCard src="/images/secundaria/emprende.png" alt="Formación Social y Humana" overlayColor="bg-[#ffb600] bg-opacity-60" textColor="text-black" onClick={() => openGallery('formacionSocial')}>
              FORMACIÓN SOCIAL Y HUMANA
            </ExtracurricularCard>
          </div>
        </div>
      </section>

      {/* Sección de Francés */}
      <section className="py-2 md:py-4 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-[73.5rem] mx-auto relative overflow-hidden rounded-none shadow-xl group cursor-pointer transition-all duration-500 hover:shadow-2xl">
            {/* Imagen de fondo que abarca todo el contenedor */}
            <div className="absolute inset-0">
              <img
                src="/images/entrepreneurs/emprendedores3.jpg"
                alt="Estudiante con bandera francesa"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay para mejorar la legibilidad del texto */}
              <div className="absolute inset-0 bg-black bg-opacity-20 transition-all duration-500 group-hover:bg-opacity-10"></div>
              {/* Filtro naranja siempre presente */}
              <div className="absolute inset-0 bg-[#ffb600] bg-opacity-30 transition-all duration-500 group-hover:bg-opacity-40"></div>
            </div>
            
            {/* Contenido superpuesto */}
            <div className="relative z-10 flex items-center justify-center px-16 py-20">
              <div className="text-center">
                <h2 className="text-3xl md:text-7xl font-bold text-white drop-shadow-lg transition-all duration-500 group-hover:scale-105">
                  FRANCÉS
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>

      {/* Sección de Certificaciones */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Certificación Internacional */}
            <div className="bg-blue-600 text-white p-8 rounded-2xl relative">
              <h3 className="text-2xl font-bold mb-4">CERTIFICACIÓN INTERNACIONAL</h3>
              <p className="mb-6 leading-relaxed">
                Contamos con el respaldo del prestigioso programa de Cambridge diseñado para elevar la excelencia académica en el idioma inglés y proporcionar a nuestros estudiantes las mejores herramientas para su desarrollo.
              </p>
              <div className="absolute bottom-4 right-4">
                <img
                  src="/images/logos/cambridge.png"
                  alt="University of Cambridge"
                  className="h-16 w-auto"
                />
              </div>
            </div>

            {/* Servicio de Estancia */}
            <div className="bg-[#ffb600] text-black p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">SERVICIO DE ESTANCIA</h3>
              <p className="mb-4 leading-relaxed">
                <strong>FLEXIBILIDAD PARA TI, ACOMPAÑAMIENTO PARA ELLOS</strong>
              </p>
              <p className="leading-relaxed">
                Sabemos que cada familia tiene diferentes horarios por eso ofrecemos servicio de estancia para cuidar, acompañar y apoyar a nuestros alumnos después de su jornada escolar.
              </p>
              <div className="mt-4">
                <p className="font-bold">HORARIOS:</p>
                <p>5:00 PM - 7:00 PM</p>
              </div>
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
          description={galleries[currentGallery].description}
        />
      )}
    </div>
  )
} 