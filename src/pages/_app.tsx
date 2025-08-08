import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '@/components/LoadingScreen'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 segundos de loading

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <AnimatePresence mode="wait">
        <LoadingScreen key="loading" />
      </AnimatePresence>
    )
  }

  return (
    <Layout showFooter={router.pathname !== '/'}>
      <Component {...pageProps} />
    </Layout>
  )
} // Updated: vie 08 ago 2025 11:02:42 CST
