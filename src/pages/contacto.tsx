import Head from 'next/head'
import Navigation from '@/components/Navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function ContactoPage() {
  const [parentName, setParentName] = useState('')
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error' | null; text: string }>({ type: null, text: '' })

  const address = 'C. 3 309, Jardín 20 de Noviembre, 89440 Cd Madero, Tamps.'
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

      setFeedback({ type: 'ok', text: '¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.' })
      setParentName('')
      setStudentName('')
      setEmail('')
      setMessage('')
      setPhone('')
    } catch (err: any) {
      setFeedback({ type: 'error', text: 'No se pudo enviar el correo. Intenta de nuevo más tarde.' })
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

  return (
    <div className="contacto-page">
      <Head>
        <title>Contáctanos - Instituto Winston Churchill</title>
        <meta name="description" content="Agenda una cita y conoce más sobre el Instituto Winston Churchill. Estamos para ayudarte." />
      </Head>

      <Navigation currentSection={1} />

      {/* Overlay de carga */}
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center shadow-2xl max-w-lg w-full mx-4">
            <div className="relative mb-6">
                          <Image 
              src="/images/logos/logo_winston.png" 
              alt="Winston Churchill" 
              width={400}
              height={100}
              className="w-24 h-24 animate-pulse"
              priority
              quality={100}
            />
              <div className="absolute -top-3 -right-3 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Enviando mensaje</h3>
            <p className="text-gray-600 text-center mb-6">Por favor, no cierre la página mientras procesamos su solicitud</p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <section className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero/contacto.png')" }}
        />
        <div className="absolute inset-0 bg-blue-900/50" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-wide uppercase">
            Contáctanos
          </h1>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
                Nombre del padre o tutor
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full h-11 rounded-md border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Escribe el nombre"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
                Nombre del aspirante
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full h-11 rounded-md border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Escribe el nombre"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
                Correo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-md border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
                placeholder="Cuéntanos en qué podemos ayudarte"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 rounded-md border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="(xxx) xxx xxxx"
              />
            </div>

            {feedback.type && (
              <div className={`${feedback.type === 'ok' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'} border px-3 py-2 rounded`}>{feedback.text}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full h-12 rounded-md bg-[#E3FB07] text-black font-bold uppercase tracking-wide hover:shadow-lg transition ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Enviando...' : 'Agendar cita'}
            </button>
          </form>

          {/* Mapa */}
          <div>
            <div className="w-full h-[320px] md:h-[360px] rounded-md overflow-hidden shadow">
              <iframe
                title="Ubicación Instituto Winston Churchill"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodedAddress}&hl=es&z=15&output=embed`}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Ver en Google Maps
              </a>
              <button
                onClick={openDirections}
                className="px-4 py-2 rounded-md bg-gray-100 text-blue-700 font-medium hover:bg-gray-200 transition"
              >
                Cómo llegar desde mi ubicación
              </button>
            </div>

            {/* Dirección textual */}
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold">Dirección</p>
              <p>{address}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 