// 2026-08-21: Modal de inscripciones en cada recarga.
// 2026-10-13: El contenido del modal (reloj "30 años") se reemplaza por la imagen del Open House 21 nov 2026.
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { OPEN_HOUSE_FORM_URL } from '@/lib/open-house'

// 2026-10-13: El popup se abre en cuanto se entra al sitio (antes esperaba 12 s o scroll).
export default function CampaignModal() {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const dismiss = () => setOpen(false)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Open House 21 de noviembre de 2026"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 2026-10-13: La imagen lleva al formulario de registro del Open House. */}
        <a
          href={OPEN_HOUSE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="block"
        >
          <Image
            src="/images/open-house/open-house-popup.webp"
            alt="Open House Winston, 21 de noviembre de 2026, Primaria y Secundaria. Instituto de campeones."
            width={1744}
            height={1080}
            sizes="(min-width: 768px) 768px, 100vw"
            className="h-auto w-full"
          />
        </a>

        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-lg font-bold text-white transition hover:bg-black/65"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  )
}
