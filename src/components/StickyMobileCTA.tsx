// 2026-08-20: Hannia — CTA sticky móvil (Agenda cita), encima del FAB de WhatsApp.
import Link from 'next/link'
import { useRouter } from 'next/router'

const HIDDEN_ON = ['/contacto', '/admisiones']

export default function StickyMobileCTA() {
  const router = useRouter()
  const hide = HIDDEN_ON.some(
    (p) => router.pathname === p || router.pathname.startsWith(`${p}/`)
  )

  if (hide) return null

  return (
    <>
      {/* 2026-08-20: Espaciador para que el contenido no quede bajo la barra fija */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#013BDF]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2 pr-16">
          <Link
            href="/admisiones"
            className="flex-1 rounded-full border border-white/30 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white"
          >
            Admisiones
          </Link>
          {/* 2026-08-21: Agenda cita → apartado examen de admisión. */}
          <Link
            href="/admisiones#examen-admision"
            className="flex-[1.2] rounded-full bg-[#E3FB07] py-2.5 text-center text-xs font-bold uppercase tracking-wide text-black shadow-md"
          >
            Agenda cita
          </Link>
        </div>
      </div>
    </>
  )
}
