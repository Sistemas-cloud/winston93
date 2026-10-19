// 2026-10-19: Oferta educativa en acordeón. Mismas fotos, textos y enlaces.
// Pages Router: el componente ya corre en cliente; sin "use client" ni librerías nuevas.
// Tipografía de marca (Poppins), no se cargan fuentes extra.
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import EnrollmentCTA from '@/components/EnrollmentCTA'
import FooterLegal from '@/components/FooterLegal'
import { PRIVACY_NOTICE_PATH } from '@/lib/legal'

const LEVELS = [
  {
    name: 'Kínder',
    image: '/images/education/kinder.png',
    blurb: 'Primeros pasos en inglés. Un entorno seguro, con curiosidad y cuidado.',
    color: '#00D8FF',
    link: 'https://educativo-winston.vercel.app/',
    external: true,
  },
  {
    name: 'Primaria',
    image: '/images/education/primaria.png',
    blurb: 'Bases sólidas en lectura y matemáticas. Valores y pensamiento crítico.',
    color: '#DFFF00',
    link: '/primaria',
    external: false,
  },
  {
    name: 'Secundaria',
    image: '/images/education/secundaria.png',
    blurb: 'Preparación integral para el siguiente paso. Disciplina y visión global.',
    color: '#1546E8',
    link: '/secundaria',
    external: false,
  },
] as const

export default function OfertaEducativaSection({
  // 2026-08-15: En /oferta-educativa el título es H1; en home (sección) es H2.
  isPageTitle = false,
  // 2026-10-19: En FullPage el cierre (CTA+footer) va en HomeClosingSection — evita corte.
  includeClosing = true,
}: {
  isPageTitle?: boolean
  includeClosing?: boolean
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const TitleTag = isPageTitle ? 'h1' : 'h2'

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = sectionRef.current
    const dot = cursorRef.current
    if (!root || !dot) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let frame = 0
    let running = false

    const loop = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    const onMove = (event: MouseEvent) => {
      tx = event.clientX
      ty = event.clientY
      dot.classList.add('is-on')
      const card = (event.target as HTMLElement | null)?.closest('.oe-card')
      dot.classList.toggle('is-hot', Boolean(card))
      if (!running) {
        running = true
        frame = requestAnimationFrame(loop)
      }
    }
    const onLeave = () => {
      dot.classList.remove('is-on', 'is-hot')
      running = false
      cancelAnimationFrame(frame)
    }
    root.addEventListener('mousemove', onMove)
    root.addEventListener('mouseleave', onLeave)
    return () => {
      root.removeEventListener('mousemove', onMove)
      root.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  const moveCard = (event: ReactMouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    card.style.setProperty('--mx', `${px * 100}%`)
    card.style.setProperty('--my', `${py * 100}%`)
    const arch = card.querySelector<HTMLElement>('.oe-arch')
    if (arch) {
      arch.style.transform = `translate3d(${(px - 0.5) * 14}px, ${(py - 0.5) * 10}px, 0)`
    }
  }

  const leaveCard = (event: ReactMouseEvent<HTMLElement>) => {
    const arch = event.currentTarget.querySelector<HTMLElement>('.oe-arch')
    if (arch) arch.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <div className="relative flex w-full flex-col overflow-x-hidden bg-white">
      <section
        ref={sectionRef}
        className={`oe relative overflow-hidden px-4 md:px-8 ${inView ? 'is-in' : ''} ${
          includeClosing ? 'pb-16 pt-24 md:pb-20 md:pt-28' : 'pb-12 pt-20 md:pb-16 md:pt-24'
        }`}
      >
        <div ref={cursorRef} className="oe-cursor" aria-hidden />
        <div className="oe-glow oe-glow-a" aria-hidden />
        <div className="oe-glow oe-glow-b" aria-hidden />
        <div className="oe-head">
          <p className="oe-kicker">Instituto Winston Churchill</p>
          <TitleTag className="oe-title">
            <span className="oe-mask"><span className="oe-word">Oferta</span></span>{' '}
            <span className="oe-mask"><span className="oe-word">educativa</span></span>
          </TitleTag>
          <div className="oe-bar" />
          <p className="oe-lead">
            Un camino bilingüe de kínder a secundaria. Conoce cada etapa. Da el
            siguiente paso con la familia del Instituto Winston Churchill.
          </p>
        </div>

        <div className="oe-row">
          {LEVELS.map((level, index) => {
            const explore = level.external ? (
              <a href={level.link} target="_blank" rel="noopener noreferrer" className="oe-link">
                Explorar nivel
                <span className="oe-arrow" aria-hidden />
              </a>
            ) : (
              <Link href={level.link} className="oe-link">
                Explorar nivel
                <span className="oe-arrow" aria-hidden />
              </Link>
            )
            return (
              <article
                key={level.name}
                className={`oe-card${active === index ? ' is-active' : ''}`}
                style={{ ['--c' as string]: level.color }}
                tabIndex={0}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onMouseMove={moveCard}
                onMouseLeave={leaveCard}
              >
                <div className="oe-stage">
                  <div className="oe-halo" aria-hidden />
                  <div className="oe-arch">
                    <Image
                      src={level.image}
                      alt={`Estudiante de ${level.name} — Instituto Winston Churchill`}
                      fill
                      sizes="230px"
                      className="oe-img"
                    />
                  </div>
                </div>
                <div className="oe-body">
                  <h3 className="oe-name">{level.name}</h3>
                  <span className="oe-rule" aria-hidden />
                  <div className="oe-reveal">
                    <p>{level.blurb}</p>
                    {explore}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <style jsx global>{`
          .oe {
            --oe-blue: #1546e8;
            --oe-ink: #0a1240;
            --oe-lime: #dfff00;
            --oe-cyan: #00d8ff;
            --oe-muted: #5b6490;
            --oe-ease: cubic-bezier(.16,1,.3,1);
            background: #fff;
            color: var(--oe-ink);
            font-family: var(--font-poppins), Poppins, sans-serif;
          }
          .oe-cursor {
            display: none;
            position: fixed;
            top: 0; left: 0;
            z-index: 70;
            width: 14px; height: 14px;
            margin: -7px 0 0 -7px;
            border-radius: 999px;
            background: var(--oe-blue);
            mix-blend-mode: multiply;
            pointer-events: none;
            opacity: 0;
          }
          .oe-cursor.is-on { opacity: 1; }
          .oe-cursor.is-hot {
            width: 70px; height: 70px;
            margin: -35px 0 0 -35px;
            background: var(--oe-lime);
          }
          @media (hover: hover) and (pointer: fine) {
            .oe-cursor { display: block; }
            .oe, .oe a { cursor: none; }
          }
          .oe-glow {
            position: absolute;
            z-index: 0;
            width: 340px; height: 340px;
            border-radius: 999px;
            filter: blur(90px);
            opacity: .35;
            pointer-events: none;
            animation: oeFloat 18s ease-in-out infinite alternate;
          }
          .oe-glow-a { left: -120px; top: 40px; background: var(--oe-lime); }
          .oe-glow-b { right: -120px; top: 180px; background: #9db4ff; animation-delay: -6s; }
          @keyframes oeFloat {
            from { transform: translate3d(0,0,0); }
            to { transform: translate3d(28px,-36px,0); }
          }
          .oe-head, .oe-row { position: relative; z-index: 1; }
          .oe-head { text-align: center; margin-bottom: 2.5rem; }
          .oe-kicker {
            margin: 0 0 .8rem;
            color: var(--oe-blue);
            font-size: .8rem;
            font-weight: 700;
            letter-spacing: .18em;
            text-transform: uppercase;
          }
          .oe-title {
            margin: 0;
            color: var(--oe-blue);
            font-weight: 800;
            font-size: clamp(2.4rem, 6vw, 4.6rem);
            letter-spacing: -0.03em;
            line-height: .95;
          }
          .oe-mask { display: inline-block; overflow: hidden; vertical-align: bottom; }
          .oe-word {
            display: inline-block;
            transform: translateY(105%);
            transition: transform 1s var(--oe-ease);
          }
          .oe.is-in .oe-word { transform: translateY(0); }
          .oe.is-in .oe-mask + .oe-mask .oe-word { transition-delay: .12s; }
          .oe-bar {
            width: 0; height: 5px;
            margin: 1rem auto 0;
            border-radius: 999px;
            background: var(--oe-lime);
            transition: width 1s var(--oe-ease) .5s;
          }
          .oe.is-in .oe-bar { width: 56px; }
          .oe-lead {
            max-width: 46ch;
            margin: 1rem auto 0;
            color: var(--oe-muted);
            font-size: 1rem;
            line-height: 1.55;
            opacity: 0;
            transition: opacity 1s var(--oe-ease) .7s;
          }
          .oe.is-in .oe-lead { opacity: 1; }
          .oe-row {
            display: flex;
            max-width: 1180px;
            height: 600px;
            margin: 0 auto;
            gap: 20px;
          }
          .oe-card {
            position: relative;
            display: flex;
            flex: 1;
            flex-direction: column;
            min-width: 0;
            overflow: hidden;
            border: 1px solid #e3e8fb;
            border-radius: 28px;
            background: #f6f8ff;
            cursor: pointer;
            transition: flex 1s var(--oe-ease), background 1s var(--oe-ease), box-shadow 1s var(--oe-ease);
          }
          .oe-card.is-active {
            flex: 1.7;
            background: #fff;
            box-shadow: 0 40px 80px -30px rgba(21,70,232,.35);
          }
          .oe-card:focus-visible { outline: 3px solid var(--oe-blue); outline-offset: 3px; }
          .oe-card::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
            opacity: 0;
            background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 20%), rgba(21,70,232,.10), transparent 60%);
            transition: opacity .4s var(--oe-ease);
          }
          .oe-card.is-active::before { opacity: 1; }
          .oe-stage {
            position: relative;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            height: 320px;
            margin-top: 18px;
          }
          .oe-halo, .oe-arch {
            width: 230px;
            height: 264px;
            border-radius: 115px 115px 18px 18px;
          }
          .oe-halo {
            position: absolute;
            z-index: 0;
            background: var(--c);
            opacity: .55;
            transform: translateY(30px) scale(.86);
            transition: transform 1s var(--oe-ease), opacity 1s var(--oe-ease);
          }
          .oe-card.is-active .oe-halo { opacity: 1; transform: translateY(0) scale(1.12); }
          .oe-arch {
            position: relative;
            z-index: 1;
            overflow: hidden;
            clip-path: inset(100% 0 0 0 round 115px 115px 18px 18px);
            transition: clip-path 1.2s var(--oe-ease), transform .2s linear;
          }
          .oe.is-in .oe-card:nth-child(1) .oe-arch { clip-path: inset(0 round 115px 115px 18px 18px); }
          .oe.is-in .oe-card:nth-child(2) .oe-arch { clip-path: inset(0 round 115px 115px 18px 18px); transition: clip-path 1.2s var(--oe-ease) .15s, transform .2s linear; }
          .oe.is-in .oe-card:nth-child(3) .oe-arch { clip-path: inset(0 round 115px 115px 18px 18px); transition: clip-path 1.2s var(--oe-ease) .3s, transform .2s linear; }
          .oe-img {
            object-fit: cover;
            object-position: center 16%;
            transform: scale(1.15);
            transition: transform 6s ease-out;
          }
          .oe-card.is-active .oe-img { transform: scale(1.02); }
          .oe-body { position: relative; z-index: 3; padding: 8px 22px 26px; }
          .oe-name {
            margin: 0;
            color: var(--oe-ink);
            font-weight: 800;
            font-size: clamp(1.4rem, 2.4vw, 2rem);
            letter-spacing: -0.03em;
          }
          .oe-rule {
            display: block;
            width: 30px; height: 4px;
            margin: 10px 0 0;
            border-radius: 999px;
            background: var(--c);
            transition: width 1s var(--oe-ease);
          }
          .oe-card.is-active .oe-rule { width: 90px; }
          .oe-reveal {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 1s var(--oe-ease), opacity .6s var(--oe-ease);
          }
          .oe-card.is-active .oe-reveal {
            max-height: 160px;
            opacity: 1;
            transition-delay: .15s;
          }
          .oe-reveal p {
            margin: 12px 0 0;
            color: var(--oe-muted);
            font-size: .92rem;
            line-height: 1.45;
          }
          .oe-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-top: 14px;
            color: var(--oe-blue);
            font-size: .78rem;
            font-weight: 800;
            letter-spacing: .12em;
            text-transform: uppercase;
            text-decoration: none;
          }
          .oe-link:focus-visible { outline: 3px solid var(--oe-blue); outline-offset: 3px; }
          .oe-arrow {
            position: relative;
            display: inline-block;
            width: 22px; height: 2px;
            background: currentColor;
            transition: width .4s var(--oe-ease);
          }
          .oe-arrow::after {
            content: '';
            position: absolute;
            right: -1px; top: -4px;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 7px solid currentColor;
          }
          .oe-link:hover .oe-arrow, .oe-link:focus-visible .oe-arrow { width: 40px; }
          @media (max-width: 860px) {
            .oe-row { flex-direction: column; height: auto; }
            .oe-card, .oe-card.is-active {
              flex: none;
              flex-direction: row;
              align-items: center;
              gap: 14px;
              width: 100%;
              padding: 14px;
              box-shadow: none;
            }
            .oe-stage { width: 130px; height: 150px; margin: 0; flex: none; }
            .oe-halo { display: none; }
            .oe-arch, .oe.is-in .oe-arch {
              width: 130px; height: 150px;
              border-radius: 65px 65px 12px 12px;
              clip-path: none;
              transform: none !important;
            }
            .oe-body { padding: 0; }
            .oe-reveal, .oe-card.is-active .oe-reveal {
              max-height: none;
              opacity: 1;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .oe-word { transform: none !important; }
            .oe-bar { width: 56px !important; transition: none !important; }
            .oe-lead { opacity: 1 !important; }
            .oe-arch { clip-path: none !important; transition: none !important; }
            .oe-glow { animation: none !important; }
            .oe-card, .oe-halo, .oe-img, .oe-reveal, .oe-rule, .oe-arrow { transition: none !important; }
          }
        `}</style>
      </section>

      {includeClosing && (
        <>
      <EnrollmentCTA />

      {/* Footer de sección (compacto) — se mantiene para no romper home / oferta */}
      <div className="flex-shrink-0">
        {/* 2026-09-22: pb-28 en móvil = espacio del sticky CTA, mismo azul (sin franja negra) */}
        {/* 2026-09-30: min-h en desktop para dar espacio a la franja legal (incorporación SEP). */}
        <footer
          className={`relative overflow-hidden text-white ${isMobile ? 'min-h-[170px] pb-28' : 'min-h-[24vh]'}`}
        >
          <div className="absolute inset-0" style={{ backgroundColor: '#013BDF' }} />

          {isMobile ? (
            <div className="relative z-10 flex h-full flex-col justify-between px-4 py-2">
              <div className="flex-1">
                <div className="mb-3 flex items-center">
                  {/* 2026-09-26: next/image lazy en logo del footer de oferta educativa. */}
                  <Image src="/images/logos/logo_winston.png" alt="Winston" width={60} height={16} className="h-4 w-auto" sizes="60px" loading="lazy" />
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
                {/* 2026-09-30: Enlace real al aviso de privacidad (antes href="#"). */}
                <Link href={PRIVACY_NOTICE_PATH} className="block text-[6px] font-medium uppercase tracking-wide transition-colors hover:text-yellow-400">
                  AVISO DE PRIVACIDAD
                </Link>
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

              {/* 2026-09-30: Incorporación SEP + aviso + preferencias de cookies. */}
              <div className="mt-3">
                <FooterLegal compact />
              </div>
            </div>
          ) : (
            <div className="relative z-10 container mx-auto px-4 py-4 sm:px-6 md:px-10 md:py-6">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center md:mb-4">
                  {/* 2026-09-26: next/image lazy en logo footer desktop de oferta educativa. */}
                  <Image src="/images/logos/logo_winston.png" alt="Winston" width={70} height={19} className="h-5 w-auto md:h-6" sizes="70px" loading="lazy" />
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

              {/* 2026-09-30: Incorporación SEP + aviso + preferencias de cookies. */}
              <div className="mt-4">
                <FooterLegal compact />
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
              {/* 2026-09-30: Enlace real al aviso de privacidad (antes href="#"). */}
              <Link
                href={PRIVACY_NOTICE_PATH}
                className="absolute bottom-24 right-4 z-20 text-[8px] font-semibold uppercase tracking-wide transition-colors hover:text-yellow-400 sm:text-[10px] md:bottom-28 md:right-10"
              >
                AVISO DE PRIVACIDAD
              </Link>
            </>
          )}
        </footer>
      </div>
        </>
      )}
    </div>
  )
}
