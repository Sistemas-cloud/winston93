// 2026-08-20: Hannia — bloque Visítanos (campus + mapa/CTA), ancla visual real.
import Link from 'next/link'
import Image from 'next/image'

export default function VisitCampusSection() {
  return (
    <section className="overflow-hidden bg-white" aria-labelledby="visit-campus-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[280px] lg:min-h-[420px]">
          <Image
            src="/images/facilities/fondo_escuela.png"
            alt="Campus Instituto Winston Churchill, Ciudad Madero"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#013BDF]/70 to-transparent lg:bg-gradient-to-r" />
        </div>

        <div className="flex flex-col justify-center px-6 py-12 md:px-12 md:py-16" style={{ backgroundColor: '#F7F8FC' }}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#013BDF]">
            Campus Cd. Madero
          </p>
          <h2 id="visit-campus-heading" className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
            Visítanos
          </h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-600 md:text-base">
            Conoce nuestras instalaciones y platica con admisiones. Estamos en Calle 3 #309, Col.
            Jardín 20 de Noviembre.
          </p>
          <ul className="mb-8 space-y-2 text-sm text-gray-700">
            <li>
              <span className="font-semibold text-gray-900">Horario:</span> Lun–Vie 7:00–19:30 · Sáb
              9:00–13:00
            </li>
            <li>
              <span className="font-semibold text-gray-900">Tel:</span>{' '}
              <a href="tel:8334378743" className="text-[#013BDF] hover:underline">
                833 437 8743
              </a>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="rounded-full bg-[#E3FB07] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:shadow-md"
            >
              Agendar visita
            </Link>
            <a
              href="https://www.google.com/maps/search/?api=1&query=C.%203%20309%2C%20Jard%C3%ADn%2020%20de%20Noviembre%2C%2089440%20Cd%20Madero%2C%20Tamps."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#013BDF] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#012A9E]"
            >
              Ver mapa
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
