import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

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

export default function SecundariaPage() {
  const [scrolled, setScrolled] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })
  const { scrollYProgress } = useScroll()

  // Estados para la galería
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentGallery, setCurrentGallery] = useState<string | null>(null)

  // Configuración de galerías para secundaria
  const galleries: Record<string, { title: string; images: string[] }> = {
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
      ]
    },
    robotica: {
      title: "ROBÓTICA",
      images: [
        "/images/secundaria/robotica/robotica1.jpg",
        "/images/secundaria/robotica/robotica2.jpg"
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
        "/images/secundaria/arte/arte6.jpg",
        "/images/secundaria/arte/arte7.jpg"
      ]
    },
    tecnologia: {
      title: "TECNOLOGÍA",
      images: [
        "/images/entrepreneurs/emprendedores5.jpg",
        "/images/entrepreneurs/emprendedores6.jpg",
        "/images/entrepreneurs/emprendedores7.jpg",
        "/images/entrepreneurs/emprendedores8.jpg",
        "/images/entrepreneurs/emprendedores9.jpg"
      ]
    },
    mindfulness: {
      title: "MINDFULNESS",
      images: [
        "/images/mindfulness/mindfulness1.jpg",
        "/images/mindfulness/mindfulness2.png",
        "/images/mindfulness/mindfulness3.jpg",
        "/images/mindfulness/mindfulness4.jpg"
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
          <div className="transform translate-y-32">
            <h1 className="text-white text-4xl md:text-7xl font-bold tracking-wider drop-shadow-2xl">
              SECUNDARIA
            </h1>
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
                    style={{ backgroundColor: '#fb7c04' }}
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
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/secundaria/leon_cabeza_gris.png')`,
              backgroundPosition: 'calc(100% + 530px) center',
              backgroundSize: 'auto 120%',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </motion.div>
        
        {/* Sección de Materias Extracurriculares */}
        <section className="py-8 md:py-20 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16 flex flex-col items-center justify-center">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2 md:mb-4 text-center">
              Materias extracurriculares que
            </h2>
            <h3 className="text-2xl md:text-4xl font-bold text-blue-600 text-center">
              enriquecen su formación:
            </h3>
          </div>

          {/* Grid de materias extracurriculares */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto justify-items-center">
            {/* Educación Financiera */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer" onClick={() => openGallery('educacionFinanciera')}>
              <img
                src="/images/secundaria/emprende.png"
                alt="Educación Financiera"
                className="w-auto h-auto max-h-80 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-blue-900 bg-opacity-40 p-3 transition-all duration-700 ease-in-out group-hover:bottom-0 group-hover:top-0 group-hover:bg-opacity-90 group-hover:flex group-hover:items-center group-hover:justify-center">
                <h4 className="text-white text-xl font-bold transition-all duration-700 group-hover:text-2xl">EDUCACIÓN FINANCIERA</h4>
              </div>

            </div>

            {/* Robótica */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer" onClick={() => openGallery('robotica')}>
              <img
                src="/images/secundaria/robotica.png"
                alt="Robótica"
                className="w-auto h-auto max-h-80 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#ff9d49] bg-opacity-60 p-3 transition-all duration-700 ease-in-out group-hover:bottom-0 group-hover:top-0 group-hover:bg-opacity-90 group-hover:flex group-hover:items-center group-hover:justify-center">
                <h4 className="text-black text-xl font-bold transition-all duration-700 group-hover:text-2xl">ROBÓTICA</h4>
              </div>

            </div>

            {/* Artes */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer" onClick={() => openGallery('artes')}>
              <img
                src="/images/secundaria/artes.png"
                alt="Artes"
                className="w-auto h-auto max-h-80 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-blue-900 bg-opacity-40 p-3 transition-all duration-700 ease-in-out group-hover:bottom-0 group-hover:top-0 group-hover:bg-opacity-90 group-hover:flex group-hover:items-center group-hover:justify-center">
                <h4 className="text-white text-xl font-bold transition-all duration-700 group-hover:text-2xl">ARTES</h4>
              </div>

            </div>
          </div>

          {/* Segunda fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto justify-items-center">
            {/* Tecnología */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer" onClick={() => openGallery('tecnologia')}>
              <img
                src="/images/secundaria/TECNOLOGIA.png"
                alt="Tecnología"
                className="w-auto h-auto max-h-80 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#ff9d49] bg-opacity-60 p-3 transition-all duration-700 ease-in-out group-hover:bottom-0 group-hover:top-0 group-hover:bg-opacity-90 group-hover:flex group-hover:items-center group-hover:justify-center">
                <h4 className="text-black text-xl font-bold transition-all duration-700 group-hover:text-2xl">TECNOLOGÍA</h4>
              </div>

            </div>

            {/* Mindfulness */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer" onClick={() => openGallery('mindfulness')}>
              <img
                src="/images/extracurriculares/mindfulness.jpg"
                alt="Mindfulness"
                className="w-auto h-auto max-h-80 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-blue-900 bg-opacity-40 p-3 transition-all duration-700 ease-in-out group-hover:bottom-0 group-hover:top-0 group-hover:bg-opacity-90 group-hover:flex group-hover:items-center group-hover:justify-center">
                <h4 className="text-white text-xl font-bold transition-all duration-700 group-hover:text-2xl">MINDFULNESS</h4>
              </div>

            </div>

            {/* Formación Social y Humana */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer" onClick={() => openGallery('formacionSocial')}>
              <img
                src="/images/secundaria/emprende.png"
                alt="Formación Social y Humana"
                className="w-auto h-auto max-h-80 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#ff9d49] bg-opacity-60 p-3 transition-all duration-700 ease-in-out group-hover:bottom-0 group-hover:top-0 group-hover:bg-opacity-90 group-hover:flex group-hover:items-center group-hover:justify-center">
              <h4 className="text-black text-lg font-bold transition-all duration-700 group-hover:text-xl">FORMACIÓN SOCIAL Y HUMANA</h4>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Sección de Francés */}
      <section className="py-8 md:py-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer transition-all duration-500 hover:shadow-2xl">
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
              <div className="absolute inset-0 bg-[#ff9d49] bg-opacity-30 transition-all duration-500 group-hover:bg-opacity-40"></div>
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
            <div className="bg-blue-600 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">CERTIFICACIÓN INTERNACIONAL</h3>
              <p className="mb-6 leading-relaxed">
                Contamos con el respaldo del prestigioso programa de Cambridge diseñado para elevar la excelencia académica en el idioma inglés y proporcionar a nuestros estudiantes las mejores herramientas para su desarrollo.
              </p>
              <div className="flex items-center">
                <img
                  src="/images/logos/cambridge.png"
                  alt="University of Cambridge"
                  className="h-16 w-auto"
                />
              </div>
            </div>

            {/* Servicio de Estancia */}
            <div className="bg-[#ff9d49] text-black p-8 rounded-2xl">
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
        />
      )}
    </div>
  )
} 