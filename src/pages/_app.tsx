import '@/styles/globals.css'
import '@/styles/amocrm.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '@/components/LoadingScreen'
import PageLoadingScreen from '@/components/PageLoadingScreen'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import AmoCRM from '@/components/AmoCRM'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 2026-07-03: Se reduce el loading inicial (2000ms → 1500ms) para mejorar LCP/TBT sin cambiar el diseño.
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Detectar cambios de página
  useEffect(() => {
    const handleStart = () => {
      setIsPageLoading(true)
    }

    const handleComplete = () => {
      // 2026-07-03: Se reduce el delay de transición (1200ms → 700ms) para mejorar Core Web Vitals.
      setTimeout(() => {
        setIsPageLoading(false)
      }, 700)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <div className={`${poppins.variable} font-sans`}>
      {/* Componente AmoCRM para métricas y contacto con usuarios */}
      <AmoCRM />

      {/* 2026-07-03: Auditoría SEO — antes la página solo se montaba cuando
          isLoading/isPageLoading eran false. Como isLoading arranca en true
          y solo cambia dentro de un useEffect (que nunca corre en SSR/SSG),
          el <Component> (y el <Head> de Seo.tsx con title/description/OG/
          Twitter) nunca llegaba a renderizarse en el HTML servido a los
          crawlers (SE Ranking reportaba "Missing Title/Description").
          Ahora <Component> se monta siempre para que el HTML inicial
          incluya la metadata, y la pantalla de carga (LoadingScreen ya usa
          "fixed inset-0 z-50") se superpone visualmente encima, sin cambiar
          el diseño ni la experiencia de carga. */}
      {router.pathname === '/' ||
      router.pathname === '/programas' ||
      router.pathname === '/oferta-educativa' ? (
        <Component {...pageProps} />
      ) : (
        <Layout key="layout" showFooter={true}>
          <Component {...pageProps} />
        </Layout>
      )}

      <AnimatePresence>
        {isLoading && <LoadingScreen key="initial-loading" />}
        {!isLoading && isPageLoading && (
          <PageLoadingScreen key="page-loading" />
        )}
      </AnimatePresence>

      {/* 2026-04-16: Botón flotante WhatsApp visible en todas las páginas, fuera del AnimatePresence para que no desaparezca en transiciones. */}
      <WhatsAppFAB />
    </div>
  )
} // Updated: 2026-07-03 (fix de SEO: render de Component siempre activo para SSR/SSG)
