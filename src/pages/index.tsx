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
  // Por defecto asumimos móvil para SSR y evitamos bloqueos de scroll antes de hidratar
  const [isMobile, setIsMobile] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
  }

  useEffect(() => {
    const updateDeviceType = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768)
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

      {/* Móvil: scroll nativo con secciones de pantalla completa. Desktop/Tablet: FullPageScroll */}
      {isHydrated && isMobile ? (
        <div className="w-full">
          <section className="h-screen w-full">
            <HeroSection />
          </section>
          <section className="h-[50vh] w-full">
            <SliderSection />
          </section>
          <section className="h-screen w-full">
            <EducationalOfferSection />
          </section>
          <section className="h-[33vh] w-full">
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