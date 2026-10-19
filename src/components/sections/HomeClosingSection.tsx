// 2026-10-19: Cierre del home en FullPage — CTA + footer en un viewport (no se corta).
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function HomeClosingSection() {
  return (
    <div className="flex h-auto min-h-[100svh] w-full flex-col bg-[#012A9E] lg:h-full lg:overflow-hidden">
      <section
        className="relative shrink-0 overflow-hidden px-4 py-6 md:py-8"
        style={{ backgroundColor: '#012A9E' }}
        aria-labelledby="home-closing-cta-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 100%, rgba(227,251,7,0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 0%, rgba(255,255,255,0.08), transparent 50%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E3FB07]">
            Admisiones
          </p>
          <h2
            id="home-closing-cta-heading"
            className="mb-3 text-xl font-extrabold leading-tight text-white md:text-3xl"
          >
            ¿Estás interesado en inscribir a tu hijo(a)?
          </h2>
          <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-white/85">
            Agenda una cita o escríbenos por WhatsApp. Te orientamos sobre kínder, primaria
            y secundaria bilingüe en Ciudad Madero.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/admisiones"
              className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[#E3FB07] px-7 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-lg transition hover:scale-[1.02]"
            >
              Ver admisiones
            </Link>
            <Link
              href="/admisiones#examen-admision"
              className="inline-flex min-w-[180px] items-center justify-center rounded-full border-2 border-white/40 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:border-[#E3FB07] hover:text-[#E3FB07]"
            >
              Agendar cita
            </Link>
          </div>
        </div>
      </section>

      <div className="min-h-0 flex-1 lg:overflow-hidden">
        <Footer />
      </div>
    </div>
  )
}
