// 2026-09-30: Banner de consentimiento de cookies (no bloquea la navegación).
// Se muestra hasta que el usuario decide; se reabre desde "Preferencias de cookies" del footer.
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { PRIVACY_NOTICE_PATH } from '@/lib/legal'
import {
  saveCookieConsent,
  useCookieBannerRequests,
  useCookieConsent,
  type CookieConsent,
} from '@/lib/cookie-consent'

export default function CookieBanner() {
  const consent = useCookieConsent()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (consent === null) setOpen(true)
  }, [consent])

  const reopen = useCallback(() => setOpen(true), [])
  useCookieBannerRequests(reopen)

  const decide = (value: CookieConsent) => {
    setOpen(false)
    saveCookieConsent(value)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
      className="fixed inset-x-0 bottom-0 z-[150] border-t border-gray-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:inset-x-auto md:bottom-6 md:left-6 md:max-w-md md:rounded-2xl md:border md:pb-5 md:pt-5"
    >
      <p
        id="cookie-banner-title"
        className="mb-1 text-xs font-bold uppercase tracking-wider text-[#013BDF]"
      >
        Uso de cookies
      </p>
      <p id="cookie-banner-text" className="mb-4 text-sm leading-relaxed text-gray-700">
        Usamos cookies necesarias para que el sitio funcione. Con tu permiso, también usamos
        cookies de Google para medir visitas y mostrar publicidad. Consulta nuestro{' '}
        <Link
          href={`${PRIVACY_NOTICE_PATH}#cookies`}
          className="font-semibold text-[#013BDF] underline-offset-2 hover:underline"
        >
          Aviso de Privacidad
        </Link>
        .
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => decide('all')}
          className="h-11 flex-1 rounded-full bg-[#013BDF] px-5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#012A9E]"
        >
          Aceptar todas
        </button>
        <button
          type="button"
          onClick={() => decide('essential')}
          className="h-11 flex-1 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold uppercase tracking-wide text-gray-800 transition hover:border-[#013BDF] hover:text-[#013BDF]"
        >
          Rechazar no esenciales
        </button>
      </div>
    </div>
  )
}
