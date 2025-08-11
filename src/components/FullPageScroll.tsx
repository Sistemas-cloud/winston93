import { useEffect, useRef, useState } from 'react'

interface FullPageScrollProps {
  children: React.ReactNode[]
  onSectionChange?: (sectionIndex: number) => void
}

export default function FullPageScroll({ children, onSectionChange }: FullPageScrollProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [windowHeight, setWindowHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  // Inicializar altura de ventana en el cliente
  useEffect(() => {
    const updateHeight = () => {
      // En móvil, usar visualViewport si está disponible para mejor precisión
      if (window.visualViewport) {
        setWindowHeight(window.visualViewport.height)
      } else {
        setWindowHeight(window.innerHeight)
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    window.addEventListener('orientationchange', updateHeight)
    
    // Para móvil, también escuchar cambios en visualViewport
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
    }
    
    return () => {
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('orientationchange', updateHeight)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight)
      }
    }
  }, [])

  const scrollToSection = (index: number) => {
    if (isScrolling || index < 0 || index >= children.length || windowHeight === 0) return
    
    setIsScrolling(true)
    setCurrentSection(index)
    
    // Notificar al componente padre sobre el cambio de sección
    if (onSectionChange) {
      onSectionChange(index)
    }
    
    if (containerRef.current) {
      let translateY = 0
      const isMobile = window.innerWidth < 768
      
      if (index === 0) {
        translateY = 0
      } else if (index === 1) {
        translateY = windowHeight // Primera sección completa
      } else {
        // En móvil, usar altura completa para todas las secciones
        const sectionHeight = isMobile ? windowHeight : (windowHeight - 64)
        translateY = windowHeight + (index - 1) * sectionHeight
      }
      containerRef.current.style.transform = `translateY(-${translateY}px)`
    }
    
    setTimeout(() => {
      setIsScrolling(false)
    }, 1000)
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isScrolling) return
      
      if (e.deltaY > 0) {
        // Scroll hacia abajo
        scrollToSection(currentSection + 1)
      } else {
        // Scroll hacia arriba
        scrollToSection(currentSection - 1)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return
      
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault()
          scrollToSection(currentSection + 1)
          break
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          scrollToSection(currentSection - 1)
          break
        case 'Home':
          e.preventDefault()
          scrollToSection(0)
          break
        case 'End':
          e.preventDefault()
          scrollToSection(children.length - 1)
          break
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return
      
      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY.current - touchEndY
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe hacia arriba (scroll hacia abajo)
          scrollToSection(currentSection + 1)
        } else {
          // Swipe hacia abajo (scroll hacia arriba)
          scrollToSection(currentSection - 1)
        }
      }
    }

    // Solo agregar listeners si estamos en el cliente
    if (typeof window !== 'undefined') {
      // Prevenir el scroll normal
      document.body.style.overflow = 'hidden'
      
      window.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      window.addEventListener('touchend', handleTouchEnd, { passive: true })
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto'
        window.removeEventListener('wheel', handleWheel)
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [currentSection, isScrolling, children.length, windowHeight, scrollToSection])

  // No renderizar hasta que tengamos la altura de la ventana
  if (windowHeight === 0) {
    return <div>Cargando...</div>
  }

  return (
    <div className="relative overflow-hidden bg-transparent">
      {/* Indicadores de navegación */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
              currentSection === index 
                ? 'bg-white scale-125' 
                : 'bg-transparent hover:bg-white/50'
            }`}
            disabled={isScrolling}
          />
        ))}
      </div>

      {/* Contenedor de secciones */}
      <div
        ref={containerRef}
        className="transition-transform duration-1000 ease-in-out"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 relative"
            style={{ 
              height: index === 0 ? '100vh' : 'calc(100vh - 4rem)',
              minHeight: index === 0 ? '100vh' : 'calc(100vh - 4rem)',
              // Para móvil, usar altura dinámica basada en el contenido
              ...(window.innerWidth < 768 && {
                height: 'auto',
                minHeight: '100vh'
              })
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white animate-bounce">
        {currentSection < children.length - 1 && (
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 opacity-75">Scroll para continuar</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
} 