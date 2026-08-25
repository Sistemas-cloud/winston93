// 2026-08-20: Hannia — slot para infografía de registro (estilo ICT). Imagen pendiente del equipo.
import Image from 'next/image'
import Link from 'next/link'
import { ADMISSIONS_CAMPAIGN } from '@/lib/seo/site-config'

interface AdmissionGuideSlotProps {
  /** compact = bloque en /admisiones; full = página /admisiones/requisitos */
  variant?: 'compact' | 'full'
}

export default function AdmissionGuideSlot({ variant = 'compact' }: AdmissionGuideSlotProps) {
  const ready = ADMISSIONS_CAMPAIGN.guideImageReady
  const src = ADMISSIONS_CAMPAIGN.guideImagePath

  return (
    <section
      className={variant === 'full' ? 'px-4 py-10' : 'mt-12'}
      aria-labelledby="admission-guide-heading"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#013BDF]">
            {ADMISSIONS_CAMPAIGN.cycleLabel}
          </p>
          <h2
            id="admission-guide-heading"
            className="text-2xl font-extrabold text-gray-900 md:text-3xl"
          >
            Guía de registro / examen de admisión
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            Infografía del proceso (similar a “Registro para el examen”). Cuando el equipo suba la
            imagen, aparecerá aquí automáticamente.
          </p>
        </div>

        {ready ? (
          <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
            <Image
              src={src}
              alt="Guía de registro para el examen de admisión — Instituto Winston Churchill"
              width={1200}
              height={1600}
              className="h-auto w-full"
              priority={variant === 'full'}
            />
            <div className="flex flex-wrap justify-center gap-3 border-t border-gray-100 p-4">
              <a
                href={src}
                download="guia-registro-admision-winston.png"
                className="rounded-full bg-[#E3FB07] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-black"
              >
                Descargar guía
              </a>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#013BDF] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white"
              >
                Ver en grande
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-[#013BDF]/35 bg-[#F7F8FC] px-6 py-14 text-center">
            {/* 2026-08-20: Slot vacío — ruta esperada: public/images/admisiones/guia-registro.png */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#013BDF]/10 text-2xl text-[#013BDF]">
              ▭
            </div>
            <p className="mb-2 text-lg font-extrabold text-gray-900">
              Próximamente — guía visual generada por el equipo
            </p>
            <p className="mx-auto mb-6 max-w-md text-sm text-gray-600">
              Mientras tanto puedes seguir los pasos de admisión o iniciar el registro en línea.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://agendaw.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#013BDF] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white"
              >
                Registro examen
              </a>
              {variant === 'compact' ? (
                <Link
                  href="/admisiones/requisitos"
                  className="rounded-full border border-[#013BDF] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-[#013BDF]"
                >
                  Ver guía / requisitos
                </Link>
              ) : (
                <Link
                  href="/admisiones"
                  className="rounded-full border border-[#013BDF] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-[#013BDF]"
                >
                  Volver a admisiones
                </Link>
              )}
            </div>
            {/* 2026-08-25: Quitada leyenda Dev visible al público */}
          </div>
        )}
      </div>
    </section>
  )
}
