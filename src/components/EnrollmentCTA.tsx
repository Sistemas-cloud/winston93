// 2026-08-20: Hannia — CTA de inscripción estilo Columbia, identidad Winston (azul/lima).
import Link from 'next/link'

export default function EnrollmentCTA() {
  return (
    <section
      className="relative overflow-hidden py-14 md:py-20 px-4"
      style={{ backgroundColor: '#012A9E' }}
      aria-labelledby="enrollment-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 100%, rgba(227,251,7,0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 0%, rgba(255,255,255,0.08), transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E3FB07]">
          Admisiones
        </p>
        <h2
          id="enrollment-cta-heading"
          className="mb-4 text-2xl font-extrabold leading-tight text-white md:text-4xl"
        >
          ¿Estás interesado en inscribir a tu hijo(a)?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
          Agenda una cita o escríbenos por WhatsApp. Te orientamos sobre kínder, primaria y
          secundaria bilingüe en Ciudad Madero.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/admisiones"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-[#E3FB07] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-black shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            Ver admisiones
          </Link>
          {/* 2026-08-21: Agendar cita → apartado examen de admisión. */}
          <Link
            href="/admisiones#examen-admision"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:border-[#E3FB07] hover:text-[#E3FB07]"
          >
            Agendar cita
          </Link>
        </div>
      </div>
    </section>
  )
}
