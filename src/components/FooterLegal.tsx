// 2026-09-30: Franja legal de los footers — incorporación SEP por nivel, aviso de privacidad
// y acceso a preferencias de cookies (permite revocar el consentimiento).
import Link from 'next/link'
import { LEGAL_ENTITY, PRIVACY_NOTICE_PATH, SCHOOL_INCORPORATIONS } from '@/lib/legal'
import { openCookiePreferences } from '@/lib/cookie-consent'

interface FooterLegalProps {
  compact?: boolean
}

export default function FooterLegal({ compact = false }: FooterLegalProps) {
  const textSize = compact ? 'text-[10px]' : 'text-[10px] sm:text-xs'

  return (
    <div className={`border-t border-white/20 ${compact ? 'pt-2' : 'pt-4'}`}>
      <ul className={`space-y-1 leading-snug text-white/85 ${textSize}`}>
        {SCHOOL_INCORPORATIONS.map((item) => (
          <li key={item.cct}>
            <span className="font-semibold text-white">
              {item.level}: CCT {item.cct}
            </span>{' '}
            — {item.text}
          </li>
        ))}
      </ul>
      <div
        className={`mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold uppercase tracking-wide ${textSize}`}
      >
        <span className="font-normal normal-case text-white/70">
          © {LEGAL_ENTITY.razonSocial}
        </span>
        <Link href={PRIVACY_NOTICE_PATH} className="transition-colors hover:text-[#E3FB07]">
          Aviso de privacidad
        </Link>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="uppercase tracking-wide transition-colors hover:text-[#E3FB07]"
        >
          Preferencias de cookies
        </button>
      </div>
    </div>
  )
}
