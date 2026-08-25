// 2026-08-25: Hannia — Oferta Educativa editorial 2026: frase por nivel, hover, CTA claro.
// Mismas fotos y enlaces; menos “plantilla flat”, más jerarquía Winston.
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import EnrollmentCTA from '@/components/EnrollmentCTA'

const LEVELS = [
  {
    name: 'Kínder',
    image: '/images/education/kinder.png',
    blurb: 'Primeros pasos en un entorno bilingüe lleno de curiosidad y cuidado.',
    accent: '#013BDF',
    link: 'https://educativo-winston.vercel.app/',
    external: true,
  },
  {
    name: 'Primaria',
    image: '/images/education/primaria.png',
    blurb: 'Bases académicas sólidas, valores y pensamiento crítico.',
    accent: '#E3FB07',
    link: '/primaria',
    external: false,
  },
  {
    name: 'Secundaria',
    image: '/images/education/secundaria.png',
    blurb: 'Preparación integral para el futuro con visión global.',
    accent: '#012A9E',
    link: '/secundaria',
    external: false,
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function OfertaEducativaSection({
  // 2026-08-15: En /oferta-educativa el título es H1; en home (sección) es H2.
  isPageTitle = false,
}: {
  isPageTitle?: boolean
}) {
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const TitleTag = isPageTitle ? 'h1' : 'h2'

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div ref={sectionRef} className="relative flex w-full min-h-screen flex-col bg-[#FAFBFF]">
      {/* Bloque oferta */}
      <section className="relative flex-1 overflow-hidden px-4 pb-16 pt-24 md:px-8 md:pb-20 md:pt-28">
        {/* Atmósfera suave */}
        <div
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: 'rgba(227,251,7,0.35)' }}
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-32 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: 'rgba(1,59,223,0.18)' }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center md:mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease }}
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#013BDF]">
              Instituto Winston Churchill
            </p>
            <TitleTag
              className="text-3xl font-extrabold uppercase leading-[0.95] tracking-wide text-[#013BDF] md:text-5xl lg:text-6xl"
            >
              <span className="font-semibold">Oferta</span>{' '}
              <span className="font-extrabold">educativa</span>
            </TitleTag>
            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#E3FB07]" />
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-500 md:text-base">
              Un camino bilingüe de Kínder a Secundaria. Conoce cada etapa y da el siguiente paso
              con la familia Winston.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {LEVELS.map((level, index) => {
              const cardClass =
                'group flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white shadow-[0_18px_50px_rgba(1,59,223,0.08)] ring-1 ring-[#013BDF]/[0.06] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(1,59,223,0.14)]'
              const inner = (
                <>
                  <div
                    className="relative flex aspect-[4/5] items-end justify-center overflow-hidden px-4 pt-8"
                    style={{
                      background: `linear-gradient(180deg, ${level.accent}14 0%, #F7F8FC 55%, #FFFFFF 100%)`,
                    }}
                  >
                    <Image
                      src={level.image}
                      alt={`Estudiantes de ${level.name} — Instituto Winston Churchill`}
                      width={420}
                      height={520}
                      className="relative z-10 h-auto max-h-[92%] w-auto max-w-full object-contain transition duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 90vw, 33vw"
                      priority={index === 0}
                    />
                    {/* Franja inferior de color marca */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1.5 transition-all duration-500 group-hover:h-2"
                      style={{ backgroundColor: level.accent === '#E3FB07' ? '#013BDF' : level.accent }}
                    />
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-6 pt-5 md:px-6">
                    <h3 className="text-xl font-extrabold uppercase tracking-wide text-gray-900 md:text-2xl">
                      {level.name}
                    </h3>
                    <div
                      className="my-3 h-1 w-12 rounded-full"
                      style={{
                        backgroundColor: level.accent === '#E3FB07' ? '#E3FB07' : level.accent,
                      }}
                    />
                    <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-500">{level.blurb}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#013BDF] transition group-hover:gap-2.5">
                      Explorar nivel
                      <span className="text-[#E3FB07]">→</span>
                    </span>
                  </div>
                </>
              )

              return (
                <motion.div
                  key={level.name}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease }}
                >
                  {level.external ? (
                    <a href={level.link} target="_blank" rel="noopener noreferrer" className={cardClass}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={level.link} className={cardClass}>
                      {inner}
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* 2026-08-25: Sin CTAs aquí — evita duplicar EnrollmentCTA (footer azul). */}
        </div>
      </section>

      <EnrollmentCTA />

      {/* Footer de sección (compacto) — se mantiene para no romper home / oferta */}
      <div className="flex-shrink-0">
        <footer
          className={`relative overflow-hidden text-white ${isMobile ? 'h-[170px]' : 'h-[24vh]'}`}
        >
          <div className="absolute inset-0" style={{ backgroundColor: '#013BDF' }} />

          {isMobile ? (
            <div className="relative z-10 flex h-full flex-col justify-between px-4 py-2">
              <div className="flex-1">
                <div className="mb-3 flex items-center">
                  <img src="/images/logos/logo_winston.png" alt="Winston" width={60} height={16} className="h-4 w-auto" />
                </div>
                <h2 className="mb-2 text-[9px] font-extrabold uppercase leading-tight tracking-wide">
                  WORKING FOR BRIGHTER FUTURES
                </h2>
                <p className="mb-3 text-[7px] opacity-90">#soywinston</p>
                <div className="space-y-1 text-[7px] leading-relaxed">
                  <p>CALLE 3 #309</p>
                  <p>COL. JARDÍN 20 DE NOVIEMBRE,</p>
                  <p>CD. MADERO TAMPS.</p>
                  <p className="mt-3 font-semibold">
                    <a href="tel:8334378743" className="transition-colors hover:text-yellow-400">
                      📞 833 437 8743
                    </a>
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-col items-center space-y-2">
                <a href="#" className="block text-[6px] font-medium uppercase tracking-wide transition-colors hover:text-yellow-400">
                  AVISO DE PRIVACIDAD
                </a>
                <div className="flex items-center gap-2">
                  <a href="https://www.facebook.com/institutowinstonchurchill/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://wa.me/528334378743" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30">
                    <span className="sr-only">WhatsApp</span>
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.815 0 0020.885 3.488"/></svg>
                  </a>
                  <a href="https://www.instagram.com/institutowinstonchurchill/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 container mx-auto px-4 py-4 sm:px-6 md:px-10 md:py-6">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center md:mb-4">
                  <img src="/images/logos/logo_winston.png" alt="Winston" width={70} height={19} className="h-5 w-auto md:h-6" />
                </div>
                <h2 className="mb-1 text-xs font-extrabold uppercase leading-snug tracking-wide sm:text-sm md:mb-2 md:text-base">
                  WORKING FOR BRIGHTER FUTURES
                </h2>
                <p className="mb-3 text-[10px] opacity-90 sm:text-xs md:mb-4">#soywinston</p>
                <div className="space-y-0.5 text-[10px] leading-relaxed sm:space-y-1 sm:text-xs md:text-sm">
                  <p>CALLE 3 #309</p>
                  <p>COL. JARDÍN 20 DE NOVIEMBRE,</p>
                  <p>CD. MADERO TAMPS.</p>
                  <p className="mt-2 font-semibold sm:mt-3">
                    <a href="tel:8334378743" className="transition-colors hover:text-yellow-400">
                      📞 833 437 8743
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isMobile && (
            <>
              <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-24">
                <a href="https://www.facebook.com/institutowinstonchurchill/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://wa.me/528334378743" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.815 0 0020.885 3.488"/></svg>
                </a>
                <a href="https://www.instagram.com/institutowinstonchurchill/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
              <a
                href="#"
                className="absolute bottom-24 right-4 z-20 text-[8px] font-semibold uppercase tracking-wide transition-colors hover:text-yellow-400 sm:text-[10px] md:bottom-28 md:right-10"
              >
                AVISO DE PRIVACIDAD
              </a>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}
