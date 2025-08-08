import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  // Temporarily disable loading screen to fix React error
  return (
    <Layout showFooter={false}>
      <Component {...pageProps} />
    </Layout>
  )
} // Updated: vie 08 ago 2025 11:02:42 CST
