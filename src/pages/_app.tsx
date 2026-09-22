import '@/styles/globals.css'
import '@/styles/amocrm.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import PageLoadingScreen from '@/components/PageLoadingScreen'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import AmoCRM from '@/components/AmoCRM'
import GoogleTagManager from '@/components/GoogleTagManager'
import GoogleAdsTag from '@/components/GoogleAdsTag'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import CampaignModal from '@/components/CampaignModal'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import { Poppins } from 'next/font/google'

// 2026-09-22: Menos pesos de fuente = menos CSS/FOUT; display swap ya activo.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export default function App({ Component, pageProps }: AppProps) {
  const [isPageLoading, setIsPageLoading] = useState(false)
  const router = useRouter()

  // 2026-09-22: Eliminado LoadingScreen inicial (1.5s + partículas) — era el mayor bloqueo de LCP móvil.

  useEffect(() => {
    const handleStart = () => setIsPageLoading(true)
    const handleComplete = () => {
      setTimeout(() => setIsPageLoading(false), 400)
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
      {/* 2026-09-22: GTM/Ads diferidos — no bloquean LCP */}
      <GoogleAdsTag />
      <GoogleTagManager />
      <AmoCRM />

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
        {isPageLoading && <PageLoadingScreen key="page-loading" />}
      </AnimatePresence>

      <StickyMobileCTA />
      <WhatsAppFAB />
      <CampaignModal />
    </div>
  )
}
