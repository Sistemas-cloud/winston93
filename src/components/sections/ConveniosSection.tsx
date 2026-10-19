// 2026-10-19: Banner original + info de convenios (beca / empresa / alianzas) + carrete.
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const BECA = ['UNE', 'IEST Anáhuac', 'Tecmilenio'] as const
const EMPRESA = ['Pemex', 'IMSS', 'CFE', 'Telmex'] as const
const ALIANZAS = ['Cambridge', 'Narrative 4', 'COPARMEX', 'AMMJE'] as const

const MARCAS = [
  ...BECA,
  ...EMPRESA,
  ...ALIANZAS,
] as const

export default function ConveniosSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const loop = [...MARCAS, ...MARCAS]

  useEffect(() => {
    const updateDeviceType = () => setIsMobile(window.innerWidth < 768)
    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    return () => window.removeEventListener('resize', updateDeviceType)
  }, [])

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
      className="relative flex h-auto min-h-full w-full flex-col bg-white lg:h-full lg:overflow-hidden"
    >
      {/* Banner + título */}
      <div className="relative min-h-0 flex-[1.1] px-4 pt-6 md:px-8 md:pt-8">
        <div
          className={`mx-auto flex h-full max-w-6xl flex-col items-center justify-center transition-all duration-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#013BDF] md:text-xs">
            Red Winston
          </p>
          <h2 className="mb-3 text-center text-lg font-extrabold uppercase tracking-tight text-gray-900 md:mb-4 md:text-2xl">
            Convenios y alianzas estratégicas
          </h2>
          <Image
            src="/images/logos/convenios.png"
            alt="Convenios y Alianzas Académicas - Instituto Winston Churchill"
            width={1200}
            height={600}
            sizes="(max-width: 768px) 100vw, 70vw"
            loading="lazy"
            decoding="async"
            className={`h-auto w-full max-w-3xl object-contain ${
              isMobile ? 'max-h-[28vh]' : 'max-h-[32vh] lg:max-h-[36vh]'
            }`}
          />
        </div>
      </div>

      {/* Info: beca / empresa / alianzas */}
      <div
        className={`shrink-0 border-t border-[#013BDF]/10 px-4 py-5 md:px-8 md:py-6 transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
        style={{ transitionDelay: '180ms' }}
      >
        <p className="mx-auto mb-5 max-w-3xl text-center text-xs leading-relaxed text-gray-600 md:mb-6 md:text-sm">
          Becas directas para egresados, vínculos con empresas y alianzas académicas que
          abren puertas reales a nuestros alumnos.
        </p>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
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

      {/* Carrete de marcas */}
      <div
        className="relative shrink-0 border-t border-[#013BDF]/10 py-3"
        style={{ backgroundColor: '#F9F9F9' }}
        aria-label="Marcas y socios"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#F9F9F9] via-[#F9F9F9]/90 to-transparent md:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#F9F9F9] via-[#F9F9F9]/90 to-transparent md:w-24"
          aria-hidden
        />
        <div className="wl-convenios-marquee flex w-max gap-10 px-6 md:gap-14">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#013BDF]/75 md:text-xs"
            >
              {name}
            </span>
          ))}
        </div>
        <style>{`
          .wl-convenios-marquee {
            animation: wlConveniosMarquee 38s linear infinite;
          }
          @keyframes wlConveniosMarquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .wl-convenios-marquee { animation: none; }
          }
        `}</style>
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
    <div className="border-t-2 pt-3" style={{ borderColor: accent }}>
      <h3 className="mb-0.5 text-[11px] font-extrabold uppercase tracking-wide text-gray-900 md:text-xs">
        {title}
      </h3>
      <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.14em] text-gray-500 md:text-[10px]">
        {subtitle}
      </p>
      <ul className="space-y-1.5">
        {items.map((name) => (
          <li
            key={name}
            className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#013BDF] md:text-base"
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
        <div className="mt-3">
          <Image
            src="/images/logos/cambridge.png"
            alt="University of Cambridge"
            width={120}
            height={40}
            className="h-7 w-auto object-contain opacity-90 md:h-8"
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}
