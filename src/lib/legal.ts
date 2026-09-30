// 2026-09-30: Datos legales e incorporación SEP del Instituto Winston Churchill (fuente única
// para aviso de privacidad, footers y formularios). Datos proporcionados por la institución.

export const PRIVACY_NOTICE_PATH = '/aviso-de-privacidad' as const

export const LEGAL_ENTITY = {
  razonSocial: 'Instituto Winston Churchill, A.C.',
  razonSocialUpper: 'INSTITUTO WINSTON CHURCHILL, A.C.',
  rfc: 'IWC990723LX1',
  domicilio:
    'Calle 3 No. 309, Col. Jardín 20 de Noviembre, C.P. 89440, Ciudad Madero, Tamaulipas',
  privacyEmail: 'direccion.primaria@winston93.edu.mx',
  phone: '833 437 8743',
  phoneHref: 'tel:+528334378743',
} as const

export const PRIVACY_NOTICE_UPDATED_AT = '30 de septiembre de 2026' as const

export interface SchoolIncorporation {
  level: 'Primaria' | 'Secundaria'
  cct: string
  text: string
}

export const SCHOOL_INCORPORATIONS: readonly SchoolIncorporation[] = [
  {
    level: 'Primaria',
    cct: '28PPR0160V',
    text: 'Escuela incorporada a la Secretaría de Educación del Estado de Tamaulipas, según Acuerdo Gubernamental No. 9905269 del 24 de octubre de 1999.',
  },
  {
    level: 'Secundaria',
    cct: '28PES0124J',
    text: 'Escuela incorporada a la Secretaría de Educación del Estado de Tamaulipas.',
  },
] as const

export const SIMPLIFIED_PRIVACY_NOTICE =
  'Los datos personales recabados serán tratados por Instituto Winston Churchill, A.C. para atención de informes y trámites escolares.' as const
