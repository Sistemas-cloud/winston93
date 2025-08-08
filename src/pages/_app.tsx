import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '@/components/LoadingScreen'
import PageLoadingScreen from '@/components/PageLoadingScreen'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simular tiempo de carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 segundos de loading inicial

    return () => clearTimeout(timer)
  }, [])

  // Detectar cambios de página
  useEffect(() => {
    const handleStart = () => {
      setIsPageLoading(true)
    }

    const handleComplete = () => {
      // Pequeño delay para mostrar la animación
      setTimeout(() => {
        setIsPageLoading(false)
      }, 1200)
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
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="initial-loading" />
      ) : isPageLoading ? (
        <PageLoadingScreen key="page-loading" />
      ) : (
        <Layout key="layout" showFooter={router.pathname !== '/'}>
          <Component {...pageProps} />
        </Layout>
      )}
    </AnimatePresence>
  )
} // Updated: vie 08 ago 2025 11:02:42 CST
