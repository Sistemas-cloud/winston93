import { useEffect, useRef, useState } from 'react'

interface FullPageScrollProps {
  children: React.ReactNode[]
  onSectionChange?: (sectionIndex: number) => void
}

export default function FullPageScroll({ children, onSectionChange }: FullPageScrollProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [windowHeight, setWindowHeight] = useState(0)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  // Función para actualizar altura de ventana
  const updateHeight = () => {
    if (typeof window !== 'undefined') {
      // En móviles, usar innerHeight para mejor compatibilidad
      if (isMobile && window.innerHeight) {
        setWindowHeight(window.innerHeight)
      } else if (window.visualViewport) {
        setWindowHeight(window.visualViewport.height)
      } else {
        setWindowHeight(window.innerHeight)
      }
    }
  }

  // Función para actualizar tipo de dispositivo
  const updateDeviceType = () => {
    const width = window.innerWidth
    const userAgent = navigator.userAgent.toLowerCase()
    
    // Detectar si es Android
    const isAndroidDevice = /android/.test(userAgent)
    setIsAndroid(isAndroidDevice)
    
    // Detectar tipo de dispositivo
    const newIsMobile = width < 768
    const newIsTablet = width >= 768 && width < 1024
    
    setIsMobile(newIsMobile)
    setIsTablet(newIsTablet)
    
    // Si cambió el tipo de dispositivo, actualizar altura
    if (newIsMobile !== isMobile) {
      setTimeout(updateHeight, 100)
    }
  }

  useEffect(() => {
    updateHeight()
    updateDeviceType()
    
    window.addEventListener('resize', () => {
      updateHeight()
      updateDeviceType()
    })
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        updateHeight()
        updateDeviceType()
      }, 300) // Aumentar delay para móviles
    })
    
    // Para móvil, también escuchar cambios en visualViewport
    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
    }

    return () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight)
      }
    }
  }, [isMobile])

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
        // En móviles, usar altura exacta del viewport
        const sectionHeight = isMobile ? window.innerHeight : windowHeight
        translateY = index * sectionHeight
      }
      containerRef.current.style.transform = `translateY(-${translateY}px)`
    }
    
    // Ajustar tiempo de bloqueo según el dispositivo
    const scrollDelay = isMobile ? 600 : 1000
    setTimeout(() => {
      setIsScrolling(false)
    }, scrollDelay)
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isScrolling) return
      
      // Ajustar sensibilidad según el dispositivo
      const sensitivity = isMobile ? 30 : 50
      
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
      const touchSensitivity = isMobile ? 30 : 50
      
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
      // En móviles, mantener scroll nativo para mejor compatibilidad
      if (isMobile) {
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
      }
    }
  }, [currentSection, isScrolling, children.length, windowHeight, isMobile, scrollToSection])

  // No renderizar hasta que tengamos la altura de la ventana
  if (windowHeight === 0) {
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
              height: isMobile ? '100vh' : '100vh',
              minHeight: isMobile ? '100vh' : '100vh',
              maxHeight: isMobile ? '100vh' : '100vh'
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