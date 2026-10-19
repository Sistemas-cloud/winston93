// 2026-10-19: Hannia — fortalezas home (IA, trilingüe, instalaciones, competencias, Winston USA).
import Link from 'next/link'

const FORTALEZAS = [
  {
    label: '01',
    title: 'Modelo avanzado con IA',
    body: 'Enseñanza potenciada con inteligencia artificial: pensamiento crítico, creatividad y herramientas del futuro desde edades tempranas.',
  },
  {
    label: '02',
    title: 'Formación trilingüe',
    body: 'Inmersión en español e inglés, con francés en secundaria. Comunicación real para un mundo global.',
  },
  {
    label: '03',
    title: 'Instalaciones que cuidan',
    body: 'Campus climatizado, circuito cerrado y estancias extendidas para que las familias confíen el día completo.',
  },
  {
    label: '04',
    title: 'Competencias que inspiran',
    body: 'Participación en competencias nacionales, estatales y regionales que fortalecen carácter y excelencia.',
  },
] as const

export default function FortalezasSection() {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 md:py-20"
      style={{ backgroundColor: '#F9F9F9' }}
      aria-labelledby="fortalezas-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: '#E3FB07' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ background: '#013BDF' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#013BDF]">
          Por qué Winston
        </p>
        <h2
          id="fortalezas-heading"
          className="mb-3 max-w-3xl text-2xl font-extrabold leading-tight text-gray-900 md:text-4xl"
        >
          Programa académico, cimentado en tecnología, innovación y emprendimiento
        </h2>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-gray-600 md:mb-14 md:text-base">
          Formamos con propósito: academia sólida, herramientas digitales y espíritu
          emprendedor — en Ciudad Madero, con visión internacional.
        </p>

        <ul className="mb-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {FORTALEZAS.map((item) => (
            <li key={item.label} className="relative border-t border-[#013BDF]/20 pt-5">
              <span
                className="mb-3 block font-bold tracking-[0.2em] text-[#013BDF]"
                style={{ fontSize: '0.7rem' }}
              >
                {item.label}
              </span>
              <h3 className="mb-2 text-lg font-extrabold uppercase leading-snug tracking-tight text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">{item.body}</p>
            </li>
          ))}
        </ul>

        {/* Winston USA — ancla home hasta contenido oficial */}
        <div
          id="winston-usa"
          className="scroll-mt-28 border-l-4 border-[#E3FB07] bg-white px-6 py-8 md:px-10 md:py-10"
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#013BDF]">
            Winston USA
          </p>
          <h3 className="mb-3 text-xl font-extrabold uppercase tracking-tight text-gray-900 md:text-2xl">
            Maternal, kínder, primaria y secundaria
          </h3>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
            Una mirada internacional alineada con estándares globales, sin perder la
            cercanía de la familia #soywinston.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/programas#tecnologia-innovacion"
              className="inline-flex rounded-full bg-[#013BDF] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#012A9E]"
            >
              Tecnología e innovación
            </Link>
            <Link
              href="/programas#finanzas-emprendimiento"
              className="inline-flex rounded-full border border-[#013BDF]/30 bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#013BDF] transition hover:border-[#013BDF]"
            >
              Finanzas y emprendimiento
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
