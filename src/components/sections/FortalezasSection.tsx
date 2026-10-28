// 2026-10-19: Por qué Winston — cabecera, bento y Winston USA.
// Pages Router, sin librerías nuevas. Tipografía de marca: Poppins.
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'

const TITLE = 'Programa académico, cimentado en tecnología, innovación y emprendimiento'
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
// 2026-10-23: bandera USA horizontal (proporción 19:10). También póster del video.
const USA_POSTER = '/images/winston-usa/flag.webp'

export default function FortalezasSection() {
  const rootRef = useRef<HTMLElement>(null)
  const bentoRef = useRef<HTMLDivElement>(null)
  const usaRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [inView, setInView] = useState(false)
  const [cardsIn, setCardsIn] = useState(false)
  const [usaIn, setUsaIn] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [usaModal, setUsaModal] = useState<null | 'info' | 'video'>(null)
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
          {/* 2026-10-22: collage de fotos (no un solo arco). */}
          <div className="fw-photo">
            <div className="fw-slab" aria-hidden />
            <span className="fw-orbit fw-orbit-a" aria-hidden />
            <span className="fw-orbit fw-orbit-b" aria-hidden />
            <figure className="fw-shot fw-shot-tech">
              <Image
                src="/images/tecnologia/tec1.png"
                alt="Alumno del Instituto Winston Churchill en el aula de tecnología"
                fill
                sizes="(max-width: 900px) 70vw, 280px"
                className="fw-shot-img"
              />
            </figure>
            <figure className="fw-shot fw-shot-group">
              <Image
                src="/images/slider/SLIDE_INICIO_1-1280.webp"
                alt="Alumnos del Instituto Winston Churchill en el campus"
                fill
                sizes="(max-width: 900px) 80vw, 340px"
                className="fw-shot-img"
              />
            </figure>
            <span className="fw-chip fw-chip-a">IA en el aula</span>
            <span className="fw-chip fw-chip-b">Trilingüe</span>
          </div>
        </div>

        {/* 2026-10-28: cinco fortalezas con icono azul; cada una abre su sección. */}
        <div ref={bentoRef} className="fw-links">
          <Link href="/conocenos#instalaciones" className="fw-link">
            <Icon name="home" />
            <h3>Instalaciones climatizadas</h3>
            <p>Circuito cerrado y cámaras de vigilancia. Agenda una visita y recorre el campus.</p>
          </Link>
          <Link href="/oferta-educativa#estancia" className="fw-link">
            <Icon name="home" />
            <h3>Estancia extendida</h3>
            <p>Acompañamiento después de clases, dentro de la oferta educativa.</p>
          </Link>
          <Link href="/programas#tecnologia-innovacion" className="fw-link">
            <Icon name="ia" />
            <h3>Modelo avanzado con IA</h3>
            <p>Enseñanza potenciada con inteligencia artificial, de preescolar a secundaria.</p>
          </Link>
          <a href="#winston-usa" className="fw-link">
            <Icon name="trophy" />
            <h3>Doble titulación</h3>
            <p>Winston USA: validación académica en el extranjero.</p>
          </a>
          <Link href="/programas" className="fw-link">
            <Icon name="lang" />
            <h3>Tecnología, innovación y emprendimiento</h3>
            <p>El programa académico que sostiene el día a día en Winston.</p>
          </Link>
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
              Les ofrece documentación académica estadounidense respaldada por Cognia, que permite a
              nuestros alumnos acreditar su trayectoria académica tanto en México como en Estados
              Unidos.
            </p>
            <p className="fw-usa-meta">Maternal, kínder, primaria y secundaria.</p>
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
            </div>
          </div>

          {/* 2026-10-23: collage USA — bandera horizontal + alumnas, sin arco. */}
          <div className="fw-usa-media">
            <div className="fw-usa-slab" aria-hidden />
            <span className="fw-usa-orbit fw-usa-orbit-a" aria-hidden />
            <span className="fw-usa-orbit fw-usa-orbit-b" aria-hidden />
            <figure className="fw-usa-shot">
              <Image
                src="/images/logos/convenios-alumnas.jpg"
                alt="Alumnas del Instituto Winston Churchill con medallas"
                fill
                sizes="(max-width: 900px) 55vw, 240px"
                className="fw-usa-shot-img"
              />
            </figure>
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
                alt="Bandera de Estados Unidos — Winston USA Program"
                fill
                sizes="(max-width: 900px) 90vw, 480px"
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
                      <span className="fw-modal-flag" aria-hidden title="Estados Unidos">
                        <svg viewBox="0 0 57 30" width="120" height="64" role="img">
                          <title>Bandera de Estados Unidos</title>
                          <rect width="57" height="30" rx="3" fill="#B22234" />
                          <path
                            fill="#fff"
                            d="M0 3.33h57v3.33H0zm0 6.67h57v3.33H0zm0 6.67h57v3.33H0zm0 6.67h57v3.33H0z"
                          />
                          <rect width="22.8" height="16.15" fill="#3C3B6E" />
                          <g fill="#fff">
                            <circle cx="2.3" cy="2" r=".7" />
                            <circle cx="5.7" cy="2" r=".7" />
                            <circle cx="9.1" cy="2" r=".7" />
                            <circle cx="12.5" cy="2" r=".7" />
                            <circle cx="15.9" cy="2" r=".7" />
                            <circle cx="19.3" cy="2" r=".7" />
                            <circle cx="4" cy="4" r=".7" />
                            <circle cx="7.4" cy="4" r=".7" />
                            <circle cx="10.8" cy="4" r=".7" />
                            <circle cx="14.2" cy="4" r=".7" />
                            <circle cx="17.6" cy="4" r=".7" />
                            <circle cx="2.3" cy="6" r=".7" />
                            <circle cx="5.7" cy="6" r=".7" />
                            <circle cx="9.1" cy="6" r=".7" />
                            <circle cx="12.5" cy="6" r=".7" />
                            <circle cx="15.9" cy="6" r=".7" />
                            <circle cx="19.3" cy="6" r=".7" />
                            <circle cx="4" cy="8" r=".7" />
                            <circle cx="7.4" cy="8" r=".7" />
                            <circle cx="10.8" cy="8" r=".7" />
                            <circle cx="14.2" cy="8" r=".7" />
                            <circle cx="17.6" cy="8" r=".7" />
                            <circle cx="2.3" cy="10" r=".7" />
                            <circle cx="5.7" cy="10" r=".7" />
                            <circle cx="9.1" cy="10" r=".7" />
                            <circle cx="12.5" cy="10" r=".7" />
                            <circle cx="15.9" cy="10" r=".7" />
                            <circle cx="19.3" cy="10" r=".7" />
                            <circle cx="4" cy="12" r=".7" />
                            <circle cx="7.4" cy="12" r=".7" />
                            <circle cx="10.8" cy="12" r=".7" />
                            <circle cx="14.2" cy="12" r=".7" />
                            <circle cx="17.6" cy="12" r=".7" />
                            <circle cx="2.3" cy="14" r=".7" />
                            <circle cx="5.7" cy="14" r=".7" />
                            <circle cx="9.1" cy="14" r=".7" />
                            <circle cx="12.5" cy="14" r=".7" />
                            <circle cx="15.9" cy="14" r=".7" />
                            <circle cx="19.3" cy="14" r=".7" />
                          </g>
                        </svg>
                      </span>
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
                        Cubre maternal, kínder, primaria y secundaria. Inscripciones abiertas hasta el
                        28 de febrero de 2027.
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
        .fw-photo {
          position: relative;
          min-height: 520px;
          margin-right: .4rem;
        }
        .fw-slab {
          position: absolute;
          z-index: 0;
          right: 4%;
          top: 8%;
          width: 62%;
          height: 74%;
          background: var(--fw-lime);
          clip-path: polygon(22% 0, 100% 0, 100% 100%, 0 100%, 0 18%, 22% 18%);
          transform: rotate(4deg) scale(.92);
          opacity: 0;
          transition: transform 1.1s var(--fw-ease), opacity 1.1s var(--fw-ease);
        }
        .fw.is-in .fw-slab {
          transform: rotate(4deg) scale(1);
          opacity: 1;
        }
        .fw-orbit {
          position: absolute;
          z-index: 1;
          border: 2px solid var(--fw-ink);
          border-radius: 999px;
          pointer-events: none;
        }
        .fw-orbit::before,
        .fw-orbit::after {
          content: '';
          position: absolute;
          border-radius: 999px;
          background: var(--fw-ink);
        }
        .fw-orbit::before { width: 18px; height: 18px; }
        .fw-orbit::after { width: 8px; height: 8px; }
        .fw-orbit-a {
          width: 88px;
          height: 88px;
          top: 2%;
          left: 8%;
        }
        .fw-orbit-a::before { top: -6px; right: 14px; }
        .fw-orbit-a::after { bottom: 10px; left: -2px; }
        .fw-orbit-b {
          width: 72px;
          height: 72px;
          right: 0;
          bottom: 8%;
        }
        .fw-orbit-b::before { right: -4px; bottom: 16px; }
        .fw-orbit-b::after { top: 8px; left: 6px; }
        .fw-shot {
          position: absolute;
          overflow: hidden;
          margin: 0;
          background: #0a1240;
          box-shadow: 0 28px 50px -24px rgba(10, 18, 64, .45);
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 1s var(--fw-ease), transform 1s var(--fw-ease);
        }
        .fw.is-in .fw-shot {
          opacity: 1;
          transform: translateY(0);
        }
        .fw-shot-tech {
          z-index: 2;
          top: 0;
          right: 0;
          width: 58%;
          aspect-ratio: 1;
          border-radius: 22px;
          transform: translateY(36px) rotate(3deg);
        }
        .fw.is-in .fw-shot-tech {
          transform: translateY(0) rotate(3deg);
          transition-delay: .12s;
        }
        .fw-shot-group {
          z-index: 3;
          left: 0;
          bottom: 2%;
          width: 68%;
          aspect-ratio: 4 / 5;
          border-radius: 24px;
          transform: translateY(36px) rotate(-4deg);
        }
        .fw.is-in .fw-shot-group {
          transform: translateY(0) rotate(-4deg);
          transition-delay: .24s;
        }
        .fw-shot-img { object-fit: cover; }
        .fw-shot-tech .fw-shot-img { object-position: center 40%; }
        .fw-shot-group .fw-shot-img { object-position: center 22%; }
        .fw-chip {
          position: absolute;
          z-index: 4;
          padding: .45rem .8rem;
          border: 1px solid #e3e8fb;
          border-radius: 999px;
          background: rgba(255,255,255,.9);
          color: var(--fw-ink);
          font-size: .82rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
          animation: fwChip 6s ease-in-out infinite alternate;
        }
        .fw-chip-a { left: 4%; top: 28%; }
        .fw-chip-b { right: 6%; bottom: 18%; animation-delay: -2.4s; }
        @keyframes fwChip {
          from { transform: translateY(-8px); }
          to { transform: translateY(8px); }
        }
        .fw-bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
        .fw-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 16px;
        }
        .fw-link {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 190px;
          padding: 1.4rem 1.25rem 1.3rem;
          border: 1px solid #d5def8;
          border-radius: 24px;
          background: #fff;
          color: var(--fw-ink);
          text-decoration: none;
        }
        .fw-link .fw-icon { position: static; width: 36px; height: 36px; }
        .fw-link svg { stroke: #1546e8; }
        .fw-link h3 { margin: .85rem 0 .35rem; color: #1546e8; font-size: 1.05rem; line-height: 1.25; }
        .fw-link p { margin: 0; color: #3d466e; font-size: .92rem; line-height: 1.45; }
        .fw-link:hover { border-color: #1546e8; }
        .fw-link:focus-visible { outline: 3px solid #1546e8; outline-offset: 3px; }
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
          width: min(100%, 520px);
          min-height: 480px;
          --px: 0px;
          --py: 0px;
        }
        .fw-usa-shot {
          position: absolute;
          z-index: 2;
          top: 0;
          right: 0;
          width: 46%;
          aspect-ratio: 4 / 5;
          margin: 0;
          overflow: hidden;
          border-radius: 22px;
          background: #0a1240;
          box-shadow: 0 28px 50px -22px rgba(5, 11, 46, .55);
          opacity: 0;
          transform: translateY(28px) rotate(5deg);
          transition: opacity 1s var(--fw-ease), transform 1s var(--fw-ease);
        }
        .fw-usa.is-on .fw-usa-shot {
          opacity: 1;
          transform: translateY(0) rotate(5deg);
        }
        .fw-usa-shot-img { object-fit: cover; object-position: center 20%; }
        .fw-usa-slab {
          position: absolute;
          z-index: 0;
          left: 10%;
          top: 8%;
          width: 72%;
          height: 78%;
          background: #dfff00;
          clip-path: polygon(18% 0, 100% 0, 100% 100%, 0 100%, 0 20%, 18% 20%);
          transform: rotate(-6deg) scale(.9);
          opacity: 0;
          pointer-events: none;
          transition: transform 1.1s var(--fw-ease), opacity 1.1s var(--fw-ease);
        }
        .fw-usa.is-on .fw-usa-slab {
          transform: rotate(-6deg) scale(1);
          opacity: 1;
        }
        .fw-usa-orbit {
          position: absolute;
          z-index: 1;
          border: 2px solid #fff;
          border-radius: 999px;
          pointer-events: none;
        }
        .fw-usa-orbit::before,
        .fw-usa-orbit::after {
          content: '';
          position: absolute;
          border-radius: 999px;
          background: #fff;
        }
        .fw-usa-orbit::before { width: 16px; height: 16px; }
        .fw-usa-orbit::after { width: 8px; height: 8px; }
        .fw-usa-orbit-a {
          width: 78px;
          height: 78px;
          top: 0;
          left: 4%;
        }
        .fw-usa-orbit-a::before { top: -5px; right: 12px; }
        .fw-usa-orbit-a::after { bottom: 8px; left: -2px; }
        .fw-usa-orbit-b {
          width: 64px;
          height: 64px;
          right: 2%;
          bottom: 6%;
        }
        .fw-usa-orbit-b::before { right: -4px; bottom: 14px; }
        .fw-usa-orbit-b::after { top: 6px; left: 8px; }
        .fw-usa-doc {
          position: absolute;
          z-index: 4;
          right: 4%;
          bottom: 16%;
          width: 96px;
          height: 122px;
          padding: 12px 10px;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 22px 44px rgba(10,18,64,.32);
          transform: rotate(8deg);
          animation: fwDocFloat 7s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .fw-usa-doc span {
          display: block;
          height: 6px;
          margin-bottom: 10px;
          border-radius: 999px;
          background: #d5dcf5;
        }
        .fw-usa-doc span:first-child {
          width: 42%;
          height: 12px;
          margin-bottom: 16px;
          background: #1546e8;
        }
        .fw-usa-doc span:nth-child(3) { width: 78%; }
        .fw-usa-doc span:nth-child(4) { width: 62%; margin-bottom: 0; }
        @keyframes fwDocFloat {
          from { transform: rotate(8deg) translateY(-10px); }
          to { transform: rotate(8deg) translateY(10px); }
        }
        .fw-usa-card {
          position: absolute;
          z-index: 3;
          left: 0;
          bottom: 2%;
          display: block;
          width: 78%;
          aspect-ratio: 19 / 10;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 22px;
          background: #0a1240;
          cursor: pointer;
          box-shadow: 0 28px 50px -22px rgba(5, 11, 46, .55);
          opacity: 0;
          transform: translate3d(var(--px), calc(var(--py) + 28px), 0) rotate(-3deg);
          transition: opacity 1s var(--fw-ease), transform .45s var(--fw-ease);
        }
        .fw-usa.is-on .fw-usa-card {
          opacity: 1;
          transform: translate3d(var(--px), var(--py), 0) rotate(-3deg);
        }
        .fw-usa-poster {
          object-fit: cover;
          object-position: center center;
        }
        .fw-usa-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 48%, rgba(10,18,64,.4));
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
        .fw-modal-flag {
          position: absolute;
          z-index: 1;
          top: 52%;
          right: 1.35rem;
          transform: translateY(-50%) rotate(-6deg);
          display: grid;
          place-items: center;
          width: 120px;
          height: 64px;
          border-radius: 8px;
          box-shadow:
            0 14px 28px -10px rgba(5, 11, 46, .45),
            0 0 0 3px rgba(255, 255, 255, .22);
          pointer-events: none;
        }
        .fw-modal-flag svg {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
        @media (max-width: 520px) {
          .fw-modal-flag {
            width: 84px;
            height: 44px;
            right: 1rem;
            top: 42%;
            opacity: .95;
          }
          .fw-modal-hero h3 { max-width: 14ch; }
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
          .fw-photo { max-width: 460px; min-height: 440px; margin: 0 auto; }
          .fw-bento { grid-template-columns: 1fr; }
          .fw-ia, .fw-tri, .fw-inst, .fw-comp { grid-column: auto; grid-row: auto; }
          .fw-usa { padding: 64px 1.15rem; }
          .fw-usa-inner { grid-template-columns: 1fr; gap: 2rem; }
          .fw-usa-media { justify-self: center; width: min(100%, 420px); min-height: 400px; }
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
          .fw-word, .fw-shot, .fw-slab, .fw-card, .fw-chip, .fw-drift, .fw-usa-glow, .fw-icon, .fw-lang span, .fw-dot, .fw-arrow,
          .fw-usa-word, .fw-usa-poster, .fw-usa-card, .fw-usa-doc, .fw-usa-play-ring, .fw-track-line i, .fw-usa-play-core, .fw-usa-slab, .fw-usa-shot {
            animation: none !important;
            transition: none !important;
          }
          .fw-word, .fw-usa-word { transform: none !important; }
          .fw-shot, .fw-slab, .fw-usa-slab, .fw-usa-card, .fw-usa-shot { opacity: 1 !important; }
          .fw-shot-tech { transform: rotate(3deg) !important; }
          .fw-shot-group { transform: rotate(-4deg) !important; }
          .fw-usa-slab { transform: rotate(-6deg) !important; }
          .fw-usa-card { transform: rotate(-3deg) !important; }
          .fw-usa-shot { transform: rotate(5deg) !important; }
          .fw-card { clip-path: none !important; }
          .fw-dot { transform: scale(1) !important; }
          .fw-track-line i { transform: scaleX(1) !important; }
        }
        .fw-usa.is-reduced .fw-usa-word { transform: none; }
        .fw-usa.is-reduced .fw-usa-card { opacity: 1; transform: rotate(-3deg); }
        .fw-usa.is-reduced .fw-usa-shot { opacity: 1; transform: rotate(5deg); }
        .fw-usa.is-reduced .fw-usa-slab { opacity: 1; transform: rotate(-6deg); }
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
