// 2026-10-19: Red Winston — sección cinematográfica (beca / empresa / alianzas).
// Motion con GSAP (transform/opacity). Lenis no entra aquí: en desktop el home
// usa snap por pantallas y un smooth-scroll global se lo come.
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const BECA = ['UNE', 'IEST Anáhuac', 'Tecmilenio'] as const
const EMPRESA = ['Pemex', 'IMSS', 'CFE', 'Telmex'] as const
const ALIANZAS = ['Cambridge', 'Narrative 4', 'COPARMEX', 'AMMJE'] as const

const STATS = [
  { value: 3, label: 'universidades con beca directa' },
  { value: 4, label: 'empresas con convenio' },
  { value: 4, label: 'alianzas académicas' },
] as const

const MARQUEE = [...BECA, ...EMPRESA, ...ALIANZAS] as const

const CARDS = [
  {
    kicker: 'A nuestros egresados',
    title: 'Convenios con beca directa',
    items: BECA,
    icon: 'beca',
  },
  {
    kicker: 'Experiencia y proyección',
    title: 'Convenios con empresas',
    items: EMPRESA,
    icon: 'empresa',
  },
  {
    kicker: 'Del instituto',
    title: 'Alianzas estratégicas',
    items: ALIANZAS,
    icon: 'alianza',
  },
] as const

export default function ConveniosSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count || 0)
        const proxy = { n: 0 }
        gsap.to(proxy, {
          n: target,
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(proxy.n))
          },
        })
      })

    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      id="convenios-alianzas"
      className="rw"
      aria-labelledby="rw-title"
    >
      <div className="rw-hero">
        <div className="rw-hero-bg">
          <Image
            src="/images/logos/convenios-alumnas.jpg"
            alt="Alumnas del Instituto Winston Churchill"
            fill
            sizes="100vw"
            className="rw-hero-photo"
            priority={false}
          />
        </div>
        <div className="rw-hero-overlay" aria-hidden />

        <div className="rw-hero-copy">
          <p className="rw-eyebrow rw-hero-fade">Red Winston</p>
          <h2 id="rw-title" className="rw-title">
            <span className="rw-line"><span className="rw-word">Convenios y alianzas que abren</span></span>{' '}
            <span className="rw-line"><span className="rw-word rw-accent">puertas reales</span></span>
          </h2>
          <p className="rw-sub rw-hero-fade">
            Becas directas para egresados, vínculos con empresas y alianzas académicas.
          </p>
          <div className="rw-hero-fade">
            <Link href="/admisiones#examen-admision" className="rw-btn rw-magnetic">
              Conoce los beneficios
              <span className="rw-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="rw-scroll" aria-hidden>
          <span>Scroll</span>
          <i />
        </div>
      </div>

      <div className="rw-stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="rw-stat">
            <p className="rw-stat-num">
              <span data-count={stat.value}>{stat.value}</span>
            </p>
            <p className="rw-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rw-cards" id="rw-becas">
        <div className="rw-cards-head">
          <p className="rw-eyebrow">La red</p>
          <h3 className="rw-h3">Tres puertas. Un mismo colegio.</h3>
        </div>
        <div className="rw-grid">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="rw-card"
              onMouseMove={(e) => tilt(e.currentTarget, e.clientX, e.clientY)}
              onMouseLeave={(e) => resetTilt(e.currentTarget)}
            >
              <div className="rw-card-glow" aria-hidden />
              <Icon name={card.icon} />
              <p className="rw-card-kicker">{card.kicker}</p>
              <h3 className="rw-card-title">{card.title}</h3>
              <ul className="rw-logos">
                {card.items.map((name) => (
                  <li key={name}>
                    <span className="rw-logo">{name}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="rw-marquees" aria-label="Socios de la red Winston">
        <Marquee names={MARQUEE} reverse={false} />
        <Marquee names={[...MARQUEE].reverse()} reverse />
      </div>

      <div className="rw-close">
        <div className="rw-close-glow" aria-hidden />
        <div className="rw-close-inner">
          <p className="rw-eyebrow">Siguiente paso</p>
          <h3 className="rw-h3">Ven a conocer el campus.</h3>
          <Link href="/contacto" className="rw-btn">
            Agenda tu visita
            <span className="rw-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .rw {
          --rw-bg: #ffffff;
          --rw-blue: #1546e8;
          --rw-brand: #013bdf;
          --rw-lime: #e3fb07;
          --rw-text: #10182f;
          --rw-muted: #5c6b8a;
          --rw-radius: 24px;
          position: relative;
          background: var(--rw-bg);
          color: var(--rw-text);
          overflow: hidden;
          font-family: var(--font-poppins), Poppins, sans-serif;
        }
        .rw-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
          height: 100svh;
          min-height: 100svh;
          background: #050b2e;
        }
        .rw-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .rw-hero-photo {
          object-fit: cover;
          object-position: 70% 25%;
          width: 100%;
          height: 100%;
        }
        .rw-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(5,11,46,0.95) 0%, rgba(5,11,46,0.75) 40%, rgba(5,11,46,0.15) 100%);
        }
        .rw-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(40px);
          pointer-events: none;
          will-change: transform;
        }
        .rw-orb-a {
          width: 280px; height: 280px;
          left: -60px; bottom: 10%;
          background: rgba(21,70,232,.16);
          animation: rwFloat 14s ease-in-out infinite;
        }
        .rw-orb-b {
          width: 180px; height: 180px;
          right: 8%; top: 18%;
          background: rgba(227,251,7,.16);
          animation: rwFloat 18s ease-in-out infinite reverse;
        }
        @keyframes rwFloat {
          0%, 100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(24px,-28px,0); }
        }
        .rw-hero-copy {
          position: relative;
          z-index: 2;
          width: 50%;
          max-width: 50%;
          margin-left: 1.25rem;
          padding: 0;
        }
        .rw-hero .rw-eyebrow {
          color: #DFFF00;
          letter-spacing: 0.3em;
          font-size: 0.8rem;
        }
        .rw-hero .rw-title {
          color: #FFFFFF;
          font-size: clamp(2.5rem, 5.5vw, 5.5rem);
          line-height: 1.02;
          max-width: 12ch;
        }
        .rw-hero .rw-line { display: inline; overflow: visible; }
        .rw-hero .rw-word { display: inline; }
        .rw-hero .rw-accent { color: #DFFF00; }
        .rw-hero .rw-sub {
          color: #C9D3F0;
          font-size: 1.125rem;
          max-width: 34ch;
          margin-top: 1.5rem;
          margin-bottom: 0;
        }
        .rw-hero .rw-btn {
          margin-top: 2rem;
          background: #DFFF00;
          color: #071018;
        }
        .rw-eyebrow {
          margin: 0 0 .9rem;
          color: var(--rw-brand);
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .28em;
          text-transform: uppercase;
        }
        .rw-title {
          margin: 0;
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: .92;
          font-size: clamp(1.85rem, 5.4vw, 5.4rem);
          color: var(--rw-brand);
        }
        .rw-line { display: block; overflow: hidden; }
        .rw-word { display: inline-block; }
        .rw-sub {
          margin: 1.25rem 0 1.75rem;
          max-width: 36rem;
          color: var(--rw-muted);
          font-size: 1rem;
          line-height: 1.55;
          font-weight: 400;
        }
        .rw-btn {
          display: inline-flex;
          align-items: center;
          gap: .65rem;
          border-radius: 999px;
          background: var(--rw-lime);
          color: #071018;
          font-weight: 800;
          font-size: .78rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          text-decoration: none;
          padding: .95rem 1.35rem;
          transition: transform .35s cubic-bezier(.22,1,.36,1);
        }
        .rw-btn:hover { transform: translate3d(4px,0,0); }
        .rw-btn:focus-visible { outline: 2px solid var(--rw-brand); outline-offset: 3px; }
        .rw-arrow { display: inline-block; transition: transform .35s cubic-bezier(.22,1,.36,1); }
        .rw-btn:hover .rw-arrow { transform: translate3d(6px,0,0); }
        .rw-btn-ghost {
          background: transparent;
          color: var(--rw-brand);
          border: 1px solid var(--rw-brand);
        }
        .rw-scroll {
          position: absolute;
          z-index: 2;
          left: 1.25rem;
          bottom: 1.1rem;
          display: flex;
          align-items: center;
          gap: .6rem;
          color: var(--rw-muted);
          font-size: .65rem;
          letter-spacing: .22em;
          text-transform: uppercase;
        }
        .rw-scroll i {
          display: block;
          width: 1px;
          height: 42px;
          background: linear-gradient(var(--rw-lime), transparent);
          animation: rwPulse 1.8s ease-in-out infinite;
          transform-origin: top;
        }
        @keyframes rwPulse {
          0%, 100% { transform: scaleY(.4); opacity: .4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .rw-stats {
          position: relative;
          z-index: 4;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 3.5rem 1.25rem;
          background: #fff;
          border-top: 1px solid rgba(1,59,223,.18);
          border-bottom: 1px solid rgba(1,59,223,.18);
        }
        .rw-stat-num {
          margin: 0;
          font-size: clamp(3.2rem, 8vw, 5.5rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: .9;
          color: var(--rw-brand);
        }
        .rw-stat-label {
          margin: .4rem 0 0;
          color: var(--rw-muted);
          font-size: .85rem;
          max-width: 16ch;
        }
        .rw-cards { padding: 4.5rem 1.25rem 2rem; position: relative; }
        .rw-cards-head {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: .35rem 1.25rem;
          margin-bottom: 1.5rem;
          max-width: none;
        }
        .rw-cards-head .rw-eyebrow { margin: 0; }
        .rw-cards-head .rw-h3 {
          flex: 1 1 auto;
          margin: 0;
          max-width: none;
          white-space: normal;
          font-size: clamp(1.35rem, 2.4vw, 2.4rem);
          line-height: 1.1;
        }
        @media (min-width: 640px) {
          .rw-cards-head .rw-h3 { white-space: nowrap; }
        }
        .rw-h3 {
          margin: 0;
          font-size: clamp(1.8rem, 4vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: .95;
        }
        .rw-grid {
          display: grid;
          gap: 1rem;
          perspective: 1200px;
        }
        .rw-card {
          position: relative;
          border-radius: var(--rw-radius);
          padding: 1.5rem 1.35rem 1.4rem;
          background: #fff;
          border: 1px solid rgba(1,59,223,.1);
          box-shadow: 0 18px 40px rgba(1,59,223,.06);
          backdrop-filter: blur(16px);
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform .2s ease-out;
          overflow: hidden;
        }
        .rw-card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(420px circle at var(--gx, 50%) var(--gy, 0%), rgba(227,251,7,.16), transparent 42%);
          pointer-events: none;
        }
        .rw-icon { position: relative; width: 42px; height: 42px; color: var(--rw-brand); margin-bottom: 1.4rem; }
        .rw-card-kicker {
          position: relative;
          margin: 0 0 .35rem;
          color: var(--rw-brand);
          font-size: .68rem;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .rw-card-title {
          position: relative;
          margin: 0 0 1.25rem;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          max-width: 16ch;
        }
        .rw-logos { position: relative; list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: .5rem; }
        .rw-logo {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 0 .75rem;
          border-radius: 999px;
          border: 1px solid rgba(1,59,223,.16);
          color: rgba(16,24,47,.62);
          font-size: .78rem;
          font-weight: 800;
          letter-spacing: .04em;
          text-transform: uppercase;
          transition: color .3s ease, border-color .3s ease, background .3s ease;
        }
        .rw-logo:hover, .rw-card:hover .rw-logo {
          color: #071018;
          background: var(--rw-lime);
          border-color: var(--rw-lime);
        }
        .rw-marquees { padding: 2.5rem 0 1rem; }
        .rw-marquee-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .rw-marquee {
          display: flex;
          width: max-content;
          gap: 3rem;
          padding: .7rem 0;
          animation: rwMarquee 42s linear infinite;
        }
        .rw-marquee.is-reverse { animation-direction: reverse; }
        .rw-marquees:hover .rw-marquee { animation-play-state: paused; }
        .rw-marquee span {
          color: rgba(1,59,223,.45);
          font-size: clamp(1.4rem, 3vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          filter: grayscale(1);
        }
        @keyframes rwMarquee {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-50%,0,0); }
        }
        .rw-close {
          position: relative;
          margin: 0;
          padding: 3.2rem 1.5rem 4rem;
          text-align: center;
          color: var(--rw-text);
          background: transparent;
        }
        .rw-close-glow {
          position: absolute;
          left: 50%;
          top: 55%;
          width: 460px;
          height: 140px;
          border-radius: 999px;
          background: rgba(227,251,7,.28);
          filter: blur(70px);
          transform: translate(-50%, -50%);
          animation: rwClosePulse 7s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes rwClosePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: .55; }
          50% { transform: translate(-40%, -60%) scale(1.25); opacity: .9; }
        }
        .rw-close-inner { position: relative; z-index: 1; }
        .rw-close .rw-eyebrow { color: var(--rw-brand); }
        .rw-close .rw-h3 {
          margin: 0 auto 1.4rem;
          max-width: none;
          color: var(--rw-brand);
          font-size: clamp(2rem, 4vw, 3.4rem);
        }
        .rw-close .rw-btn {
          background: #e3fb07;
          color: #071018;
          box-shadow: 0 12px 30px rgba(227,251,7,.28);
        }
        @media (min-width: 768px) {
          .rw-hero-copy { margin-left: 4rem; }
          .rw-scroll { left: 4rem; }
          .rw-stats { grid-template-columns: repeat(3, 1fr); padding: 4rem; }
          .rw-stat + .rw-stat { border-left: 1px solid rgba(1,59,223,.18); padding-left: 2rem; }
          .rw-cards { padding-left: 4rem; padding-right: 4rem; }
          .rw-close { padding: 4.5rem 2rem 5rem; }
          .rw-cards-head .rw-h3 { white-space: nowrap; }
          .rw-grid { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        }
        @media (min-width: 1440px) {
          .rw-hero, .rw-stats, .rw-cards { padding-left: 6rem; padding-right: 6rem; }
          .rw-close { padding-top: 5rem; padding-bottom: 5.5rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rw-orb-a, .rw-orb-b, .rw-scroll i, .rw-marquee, .rw-close-glow { animation: none !important; }
          .rw-word { transform: none !important; }
        }
      `}</style>
    </section>
  )
}

function tilt(el: HTMLElement, clientX: number, clientY: number) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = el.getBoundingClientRect()
  const x = (clientX - r.left) / r.width
  const y = (clientY - r.top) / r.height
  el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`)
  el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`)
  el.style.setProperty('--gx', `${x * 100}%`)
  el.style.setProperty('--gy', `${y * 100}%`)
}

function resetTilt(el: HTMLElement) {
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}

function Marquee({ names, reverse }: { names: readonly string[]; reverse: boolean }) {
  const loop = [...names, ...names]
  return (
    <div className="rw-marquee-mask">
      <div className={`rw-marquee${reverse ? ' is-reverse' : ''}`}>
        {loop.map((name, i) => (
          <span key={`${name}-${i}`}>{name}</span>
        ))}
      </div>
    </div>
  )
}

function Icon({ name }: { name: string }) {
  const common = { className: 'rw-icon', viewBox: '0 0 48 48', fill: 'none', 'aria-hidden': true as const }
  if (name === 'beca') {
    return (
      <svg {...common}>
        <path d="M6 18 24 8l18 10-18 10L6 18Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 22v8c4 4 16 4 20 0v-8" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  if (name === 'empresa') {
    return (
      <svg {...common}>
        <path d="M8 40V16l12-6v30M20 40V20h16v20" stroke="currentColor" strokeWidth="1.6" />
        <path d="M26 26h4M26 32h4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="16" cy="20" r="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="32" cy="20" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 36c1.5-5 5-7 8-7s6.5 2 8 7M24 36c1.5-5 5-7 8-7s6.5 2 8 7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
