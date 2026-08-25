// 2026-08-21: Modal de inscripciones en cada recarga + reloj flip “30 años de experiencia”.
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ADMISSIONS_CAMPAIGN } from '@/lib/seo/site-config'

/**
 * Dígito tipo reloj de hojas (split-flap).
 * 2026-08-21: Al cambiar el valor, la mitad superior voltea en 3D.
 */
function FlipDigit({ value }: { value: string }) {
  const prevRef = useRef(value)
  const [prev, setPrev] = useState(value)
  const [curr, setCurr] = useState(value)
  const [flipping, setFlipping] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (value === prevRef.current) return

    if (timerRef.current) window.clearTimeout(timerRef.current)

    setPrev(prevRef.current)
    setCurr(value)
    setFlipping(true)
    prevRef.current = value

    timerRef.current = window.setTimeout(() => {
      setFlipping(false)
      setPrev(value)
    }, 160)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [value])

  return (
    <div
      className="relative h-[4.75rem] w-[3.4rem] select-none md:h-[6.25rem] md:w-[4.5rem]"
      style={{ perspective: '480px' }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 overflow-hidden rounded-md bg-[#011f75] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_16px_rgba(0,0,0,0.35)]">
        {/* Mitad superior: valor nuevo */}
        <div className="absolute inset-x-0 top-0 flex h-1/2 items-end justify-center overflow-hidden bg-[#013BDF]">
          <span className="translate-y-1/2 text-4xl font-extrabold tabular-nums leading-none text-white md:text-5xl">
            {curr}
          </span>
        </div>
        {/* Mitad inferior: valor nuevo (tras el flip) / base */}
        <div className="absolute inset-x-0 bottom-0 flex h-1/2 items-start justify-center overflow-hidden bg-[#012A9E]">
          <span className="-translate-y-1/2 text-4xl font-extrabold tabular-nums leading-none text-white md:text-5xl">
            {flipping ? prev : curr}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-px bg-black/50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-md bg-gradient-to-b from-white/12 to-transparent" />
      </div>

      {/* Hoja que gira: muestra el dígito anterior cayendo */}
      {flipping && (
        <div
          className="absolute inset-x-0 top-0 z-30 h-1/2 origin-bottom overflow-hidden rounded-t-md bg-[#013BDF]"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            animation: 'winstonFlipCard 0.16s ease-in forwards',
            boxShadow: '0 8px 14px rgba(0,0,0,0.4)',
          }}
        >
          <span className="absolute inset-x-0 top-0 flex h-[200%] items-end justify-center">
            <span className="translate-y-1/2 text-4xl font-extrabold tabular-nums leading-none text-white md:text-5xl">
              {prev}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}

function YearsFlipClock({ active }: { active: boolean }) {
  const [tens, setTens] = useState('0')
  const [ones, setOnes] = useState('0')

  useEffect(() => {
    if (!active) {
      setTens('0')
      setOnes('0')
      return
    }

    // 2026-08-21: Cuenta 0→30 ~2.5s (flip corto para no alargar el anuncio).
    let n = 0
    const target = 30
    const id = window.setInterval(() => {
      n += 1
      if (n >= target) {
        n = target
        window.clearInterval(id)
      }
      const s = String(n).padStart(2, '0')
      setTens(s[0])
      setOnes(s[1])
    }, 85)

    return () => window.clearInterval(id)
  }, [active])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2.5" role="img" aria-label="30 años de experiencia">
        <FlipDigit value={tens} />
        <FlipDigit value={ones} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E3FB07] md:text-sm">
        años de experiencia
      </p>
    </div>
  )
}

export default function CampaignModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // 2026-08-21: Sin sessionStorage — el aviso sale en cada recarga de página.
    let cancelled = false
    const t = window.setTimeout(() => {
      if (!cancelled) setOpen(true)
    }, 2600)

    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [])

  const dismiss = () => setOpen(false)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-modal-title"
      onClick={dismiss}
    >
      <style>{`
        @keyframes winstonFlipCard {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
      `}</style>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 pb-6 pt-10 text-center"
          style={{ background: 'linear-gradient(180deg, #013BDF 0%, #012A9E 100%)' }}
        >
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E3FB07]">
            {ADMISSIONS_CAMPAIGN.cycleLabel}
          </p>

          <YearsFlipClock active={open} />

          <h2
            id="campaign-modal-title"
            className="mt-6 pb-2 text-2xl font-extrabold leading-tight text-white"
          >
            {ADMISSIONS_CAMPAIGN.title}
          </h2>
          <p className="text-sm text-white/85">{ADMISSIONS_CAMPAIGN.highlight}</p>
        </div>

        <div className="space-y-4 px-6 py-6">
          <p className="text-center text-sm text-gray-600">{ADMISSIONS_CAMPAIGN.openHouseNote}</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2 rounded-lg bg-[#F7F8FC] px-3 py-2">
              <span className="font-bold text-[#013BDF]">✓</span>
              Kínder, Primaria y Secundaria
            </li>
            <li className="flex items-start gap-2 rounded-lg bg-[#F7F8FC] px-3 py-2">
              <span className="font-bold text-[#013BDF]">✓</span>
              Educación bilingüe con respaldo Cambridge
            </li>
            <li className="flex items-start gap-2 rounded-lg bg-[#F7F8FC] px-3 py-2">
              <span className="font-bold text-[#013BDF]">✓</span>
              Campus en Ciudad Madero
            </li>
          </ul>
          <Link
            href="/admisiones"
            onClick={dismiss}
            className="flex w-full items-center justify-center rounded-full bg-[#E3FB07] py-3.5 text-sm font-bold uppercase tracking-wide text-black transition hover:shadow-lg"
          >
            Ver proceso de admisión
          </Link>
          {/* 2026-08-21: Agendar cita → apartado examen de admisión. */}
          <Link
            href="/admisiones#examen-admision"
            onClick={dismiss}
            className="flex w-full items-center justify-center rounded-full bg-[#013BDF] py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#012A9E]"
          >
            Agendar cita
          </Link>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white transition hover:bg-white/35"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  )
}
