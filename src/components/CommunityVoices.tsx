// 2026-08-20: Hannia — voces de comunidad (copy institucional, sin testimonios inventados con nombre falso).
import Link from 'next/link'

const VOICES = [
  {
    quote:
      'Elegimos un colegio donde el inglés y los valores caminan juntos desde kínder hasta secundaria.',
    role: 'Familias Winston',
  },
  {
    quote:
      'Más de tres décadas formando estudiantes con respaldo internacional y raíz en Ciudad Madero.',
    role: 'Comunidad #soywinston',
  },
  // 2026-08-21: Sin mención a Oxford; se mantiene Cambridge.
  {
    quote:
      'University of Cambridge acompaña nuestra propuesta bilingüe de excelencia.',
    role: 'Formación académica',
  },
]

export default function CommunityVoices() {
  return (
    // 2026-08-20: Más padding inferior para que el título/cards no queden bajo sticky/taskbar
    <section className="px-4 py-14 pb-20 md:py-16 md:pb-20" style={{ backgroundColor: '#F7F8FC' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#013BDF]">
            Confianza
          </p>
          <h2 className="text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl">
            Por qué las familias eligen Winston
          </h2>
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
