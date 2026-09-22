// 2026-08-20: Hannia — voces de comunidad (copy institucional, sin testimonios inventados).
// 2026-09-22: Más texto claro + oraciones cortas (legibilidad SEO/GEO).
import Link from 'next/link'

const VOICES = [
  {
    quote:
      'Elegimos un colegio donde el inglés y los valores van juntos. Desde kínder hasta secundaria.',
    role: 'Familias Winston',
  },
  {
    quote:
      'Más de tres décadas formando estudiantes en Ciudad Madero. Con respaldo internacional.',
    role: 'Comunidad #soywinston',
  },
  {
    quote:
      'University of Cambridge acompaña nuestra propuesta bilingüe. Buscamos excelencia con cercanía.',
    role: 'Formación académica',
  },
]

export default function CommunityVoices() {
  return (
    <section
      className="px-4 py-14 pb-20 md:py-16 md:pb-20"
      style={{ backgroundColor: '#F7F8FC' }}
      aria-labelledby="community-voices-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#013BDF]">
            Confianza
          </p>
          <h2
            id="community-voices-heading"
            className="mb-4 text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl"
          >
            Por qué las familias eligen el Instituto Winston Churchill
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
            Las familias buscan un colegio serio, bilingüe y cercano. En el Instituto
            Winston Churchill unimos trayectoria, inglés diario y valores. Así
            acompañamos el crecimiento de cada estudiante.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VOICES.map((v) => (
            <blockquote
              key={v.role}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <p className="mb-4 text-sm leading-relaxed text-gray-700">“{v.quote}”</p>
              <footer className="text-xs font-bold uppercase tracking-wide text-[#013BDF]">
                {v.role}
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/conocenos"
            className="text-sm font-bold uppercase tracking-wide text-[#013BDF] hover:underline"
          >
            Conoce nuestra historia →
          </Link>
        </div>
      </div>
    </section>
  )
}
