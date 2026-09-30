// 2026-09-30: Consentimiento de cookies. Google Tag Manager y Google Ads solo se cargan con
// consentimiento 'all'; sin decisión o con 'essential' no se inyecta ningún script de Google.
import { useEffect, useState } from 'react'

export type CookieConsent = 'all' | 'essential'

const STORAGE_KEY = 'winston93_cookie_consent'
const CONSENT_EVENT = 'winston93:cookie-consent'
const OPEN_BANNER_EVENT = 'winston93:open-cookie-banner'

const TRACKING_COOKIE_PREFIXES = ['_ga', '_gid', '_gat', '_gcl', '_gac', 'IDE', 'test_cookie']

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'all' || value === 'essential' ? value : null
  } catch {
    return null
  }
}

function clearTrackingCookies(): void {
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.replace(/^www\./, '')}`]
  document.cookie.split(';').forEach((raw) => {
    const name = raw.split('=')[0]?.trim()
    if (!name || !TRACKING_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) return
    domains.forEach((domain) => {
      const domainAttr = domain ? `; domain=${domain}` : ''
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttr}`
    })
  })
}

export function saveCookieConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return
  const previous = readCookieConsent()
  try {
    window.localStorage.setItem(STORAGE_KEY, consent)
  } catch {
    /* almacenamiento bloqueado: la decisión vale solo para esta visita */
  }

  // Los scripts de Google ya cargados no se pueden descargar: se limpian cookies y se recarga.
  if (previous === 'all' && consent === 'essential') {
    clearTrackingCookies()
    window.location.reload()
    return
  }

  window.dispatchEvent(new CustomEvent<CookieConsent>(CONSENT_EVENT, { detail: consent }))
}

export function openCookiePreferences(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_BANNER_EVENT))
}

/** `undefined` mientras se lee localStorage (evita parpadeo del banner en SSR). */
export function useCookieConsent(): CookieConsent | null | undefined {
  const [consent, setConsent] = useState<CookieConsent | null | undefined>(undefined)

  useEffect(() => {
    setConsent(readCookieConsent())
    const onChange = (event: Event) => {
      setConsent((event as CustomEvent<CookieConsent>).detail)
    }
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  return consent
}

export function useCookieBannerRequests(onOpen: () => void): void {
  useEffect(() => {
    window.addEventListener(OPEN_BANNER_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_BANNER_EVENT, onOpen)
  }, [onOpen])
}
