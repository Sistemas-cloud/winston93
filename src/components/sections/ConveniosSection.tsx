// 2026-10-19: Hannia — convenios tipográficos (beca / empresa / alianzas) en lugar del PNG monolítico.
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const BECA = ['UNE', 'IEST Anáhuac', 'Tecmilenio'] as const
const EMPRESA = ['Pemex', 'IMSS', 'CFE', 'Telmex'] as const
const ALIANZAS = ['Cambridge', 'Narrative 4', 'COPARMEX', 'AMMJE'] as const

export default function ConveniosSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={sectionRef}
      id="convenios-alianzas"
      className="relative flex h-full min-h-[420px] w-full items-center overflow-hidden bg-white px-4 py-12 md:min-h-0 md:px-8 md:py-16"
    >
      <div
        className={`mx-auto w-full max-w-6xl transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#013BDF]">
          Red Winston
        </p>
        <h2 className="mb-2 text-2xl font-extrabold uppercase tracking-tight text-gray-900 md:text-3xl">
          Convenios y alianzas estratégicas
        </h2>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
          Becas directas para egresados, vínculos con empresas y alianzas académicas que
          abren puertas reales a nuestros alumnos.
        </p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <Group
            title="Convenios con beca directa"
            subtitle="A nuestros egresados"
            items={BECA}
            accent="#E3FB07"
          />
          <Group
            title="Convenios con empresas"
            subtitle="Experiencia y proyección"
            items={EMPRESA}
            accent="#013BDF"
          />
          <Group
            title="Alianzas estratégicas"
            subtitle="Del Instituto"
            items={ALIANZAS}
            accent="#E3FB07"
            showCambridge
          />
        </div>
      </div>
    </div>
  )
}

function Group({
  title,
  subtitle,
  items,
  accent,
  showCambridge,
}: {
  title: string
  subtitle: string
  items: readonly string[]
  accent: string
  showCambridge?: boolean
}) {
  return (
    <div className="border-t-2 pt-5" style={{ borderColor: accent }}>
      <h3 className="mb-1 text-sm font-extrabold uppercase tracking-wide text-gray-900">
        {title}
      </h3>
      <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
        {subtitle}
      </p>
      <ul className="space-y-3">
        {items.map((name) => (
          <li
            key={name}
            className="flex items-center gap-3 text-base font-bold tracking-tight text-[#013BDF] md:text-lg"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent === '#E3FB07' ? '#013BDF' : accent }}
              aria-hidden
            />
            {name}
          </li>
        ))}
      </ul>
      {showCambridge && (
        <div className="mt-6">
          <Image
            src="/images/logos/cambridge.png"
            alt="University of Cambridge"
            width={140}
            height={48}
            className="h-10 w-auto object-contain opacity-90"
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}
