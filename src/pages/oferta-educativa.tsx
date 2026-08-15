import Navigation from '@/components/Navigation'
import OfertaEducativaSection from '@/components/sections/OfertaEducativaSection'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'

export default function OfertaEducativaPage() {
  // 2026-07-03: Metadata SEO centralizada para /oferta-educativa.
  const pageSeo = SITE_ROUTES.find((route) => route.path === '/oferta-educativa')!

  return (
    <>
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />
      
      <div className="oferta-educativa-page">
        <Navigation />
        {/* 2026-08-15: isPageTitle para H1 único en esta ruta. */}
        <OfertaEducativaSection isPageTitle />
      </div>
    </>
  )
}
