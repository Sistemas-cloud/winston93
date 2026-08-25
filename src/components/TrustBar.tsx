// 2026-08-20: Hannia — barra de confianza bajo el hero (credenciales institucionales).
// 2026-08-21: Se elimina Oxford; se mantiene Cambridge y campus local.
const ITEMS = [
  { label: '30+ años', sub: 'de experiencia' },
  { label: 'Bilingüe', sub: 'formación integral' },
  { label: 'Cambridge', sub: 'University' },
  { label: 'Cd. Madero', sub: 'Tamaulipas' },
]

export default function TrustBar() {
  return (
    <section
      className="relative z-20 border-y border-white/10"
      style={{ backgroundColor: '#012A9E' }}
      aria-label="Credenciales del instituto"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center px-4 py-5 text-center md:py-6"
          >
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#E3FB07] md:text-base">
              {item.label}
            </p>
            <p className="mt-0.5 text-xs text-white/80 md:text-sm">{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
