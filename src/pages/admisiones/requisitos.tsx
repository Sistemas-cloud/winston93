// 2026-08-20: Hannia — página ligera para la guía visual (placeholder hasta que exista el PNG).
// 2026-09-25: SEO — H1 con keyword, párrafos de apoyo y CTAs a rutas internas existentes.
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

        {/* 2026-09-25: Bloque SEO exclusivo de esta página — un solo H1 + texto de apoyo. */}
        <header className="mx-auto mb-8 max-w-4xl text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
            Requisitos de admisión — Instituto Winston Churchill, Ciudad Madero
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 md:text-base">
            En esta página consultas la guía de registro y el examen de admisión del Instituto
            Winston Churchill, colegio bilingüe en Ciudad Madero con más de 30 años de experiencia.
            Te invitamos a{' '}
            <Link href="/admisiones" className="font-semibold text-[#013BDF] hover:underline">
              seguir los pasos de admisión
            </Link>{' '}
            o a{' '}
            <Link
              href="/admisiones#examen-admision"
              className="font-semibold text-[#013BDF] hover:underline"
            >
              iniciar el registro en línea
            </Link>
            .
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
            Estamos en Calle 3 #309, Col. Jardín 20 de Noviembre, Cd. Madero, Tamps. Teléfono{' '}
            <a href="tel:+528334378743" className="font-semibold text-[#013BDF] hover:underline">
              833 437 8743
            </a>
            . Horario: Lun–Vie 7:00–19:30 y Sáb 9:00–13:00.
          </p>
        </header>

        <AdmissionGuideSlot variant="full" />
      </div>
    </div>
  )
}
