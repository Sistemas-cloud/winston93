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
  const [isMobile, setIsMobile] = useState(false)
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

      {/* Móvil: scroll nativo y espaciados mejorados. Desktop/Tablet: FullPageScroll */}
      {isHydrated && isMobile ? (
        <div className="w-full mx-auto px-4 pt-2 pb-8 space-y-8 sm:space-y-10">
          <section className="min-h-[70vh]">
            <HeroSection />
          </section>
          <section className="py-2">
            <SliderSection />
          </section>
          <section className="py-2">
            <EducationalOfferSection />
          </section>
          <section className="py-2">
            <ConveniosSection />
          </section>
          <section className="py-2">
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