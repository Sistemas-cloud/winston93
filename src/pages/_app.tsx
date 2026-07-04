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
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="initial-loading" />
        ) : isPageLoading ? (
          <PageLoadingScreen key="page-loading" />
        ) : router.pathname === '/' || router.pathname === '/programas' ? (
          <Component {...pageProps} />
        ) : router.pathname === '/oferta-educativa' ? (
          <Component {...pageProps} />
        ) : (
          <Layout key="layout" showFooter={true}>
            <Component {...pageProps} />
          </Layout>
        )}
      </AnimatePresence>
      {/* 2026-04-16: Botón flotante WhatsApp visible en todas las páginas, fuera del AnimatePresence para que no desaparezca en transiciones. */}
      <WhatsAppFAB />
    </div>
  )
} // Updated: vie 08 ago 2025 11:02:42 CST
