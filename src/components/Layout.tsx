import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import Footer from './Footer'
import EnrollmentCTA from './EnrollmentCTA'

interface LayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  const router = useRouter()
  // 2026-08-20: Hannia — CTA inscripción en páginas con Layout; omitir en /contacto (ya tiene form).
  const showEnrollmentCta =
    router.pathname !== '/contacto' &&
    router.pathname !== '/admisiones' &&
    !router.pathname.startsWith('/admisiones/')

  return (
    <div className="pb-28 md:pb-0">
      {children}
      {showFooter && showEnrollmentCta && <EnrollmentCTA />}
      {showFooter && <Footer />}
    </div>
  )
}
