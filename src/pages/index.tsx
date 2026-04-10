import Head from 'next/head'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import FullPageScroll from '@/components/FullPageScroll'
import HeroSection from '@/components/sections/HeroSection'
import SliderSection from '@/components/sections/ProjectsSection'
import EducationalOfferSection from '@/components/sections/ServicesSection'
import ConveniosSection from '@/components/sections/ConveniosSection'
import OfertaEducativaSection from '@/components/sections/OfertaEducativaSection'


export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  // Por defecto asumimos scroll nativo para SSR
  const [useNativeScroll, setUseNativeScroll] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
  }

  useEffect(() => {
    const updateDeviceType = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        const height = window.innerHeight
        const isLandscape = width > height
        
        // Determinar si es móvil
        setIsMobile(width < 768)
        
        // Detectar tablets: 768-1024px O dispositivos landscape con altura <= 900px (Nest Hub Max)
        const isTabletDevice = (width >= 768 && width <= 1024) || (isLandscape && height <= 900)
        
        // Usar scroll nativo en: móviles O tablets
        const shouldUseNativeScroll = width < 768 || isTabletDevice
        setUseNativeScroll(shouldUseNativeScroll)
      }
    }
    updateDeviceType()
    setIsHydrated(true)
    window.addEventListener('resize', updateDeviceType)
    window.addEventListener('orientationchange', updateDeviceType)
    return () => {
      window.removeEventListener('resize', updateDeviceType)
      window.removeEventListener('orientationchange', updateDeviceType)
    }
  }, [])

  // Detectar scroll para cambiar la navegación
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 100)
      
      // Actualizar sección actual basado en scroll
      if (scrollY < window.innerHeight * 0.5) {
        setCurrentSection(0)
      } else if (scrollY < window.innerHeight * 1.5) {
        setCurrentSection(1)
      } else if (scrollY < window.innerHeight * 2.5) {
        setCurrentSection(2)
      } else if (scrollY < window.innerHeight * 3.5) {
        setCurrentSection(3)
      } else {
        setCurrentSection(4)
      }
    }

    if (useNativeScroll) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [useNativeScroll])

  return (
    <div className="home-page">
      <Head>
        <title>Instituto Winston Churchill - Working for a Brighter Future</title>
        <meta name="description" content="Instituto educativo con 30 años de experiencia. Educación bilingüe integral: Kínder, Primaria y Secundaria. Respaldados por Oxford University Press y University of Cambridge." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="instituto, educación, bilingüe, kínder, primaria, secundaria, Winston Churchill, Oxford, Cambridge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation que recibe la sección actual */}
      <Navigation currentSection={currentSection} />

      {/* Móvil y Tablets: scroll nativo. Solo Desktop: FullPageScroll */}
      {isHydrated && useNativeScroll ? (
        // 2026-03-27: Espaciado y alturas fluidas para mejorar legibilidad en móvil/tablet sin alterar orden de secciones.
        // 2026-04-10: Eliminado pt-16 del contenedor; la sección hero arranca en y=0 para que el nav transparente la superponga.
        // 2026-04-10: Se diferencian alturas tablet (md:) vs desktop (lg:) para reducir espacios muertos en tablet.
        <div className="w-full">
          <section className="min-h-[85vh] md:min-h-[90vh] lg:h-screen w-full">
            <HeroSection />
          </section>
          <section className="w-full min-h-[70vh] md:min-h-[75vh] lg:h-screen">
            <div className="h-full">
              <SliderSection />
            </div>
          </section>
          <section className="min-h-[85vh] md:min-h-[90vh] lg:h-screen w-full">
            <EducationalOfferSection />
          </section>
          <section className="w-full min-h-[360px] md:min-h-[450px] lg:h-screen">
            <ConveniosSection />
          </section>
          <section className="min-h-screen w-full">
            <OfertaEducativaSection />
          </section>
        </div>
      ) : (
        <FullPageScroll onSectionChange={handleSectionChange}>
          <HeroSection />
          <SliderSection />
          <EducationalOfferSection />
          <ConveniosSection />
          <OfertaEducativaSection />
        </FullPageScroll>
      )}
      

    </div>
  )
} 