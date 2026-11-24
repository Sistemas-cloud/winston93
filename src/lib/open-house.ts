// 2026-10-13: Datos del Open House 21 nov 2026 compartidos por el popup y el carrusel de la home.
export const OPEN_HOUSE_FORM_URL = 'https://open-house-chi.vercel.app/'

// 2026-11-24: El popup se oculta y vuelve a abrirse desde el 15 de enero de 2027 (hora de México).
export const CAMPAIGN_POPUP_VISIBLE_FROM = '2027-01-15'

export function isCampaignPopupVisible(now: Date = new Date()): boolean {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  return today >= CAMPAIGN_POPUP_VISIBLE_FROM
}

// 2026-10-14: Banner actualizado (sin texto sobre el edificio); nombre nuevo para no servir la versión en caché.
export const OPEN_HOUSE_BANNER_SRC = '/images/open-house/open-house-banner-v2.webp'

export const OPEN_HOUSE_ALT =
  'Open House Winston, 21 de noviembre de 2026, Primaria y Secundaria: recorridos guiados, inmersión educativa y actividades para papás y aspirantes.'
