// 2026-08-19: Google Ads gtag AW-11289279900 — beforeInteractive en <head> + page views SPA.
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GOOGLE_ADS_ID } from '@/lib/seo/site-config'

function sendAdsPageView(url: string) {
  if (typeof window === 'undefined' || !GOOGLE_ADS_ID) return
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  gtag('config', GOOGLE_ADS_ID, { page_path: url })
}

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

  if (!GOOGLE_ADS_ID) return null

  return (
    <>
      <Script
        id="google-ads-gtag-loader"
        strategy="beforeInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script
        id="google-ads-gtag-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />
    </>
  )
}
