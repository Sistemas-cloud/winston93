// 2026-07-03: Documento HTML raíz para Pages Router.
// 2026-09-22: Preload LCP (poster hero) + preconnect a orígenes críticos.
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from 'next/document'
import { GoogleTagManagerNoScript } from '@/components/GoogleTagManager'
import { SITE_LANG, SITE_LOGO_PATH, SITE_NAME } from '@/lib/seo/site-config'

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={SITE_LANG}>
        <Head>
          <link rel="icon" href={SITE_LOGO_PATH} type="image/png" />
          <link rel="apple-touch-icon" href={SITE_LOGO_PATH} />
          <meta name="theme-color" content="#013BDF" />
          <meta name="application-name" content={SITE_NAME} />

          {/* 2026-09-22: Preconnect/dns-prefetch para terceros diferidos */}
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://gso.amocrm.com" />

          {/* 2026-09-22: Preload poster LCP (móvil prioriza 640w WebP) */}
          <link
            rel="preload"
            as="image"
            href="/images/slider/SLIDE_INICIO_1-640.webp"
            type="image/webp"
          />

          {/* 2026-09-22: CSS crítico mínimo above-the-fold */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                html{scroll-behavior:smooth}
                body{margin:0;background:#000}
                .home-page{min-height:100vh;background:#000}
                .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
              `,
            }}
          />
        </Head>
        <body>
          <GoogleTagManagerNoScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
