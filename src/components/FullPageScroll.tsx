import { useEffect, useRef, useState } from 'react'

interface FullPageScrollProps {
  children: React.ReactNode[]
  onSectionChange?: (sectionIndex: number) => void
}

export default function FullPageScroll({ children, onSectionChange }: FullPageScrollProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [windowHeight, setWindowHeight] = useState(0)
  const [actualViewportHeight, setActualViewportHeight] = useState(0)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isTabletLandscape, setIsTabletLandscape] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  // Función para actualizar altura de ventana
  const updateHeight = () => {
    if (typeof window !== 'undefined') {
      // Obtener la altura real del viewport
      let realHeight = window.innerHeight
      
      // En móviles, usar visualViewport si está disponible para mejor precisión
      if (window.visualViewport && window.visualViewport.height) {
        realHeight = window.visualViewport.height
      }
      
      setWindowHeight(realHeight)
      setActualViewportHeight(realHeight)
    }
  }

  // Función para actualizar tipo de dispositivo
  const updateDeviceType = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const userAgent = navigator.userAgent.toLowerCase()
    
    // Detectar si es Android
    const isAndroidDevice = /android/.test(userAgent)
    setIsAndroid(isAndroidDevice)
    
    // Detectar tipo de dispositivo
    const newIsMobile = width < 768
    const newIsTablet = width >= 768 && width < 1024
    const newIsTabletLandscape = newIsTablet && width > height
    
    setIsMobile(newIsMobile)
    setIsTablet(newIsTablet)
    setIsTabletLandscape(newIsTabletLandscape)
    
    // Si cambió el tipo de dispositivo, actualizar altura
    if (newIsMobile !== isMobile || newIsTabletLandscape !== isTabletLandscape) {
      setTimeout(updateHeight, 100)
    }
  }

  useEffect(() => {
    updateHeight()
    updateDeviceType()
    
    const handleResize = () => {
      updateHeight()
      updateDeviceType()
    }
    
    const handleOrientationChange = () => {
      setTimeout(() => {
        updateHeight()
        updateDeviceType()
      }, 300)
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    
    // Para móvil, también escuchar cambios en visualViewport
    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight)
      }
    }
  }, [isMobile, isTabletLandscape])

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= children.length || isScrolling) return
    
    setIsScrolling(true)
    setCurrentSection(index)
    onSectionChange?.(index)
    
    if (containerRef.current) {
      let translateY = 0
      
      if (index === 0) {
        translateY = 0
      } else {
        // Usar la altura real del viewport para todos los dispositivos
        const sectionHeight = actualViewportHeight
        translateY = index * sectionHeight
      }
      containerRef.current.style.transform = `translateY(-${translateY}px)`
    }
    
    // Ajustar tiempo de bloqueo según el dispositivo
    const scrollDelay = (isMobile || (isTablet && !isTabletLandscape)) ? 600 : 1000
    setTimeout(() => {
      setIsScrolling(false)
    }, scrollDelay)
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isScrolling) return
      
      // Ajustar sensibilidad según el dispositivo
      const sensitivity = (isMobile || (isTablet && !isTabletLandscape)) ? 30 : 50
      
      if (e.deltaY > sensitivity) {
        // Scroll hacia abajo
        scrollToSection(currentSection + 1)
      } else if (e.deltaY < -sensitivity) {
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
      
      // Ajustar sensibilidad del touch según el dispositivo
      const touchSensitivity = (isMobile || (isTablet && !isTabletLandscape)) ? 30 : 50
      
      if (Math.abs(diff) > touchSensitivity) {
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
      // En móviles y tablet vertical, mantener scroll nativo para mejor compatibilidad
      // En tablet horizontal, usar scroll personalizado como en desktop
      if (isMobile || (isTablet && !isTabletLandscape)) {
        document.body.style.overflow = 'auto'
      } else {
        document.body.style.overflow = 'hidden'
      }
      
      window.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      window.addEventListener('touchend', handleTouchEnd, { passive: true })
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('wheel', handleWheel)
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchend', handleTouchEnd)
        // Importante: restablecer el scroll del body al desmontar para no bloquear otras páginas
        document.body.style.overflow = 'auto'
      }
    }
  }, [currentSection, isScrolling, children.length, actualViewportHeight, isMobile, isTablet, isTabletLandscape, scrollToSection])

  // No renderizar hasta que tengamos la altura de la ventana
  if (windowHeight === 0 || actualViewportHeight === 0) {
    return <div className="h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="relative overflow-hidden bg-transparent">
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
              height: `${actualViewportHeight}px`,
              minHeight: `${actualViewportHeight}px`,
              maxHeight: `${actualViewportHeight}px`
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Indicador de scroll - Responsivo */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white animate-bounce">
        {currentSection < children.length - 1 && (
          <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm mb-1 md:mb-2 opacity-75 hidden sm:block">Scroll para continuar</span>
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
} 