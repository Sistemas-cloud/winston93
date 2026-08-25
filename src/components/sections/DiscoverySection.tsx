// 2026-08-20: Hannia — sección full-viewport: niveles + voces + Visítanos (FullPageScroll desktop).
import LevelsShowcase from '@/components/LevelsShowcase'
import CommunityVoices from '@/components/CommunityVoices'
import VisitCampusSection from '@/components/VisitCampusSection'

export default function DiscoverySection() {
  return (
    <div className="flex h-full min-h-[100vh] w-full flex-col overflow-y-auto bg-white">
      <div className="flex-1">
        <LevelsShowcase />
        <CommunityVoices />
        <VisitCampusSection />
      </div>
    </div>
  )
}
