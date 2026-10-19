// 2026-10-19: Hannia — carrete de marcas con desvanecido lateral (tipografía hasta logos oficiales).
const MARCAS = [
  'UNE',
  'IEST Anáhuac',
  'Tecmilenio',
  'Pemex',
  'IMSS',
  'CFE',
  'Telmex',
  'Cambridge',
  'Narrative 4',
  'COPARMEX',
  'AMMJE',
] as const

export default function MarcasSection() {
  const loop = [...MARCAS, ...MARCAS]

  return (
    <section
      className="relative overflow-hidden py-10 md:py-12"
      style={{ backgroundColor: '#F9F9F9' }}
      aria-label="Empresas e instituciones con las que trabajamos"
    >
      <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#013BDF]">
        Marcas y socios
      </p>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F9F9F9] to-transparent md:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F9F9F9] to-transparent md:w-28"
          aria-hidden
        />

        <div className="wl-marcas-track flex w-max gap-10 px-6 md:gap-14">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 text-sm font-extrabold uppercase tracking-[0.18em] text-[#013BDF]/70 md:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .wl-marcas-track {
          animation: wlMarquee 42s linear infinite;
        }
        @keyframes wlMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wl-marcas-track { animation: none; }
        }
      `}</style>
    </section>
  )
}
