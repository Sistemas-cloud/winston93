// 2026-08-20: Hannia — rediseño de /contacto (claridad ICT + datos Columbia), marca Winston.
import Navigation from '@/components/Navigation'
import { useState } from 'react'
import Image from 'next/image'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'

export default function ContactoPage() {
  const [parentName, setParentName] = useState('')
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })

  const address = 'C. 3 309, Jardín 20 de Noviembre, 89440 Cd Madero, Tamps.'
  const officePhone = '833 437 8743'
  const officeScheduleWeekdays = 'Lunes a viernes: 7:00 am - 7:30 pm'
  const officeScheduleSaturday = 'Sábado: 9:00 am - 1:00 pm'
  const encodedAddress = encodeURIComponent(address)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback({ type: null, text: '' })

    try {
      const res = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentName, studentName, email, message, phone }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.message || 'Error')

      setFeedback({
        type: 'ok',
        text: '¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.',
      })
      setParentName('')
      setStudentName('')
      setEmail('')
      setMessage('')
      setPhone('')
    } catch {
      setFeedback({
        type: 'error',
        text: 'No se pudo enviar el correo. Intenta de nuevo más tarde.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openDirections = () => {
    if (typeof window === 'undefined') return

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(
            address
          )}&travelmode=driving`
          window.open(url, '_blank')
        },
        () => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`
          window.open(url, '_blank')
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`
      window.open(url, '_blank')
    }
  }

  const pageSeo = SITE_ROUTES.find((route) => route.path === '/contacto')!
  const inputClass =
    'w-full h-12 rounded-lg border border-gray-200 bg-white px-4 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#013BDF] focus:ring-2 focus:ring-[#013BDF]/20'

  return (
    <div className="contacto-page bg-white">
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />

      <Navigation currentSection={1} />

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 flex w-full max-w-lg flex-col items-center rounded-2xl bg-white p-12 shadow-2xl">
            <div className="relative mb-6">
              <Image
                src="/images/logos/logo_winston.png"
                alt="Winston Churchill"
                width={400}
                height={100}
                className="h-24 w-24 animate-pulse"
                priority
                quality={100}
              />
              <div className="absolute -right-3 -top-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">Enviando mensaje</h3>
            <p className="mb-6 text-center text-gray-600">
              Por favor, no cierre la página mientras procesamos su solicitud
            </p>
          </div>
        </div>
      )}

      {/* Banner — brand first */}
      <section className="relative h-56 w-full overflow-hidden md:h-72 lg:h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero/contacto.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#013BDF]/85 via-[#013BDF]/55 to-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#E3FB07]">
            Instituto Winston Churchill
          </p>
          <h1 className="text-4xl font-extrabold uppercase tracking-wide text-white md:text-5xl">
            Contáctanos
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/90 md:text-base">
            Despeja dudas sobre admisiones. Llena el formulario y nosotros te contactamos.
          </p>
        </div>
      </section>

      {/* Intro conversión — patrón ICT */}
      <section className="border-b border-gray-100 bg-[#F7F8FC] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold text-[#013BDF]">¿Necesitas más información?</p>
          <h2 className="mb-3 text-2xl font-extrabold text-gray-900 md:text-3xl">
            Estamos listos para orientarte
          </h2>
          {/* 2026-08-21: Copy centrado en el nivel de interés (no “familia”). */}
          <p className="text-sm text-gray-600 md:text-base">
            Cuéntanos del nivel que te interesa. Respuesta de nuestro equipo de admisiones.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#formulario-contacto"
              className="inline-flex rounded-full bg-[#013BDF] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#012A9E]"
            >
              Ir al formulario
            </a>
            <a
              href="https://wa.me/528334378743"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-[#E3FB07] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:shadow-md"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Formulario + datos + mapa */}
      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="container mx-auto grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-14">
          <form id="formulario-contacto" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#013BDF]">
                Formulario
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900">Agenda tu cita</h2>
            </div>

            <div>
              <label htmlFor="parentName" className="mb-2 block text-xs font-semibold uppercase text-gray-700">
                Nombre del padre o tutor
              </label>
              <input
                id="parentName"
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className={inputClass}
                placeholder="Escribe el nombre"
              />
            </div>

            <div>
              <label htmlFor="studentName" className="mb-2 block text-xs font-semibold uppercase text-gray-700">
                Nombre del aspirante
              </label>
              <input
                id="studentName"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className={inputClass}
                placeholder="Escribe el nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase text-gray-700">
                Correo
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase text-gray-700">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="(xxx) xxx xxxx"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase text-gray-700">
                Mensaje
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#013BDF] focus:ring-2 focus:ring-[#013BDF]/20"
                placeholder="Cuéntanos en qué podemos ayudarte"
              />
            </div>

            {feedback.type && (
              <div
                className={`rounded-lg border px-3 py-2 ${
                  feedback.type === 'ok'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`h-12 w-full rounded-full bg-[#E3FB07] text-sm font-bold uppercase tracking-wide text-black transition hover:shadow-lg ${
                submitting ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {submitting ? 'Enviando...' : 'Agendar cita'}
            </button>
          </form>

          <div className="space-y-8">
            {/* Datos estilo Columbia */}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#013BDF]">
                Kínder · Primaria · Secundaria
              </p>
              <h2 className="mb-6 text-2xl font-extrabold text-gray-900">Campus Cd. Madero</h2>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Información de contacto
              </p>

              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(1,59,223,0.1)' }}
                    aria-hidden
                  >
                    <svg className="h-5 w-5 text-[#013BDF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Dirección</p>
                    <p className="text-sm text-gray-600">{address}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(1,59,223,0.1)' }}
                    aria-hidden
                  >
                    <svg className="h-5 w-5 text-[#013BDF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Teléfono</p>
                    <a
                      href="tel:8334378743"
                      className="text-sm font-medium text-[#013BDF] transition hover:underline"
                    >
                      +52 ({officePhone.slice(0, 3)}) {officePhone.slice(4)}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(1,59,223,0.1)' }}
                    aria-hidden
                  >
                    <svg className="h-5 w-5 text-[#013BDF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">Horario de oficina</p>
                    <p className="text-sm text-gray-600">{officeScheduleWeekdays}</p>
                    <p className="text-sm text-gray-600">{officeScheduleSaturday}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <div className="h-[280px] w-full overflow-hidden rounded-xl shadow-md md:h-[320px]">
                <iframe
                  title="Ubicación Instituto Winston Churchill"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodedAddress}&hl=es&z=15&output=embed`}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#013BDF] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012A9E]"
                >
                  Ver en Google Maps
                </a>
                <button
                  type="button"
                  onClick={openDirections}
                  className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-[#013BDF] transition hover:bg-gray-200"
                >
                  Cómo llegar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
