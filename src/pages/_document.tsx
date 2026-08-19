// 2026-07-03: Documento HTML raíz para Pages Router.
// Define lang="es", favicon institucional y meta base compartidos.
// Preparado para futura extensión i18n (hoy el sitio es monolingüe es).

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
    // Futuro i18n: cambiar lang dinámicamente según locale (ej. es | en).
    return (
      <Html lang={SITE_LANG}>
        <Head>
          <link
            rel="icon"
            href={SITE_LOGO_PATH}
            type="image/png"
          />
          <link
            rel="apple-touch-icon"
            href={SITE_LOGO_PATH}
          />
          <meta name="theme-color" content="#013BDF" />
          <meta name="application-name" content={SITE_NAME} />
        </Head>
        <body>
          {/* 2026-08-19: GTM noscript — fallback cuando JavaScript está deshabilitado */}
          <GoogleTagManagerNoScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
