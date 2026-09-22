// 2026-09-22: Mobile-first SSR — hero en HTML inicial (mejor LCP); FullPageScroll solo desktop.
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
  // SSR y primer paint: scroll nativo. FullPageScroll solo en desktop tras hidratar.
  const [useFullPage, setUseFullPage] = useState(false)

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
  }

  useEffect(() => {
    const updateDeviceType = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height
      const isTabletDevice =
        (width >= 768 && width <= 1024) || (isLandscape && height <= 900)
      setUseFullPage(width >= 768 && !isTabletDevice)
    }
    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    window.addEventListener('orientationchange', updateDeviceType)
    return () => {
      window.removeEventListener('resize', updateDeviceType)
      window.removeEventListener('orientationchange', updateDeviceType)
    }
  }, [])

  useEffect(() => {
    if (useFullPage) return
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY < window.innerHeight * 0.5) setCurrentSection(0)
      else if (scrollY < window.innerHeight * 1.5) setCurrentSection(1)
      else if (scrollY < window.innerHeight * 2.5) setCurrentSection(2)
      else if (scrollY < window.innerHeight * 3.5) setCurrentSection(3)
      else setCurrentSection(4)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [useFullPage])

  const homeSeo = SITE_ROUTES.find((route) => route.path === '/')!

  const nativeSections = (
    <div className="w-full pb-28 md:pb-0">
      <section className="min-h-[85vh] w-full md:min-h-[90vh] lg:h-screen">
        <HeroSection />
      </section>
      <CommunityVoices />
      <VisitCampusSection />
      <section className="min-h-[70vh] w-full md:min-h-[75vh] lg:h-screen">
        <div className="h-full">
          <SliderSection />
        </div>
      </section>
      <section className="min-h-[85vh] w-full md:min-h-[90vh] lg:h-screen">
        <EducationalOfferSection />
      </section>
      <section className="min-h-[360px] w-full md:min-h-[450px] lg:h-screen">
        <ConveniosSection />
      </section>
      <section className="min-h-screen w-full">
        <OfertaEducativaSection />
      </section>
    </div>
  )

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

      {useFullPage ? (
        <FullPageScroll onSectionChange={handleSectionChange}>
          <HeroSection />
          <SliderSection />
          <EducationalOfferSection />
          <ConveniosSection />
          <OfertaEducativaSection />
        </FullPageScroll>
      ) : (
        nativeSections
      )}
    </div>
  )
}
