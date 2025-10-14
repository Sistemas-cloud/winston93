import Head from 'next/head'
import Navigation from '@/components/Navigation'
import OfertaEducativaSection from '@/components/sections/OfertaEducativaSection'

export default function OfertaEducativaPage() {
  return (
    <>
      <Head>
        <title>Oferta Educativa - Instituto Winston Churchill</title>
        <meta name="description" content="Descubre nuestra oferta educativa: Kínder, Primaria y Secundaria. Formación integral para un futuro brillante." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="oferta-educativa-page">
        <Navigation />
        <OfertaEducativaSection />
      </div>
    </>
  )
}
