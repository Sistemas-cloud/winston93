import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import FullPageScroll from '@/components/FullPageScroll'
import HeroSection from '@/components/sections/HeroSection'
import SliderSection from '@/components/sections/ProjectsSection'
import EducationalOfferSection from '@/components/sections/ServicesSection'
import ConveniosSection from '@/components/sections/ConveniosSection'
import OfertaEducativaSection from '@/components/sections/OfertaEducativaSection'
import CommunityVoices from '@/components/CommunityVoices'
import VisitCampusSection from '@/components/VisitCampusSection'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [useNativeScroll, setUseNativeScroll] = useState(true)
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
        const isTabletDevice = (width >= 768 && width <= 1024) || (isLandscape && height <= 900)
        setUseNativeScroll(width < 768 || isTabletDevice)
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY < window.innerHeight * 0.5) setCurrentSection(0)
      else if (scrollY < window.innerHeight * 1.5) setCurrentSection(1)
      else if (scrollY < window.innerHeight * 2.5) setCurrentSection(2)
      else if (scrollY < window.innerHeight * 3.5) setCurrentSection(3)
      else setCurrentSection(4)
    }

    if (useNativeScroll) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [useNativeScroll])

  const homeSeo = SITE_ROUTES.find((route) => route.path === '/')!

  return (
    <div className="home-page">
      <Seo
        title={homeSeo.title}
        description={homeSeo.description}
        path={homeSeo.path}
        keywords={homeSeo.keywords}
      />

      <h1 className="sr-only">Instituto Winston Churchill - Educación Bilingüe</h1>

      <Navigation currentSection={currentSection} />

      {isHydrated && useNativeScroll ? (
        // 2026-08-20: pb-28 evita que el sticky CTA móvil recorte títulos/secciones al final del viewport
        <div className="w-full pb-28 md:pb-0">
          <section className="min-h-[85vh] md:min-h-[90vh] lg:h-screen w-full">
            <HeroSection />
          </section>
          {/* 2026-08-25: Sin LevelsShowcase — duplicaba Oferta Educativa; queda solo OfertaEducativaSection. */}
          <CommunityVoices />
          <VisitCampusSection />
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
          {/* 2026-08-20: Sin DiscoverySection en full-page — metía 3 bloques en 1 viewport y recortaba “Confianza”. */}
          <OfertaEducativaSection />
        </FullPageScroll>
      )}
    </div>
  )
}
