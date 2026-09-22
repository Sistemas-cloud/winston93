// 2026-09-22: Mobile-first SSR — hero + texto SEO en HTML inicial; media pesada diferida.
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import FullPageScroll from '@/components/FullPageScroll'
import HeroSection from '@/components/sections/HeroSection'
import HomeAboutSection from '@/components/HomeAboutSection'
import CommunityVoices from '@/components/CommunityVoices'
import VisitCampusSection from '@/components/VisitCampusSection'
import EducationalOfferSection from '@/components/sections/ServicesSection'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'

// 2026-09-22: Solo bloques muy pesados en imágenes sin texto SEO crítico.
const SliderSection = dynamic(() => import('@/components/sections/ProjectsSection'), {
  ssr: false,
  loading: () => <div className="min-h-[70vh] w-full bg-[#012A9E]" aria-hidden />,
})
const ConveniosSection = dynamic(() => import('@/components/sections/ConveniosSection'), {
  ssr: false,
  loading: () => <div className="min-h-[360px] w-full bg-white" aria-hidden />,
})
const OfertaEducativaSection = dynamic(
  () => import('@/components/sections/OfertaEducativaSection'),
  { loading: () => <div className="min-h-[50vh] w-full bg-white" aria-hidden /> }
)

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
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
    <div className="w-full">
      <section className="min-h-[85vh] w-full md:min-h-[90vh] lg:h-screen">
        <HeroSection />
      </section>
      <HomeAboutSection />
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
      <section className="w-full">
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

      <h1 className="sr-only">
        Instituto Winston Churchill — colegio bilingüe en Ciudad Madero
      </h1>

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
