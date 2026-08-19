// 2026-08-19: Google Tag Manager — contenedor GTM-57SXS2C5 para analytics y tags desde consola GTM.
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GTM_ID } from '@/lib/seo/site-config'

function pushPageView(url: string) {
  if (typeof window === 'undefined' || !GTM_ID) return
  const dataLayer = ((window as Window & { dataLayer?: unknown[] }).dataLayer =
    (window as Window & { dataLayer?: unknown[] }).dataLayer || [])
  dataLayer.push({
    event: 'page_view',
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export default function GoogleTagManager() {
  const router = useRouter()

  useEffect(() => {
    if (!GTM_ID) return

    const onRouteChange = (url: string) => {
      pushPageView(url)
    }

    router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [router.events])

  if (!GTM_ID) return null

  return (
    <Script
      id="google-tag-manager"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
  )
}

export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
