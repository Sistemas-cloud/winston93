// 2026-10-13: Banner fijo Open House (21 nov 2026) en la home, antes del slider "Forma parte".
// 2026-10-13: Banner y popup llevan al formulario de registro del Open House.
import Image from 'next/image'

export const OPEN_HOUSE_FORM_URL = 'https://open-house-chi.vercel.app/'

export const OPEN_HOUSE_ALT =
  'Open House Winston, 21 de noviembre de 2026, Primaria y Secundaria: recorridos guiados, inmersión educativa y actividades para papás y aspirantes.'

export default function OpenHouseSection() {
  return (
    <section
      aria-label="Open House 21 de noviembre de 2026"
      className="relative w-full overflow-hidden bg-[#E7E8E7] md:h-full md:pt-[72px]"
    >
      <h2 className="sr-only">Open House — 21 de noviembre de 2026, Primaria y Secundaria</h2>
      <a
        href={OPEN_HOUSE_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open House 21 de noviembre: regístrate (abre en una pestaña nueva)"
        className="relative block w-full md:h-full"
      >
        {/* En pantallas con proporción distinta a 16:9, el fondo difuminado rellena los costados sin recortar la imagen. */}
        <Image
          src="/images/open-house/open-house-banner.webp"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="hidden scale-110 object-cover blur-2xl md:block"
        />
        <Image
          src="/images/open-house/open-house-banner.webp"
          alt={OPEN_HOUSE_ALT}
          width={1920}
          height={1080}
          sizes="100vw"
          className="relative h-auto w-full md:h-full md:object-contain"
        />
      </a>
    </section>
  )
}
