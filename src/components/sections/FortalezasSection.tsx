// 2026-10-19: Por qué Winston — cabecera, bento y Winston USA.
// Pages Router, sin librerías nuevas. Tipografía de marca: Poppins.
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'

const TITLE = 'Programa académico, cimentado en tecnología, innovación y emprendimiento'
const LANGS = ['Español', 'English', 'Français'] as const
const LEVELS = ['Maternal', 'Kínder', 'Primaria', 'Secundaria'] as const
// 2026-10-19: video público de servicios (usa_programa_config, ciclo 23). Sin montos.
const USA_VIDEO =
  'https://g4ta4bfg.us-east.insforge.app/api/storage/buckets/winston-usa-video/objects/ciclo-23%2Fb63e6369-d262-4329-872d-e9e0cb85aaf8.mp4'
const USA_BENEFICIOS = [
  {
    icon: 'award' as const,
    titulo: 'Doble titulación',
    texto: 'Opción del Instituto Winston Churchill.',
  },
  {
    icon: 'globe' as const,
    titulo: 'Documentación estadounidense',
    texto: 'Reconocimiento académico de sus estudios.',
  },
  {
    icon: 'check' as const,
    titulo: 'Institución acreditada',
    texto: 'Respaldo oficial para su expediente.',
  },
] as const
const USA_TITLE = 'Winston USA Program'
const USA_CLOSE = new Date('2027-02-28T23:59:59')
// 2026-10-19: póster 4:5 (960×1200) recortado de mindfulness — cabe en el arco sin repetir Fortalezas.
const USA_POSTER = '/images/winston-usa/poster.webp'

function daysUntilClose(now = new Date()): number {
  return Math.ceil((USA_CLOSE.getTime() - now.getTime()) / 86_400_000)
}

export default function FortalezasSection() {
  const rootRef = useRef<HTMLElement>(null)
  const bentoRef = useRef<HTMLDivElement>(null)
  const usaRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [inView, setInView] = useState(false)
  const [cardsIn, setCardsIn] = useState(false)
  const [usaIn, setUsaIn] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [lang, setLang] = useState(0)
  const [langOut, setLangOut] = useState(false)
  const [usaModal, setUsaModal] = useState<null | 'info' | 'video'>(null)
  const [daysLeft, setDaysLeft] = useState<number | null | undefined>(undefined)
  const videoRef = useRef<HTMLVideoElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(reduce)
    if (reduce) {
      setInView(true)
      setCardsIn(true)
    }
    const root = rootRef.current
    const bento = bentoRef.current
    if (!root || reduce) return
    const head = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          head.disconnect()
        }
      },
      { threshold: 0.01 }
    )
    head.observe(root)
    let cards: IntersectionObserver | null = null
    if (bento) {
      cards = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCardsIn(true)
            cards?.disconnect()
          }
        },
        { threshold: 0.01 }
      )
      cards.observe(bento)
    }
    return () => {
      head.disconnect()
      cards?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setLangOut(true)
      window.setTimeout(() => {
        setLang((current) => (current + 1) % LANGS.length)
        setLangOut(false)
      }, 380)
    }, 2200)
    return () => window.clearInterval(id)
  }, [reduced])

  useEffect(() => {
    const usa = usaRef.current
    if (!usa) return
    if (reduced) {
      setUsaIn(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setUsaIn(true)
        io.disconnect()
      },
      { threshold: 0.3 }
    )
    io.observe(usa)
    return () => io.disconnect()
  }, [reduced])

  useEffect(() => {
    const tick = () => {
      const days = daysUntilClose()
      setDaysLeft(days < 0 ? null : days)
    }
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!usaModal) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUsaModal(null)
    }
    window.addEventListener('keydown', onKey)
    const video = videoRef.current
    if (usaModal === 'video') {
      if (!reduced) video?.play().catch(() => {})
    }
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      if (video) {
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
      openerRef.current?.focus()
    }
  }, [usaModal, reduced])

  const openUsa = (mode: 'info' | 'video', el: HTMLElement) => {
    openerRef.current = el
    setUsaModal(mode)
  }

  const onUsaMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const media = event.currentTarget.querySelector<HTMLElement>('.fw-usa-media')
    if (!media) return
    const rect = media.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 16
    media.style.setProperty('--px', `${Math.max(-8, Math.min(8, x))}px`)
    media.style.setProperty('--py', `${Math.max(-8, Math.min(8, y))}px`)
  }

  const onUsaLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
    const media = event.currentTarget.querySelector<HTMLElement>('.fw-usa-media')
    media?.style.setProperty('--px', '0px')
    media?.style.setProperty('--py', '0px')
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const points = Array.from({ length: 16 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
    }))
    let frame = 0
    let running = false
    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const ratio = window.devicePixelRatio || 1
      if (canvas.width !== Math.floor(width * ratio)) {
        canvas.width = Math.floor(width * ratio)
        canvas.height = Math.floor(height * ratio)
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.clearRect(0, 0, width, height)
      points.forEach((point) => {
        point.x += point.vx
        point.y += point.vy
        if (point.x < 0 || point.x > 1) point.vx *= -1
        if (point.y < 0 || point.y > 1) point.vy *= -1
      })
      ctx.strokeStyle = 'rgba(255,255,255,.35)'
      ctx.fillStyle = 'rgba(255,255,255,.8)'
      ctx.lineWidth = 1
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const dx = (points[i].x - points[j].x) * width
          const dy = (points[i].y - points[j].y) * height
          if (dx * dx + dy * dy < 140 * 140) {
            ctx.beginPath()
            ctx.moveTo(points[i].x * width, points[i].y * height)
            ctx.lineTo(points[j].x * width, points[j].y * height)
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(points[i].x * width, points[i].y * height, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
      if (running) frame = requestAnimationFrame(draw)
    }
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running) frame = requestAnimationFrame(draw)
      else cancelAnimationFrame(frame)
    })
    io.observe(canvas)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [reduced])

  const onCardMove = (event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    event.currentTarget.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <section
      ref={rootRef}
      className={`fw${inView ? ' is-in' : ''}${cardsIn ? ' is-cards' : ''}${reduced ? ' is-reduced' : ''}`}
      aria-labelledby="fortalezas-heading"
    >
      <div className="fw-drift" aria-hidden />

      <div className="fw-wrap">
        <div className="fw-head">
          <div>
            <p className="fw-eyebrow">Por qué Winston</p>
            <h2 id="fortalezas-heading" className="fw-title">
              {TITLE.split(' ').map((word) => (
                <span className="fw-mask" key={word}>
                  <span className="fw-word">{word}</span>
                </span>
              ))}
            </h2>
            <p className="fw-lead">
              Formamos con propósito: academia sólida, herramientas digitales y espíritu
              emprendedor — en Ciudad Madero, con visión internacional.
            </p>
          </div>
          <div className="fw-photo">
            <div className="fw-halo" aria-hidden />
            <div className="fw-arch">
              <Image
                src="/images/slider/SLIDE_INICIO_1-1280.webp"
                alt="Alumnos del Instituto Winston Churchill en el campus"
                fill
                sizes="(max-width: 900px) 100vw, 420px"
                className="fw-arch-img"
              />
            </div>
            <span className="fw-chip fw-chip-a">IA en el aula</span>
            <span className="fw-chip fw-chip-b">Trilingüe</span>
          </div>
        </div>

        <div ref={bentoRef} className="fw-bento">
          <article className="fw-card fw-ia" onMouseMove={onCardMove}>
            <canvas ref={canvasRef} className="fw-net" aria-hidden />
            <Icon name="ia" />
            <h3>Modelo avanzado con IA</h3>
            <p>
              Enseñanza potenciada con inteligencia artificial: pensamiento crítico, creatividad y
              herramientas del futuro desde edades tempranas.
            </p>
          </article>

          <article className="fw-card fw-tri" onMouseMove={onCardMove}>
            <Icon name="lang" />
            <h3>Formación trilingüe</h3>
            {reduced ? (
              <p className="fw-lang-static">Español, English, Français</p>
            ) : (
              <p className={`fw-lang${langOut ? ' is-out' : ' is-in'}`} aria-hidden>
                <span>{LANGS[lang]}</span>
              </p>
            )}
            <p>
              Inmersión en español e inglés, con francés en secundaria. Comunicación real para un
              mundo global.
            </p>
          </article>

          <article className="fw-card fw-inst" onMouseMove={onCardMove}>
            <Image
              src="/images/facilities/fondo_escuela-1280.webp"
              alt="Campus del Instituto Winston Churchill"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="fw-inst-img"
            />
            <div className="fw-inst-shade" aria-hidden />
            <Icon name="home" />
            <h3>Instalaciones que cuidan</h3>
            <p>
              Campus climatizado, circuito cerrado y estancias extendidas para que las familias
              confíen el día completo.
            </p>
            <ul>
              <li>Campus climatizado</li>
              <li>Circuito cerrado</li>
              <li>Estancias extendidas</li>
            </ul>
          </article>

          <article className="fw-card fw-comp" onMouseMove={onCardMove}>
            <Icon name="trophy" />
            <h3>Competencias que inspiran</h3>
            <p>
              Participación en competencias nacionales, estatales y regionales que fortalecen
              carácter y excelencia.
            </p>
          </article>
        </div>
      </div>

      <div
        ref={usaRef}
        id="winston-usa"
        className={`fw-usa${usaIn ? ' is-on' : ''}${reduced ? ' is-reduced' : ''}`}
        onMouseMove={onUsaMove}
        onMouseLeave={onUsaLeave}
      >
        <div className="fw-usa-glow" aria-hidden />
        <div className="fw-usa-inner">
          <div className="fw-usa-copy">
            <div className="fw-usa-eyebrow">
              <span className="fw-usa-eyebrow-text">Doble titulación</span>
              <span className="fw-usa-pill">Opcional</span>
            </div>
            <h3 className="fw-usa-title">
              {USA_TITLE.split(' ').map((word) => (
                <span className="fw-usa-mask" key={word}>
                  <span className="fw-usa-word">{word}</span>
                </span>
              ))}
            </h3>
            <p className="fw-usa-lead">
              Documentación académica estadounidense respaldada por una institución acreditada, para
              fortalecer el expediente de tu hijo con proyección internacional.
            </p>
            <div className="fw-usa-glass">
              {daysLeft === null ? (
                <p className="fw-usa-glass-text">Inscripciones cerradas</p>
              ) : (
                <>
                  <p className="fw-usa-glass-text">Inscripciones hasta el 28 de febrero de 2027</p>
                  {typeof daysLeft === 'number' ? (
                    <p className="fw-usa-count" aria-live="polite">
                      <span className="fw-usa-days">{daysLeft}</span>
                      <span className="fw-usa-days-label">días</span>
                    </p>
                  ) : null}
                </>
              )}
            </div>
            <p className="fw-usa-meta">
              Maternal, kínder, primaria y secundaria. No es obligatorio.
            </p>
            <ol className="fw-track" aria-label="Niveles del programa">
              <span className="fw-track-line" aria-hidden>
                <i />
              </span>
              {LEVELS.map((level) => (
                <li key={level}>
                  <span className="fw-dot" aria-hidden />
                  {level}
                </li>
              ))}
            </ol>
            <div className="fw-actions">
              <button
                type="button"
                className="fw-btn fw-btn-solid"
                onClick={(e) => openUsa('info', e.currentTarget)}
              >
                Conoce el programa
                <span className="fw-arrow" aria-hidden />
              </button>
              <button
                type="button"
                className="fw-btn fw-btn-ghost"
                onClick={(e) => openUsa('video', e.currentTarget)}
              >
                Ver video
                <span className="fw-arrow" aria-hidden />
              </button>
            </div>
          </div>

          <div className="fw-usa-media">
            <div className="fw-usa-halo" aria-hidden />
            {/* TODO(2026-10-19): reemplazar por imagen real de diploma/transcript USA. */}
            <div className="fw-usa-doc" aria-hidden>
              <span />
              <span />
              <span />
              <span />
            </div>
            <button
              type="button"
              className="fw-usa-card"
              aria-label="Ver video Winston USA Program"
              onClick={(e) => openUsa('video', e.currentTarget)}
            >
              <Image
                src={USA_POSTER}
                alt="Vista previa del video Winston USA Program"
                fill
                sizes="(max-width: 900px) 340px, 420px"
                className="fw-usa-poster"
              />
              <span className="fw-usa-shade" aria-hidden />
              <span className="fw-usa-play" aria-hidden>
                <span className="fw-usa-play-ring" />
                <span className="fw-usa-play-core">
                  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
                  </svg>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {usaModal
        ? createPortal(
            <div className="fw-modal-overlay" role="presentation" onClick={() => setUsaModal(null)}>
              <div
                className={`fw-modal${usaModal === 'video' ? ' is-video' : ' is-info'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="fw-usa-dialog-title"
                onClick={(e) => e.stopPropagation()}
              >
                <button type="button" className="fw-modal-x" onClick={() => setUsaModal(null)} aria-label="Cerrar">
                  ×
                </button>
                {usaModal === 'video' ? (
                  <div className="fw-modal-video">
                    <video
                      ref={videoRef}
                      src={USA_VIDEO}
                      controls
                      playsInline
                      autoPlay={!reduced}
                      preload="metadata"
                      title="Video Winston USA Program"
                      poster={USA_POSTER}
                    />
                    <p id="fw-usa-dialog-title" className="fw-modal-video-caption">
                      Winston USA Program
                    </p>
                  </div>
                ) : (
                  <>
                    <header className="fw-modal-hero">
                      <span className="fw-modal-emblem" aria-hidden>
                        <svg viewBox="0 0 40 40" width="34" height="34" fill="none">
                          <path
                            d="M8 14h24v4c0 6.6-5.4 12-12 12S8 24.6 8 18v-4Z"
                            stroke="#0A1240"
                            strokeWidth="1.8"
                          />
                          <path d="M8 14 20 8l12 6" stroke="#0A1240" strokeWidth="1.8" strokeLinejoin="round" />
                          <path d="M14 34h12M20 30v4" stroke="#0A1240" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </span>
                      <p className="fw-modal-kicker">Winston USA Program</p>
                      <h3 id="fw-usa-dialog-title">Doble titulación, si la familia lo desea</h3>
                      <ul className="fw-modal-levels" aria-label="Niveles cubiertos">
                        {LEVELS.map((level) => (
                          <li key={level}>{level}</li>
                        ))}
                      </ul>
                    </header>
                    <div className="fw-modal-body">
                      <p className="fw-modal-lead">
                        El Programa USA es una opción de doble titulación del Instituto Winston Churchill:
                        los estudios del alumno se integran a un proceso de reconocimiento académico que
                        permite contar con documentación estadounidense respaldada por una institución
                        acreditada.
                      </p>
                      <ul className="fw-modal-list">
                        {USA_BENEFICIOS.map((item) => (
                          <li key={item.titulo}>
                            <span className="fw-modal-ico" aria-hidden>
                              <UsaBenefitIcon name={item.icon} />
                            </span>
                            <span>
                              <strong>{item.titulo}</strong>
                              <small>{item.texto}</small>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="fw-modal-note">
                        <strong>No es obligatorio.</strong> La familia participa solo si lo desea. Cubre
                        maternal, kínder, primaria y secundaria. Inscripciones abiertas hasta el 28 de
                        febrero de 2027.
                      </p>
                    </div>
                    <footer className="fw-modal-foot">
                      <Link href="/contacto" className="fw-btn fw-btn-solid" onClick={() => setUsaModal(null)}>
                        Agenda una visita
                        <span className="fw-arrow" aria-hidden />
                      </Link>
                      <div className="fw-modal-links">
                        <Link href="/programas#tecnologia-innovacion" onClick={() => setUsaModal(null)}>
                          Tecnología e innovación
                        </Link>
                        <Link href="/programas#finanzas-emprendimiento" onClick={() => setUsaModal(null)}>
                          Finanzas y emprendimiento
                        </Link>
                      </div>
                    </footer>
                  </>
                )}
              </div>
            </div>,
            document.body
          )
        : null}

      <style jsx global>{`
        .fw {
          --fw-blue: #1546e8;
          --fw-ink: #0a1240;
          --fw-lime: #dfff00;
          --fw-cyan: #00d8ff;
          --fw-body: #3d4670;
          --fw-ease: cubic-bezier(.16,1,.3,1);
          position: relative;
          overflow-x: hidden;
          background: #fff;
          color: var(--fw-ink);
          font-family: var(--font-poppins), Poppins, sans-serif;
          padding: 6.5rem 0 0;
          scroll-margin-top: 96px;
        }
        .fw-drift {
          position: absolute;
          z-index: 0;
          left: -80px;
          bottom: 8%;
          width: 280px;
          height: 280px;
          border-radius: 999px;
          background: var(--fw-lime);
          filter: blur(90px);
          opacity: .3;
          pointer-events: none;
          animation: fwDrift 18s ease-in-out infinite alternate;
        }
        @keyframes fwDrift {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(40px,-28px,0); }
        }
        .fw-wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 1.25rem 4rem; }
        .fw-head {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 2.5rem;
          align-items: center;
          margin-bottom: 3rem;
        }
        .fw-eyebrow {
          margin: 0 0 .8rem;
          color: var(--fw-blue);
          font-size: .95rem;
          font-weight: 700;
          scroll-margin-top: 96px;
        }
        .fw-title {
          margin: 0;
          max-width: 16ch;
          color: var(--fw-ink);
          font-weight: 800;
          font-size: clamp(2.2rem, 4.6vw, 3.8rem);
          line-height: 1.04;
          letter-spacing: -0.03em;
        }
        .fw-mask { display: inline-block; overflow: hidden; margin-right: .28em; vertical-align: bottom; }
        .fw-word {
          display: inline-block;
          transform: translateY(105%);
          transition: transform 1s var(--fw-ease);
        }
        .fw.is-in .fw-word { transform: translateY(0); }
        .fw.is-in .fw-mask:nth-child(2) .fw-word { transition-delay: .06s; }
        .fw.is-in .fw-mask:nth-child(3) .fw-word { transition-delay: .12s; }
        .fw.is-in .fw-mask:nth-child(4) .fw-word { transition-delay: .18s; }
        .fw.is-in .fw-mask:nth-child(5) .fw-word { transition-delay: .24s; }
        .fw.is-in .fw-mask:nth-child(6) .fw-word { transition-delay: .3s; }
        .fw.is-in .fw-mask:nth-child(7) .fw-word { transition-delay: .36s; }
        .fw.is-in .fw-mask:nth-child(8) .fw-word { transition-delay: .42s; }
        .fw-lead {
          max-width: 46ch;
          margin: 1.1rem 0 0;
          color: var(--fw-body);
          font-size: 1.05rem;
          line-height: 1.6;
        }
        .fw-photo { position: relative; }
        .fw-halo, .fw-arch { border-radius: 200px 200px 24px 24px; aspect-ratio: 4/5; }
        .fw-halo {
          position: absolute;
          inset: 0;
          background: var(--fw-lime);
          transform: translate(18px, 18px);
        }
        .fw-arch {
          position: relative;
          overflow: hidden;
          clip-path: inset(100% 0 0 0 round 200px 200px 24px 24px);
          transition: clip-path 1.2s var(--fw-ease);
        }
        .fw.is-in .fw-arch { clip-path: inset(0 round 200px 200px 24px 24px); }
        .fw-arch-img { object-fit: cover; object-position: center 30%; }
        .fw-chip {
          position: absolute;
          z-index: 2;
          padding: .45rem .8rem;
          border: 1px solid #e3e8fb;
          border-radius: 999px;
          background: rgba(255,255,255,.82);
          color: var(--fw-ink);
          font-size: .82rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
          animation: fwChip 6s ease-in-out infinite alternate;
        }
        .fw-chip-a { left: -8px; top: 18%; }
        .fw-chip-b { right: 8%; bottom: 16%; animation-delay: -2.4s; }
        @keyframes fwChip {
          from { transform: translateY(-8px); }
          to { transform: translateY(8px); }
        }
        .fw-bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
        .fw-card {
          position: relative;
          overflow: hidden;
          min-height: 220px;
          padding: 32px;
          border: 1px solid #e3e8fb;
          border-radius: 28px;
          background: #f6f8ff;
          clip-path: inset(0 0 100% 0 round 28px);
          transition: clip-path 1s var(--fw-ease), transform .45s var(--fw-ease), box-shadow .45s var(--fw-ease);
        }
        .fw.is-cards .fw-card { clip-path: inset(0 round 28px); }
        .fw.is-cards .fw-card:nth-child(2) { transition: clip-path 1s var(--fw-ease) .12s, transform .45s var(--fw-ease), box-shadow .45s var(--fw-ease); }
        .fw.is-cards .fw-card:nth-child(3) { transition: clip-path 1s var(--fw-ease) .24s, transform .45s var(--fw-ease), box-shadow .45s var(--fw-ease); }
        .fw.is-cards .fw-card:nth-child(4) { transition: clip-path 1s var(--fw-ease) .36s, transform .45s var(--fw-ease), box-shadow .45s var(--fw-ease); }
        .fw-card:hover { transform: translateY(-4px); box-shadow: 0 30px 60px -30px rgba(21,70,232,.35); }
        .fw-card::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(400px circle at var(--mx, 50%) var(--my, 20%), rgba(21,70,232,.10), transparent 60%);
        }
        .fw-card h3 { position: relative; margin: 2.4rem 0 .6rem; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.03em; }
        .fw-card p { position: relative; max-width: 46ch; margin: 0; color: var(--fw-body); font-size: 1rem; line-height: 1.6; }
        .fw-ia { grid-column: span 4; grid-row: span 2; background: var(--fw-blue); color: #fff; min-height: 360px; }
        .fw-ia p { color: #dce4ff; }
        .fw-net { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .35; }
        .fw-tri { grid-column: span 2; }
        .fw-lang, .fw-lang-static {
          position: relative;
          height: 1.15em;
          margin: 0 0 .6rem;
          overflow: hidden;
          color: var(--fw-blue);
          font-size: clamp(1.6rem, 2vw, 2rem);
          font-weight: 800;
        }
        .fw-lang span {
          display: block;
          transform: translateY(105%);
          transition: transform .45s var(--fw-ease);
        }
        .fw-lang.is-in span { transform: translateY(0); }
        .fw-lang.is-out span { transform: translateY(-105%); }
        .fw-lang-static { height: auto; }
        .fw-inst, .fw-comp { grid-column: span 3; }
        .fw-inst { color: #fff; min-height: 280px; }
        .fw-inst-img { object-fit: cover; }
        .fw-inst-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10,18,64,.25), rgba(10,18,64,.78));
        }
        .fw-inst h3, .fw-inst p, .fw-inst ul, .fw-inst .fw-icon { position: relative; color: #fff; }
        .fw-inst p { color: #e7ecff; }
        .fw-inst ul { position: relative; display: flex; flex-wrap: wrap; gap: .45rem; margin: 1rem 0 0; padding: 0; list-style: none; }
        .fw-inst li {
          padding: .35rem .7rem;
          border-radius: 999px;
          background: rgba(255,255,255,.16);
          font-size: .82rem;
          font-weight: 700;
        }
        .fw-comp { background: var(--fw-lime); }
        .fw-comp p { color: var(--fw-ink); }
        .fw-comp:hover .fw-icon { transform: rotate(-8deg); }
        .fw-icon { position: absolute; top: 28px; left: 28px; width: 40px; height: 40px; transition: transform .45s var(--fw-ease); }
        .fw-usa {
          position: relative;
          overflow: hidden;
          margin-top: 1rem;
          padding: 96px 1.25rem;
          border-radius: 40px;
          background: #1546e8;
          color: #fff;
        }
        .fw-usa-glow {
          position: absolute;
          z-index: 0;
          left: 12%;
          top: 18%;
          width: 360px;
          height: 360px;
          border-radius: 999px;
          background: #dfff00;
          filter: blur(100px);
          opacity: .25;
          pointer-events: none;
          animation: fwDrift 18s ease-in-out infinite alternate;
        }
        .fw-usa-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 2.5rem;
          align-items: center;
          max-width: 1180px;
          margin: 0 auto;
        }
        .fw-usa-eyebrow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: .55rem;
          margin: 0 0 .7rem;
        }
        .fw-usa-eyebrow-text {
          color: #dfff00;
          font-size: .95rem;
          font-weight: 700;
        }
        .fw-usa-pill {
          display: inline-flex;
          align-items: center;
          height: 24px;
          padding: 4px 10px;
          border: 1px solid rgba(255,255,255,.4);
          border-radius: 999px;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .02em;
        }
        .fw-usa-title {
          margin: 0;
          max-width: 12ch;
          color: #fff;
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .fw-usa-mask {
          display: inline-block;
          overflow: hidden;
          margin-right: .28em;
          vertical-align: bottom;
        }
        .fw-usa-word {
          display: inline-block;
          transform: translateY(105%);
          transition: transform 1s var(--fw-ease);
        }
        .fw-usa.is-on .fw-usa-word { transform: translateY(0); }
        .fw-usa.is-on .fw-usa-mask:nth-child(2) .fw-usa-word { transition-delay: .1s; }
        .fw-usa.is-on .fw-usa-mask:nth-child(3) .fw-usa-word { transition-delay: .2s; }
        .fw-usa-lead {
          max-width: 46ch;
          margin: 1.1rem 0 0;
          color: #dce4ff;
          font-size: 18px;
          line-height: 1.6;
        }
        .fw-usa-glass {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: .85rem 1.2rem;
          max-width: 46ch;
          margin-top: 1.25rem;
          padding: 16px 20px;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          backdrop-filter: blur(12px);
        }
        .fw-usa-glass-text {
          margin: 0;
          flex: 1 1 12rem;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.35;
        }
        .fw-usa-count {
          display: flex;
          align-items: baseline;
          gap: .4rem;
          margin: 0;
        }
        .fw-usa-days {
          color: #dfff00;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .fw-usa-days-label {
          color: #dce4ff;
          font-size: .95rem;
          font-weight: 600;
        }
        .fw-usa-meta {
          margin: 1rem 0 0;
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
        }
        .fw-track {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin: 2.2rem 0 0;
          padding: 0;
          list-style: none;
        }
        .fw-track-line {
          position: absolute;
          left: 0; right: 0; top: 10px;
          height: 2px;
          background: rgba(255,255,255,.28);
        }
        .fw-track-line i {
          display: block;
          width: 100%;
          height: 100%;
          background: #dfff00;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 1.6s var(--fw-ease);
        }
        .fw-usa.is-on .fw-track-line i { transform: scaleX(1); }
        .fw-track li {
          position: relative;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
        }
        .fw-dot {
          position: relative;
          display: block;
          width: 22px;
          height: 22px;
          margin-bottom: .7rem;
          border: 2px solid #dfff00;
          border-radius: 999px;
          background: #dfff00;
          transform: scale(0);
        }
        .fw-dot::after {
          content: '';
          position: absolute;
          inset: -6px;
          border: 2px solid #dfff00;
          border-radius: 999px;
          opacity: 0;
          transform: scale(.6);
        }
        .fw-usa.is-on .fw-dot {
          animation: fwDotPop .7s var(--fw-ease) forwards;
        }
        .fw-usa.is-on .fw-track li:nth-child(2) .fw-dot { animation-delay: 0s; }
        .fw-usa.is-on .fw-track li:nth-child(3) .fw-dot { animation-delay: .53s; }
        .fw-usa.is-on .fw-track li:nth-child(4) .fw-dot { animation-delay: 1.06s; }
        .fw-usa.is-on .fw-track li:nth-child(5) .fw-dot { animation-delay: 1.6s; }
        .fw-usa.is-on .fw-dot::after {
          animation: fwDotRing .8s ease-out forwards;
        }
        .fw-usa.is-on .fw-track li:nth-child(3) .fw-dot::after { animation-delay: .53s; }
        .fw-usa.is-on .fw-track li:nth-child(4) .fw-dot::after { animation-delay: 1.06s; }
        .fw-usa.is-on .fw-track li:nth-child(5) .fw-dot::after { animation-delay: 1.6s; }
        @keyframes fwDotPop {
          0% { transform: scale(0); }
          70% { transform: scale(1.22); }
          100% { transform: scale(1); }
        }
        @keyframes fwDotRing {
          0% { opacity: .7; transform: scale(.6); }
          100% { opacity: 0; transform: scale(1.7); }
        }
        .fw-actions { display: flex; flex-wrap: wrap; gap: .8rem; margin-top: 2.2rem; }
        .fw-btn {
          display: inline-flex;
          align-items: center;
          gap: .7rem;
          height: 56px;
          padding: 0 1.35rem;
          border: 0;
          border-radius: 999px;
          font-family: inherit;
          font-size: 17px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
        }
        .fw-btn:focus-visible, .fw-card:focus-visible, .fw-usa-card:focus-visible {
          outline: 3px solid #fff;
          outline-offset: 3px;
        }
        .fw-btn-solid { background: #dfff00; color: #0a1240; }
        .fw-btn-ghost { border: 1.5px solid #fff; color: #fff; background: transparent; }
        .fw-usa-media {
          position: relative;
          justify-self: end;
          width: min(100%, 420px);
          --px: 0px;
          --py: 0px;
        }
        .fw-usa-halo {
          position: absolute;
          inset: 0;
          border-radius: 220px 220px 28px 28px;
          background: #dfff00;
          transform: translate(18px, 18px);
          pointer-events: none;
        }
        .fw-usa-doc {
          position: absolute;
          z-index: 2;
          right: -8%;
          top: 12%;
          width: 88px;
          height: 112px;
          padding: 12px 10px;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 18px 40px rgba(10,18,64,.28);
          transform: rotate(-6deg);
          animation: fwDocFloat 7s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .fw-usa-doc span {
          display: block;
          height: 6px;
          margin-bottom: 8px;
          border-radius: 999px;
          background: #d5dcf5;
        }
        .fw-usa-doc span:first-child {
          width: 42%;
          height: 10px;
          margin-bottom: 14px;
          background: #1546e8;
        }
        .fw-usa-doc span:nth-child(3) { width: 78%; }
        .fw-usa-doc span:nth-child(4) { width: 62%; margin-bottom: 0; }
        @keyframes fwDocFloat {
          from { transform: rotate(-6deg) translateY(-10px); }
          to { transform: rotate(-6deg) translateY(10px); }
        }
        .fw-usa-card {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 220px 220px 28px 28px;
          background: #0a1240;
          cursor: pointer;
          clip-path: inset(100% 0 0 0 round 220px 220px 28px 28px);
          transform: translate3d(var(--px), var(--py), 0);
          transition: clip-path 1.3s var(--fw-ease), transform .35s var(--fw-ease);
        }
        .fw-usa.is-on .fw-usa-card { clip-path: inset(0 round 220px 220px 28px 28px); }
        .fw-usa-poster {
          object-fit: cover;
          object-position: center 30%;
          transform: scale(1.15);
          transition: transform 8s var(--fw-ease);
        }
        .fw-usa.is-on .fw-usa-poster { transform: scale(1.02); }
        .fw-usa-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 42%, rgba(10,18,64,.55));
          pointer-events: none;
        }
        .fw-usa-play {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .fw-usa-play-ring {
          position: absolute;
          width: 88px;
          height: 88px;
          border: 2px solid rgba(255,255,255,.7);
          border-radius: 999px;
          animation: fwPlayPulse 2s ease-out infinite;
        }
        .fw-usa-play-core {
          position: relative;
          display: grid;
          place-items: center;
          width: 88px;
          height: 88px;
          border-radius: 999px;
          background: #fff;
          color: #1546e8;
          transition: transform .35s var(--fw-ease), background .35s var(--fw-ease), color .35s var(--fw-ease);
        }
        .fw-usa-play-core svg { margin-left: 3px; }
        .fw-usa-card:hover .fw-usa-play-core,
        .fw-usa-card:focus-visible .fw-usa-play-core {
          background: #dfff00;
          color: #0a1240;
          transform: scale(1.08);
        }
        @keyframes fwPlayPulse {
          0% { transform: scale(1); opacity: .6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .fw-btn-line { height: 44px; padding: 0 1rem; border: 1px solid #d5dcf5; background: #fff; color: var(--fw-ink); font-size: .92rem; }
        .fw-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 220;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          background: rgba(5, 11, 46, .72);
        }
        .fw-modal {
          position: relative;
          width: min(560px, 100%);
          max-height: min(92vh, 900px);
          overflow: auto;
          border-radius: 28px;
          background: #fff;
          color: var(--fw-ink);
          box-shadow: 0 40px 80px -30px rgba(5, 11, 46, .55);
        }
        .fw-modal.is-info { width: min(640px, 100%); }
        .fw-modal-x {
          position: absolute;
          z-index: 3;
          top: 14px;
          right: 14px;
          width: 40px;
          height: 40px;
          border: 0;
          border-radius: 999px;
          background: #fff;
          color: var(--fw-ink);
          font-size: 1.6rem;
          line-height: 1;
          cursor: pointer;
        }
        .fw-modal-x:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        .fw-modal.is-info .fw-modal-x { background: rgba(255,255,255,.95); box-shadow: 0 8px 20px rgba(10,18,64,.18); }
        .fw-modal.is-video { width: min(960px, 100%); background: #0a1240; }
        .fw-modal.is-video .fw-modal-x { background: rgba(255,255,255,.92); }
        .fw-modal-video { background: #0a1240; }
        .fw-modal-video video { display: block; width: 100%; max-height: min(78vh, 720px); background: #000; }
        .fw-modal-video-caption {
          margin: 0;
          padding: .75rem 1.1rem 1rem;
          color: #fff;
          font-size: .9rem;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .fw-modal-hero {
          position: relative;
          overflow: hidden;
          padding: 1.7rem 1.6rem 1.4rem;
          background: #1546e8;
          color: #fff;
        }
        .fw-modal-hero::before {
          content: '';
          position: absolute;
          right: -40px;
          top: -30px;
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: #dfff00;
          filter: blur(50px);
          opacity: .35;
          pointer-events: none;
        }
        .fw-modal-emblem {
          position: relative;
          display: grid;
          place-items: center;
          width: 56px;
          height: 56px;
          margin-bottom: .9rem;
          border-radius: 18px;
          background: #dfff00;
        }
        .fw-modal-kicker {
          position: relative;
          margin: 0 0 .45rem;
          color: #dfff00;
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .fw-modal-hero h3 {
          position: relative;
          margin: 0;
          max-width: 16ch;
          color: #fff;
          font-size: clamp(1.7rem, 3.4vw, 2.35rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.08;
        }
        .fw-modal-levels {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          gap: .45rem;
          margin: 1.1rem 0 0;
          padding: 0;
          list-style: none;
        }
        .fw-modal-levels li {
          padding: .35rem .75rem;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 999px;
          background: rgba(255,255,255,.12);
          color: #fff;
          font-size: .78rem;
          font-weight: 700;
        }
        .fw-modal-body { padding: 1.45rem 1.6rem 0; }
        .fw-modal-lead {
          margin: 0;
          color: var(--fw-body);
          font-size: 1rem;
          line-height: 1.65;
        }
        .fw-modal-list {
          display: grid;
          gap: .75rem;
          margin: 1.25rem 0 0;
          padding: 0;
          list-style: none;
        }
        .fw-modal-list li {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: .85rem;
          align-items: start;
          padding: .9rem 1rem;
          border: 1px solid #e3e8fb;
          border-radius: 18px;
          background: #f7f9ff;
        }
        .fw-modal-ico {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #1546e8;
          color: #dfff00;
        }
        .fw-modal-list strong {
          display: block;
          color: var(--fw-ink);
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .fw-modal-list small {
          display: block;
          margin-top: .2rem;
          color: var(--fw-body);
          font-size: .92rem;
          line-height: 1.45;
        }
        .fw-modal-note {
          margin: 1.15rem 0 0;
          padding: 1rem 1.05rem;
          border-left: 4px solid #dfff00;
          border-radius: 16px;
          background: #f4f7ff;
          color: var(--fw-ink);
          font-size: .95rem;
          line-height: 1.55;
        }
        .fw-modal-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: .85rem 1.1rem;
          padding: 1.2rem 1.6rem 1.55rem;
        }
        .fw-modal-links {
          display: flex;
          flex-wrap: wrap;
          gap: .65rem 1rem;
        }
        .fw-modal-links a {
          color: #1546e8;
          font-size: .92rem;
          font-weight: 700;
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }
        .fw-modal-links a:hover,
        .fw-modal-links a:focus-visible {
          border-bottom-color: #1546e8;
        }
        .fw-modal-links a:focus-visible {
          outline: 3px solid #1546e8;
          outline-offset: 3px;
        }
        @media (max-width: 520px) {
          .fw-modal-foot { flex-direction: column; align-items: stretch; }
          .fw-modal-foot .fw-btn { justify-content: center; width: 100%; }
        }
        .fw-arrow {
          position: relative;
          width: 22px; height: 2px;
          background: currentColor;
          transition: width .4s var(--fw-ease);
        }
        .fw-arrow::after {
          content: '';
          position: absolute;
          right: -1px; top: -4px;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 7px solid currentColor;
        }
        .fw-btn:hover .fw-arrow, .fw-btn:focus-visible .fw-arrow { width: 40px; }
        @media (max-width: 900px) {
          .fw-head { grid-template-columns: 1fr; }
          .fw-photo { max-width: 420px; }
          .fw-bento { grid-template-columns: 1fr; }
          .fw-ia, .fw-tri, .fw-inst, .fw-comp { grid-column: auto; grid-row: auto; }
          .fw-usa { padding: 64px 1.15rem; }
          .fw-usa-inner { grid-template-columns: 1fr; gap: 2rem; }
          .fw-usa-media { justify-self: center; width: min(100%, 340px); }
          .fw-track { display: flex; flex-direction: column; gap: 1.2rem; padding-left: 8px; }
          .fw-track-line { left: 10px; top: 0; bottom: 0; width: 2px; height: auto; right: auto; }
          .fw-track-line i {
            transform: scaleY(0);
            transform-origin: top center;
          }
          .fw-usa.is-on .fw-track-line i { transform: scaleY(1); }
          .fw-dot { margin-bottom: .45rem; }
        }
        @media (min-width: 600px) and (max-width: 900px) {
          .fw-bento { grid-template-columns: 1fr 1fr; }
          .fw-ia { grid-column: span 2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fw-word, .fw-arch, .fw-card, .fw-chip, .fw-drift, .fw-usa-glow, .fw-icon, .fw-lang span, .fw-dot, .fw-arrow,
          .fw-usa-word, .fw-usa-poster, .fw-usa-card, .fw-usa-doc, .fw-usa-play-ring, .fw-track-line i, .fw-usa-play-core {
            animation: none !important;
            transition: none !important;
          }
          .fw-word, .fw-usa-word { transform: none !important; }
          .fw-arch, .fw-card, .fw-usa-card { clip-path: none !important; }
          .fw-usa-poster { transform: scale(1.02) !important; }
          .fw-dot { transform: scale(1) !important; }
          .fw-track-line i { transform: scaleX(1) !important; }
          .fw-usa-card { transform: none !important; }
        }
        .fw-usa.is-reduced .fw-usa-word { transform: none; }
        .fw-usa.is-reduced .fw-usa-card { clip-path: inset(0 round 220px 220px 28px 28px); }
        .fw-usa.is-reduced .fw-usa-poster { transform: scale(1.02); }
        .fw-usa.is-reduced .fw-dot { transform: scale(1); animation: none; }
        .fw-usa.is-reduced .fw-dot::after { animation: none; opacity: 0; }
        .fw-usa.is-reduced .fw-track-line i { transform: scaleX(1); }
        .fw-usa.is-reduced .fw-usa-play-ring, .fw-usa.is-reduced .fw-usa-doc, .fw-usa.is-reduced .fw-usa-glow {
          animation: none;
        }
        @media (max-width: 900px) {
          .fw-usa.is-reduced .fw-track-line i { transform: scaleY(1); }
        }
      `}</style>
    </section>
  )
}

function UsaBenefitIcon({ name }: { name: 'award' | 'globe' | 'check' }) {
  const common = { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', 'aria-hidden': true as const }
  if (name === 'award') {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (name === 'globe') {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4c2.8 2.8 2.8 12.2 0 16M12 4c-2.8 2.8-2.8 12.2 0 16" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg {...common} stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12.5 10 17.5 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    </svg>
  )
}

function Icon({ name }: { name: 'ia' | 'lang' | 'home' | 'trophy' }) {
  const common = { className: 'fw-icon', viewBox: '0 0 40 40', fill: 'none', 'aria-hidden': true as const }
  if (name === 'ia') {
    return (
      <svg {...common} stroke="#fff">
        <rect x="6" y="8" width="28" height="20" rx="4" strokeWidth="1.6" />
        <path d="M14 32h12M20 28v4M14 16h.01M20 16h.01M26 16h.01" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'lang') {
    return (
      <svg {...common} stroke="#1546E8">
        <circle cx="20" cy="20" r="12" strokeWidth="1.6" />
        <path d="M8 20h24M20 8c3 3.5 3 20 0 24M20 8c-3 3.5-3 20 0 24" strokeWidth="1.6" />
      </svg>
    )
  }
  if (name === 'home') {
    return (
      <svg {...common} stroke="#fff">
        <path d="M8 18 20 8l12 10v12H8V18Z" strokeWidth="1.6" />
        <path d="M16 30V20h8v10" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg {...common} stroke="#0A1240">
      <path d="M12 8h16v8a8 8 0 0 1-16 0V8Z" strokeWidth="1.6" />
      <path d="M12 12H8a4 4 0 0 0 4 6M28 12h4a4 4 0 0 1-4 6M20 24v4M14 32h12" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
