import { useState, useEffect } from 'react'
import AnimatedElement from '@/components/AnimatedElement'

export default function SliderSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isTabletLandscape, setIsTabletLandscape] = useState(false)
  
  const slides = [
    {
      image: '/images/slider/SLIDE_INICIO.jpg',
      title: 'FORMA PARTE',
      subtitle: 'DE LA FAMILIA WINSTON CHURCHILL',
      description: 'Únete a nuestra comunidad educativa y descubre el potencial que hay en ti. Más de 30 años formando líderes del mañana.'
    },
    {
      image: '/images/slider/SLIDE_INICIO_1.jpg',
      title: 'WORKING FOR A',
      subtitle: 'BRIGHTER FUTURE',
      description: 'Construimos el futuro a través de una educación de excelencia que prepara a nuestros estudiantes para los desafíos del mañana.'
    },
    {
      image: '/images/slider/SLIDE_INICIO_2.jpg',
      title: 'EDUCACIÓN QUE',
      subtitle: 'TRASCIENDE',
      description: 'Más que conocimientos, formamos personas íntegras con valores sólidos y visión global para transformar el mundo.'
    }
  ]

  // Detectar tipo de dispositivo
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height
      
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsTabletLandscape(width >= 768 && width < 1024 && isLandscape)
    }
    
    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    window.addEventListener('orientationchange', updateDeviceType)
    
    return () => {
      window.removeEventListener('resize', updateDeviceType)
      window.removeEventListener('orientationchange', updateDeviceType)
    }
  }, [])

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length
        console.log('Auto advancing to slide:', nextSlide)
        return nextSlide
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % slides.length
      console.log('Manual next to slide:', next)
      return next
    })
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const previous = (prev - 1 + slides.length) % slides.length
      console.log('Manual prev to slide:', previous)
      return previous
    })
  }

  const goToSlide = (index: number) => {
    console.log('Going to slide:', index)
    setCurrentSlide(index)
  }

  // Debug: Log current slide
  useEffect(() => {
    console.log('Current slide changed to:', currentSlide)
  }, [currentSlide])

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Slider de imágenes de fondo */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => console.log(`Image ${index + 1} loaded:`, slide.image)}
              onError={(e) => console.error(`Error loading image ${index + 1}:`, slide.image, e)}
            />
          </div>
        ))}
        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 z-20 bg-black/30 md:bg-black/15 lg:bg-black/20"></div>
      </div>

      {/* Contenido superpuesto */}
      <div className="relative z-30 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className={`flex items-start justify-between h-full ${
            // Ajustar padding-top según el dispositivo
            isTabletLandscape 
              ? 'pt-12' // Menos padding en tablet horizontal
              : 'pt-16 md:pt-20' // Padding normal para otros dispositivos
          }`}>
            
            {/* Texto dinámico con posicionamiento condicional */}
            <div className={`${
              currentSlide === 2 
                ? 'w-full md:w-1/2 md:max-w-lg text-white md:pl-8 md:ml-auto' // Slide 3: derecha en desktop
                : 'w-full md:w-1/2 md:max-w-lg text-white md:pr-8'        // Slides 1 y 2: izquierda en desktop
            }`}>
              <AnimatedElement>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-4 tracking-wide">
                  {slides[currentSlide].title}
                </h2>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 md:mb-4 lg:mb-6 text-blue-300">
                  {slides[currentSlide].subtitle}
                </h3>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed mb-4 md:mb-6 lg:mb-8 max-w-sm md:max-w-none">
                  {slides[currentSlide].description}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-lg font-semibold transition-colors duration-300 text-xs sm:text-sm md:text-base">
                  Saber más
                </button>
              </AnimatedElement>
            </div>

            {/* Controles de navegación - Desktop y Tablet */}
            <div className="hidden md:flex flex-col items-center justify-center space-y-3 md:space-y-4">
              {/* Botón anterior */}
              <button
                onClick={prevSlide}
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Indicadores de slide */}
              <div className="flex flex-col space-y-1.5 md:space-y-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>

              {/* Botón siguiente */}
              <button
                onClick={nextSlide}
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controles móviles */}
      <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Botones de navegación móviles */}
      <div className="md:hidden absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-40 flex justify-between px-4">
        <button
          onClick={prevSlide}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
} 