// 2026-08-20: Hannia — página ligera para la guía visual (placeholder hasta que exista el PNG).
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Seo from '@/components/Seo'
import AdmissionGuideSlot from '@/components/AdmissionGuideSlot'
import { SITE_ROUTES } from '@/lib/seo/routes'

export default function RequisitosAdmisionPage() {
  const pageSeo = SITE_ROUTES.find((route) => route.path === '/admisiones/requisitos')!

  return (
    <div className="bg-white">
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />
      <Navigation currentSection={1} />

      <div className="px-4 pb-8 pt-24 md:pt-28">
        <div className="mx-auto mb-4 max-w-4xl text-center print:hidden">
          <Link href="/admisiones" className="text-sm font-semibold text-[#013BDF] hover:underline">
            ← Admisiones
          </Link>
        </div>
        <AdmissionGuideSlot variant="full" />
      </div>
    </div>
  )
}
