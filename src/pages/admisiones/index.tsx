// 2026-08-25: Hannia — /admisiones elevated 2026: hero mesh, timeline de pasos, requisitos y FAQ más editoriales.
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Seo from '@/components/Seo'
import AdmissionGuideSlot from '@/components/AdmissionGuideSlot'
import { SITE_ROUTES } from '@/lib/seo/routes'

const STEPS = [
  {
    n: '01',
    title: 'Agenda tu cita',
    desc: 'Completa el formulario de contacto o escríbenos por WhatsApp. Te respondemos pronto.',
    href: '/contacto',
    cta: 'Ir al formulario',
  },
  {
    n: '02',
    title: 'Conoce el instituto',
    desc: 'Te orientamos sobre el nivel, horarios y el proceso de ingreso de tu hijo(a).',
    href: '/oferta-educativa',
    cta: 'Ver oferta',
  },
  {
    n: '03',
    title: 'Registro y examen',
    desc: 'Registro para examen, documentación e inscripción en línea cuando indiquemos fechas.',
    href: 'https://agendaw.vercel.app/',
    cta: 'Registro examen',
    external: true,
  },
]

const LEVELS = [
  {
    id: 'kinder',
    name: 'Kínder',
    accent: '#013BDF',
    items: [
      'Acta de nacimiento del aspirante',
      'CURP del aspirante',
      'Identificación oficial del padre o tutor',
      'Comprobante de domicilio',
      'Fotografías tamaño infantil (según indicación de admisiones)',
    ],
  },
  {
    id: 'primaria',
    name: 'Primaria',
    accent: '#0A5CFF',
    items: [
      'Acta de nacimiento y CURP',
      'Boleta o constancia del ciclo anterior',
      'Carta de conducta / no adeudo (si aplica)',
      'Identificación del padre o tutor',
      'Comprobante de domicilio',
    ],
  },
  {
    id: 'secundaria',
    name: 'Secundaria',
    accent: '#012A9E',
    items: [
      'Acta de nacimiento y CURP',
      'Certificado o boletas de primaria / secundaria previa',
      'Carta de conducta / no adeudo (si aplica)',
      'Identificación del padre o tutor',
      'Comprobante de domicilio',
    ],
  },
]

const FAQS = [
  {
    q: '¿Cómo inicio el proceso de admisión?',
    a: 'Agenda una cita desde la página de contacto o por WhatsApp. Nuestro equipo te guía paso a paso según el nivel (kínder, primaria o secundaria).',
  },
  {
    q: '¿Hay examen de admisión?',
    a: 'Según el nivel y el ciclo, puede haber registro para examen. Puedes iniciar el registro en línea cuando te lo indiquemos o desde Servicios en línea.',
  },
  {
    q: '¿El instituto es bilingüe?',
    a: 'Sí. Ofrecemos formación bilingüe integral respaldada por University of Cambridge, con más de 30 años de experiencia en Cd. Madero.',
  },
  {
    q: '¿Cuáles son los horarios de atención?',
    a: 'Lunes a viernes de 7:00 am a 7:30 pm y sábado de 9:00 am a 1:00 pm. Teléfono: 833 437 8743.',
  },
  {
    q: '¿Dónde están?',
    a: 'Calle 3 #309, Col. Jardín 20 de Noviembre, Ciudad Madero, Tamaulipas. En Contacto tienes el mapa y la opción “Cómo llegar”.',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function AdmisionesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [openLevel, setOpenLevel] = useState<string | null>('primaria')
  const pageSeo = SITE_ROUTES.find((route) => route.path === '/admisiones')!

  return (
    <div className="admisiones-page overflow-x-hidden bg-[#FAFBFF]">
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />
      <Navigation currentSection={1} />

      {/* Hero 2026 */}
      <section className="relative overflow-hidden px-4 pb-20 pt-28 md:pb-28 md:pt-36">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 12% 15%, rgba(227,251,7,0.22) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 95% 85%, rgba(255,255,255,0.1) 0%, transparent 45%), linear-gradient(155deg, #013BDF 0%, #012A9E 55%, #011F75 100%)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E3FB07]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/90">
              Ciclo 2026-2027 · #soywinston
            </span>
          </motion.div>

          <motion.h1
            className="mb-5 text-5xl font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-white md:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
          >
            Admisiones
          </motion.h1>

          <motion.p
            className="mx-auto max-w-md text-sm text-white/85 md:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease }}
          >
            Agenda tu cita y continúa tu ingreso con nosotros.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease }}
          >
            <Link
              href="/admisiones#examen-admision"
              className="rounded-full bg-[#E3FB07] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#012A9E] shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
            >
              Agendar cita
            </Link>
            <a
              href="https://wa.me/528334378743"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/35 bg-white/5 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition hover:border-[#E3FB07] hover:text-[#E3FB07]"
            >
              WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Timeline de pasos */}
      <section className="relative px-4 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-[#F7F8FC] to-white" />
        <div
          className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: 'rgba(1,59,223,0.12)' }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            className="mb-14 text-center md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#013BDF]">
              Familia Winston
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              Continúa tu proceso aquí
            </h2>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#E3FB07]" />
          </motion.div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            <div
              className="pointer-events-none absolute left-[18%] right-[18%] top-[2.75rem] hidden h-[2px] md:block"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(1,59,223,0.25) 15%, rgba(1,59,223,0.25) 85%, transparent)',
              }}
              aria-hidden
            />

            {STEPS.map((step, i) => {
              const className =
                'group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white p-8 shadow-[0_20px_60px_rgba(1,59,223,0.08)] ring-1 ring-[#013BDF]/[0.06] transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(1,59,223,0.14)]'
              const inner = (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#013BDF] text-lg font-extrabold text-white shadow-lg shadow-[#013BDF]/35">
                      {step.n}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 transition group-hover:text-[#013BDF]/40">
                      Paso {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-extrabold leading-tight text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mb-10 flex-1 text-sm leading-relaxed text-gray-500">{step.desc}</p>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#013BDF] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition group-hover:bg-[#012A9E]">
                    {step.cta}
                    <span className="text-[#E3FB07] transition group-hover:translate-x-0.5">→</span>
                  </span>
                </>
              )

              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease }}
                >
                  {step.external ? (
                    <a href={step.href} target="_blank" rel="noopener noreferrer" className={className}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={step.href} className={className}>
                      {inner}
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="relative px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#013BDF]">
              Documentación
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Requisitos por nivel
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500">
              Consulta lo sugerido para cada etapa. La lista final la confirma admisiones.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {LEVELS.map((level, i) => {
              const open = openLevel === level.id
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  className={`overflow-hidden rounded-[1.35rem] bg-white ring-1 transition ${
                    open
                      ? 'shadow-[0_20px_50px_rgba(1,59,223,0.12)] ring-[#013BDF]/20'
                      : 'shadow-sm ring-gray-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenLevel(open ? null : level.id)}
                    className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left"
                    aria-expanded={open}
                  >
                    <div>
                      <h3 className="text-xl font-extrabold uppercase tracking-wide text-gray-900">
                        {level.name}
                      </h3>
                      <div
                        className="mt-2 h-1 w-12 rounded-full"
                        style={{ backgroundColor: level.accent }}
                      />
                    </div>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold transition ${
                        open ? 'bg-[#013BDF] text-white' : 'bg-[#E3FB07] text-[#012A9E]'
                      }`}
                    >
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-gray-50 px-6 pb-6 pt-2">
                      <ul className="space-y-3 text-sm text-gray-600">
                        {level.items.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#013BDF]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <a
              href="https://servicios-admin.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#013BDF] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#012A9E]"
            >
              Portal inscripciones / pagos
            </a>
            <Link
              href="/servicios-en-linea"
              className="rounded-full border border-[#013BDF]/30 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#013BDF] transition hover:bg-[#013BDF] hover:text-white"
            >
              Todos los servicios
            </Link>
            <Link
              href="/admisiones/requisitos"
              className="rounded-full bg-[#E3FB07] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#012A9E] transition hover:shadow-md"
            >
              Ver guía / requisitos
            </Link>
          </div>
        </div>
      </section>

      {/* Examen */}
      <section
        id="examen-admision"
        className="scroll-mt-28 relative overflow-hidden px-4 py-20 md:py-24"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(145deg, #013BDF 0%, #012A9E 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: '#E3FB07' }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E3FB07]">
            Ciclo escolar 2026-2027
          </p>
          <h2 className="mb-4 text-3xl font-extrabold uppercase tracking-wide text-white md:text-5xl">
            Examen de admisión
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-sm text-white/80 md:text-base">
            Agenda tu registro al examen en línea. Te orientamos sobre fechas, nivel y documentación.
          </p>
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <a
              href="https://agendaw.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#E3FB07] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#012A9E] shadow-lg transition hover:-translate-y-0.5"
            >
              Registro para examen
            </a>
            <Link
              href="/contacto"
              className="rounded-full border border-white/35 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-[#E3FB07] hover:text-[#E3FB07]"
            >
              Escribir a admisiones
            </Link>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/15 md:p-6">
            <AdmissionGuideSlot variant="compact" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-extrabold text-gray-900 md:text-4xl">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i
              return (
                <div
                  key={faq.q}
                  className={`overflow-hidden rounded-2xl bg-white transition ${
                    open
                      ? 'shadow-[0_12px_40px_rgba(1,59,223,0.1)] ring-1 ring-[#013BDF]/15'
                      : 'ring-1 ring-gray-100'
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-gray-900 md:text-lg">{faq.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                        open ? 'bg-[#013BDF] text-white' : 'bg-[#F7F8FC] text-[#013BDF]'
                      }`}
                    >
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && (
                    <p className="border-t border-gray-50 px-5 pb-5 pt-3 text-sm leading-relaxed text-gray-600 md:px-6">
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
