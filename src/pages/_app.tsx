import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import GoogleTagManager from '@/components/GoogleTagManager'
import GoogleAdsTag from '@/components/GoogleAdsTag'
import { Poppins } from 'next/font/google'

// 2026-09-22: Widgets no críticos fuera del bundle inicial (mejor TBT/LCP móvil).
const AmoCRM = dynamic(() => import('@/components/AmoCRM'), { ssr: false })
const WhatsAppFAB = dynamic(() => import('@/components/WhatsAppFAB'), { ssr: false })
const CampaignModal = dynamic(() => import('@/components/CampaignModal'), { ssr: false })
const StickyMobileCTA = dynamic(() => import('@/components/StickyMobileCTA'), { ssr: false })
const PageLoadingScreen = dynamic(() => import('@/components/PageLoadingScreen'), { ssr: false })

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
  const [mountExtras, setMountExtras] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => setIsPageLoading(true)
    const handleComplete = () => {
      window.setTimeout(() => setIsPageLoading(false), 400)
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

  // 2026-09-22: Montar FAB/modal/chat tras idle o interacción (no compiten con LCP).
  useEffect(() => {
    let idleId: number | undefined
    let timeoutId: number | undefined
    const enable = () => setMountExtras(true)
    const onInteract = () => {
      enable()
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('touchstart', onInteract)
      window.removeEventListener('click', onInteract)
    }
    window.addEventListener('scroll', onInteract, { once: true, passive: true })
    window.addEventListener('touchstart', onInteract, { once: true, passive: true })
    window.addEventListener('click', onInteract, { once: true })

    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(
          () => cb({ didTimeout: true, timeRemaining: () => 0 } as IdleDeadline),
          4000
        ))
    idleId = ric(() => enable(), { timeout: 8000 }) as number
    timeoutId = window.setTimeout(enable, 10000)

    return () => {
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('touchstart', onInteract)
      window.removeEventListener('click', onInteract)
      if (typeof window.cancelIdleCallback === 'function' && idleId !== undefined) {
        window.cancelIdleCallback(idleId)
      } else if (idleId !== undefined) {
        window.clearTimeout(idleId)
      }
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className={`${poppins.variable} font-sans`}>
      {/* 2026-09-22: GTM/Ads lazyOnload — no bloquean primer paint */}
      <GoogleAdsTag />
      <GoogleTagManager />

      {router.pathname === '/' ||
      router.pathname === '/programas' ||
      router.pathname === '/oferta-educativa' ? (
        <Component {...pageProps} />
      ) : (
        <Layout key="layout" showFooter={true}>
          <Component {...pageProps} />
        </Layout>
      )}

      {isPageLoading && <PageLoadingScreen />}

      {/* 2026-09-22: Sticky/WhatsApp pronto; chat/modal solo tras idle o interacción */}
      <StickyMobileCTA />
      <WhatsAppFAB />
      {mountExtras && (
        <>
          <AmoCRM />
          <CampaignModal />
        </>
      )}
    </div>
  )
}
