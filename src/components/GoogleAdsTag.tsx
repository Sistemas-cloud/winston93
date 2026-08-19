// 2026-08-19: Seguimiento SPA de Google Ads — el snippet gtag vive en _document.tsx (<head>).
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GOOGLE_ADS_ID } from '@/lib/seo/site-config'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function sendAdsPageView(url: string) {
  if (typeof window === 'undefined' || !GOOGLE_ADS_ID || !window.gtag) return
  window.gtag('config', GOOGLE_ADS_ID, {
    page_path: url,
  })
}

/** Registra page views en navegación cliente (Next.js SPA). El script base está en _document. */
export default function GoogleAdsTag() {
  const router = useRouter()

  useEffect(() => {
    if (!GOOGLE_ADS_ID) return

    const onRouteChange = (url: string) => {
      sendAdsPageView(url)
    }

    router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [router.events])

  return null
}
