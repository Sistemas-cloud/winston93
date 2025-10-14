import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Componente para imagen con efecto de entrada único
const AnimatedImage = ({ 
  src, 
  alt, 
  effectType = 'slide',
  delay = 0 
}: {
  src: string
  alt: string
  effectType?: 'slide' | 'zoom' | 'zoom-organic' | 'fade' | 'rotate'
  delay?: number
}) => {
  const getInitialState = () => {
    switch (effectType) {
      case 'slide':
        return { opacity: 0, x: -100, y: 0, scale: 1, rotate: 0 }
      case 'zoom':
        return { opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 0 }
      case 'zoom-organic':
        return { opacity: 0, x: 0, y: 0, scale: 0.8, rotate: -5 }
      case 'fade':
        return { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }
      case 'rotate':
        return { opacity: 0, x: 0, y: 0, scale: 0.8, rotate: 180 }
      default:
        return { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }
    }
  }

  const getFinalState = () => {
    return { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
  }

  const getTransition = () => {
    switch (effectType) {
      case 'zoom-organic':
        return { 
          duration: 2.2, 
          delay: delay,
          ease: [0.25, 0.46, 0.45, 0.94] // Curva de ease-out más orgánica
        }
      default:
        return { 
          duration: 1.5, 
          delay: delay,
          ease: "easeOut"
        }
    }
  }

  return (
    <motion.div
      initial={getInitialState()}
      whileInView={getFinalState()}
      transition={getTransition()}
      viewport={{ once: true, margin: "-50px" }}
      className="absolute inset-0"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={true}
      />
    </motion.div>
  )
}

// Tipo para las secciones que pueden tener imagen normal o fragmentada
interface Section {
  id: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  bgColor: string
  textColor: string
  accentColor: string
  image?: string
  imageEffect?: 'slide' | 'zoom' | 'zoom-organic' | 'fade' | 'rotate'
  fadeImage?: string
}

export default function ProgramasPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [showTitle, setShowTitle] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)
  const sectionsRef = useRef<HTMLDivElement>(null)
  const sections = useRef<(HTMLDivElement | null)[]>([])

  // Configuración de las tres secciones
  const sectionsData: Section[] = [
    {
      id: 'educacion-financiera',
      title: 'Educación Financiera',
      subtitle: 'Entrepreneurs',
      description: 'Fomentamos la cultura del emprendimiento desde edades tempranas.',
      longDescription: 'Nuestros alumnos no sólo imaginan ideas innovadoras: Aprenden a construir un negocio desde cero. Desarrollan planes de negocio reales, crean estrategias de marketing, realizan proyecciones financieras básicas y presentan sus proyectos de forma profesional, todo esto con la finalidad de fortalecer su liderazgo, pensamiento estratégico y toma de decisiones.',
      bgColor: 'from-yellow-400 to-yellow-500',
      textColor: 'text-black',
      accentColor: 'bg-blue-600',
      image: '/images/PROGRAMAS/emprende.jpg',
      imageEffect: 'fade',
      fadeImage: '/images/PROGRAMAS/fundidos/fondo_naranja.png'
    },
    {
      id: 'mindfulness',
      title: 'MIND FUL NESS',
      subtitle: '',
      description: 'Atención plena para el bienestar emocional y la concentración.',
      longDescription: 'Con ejercicios de respiración, enfoque y relajación, nuestros alumnos aprenden a gestionar sus emociones y mejorar su rendimiento académico.',
      bgColor: 'from-blue-500 to-blue-600',
      textColor: 'text-white',
      accentColor: 'bg-yellow-400',
      image: '/images/PROGRAMAS/socioemocional.jpg',
      imageEffect: 'slide',
      fadeImage: '/images/PROGRAMAS/fundidos/fondo_azul.png'
    },
    {
      id: 'formacion-social',
      title: 'FORMACIÓN',
      subtitle: 'Social y Humana',
      description: 'Atención plena para el bienestar emocional y la concentración.',
      longDescription: 'Con ejercicios de respiración, enfoque y relajación, nuestros alumnos aprenden a gestionar sus emociones y mejorar su rendimiento académico.',
      bgColor: 'from-blue-600 to-blue-800',
      textColor: 'text-white',
      accentColor: 'bg-yellow-400',
      image: '/images/PROGRAMAS/donativo.jpg',
      imageEffect: 'zoom-organic',
      fadeImage: '/images/PROGRAMAS/fundidos/fondo_verde.png'
    }
  ]

  // Ocultar el título después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // Función para obtener el color de difuminado más suave según el fondo de la sección
  const getFadeColor = (bgColor: string) => {
    if (bgColor.includes('blue-500') || bgColor.includes('blue-600')) {
      return {
        light: 'rgba(1, 59, 223, 0.01)',
        medium: 'rgba(1, 59, 223, 0.03)',
        strong: 'rgba(1, 59, 223, 0.08)',
        veryStrong: 'rgba(1, 59, 223, 0.2)',
        solid: 'rgba(1, 59, 223, 0.6)'
      }
    } else if (bgColor.includes('blue-800')) {
      return {
        light: 'rgba(1, 59, 223, 0.01)',
        medium: 'rgba(1, 59, 223, 0.03)',
        strong: 'rgba(1, 59, 223, 0.08)',
        veryStrong: 'rgba(1, 59, 223, 0.2)',
        solid: 'rgba(1, 59, 223, 0.6)'
      }
    } else if (bgColor.includes('yellow-400') || bgColor.includes('yellow-500')) {
      return {
        light: 'rgba(227, 251, 7, 0.01)',
        medium: 'rgba(227, 251, 7, 0.03)',
        strong: 'rgba(227, 251, 7, 0.08)',
        veryStrong: 'rgba(227, 251, 7, 0.2)',
        solid: 'rgba(227, 251, 7, 0.6)'
      }
    }
    // Color por defecto (negro) para otros casos
    return {
      light: 'rgba(0, 0, 0, 0.01)',
      medium: 'rgba(0, 0, 0, 0.03)',
      strong: 'rgba(0, 0, 0, 0.08)',
      veryStrong: 'rgba(0, 0, 0, 0.2)',
      solid: 'rgba(0, 0, 0, 0.6)'
    }
  }

  // Función para navegar a una sección específica
  const goToSection = (index: number) => {
    if (isScrolling || index < 0 || index >= sectionsData.length) return
    
    setIsScrolling(true)
    setCurrentSection(index)
    
    // Usar scrollTo en el contenedor principal en lugar de window
    if (sectionsRef.current) {
      const targetY = index * window.innerHeight
      sectionsRef.current.scrollTo({
        top: targetY,
        behavior: 'smooth'
      })
    }
    
    // Permitir scroll después de la animación
    setTimeout(() => setIsScrolling(false), 1000)
  }

  // Manejar scroll del mouse y teclado
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return
      
      if (e.deltaY > 0) {
        // Scroll hacia abajo
        goToSection(Math.min(currentSection + 1, sectionsData.length - 1))
      } else {
        // Scroll hacia arriba
        goToSection(Math.max(currentSection - 1, 0))
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        goToSection(Math.min(currentSection + 1, sectionsData.length - 1))
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goToSection(Math.max(currentSection - 1, 0))
      }
    }

    // Bloquear scroll nativo completamente
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    
    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSection, isScrolling, sectionsData.length])

  return (
    <div className="programas-page">
      <Head>
        <title>Programas - Instituto Winston Churchill</title>
        <meta name="description" content="Descubre nuestros programas especializados en formación social, educación financiera y mindfulness en el Instituto Winston Churchill." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="programas, mindfulness, emprendimiento, educación financiera, Winston Churchill" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation siempre transparente */}
      <Navigation currentSection={0} />

      
      {/* Contenedor principal con secciones */}
      <div ref={sectionsRef} className="programas-container">
        {sectionsData.map((section, index) => (
          <motion.section
            key={section.id}
            ref={(el: HTMLDivElement | null) => {
              if (el) sections.current[index] = el
            }}
            className="programas-section h-screen w-full relative overflow-hidden"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-200px" }}
            style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
          >
            {/* Contenedor unificado para imagen y texto */}
            <div className="h-full w-full relative flex flex-row" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
              {/* Imagen de fondo que ocupa toda la pantalla */}
              <div className="w-full h-full relative" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="absolute inset-0"
                  style={{ border: 'none', outline: 'none' }}
                >
                  {/* Contenedor para la imagen */}
                  <div className="relative w-full h-full">
                    {/* Renderizar imagen con efecto único */}
                    {section.image && (
                      <AnimatedImage 
                        src={section.image} 
                        alt={section.title} 
                        effectType={section.imageEffect}
                        delay={0.3}
                      />
                    )}
                    
                    {/* Imagen de fundido superpuesta */}
                    {section.fadeImage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.5 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="absolute inset-0 z-10"
                      >
                        <Image
                          src={section.fadeImage}
                          alt={`Fundido ${section.title}`}
                          fill
                          className="object-cover"
                          priority={true}
                        />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Overlay con gradiente que coincide con el color del fondo */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: section.fadeImage?.includes('naranja') ? 
                        `linear-gradient(
                          to right,
                          transparent 0%,
                          transparent 30%,
                          rgba(255, 180, 42, 0.1) 50%,
                          rgba(255, 180, 42, 0.3) 70%,
                          rgba(255, 180, 42, 0.5) 85%,
                          rgba(255, 180, 42, 0.7) 100%
                        )` :
                        section.fadeImage?.includes('azul') ?
                        `linear-gradient(
                          to right,
                          transparent 0%,
                          transparent 30%,
                          rgba(122, 220, 243, 0.1) 50%,
                          rgba(122, 220, 243, 0.3) 70%,
                          rgba(122, 220, 243, 0.5) 85%,
                          rgba(122, 220, 243, 0.7) 100%
                        )` :
                        section.fadeImage?.includes('verde') ?
                        `linear-gradient(
                          to right,
                          transparent 0%,
                          transparent 30%,
                          rgba(234, 249, 128, 0.1) 50%,
                          rgba(234, 249, 128, 0.3) 70%,
                          rgba(234, 249, 128, 0.5) 85%,
                          rgba(234, 249, 128, 0.7) 100%
                        )` :
                        `linear-gradient(
                          to right,
                          transparent 0%,
                          transparent 30%,
                          rgba(0, 0, 0, 0.1) 50%,
                          rgba(0, 0, 0, 0.3) 70%,
                          rgba(0, 0, 0, 0.5) 85%,
                          rgba(0, 0, 0, 0.7) 100%
                        )`,
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                  ></div>
                </motion.div>
              </div>

              {/* Panel de texto derecho con fondo sólido que se extiende sobre la imagen */}
              <div 
                className={`w-4/5 h-full absolute right-0 top-0 flex items-center justify-end pr-8 md:pr-16 lg:pr-24 z-20`}
                style={{
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  background: section.fadeImage?.includes('naranja') ? 
                    `linear-gradient(
                      to left,
                      rgba(255, 180, 42, 1) 0%,
                      rgba(255, 180, 42, 0.95) 15%,
                      rgba(255, 180, 42, 0.8) 35%,
                      rgba(255, 180, 42, 0.4) 60%,
                      transparent 100%
                    )` :
                    section.fadeImage?.includes('azul') ?
                    `linear-gradient(
                      to left,
                      rgba(122, 220, 243, 1) 0%,
                      rgba(122, 220, 243, 0.95) 15%,
                      rgba(122, 220, 243, 0.8) 35%,
                      rgba(122, 220, 243, 0.4) 60%,
                      transparent 100%
                    )` :
                    section.fadeImage?.includes('verde') ?
                    `linear-gradient(
                      to left,
                      rgba(234, 249, 128, 1) 0%,
                      rgba(234, 249, 128, 0.95) 15%,
                      rgba(234, 249, 128, 0.8) 35%,
                      rgba(234, 249, 128, 0.4) 60%,
                      transparent 100%
                    )` :
                    `linear-gradient(
                      to left,
                      ${section.bgColor.includes('from-') ? 
                        section.bgColor.includes('blue-500') ? 'rgba(1, 59, 223, 1)' :
                        section.bgColor.includes('blue-800') ? 'rgba(1, 59, 223, 1)' :
                        section.bgColor.includes('yellow-400') ? 'rgba(227, 251, 7, 1)' :
                        'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 1)'
                      } 0%,
                      ${section.bgColor.includes('from-') ? 
                        section.bgColor.includes('blue-500') ? 'rgba(1, 59, 223, 0.95)' :
                        section.bgColor.includes('blue-800') ? 'rgba(1, 59, 223, 0.95)' :
                        section.bgColor.includes('yellow-400') ? 'rgba(227, 251, 7, 0.95)' :
                        'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.95)'
                      } 15%,
                      ${section.bgColor.includes('from-') ? 
                        section.bgColor.includes('blue-500') ? 'rgba(1, 59, 223, 0.8)' :
                        section.bgColor.includes('blue-800') ? 'rgba(1, 59, 223, 0.8)' :
                        section.bgColor.includes('yellow-400') ? 'rgba(227, 251, 7, 0.8)' :
                        'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)'
                      } 35%,
                      ${section.bgColor.includes('from-') ? 
                        section.bgColor.includes('blue-500') ? 'rgba(1, 59, 223, 0.4)' :
                        section.bgColor.includes('blue-800') ? 'rgba(1, 59, 223, 0.4)' :
                        section.bgColor.includes('yellow-400') ? 'rgba(227, 251, 7, 0.4)' :
                        'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                      } 60%,
                      transparent 100%
                    )`
                } as React.CSSProperties}
              >
                <div className={`max-w-sm ${section.fadeImage?.includes('naranja') ? 'text-left -ml-8 md:-ml-12 lg:-ml-' : 'text-center'}`}>
                  {/* Título principal - Solo para sección naranja */}
                  {section.fadeImage?.includes('naranja') ? (
                    <div className="mb-4">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight -ml-12 md:-ml-16 lg:-ml-20"
                      >
                        <div className="-ml-12 md:-ml-16 lg:-ml-35">Educación</div>
                        <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl -ml-12 md:-ml-16 lg:-ml-10">Financiera</div>
                      </motion.div>
                      
                      {/* Subtítulo */}
                      <motion.h3 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mt-2 -ml-12 md:-ml-16 lg:-ml-20"
                      >
                        Entrepreneurs
                      </motion.h3>
                    </div>
                  ) : section.fadeImage?.includes('azul') ? (
                    /* Título para sección azul (Mindfulness) */
                    <div className="mb-4">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
                      >
                        <div className="-ml-12 md:-ml-16 lg:-ml-40">MIND</div>
                        <div className="-ml-12 md:-ml-16 lg:-ml-10">FUL</div>
                        <div className="-mr-12 md:-mr-16 lg:-mr-20">NESS</div>
                      </motion.div>
                    </div>
                  ) : section.fadeImage?.includes('verde') ? (
                    /* Título para sección verde (Formación Social) */
                    <div className="mb-4">
                      <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2"
                        style={{ color: '#97b664' }}
                      >
                        {section.title}
                      </motion.h2>
                      
                      <motion.h3 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6"
                        style={{ color: '#97b664' }}
                      >
                        {section.subtitle}
                      </motion.h3>
                    </div>
                  ) : (
                    <>
                      {/* Título principal para otras secciones */}
                      <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${section.textColor}`}
                      >
                        {section.title}
                      </motion.h2>
                      
                      {/* Subtítulo para otras secciones */}
                      <motion.h3 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 ${section.textColor}`}
                      >
                        {section.subtitle}
                      </motion.h3>
                    </>
                  )}

                  {/* Descripción en caja */}
                  {section.fadeImage?.includes('azul') ? (
                    /* Recuadro transparente con borde blanco para Mindfulness */
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      viewport={{ once: true }}
                      className="bg-transparent border border-white p-3 md:p-4 mb-4 md:mb-6"
                    >
                      <p className="text-sm md:text-lg text-white font-medium">
                        {section.description}
                      </p>
                    </motion.div>
                  ) : section.fadeImage?.includes('verde') ? (
                    /* Recuadro transparente con borde verde oscuro para Formación Social */
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      viewport={{ once: true }}
                      className="bg-transparent p-3 md:p-4 mb-4 md:mb-6"
                      style={{ borderColor: '#97b664', border: '1px solid' }}
                    >
                      <p className="text-sm md:text-lg font-medium"
                         style={{ color: '#97b664' }}>
                        {section.description}
                      </p>
                    </motion.div>
                  ) : !section.fadeImage?.includes('naranja') && (
                    /* Recuadro normal para otras secciones */
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      viewport={{ once: true }}
                      className={`${section.accentColor} bg-opacity-20 border border-current border-opacity-30 p-3 md:p-4 mb-4 md:mb-6`}
                    >
                      <p className={`text-sm md:text-lg ${section.textColor} font-medium`}>
                        {section.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Descripción larga */}
                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className={`text-sm md:text-base leading-relaxed text-left ${section.fadeImage?.includes('naranja') ? 'text-white -ml-12 md:-ml-16 lg:-ml-20' : section.fadeImage?.includes('azul') ? 'text-white' : section.fadeImage?.includes('verde') ? '' : section.textColor} opacity-90`}
                    style={section.fadeImage?.includes('verde') ? { color: '#97b664' } : {}}
                  >
                    {section.longDescription}
                  </motion.p>

                  {/* Icono de avión de papel */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    viewport={{ once: true }}
                    className="absolute bottom-8 left-8"
                  >
                    <svg 
                      className={`w-8 h-8 ${section.fadeImage?.includes('naranja') ? 'text-white' : section.fadeImage?.includes('azul') ? 'text-white' : section.textColor} opacity-60`}
                      style={section.fadeImage?.includes('verde') ? { color: '#97b664' } : {}} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                      />
                    </svg>
                  </motion.div>

                  {/* Flechas de navegación */}
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-6 z-30">
                    <motion.button
                      onClick={() => goToSection(Math.max(0, index - 1))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-14 h-14 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center shadow-xl ${
                        section.fadeImage?.includes('naranja') ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30' :
                        section.fadeImage?.includes('azul') ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30' :
                        section.fadeImage?.includes('verde') ? 'bg-white bg-opacity-20 hover:bg-opacity-30' :
                        'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                      } ${
                        index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'
                      }`}
                      style={section.fadeImage?.includes('verde') ? { color: '#97b664' } : {}}
                      disabled={index === 0}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                      </svg>
                    </motion.button>
                    <motion.button
                      onClick={() => goToSection(Math.min(sectionsData.length - 1, index + 1))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-14 h-14 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center shadow-xl ${
                        section.fadeImage?.includes('naranja') ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30' :
                        section.fadeImage?.includes('azul') ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30' :
                        section.fadeImage?.includes('verde') ? 'bg-white bg-opacity-20 hover:bg-opacity-30' :
                        'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                      } ${
                        index === sectionsData.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'
                      }`}
                      style={section.fadeImage?.includes('verde') ? { color: '#97b664' } : {}}
                      disabled={index === sectionsData.length - 1}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Aviso de privacidad */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    viewport={{ once: true }}
                    className="absolute bottom-8 right-8"
                  >
                    <p className={`text-sm ${section.textColor} opacity-70 font-medium`}>
                      AVISO DE PRIVACIDAD
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* Footer al final de todas las secciones */}
      <Footer />
    </div>
  )
} 