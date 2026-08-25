// 2026-08-20: Hannia — paneles de niveles (patrón oferta Columbia/ICT), marca Winston.
import Link from 'next/link'
import Image from 'next/image'

const LEVELS = [
  {
    title: 'Kínder',
    href: '/oferta-educativa',
    image: '/images/education/kinder.png',
    blurb: 'Primeros pasos en un entorno bilingüe lleno de curiosidad y cuidado.',
  },
  {
    title: 'Primaria',
    href: '/primaria',
    image: '/images/education/primaria.png',
    blurb: 'Bases académicas sólidas, valores y pensamiento crítico.',
  },
  {
    title: 'Secundaria',
    href: '/secundaria',
    image: '/images/education/secundaria.png',
    blurb: 'Preparación integral para el futuro con visión global.',
  },
]

export default function LevelsShowcase() {
  return (
    <section className="bg-white px-4 py-14 md:py-16" aria-labelledby="levels-showcase-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#013BDF]">
            Oferta educativa
          </p>
          <h2 id="levels-showcase-heading" className="text-2xl font-extrabold text-gray-900 md:text-3xl">
            Un camino por nivel
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
            Conoce cada etapa de la formación Winston y da el siguiente paso hacia admisiones.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {LEVELS.map((level) => (
            <Link
              key={level.title}
              href={level.href}
              className="group overflow-hidden rounded-2xl bg-[#F7F8FC] shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#013BDF]/10">
                <Image
                  src={level.image}
                  alt={`Nivel ${level.title} — Instituto Winston Churchill`}
                  fill
                  className="object-contain p-6 transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-xl font-extrabold uppercase tracking-wide text-gray-900">
                  {level.title}
                </h3>
                <div className="mb-3 h-1 w-12 rounded-full bg-[#E3FB07]" />
                <p className="mb-4 text-sm text-gray-600">{level.blurb}</p>
                <span className="text-xs font-bold uppercase tracking-wide text-[#013BDF] group-hover:underline">
                  Conocer más →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/admisiones"
            className="inline-flex rounded-full bg-[#013BDF] px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#012A9E]"
          >
            Ir a admisiones
          </Link>
        </div>
      </div>
    </section>
  )
}
