// 2026-10-19: Oferta educativa — acordeón, continuidad y cierre. Mismos textos y enlaces.
// Pages Router: cliente sin "use client". Sin librerías nuevas. Poppins de marca.
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    // 2026-10-26: archivo nuevo. /_next/image deja cacheada la URL anterior un año.
    image: '/images/education/secundaria-2026.png',
    blurb: 'Preparación integral para el siguiente paso. Disciplina y visión global.',
    color: '#1546E8',
    link: '/secundaria',
    external: false,
  },
] as const

const CLOSE_HEAD = 'Da el siguiente paso con la familia Winston'

const CHAMPS = [
  {
    src: '/images/logos/convenios-alumnas.jpg',
    alt: 'Alumnas del Instituto Winston Churchill con medallas',
    label: 'Medallas',
  },
  {
    src: '/images/slider/SLIDE_INICIO_2.jpg',
    alt: 'Alumna con medalla frente al campus Winston',
    label: 'Generación',
  },
  {
    src: '/images/Winston%20Life/portada-1280.webp',
    alt: 'Equipo de alumnos en Winston Olympics',
    label: 'Winston Olympics',
  },
] as const

export default function OfertaEducativaSection({
  // 2026-08-15: En /oferta-educativa el título es H1.
  isPageTitle = false,
  // 2026-10-19: En FullPage el cierre (CTA+footer) va en HomeClosingSection — evita corte.
  includeClosing = true,
}: {
  isPageTitle?: boolean
  includeClosing?: boolean
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isStacked, setIsStacked] = useState(false)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [closeIn, setCloseIn] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [champ, setChamp] = useState(0)
  const [champPaused, setChampPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLElement>(null)
  const TitleTag = isPageTitle ? 'h1' : 'h2'

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768)
      setIsStacked(window.innerWidth < 900)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (reduced || champPaused) return
    const id = window.setInterval(() => {
      setChamp((index) => (index + 1) % CHAMPS.length)
    }, 4800)
    return () => window.clearInterval(id)
  }, [reduced, champPaused])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
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
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  useEffect(() => {
    const node = closeRef.current
    if (!node || !includeClosing) return
    if (reduced) {
      setCloseIn(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCloseIn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced, includeClosing])

  const moveCard = (event: ReactMouseEvent<HTMLElement>) => {
    if (reduced || window.innerWidth < 900) return
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
        className={`oe relative overflow-x-hidden px-4 md:px-8 ${inView ? 'is-in' : ''} ${
          includeClosing ? 'pb-10 pt-24 md:pb-12 md:pt-28' : 'pb-10 pt-20 md:pb-12 md:pt-24'
        }`}
      >
        <div className="oe-glow-wrap" aria-hidden>
          <div className="oe-glow oe-glow-a" />
          <div className="oe-glow oe-glow-b" />
        </div>

        <div className="oe-head">
          <p className="oe-kicker">Instituto Winston Churchill</p>
          <TitleTag className="oe-title">
            <span className="oe-mask">
              <span className="oe-word">Oferta</span>
            </span>{' '}
            <span className="oe-mask">
              <span className="oe-word">educativa</span>
            </span>
          </TitleTag>
          <div className="oe-bar" />
          <p className="oe-lead">
            Impulsamos y acompañamos su potencial en cada etapa.
          </p>
        </div>

        <div className="oe-row">
          {LEVELS.map((level, index) => {
            const ctaOpen = active === index || isStacked
            const explore = level.external ? (
              <a
                href={level.link}
                target="_blank"
                rel="noopener noreferrer"
                className="oe-link"
                tabIndex={ctaOpen ? undefined : -1}
              >
                Explorar nivel
                <span className="oe-arrow" aria-hidden />
              </a>
            ) : (
              <Link href={level.link} className="oe-link" tabIndex={ctaOpen ? undefined : -1}>
                Explorar nivel
                <span className="oe-arrow" aria-hidden />
              </Link>
            )
            return (
              <article
                key={level.name}
                className={`oe-card${active === index || isStacked ? ' is-active' : ''}`}
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
                      sizes="(max-width: 900px) 130px, 230px"
                      className="oe-img"
                    />
                  </div>
                </div>
                <div className="oe-body">
                  <h3 className="oe-name">{level.name}</h3>
                  <span className="oe-rule" aria-hidden />
                  <p className="oe-blurb">{level.blurb}</p>
                  <div
                    className="oe-cta"
                    aria-hidden={!ctaOpen}
                    {...(!ctaOpen ? { inert: true } : {})}
                  >
                    {explore}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* 2026-10-29: título y párrafo en una fila; el carrusel ocupa el ancho de abajo. */}
        <section className="oe-champs" aria-labelledby="oe-champs-heading">
          <div className="oe-champs-copy">
            <div className="oe-champs-title">
              <p className="oe-champs-kicker">Primaria y secundaria</p>
              <h2 id="oe-champs-heading">Formamos campeones</h2>
            </div>
            <p className="oe-champs-lead">
              En Winston celebramos con orgullo el talento, la dedicación y los logros de nuestros
              alumnos de primaria y secundaria, quienes destacan en competencias estatales, regionales
              y nacionales. Con su esfuerzo y preparación, nuestros estudiantes dejan en alto el nombre
              de nuestra institución y demuestran que en Winston formamos campeones.
            </p>
          </div>
          <div
            className="oe-carousel"
            onMouseEnter={() => setChampPaused(true)}
            onMouseLeave={() => setChampPaused(false)}
          >
            <div className="oe-carousel-viewport">
              <div
                className="oe-carousel-track"
                style={{ transform: `translate3d(-${champ * 100}%, 0, 0)` }}
              >
                {CHAMPS.map((shot) => (
                  <figure key={shot.src} className="oe-shot">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(max-width: 800px) 100vw, 1120px"
                      className="oe-shot-img"
                    />
                    <figcaption>{shot.label}</figcaption>
                  </figure>
                ))}
              </div>
              <button
                type="button"
                className="oe-car-btn oe-car-prev"
                aria-label="Foto anterior"
                onClick={() => setChamp((index) => (index - 1 + CHAMPS.length) % CHAMPS.length)}
              />
              <button
                type="button"
                className="oe-car-btn oe-car-next"
                aria-label="Foto siguiente"
                onClick={() => setChamp((index) => (index + 1) % CHAMPS.length)}
              />
            </div>
            <div className="oe-car-dots">
              {CHAMPS.map((shot, index) => (
                <button
                  key={shot.src}
                  type="button"
                  className={index === champ ? 'is-on' : undefined}
                  aria-label={shot.label}
                  aria-current={index === champ ? 'true' : undefined}
                  onClick={() => setChamp(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 2026-10-29: estancia con foto real de acompañamiento; el texto oficial se conserva. */}
        <section id="estancia" className="oe-estancia">
          <figure className="oe-estancia-photo">
            <Image
              src="/images/mindfulness/mindfulness3.jpg"
              alt="Maestra del Instituto Winston Churchill acompaña a una alumna en una actividad"
              fill
              sizes="(max-width: 800px) 100vw, 520px"
              className="oe-estancia-img"
            />
          </figure>
          <div className="oe-estancia-copy">
            <p className="oe-estancia-kicker">Después de clases</p>
            <h2>Estancia extendida</h2>
            <p className="oe-estancia-hour">Hasta las 7:00 p.m.</p>
            <p>
              Después de clases acompañamos a los alumnos hasta las 7:00 p.m., con cuidado y apoyo
              en tareas. Cada familia elige el horario que necesita.
            </p>
          </div>
        </section>

        <style jsx global>{`
          .oe {
            --oe-blue: #1546e8;
            --oe-ink: #0a1240;
            --oe-lime: #dfff00;
            --oe-cyan: #00d8ff;
            --oe-muted: #5b6490;
            --oe-ease: cubic-bezier(.16, 1, .3, 1);
            background: #fff;
            color: var(--oe-ink);
            font-family: var(--font-poppins), Poppins, sans-serif;
          }
          .oe-glow-wrap {
            position: absolute;
            inset: 0;
            z-index: 0;
            overflow: hidden;
            pointer-events: none;
          }
          .oe-glow {
            position: absolute;
            width: 320px;
            height: 320px;
            border-radius: 999px;
            filter: blur(90px);
            opacity: .3;
            animation: oeDrift 18s ease-in-out infinite alternate;
          }
          .oe-glow-a {
            left: 4%;
            top: 8%;
            background: var(--oe-lime);
          }
          .oe-glow-b {
            right: 6%;
            top: 28%;
            background: #9db4ff;
            animation-delay: -6s;
          }
          @keyframes oeDrift {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(24px, -28px, 0); }
          }
          .oe-head,
          .oe-row,
          .oe-path {
            position: relative;
            z-index: 1;
          }
          .oe-head {
            text-align: center;
            margin-bottom: 2.5rem;
          }
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
          .oe-mask {
            display: inline-block;
            overflow: hidden;
            vertical-align: bottom;
          }
          .oe-word {
            display: inline-block;
            transform: translateY(105%);
            transition: transform 1s var(--oe-ease);
          }
          .oe.is-in .oe-word { transform: translateY(0); }
          .oe.is-in .oe-mask + .oe-mask .oe-word { transition-delay: .12s; }
          .oe-bar {
            width: 0;
            height: 5px;
            margin: 1rem auto 0;
            border-radius: 999px;
            background: var(--oe-lime);
            transition: width 1s var(--oe-ease) .5s;
          }
          .oe.is-in .oe-bar { width: 56px; }
          .oe-champs {
            position: relative;
            z-index: 1;
            max-width: 1120px;
            margin: 3.25rem auto 0;
          }
          .oe-champs-copy {
            display: grid;
            grid-template-columns: minmax(15rem, .82fr) minmax(0, 1.18fr);
            gap: 1.25rem 3rem;
            align-items: center;
            margin-bottom: 1.15rem;
          }
          .oe-champs-title { position: relative; padding-left: 1rem; }
          .oe-champs-title::before {
            content: '';
            position: absolute;
            left: 0;
            top: .15rem;
            bottom: .2rem;
            width: 4px;
            border-radius: 999px;
            background: #E3FB07;
          }
          .oe-champs-kicker {
            margin: 0 0 .55rem;
            color: #013BDF;
            font-size: .75rem;
            font-weight: 800;
            letter-spacing: .18em;
            text-transform: uppercase;
          }
          .oe-champs h2 {
            margin: 0;
            max-width: 8ch;
            color: #0a1240;
            font-size: clamp(2.35rem, 3.4vw, 3.35rem);
            font-weight: 800;
            letter-spacing: -0.045em;
            line-height: .92;
            text-align: left;
          }
          .oe-champs-lead {
            margin: 0;
            color: #3d466e;
            font-size: 1.02rem;
            line-height: 1.6;
          }
          .oe-carousel { position: relative; }
          .oe-carousel-viewport {
            position: relative;
            overflow: hidden;
            border-radius: 28px;
          }
          .oe-carousel-track {
            display: flex;
            transition: transform .7s var(--oe-ease);
          }
          .oe-shot {
            position: relative;
            flex: 0 0 100%;
            aspect-ratio: 2 / 1;
            height: auto;
            margin: 0;
            background: #0a1240;
          }
          .oe-shot-img { object-fit: cover; object-position: center 32%; }
          .oe-shot figcaption {
            position: absolute;
            left: 16px;
            bottom: 16px;
            margin: 0;
            padding: .4rem .75rem;
            border-radius: 999px;
            background: rgba(10, 18, 64, .62);
            color: #fff;
            font-size: .72rem;
            font-weight: 700;
            letter-spacing: .12em;
            text-transform: uppercase;
            backdrop-filter: blur(8px);
          }
          .oe-car-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
            width: 44px;
            height: 44px;
            border: 0;
            border-radius: 999px;
            background: #fff;
            box-shadow: 0 10px 24px -12px rgba(10, 18, 64, .6);
            cursor: pointer;
          }
          .oe-car-btn::before {
            content: '';
            position: absolute;
            top: 16px;
            width: 10px;
            height: 10px;
            border-top: 2px solid #013BDF;
            border-right: 2px solid #013BDF;
          }
          .oe-car-prev { left: 14px; }
          .oe-car-prev::before { left: 18px; transform: rotate(-135deg); }
          .oe-car-next { right: 14px; }
          .oe-car-next::before { right: 18px; transform: rotate(45deg); }
          .oe-car-btn:focus-visible { outline: 3px solid #013BDF; outline-offset: 3px; }
          .oe-car-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 14px;
          }
          .oe-car-dots button {
            width: 8px;
            height: 8px;
            padding: 0;
            border: 0;
            border-radius: 999px;
            background: #d5def8;
            cursor: pointer;
            transition: width .35s var(--oe-ease), background .35s var(--oe-ease);
          }
          .oe-car-dots button.is-on { width: 28px; background: #013BDF; }
          @media (max-width: 800px) {
            .oe-champs-copy { grid-template-columns: 1fr; gap: .85rem; }
            .oe-champs h2 { max-width: none; }
            .oe-shot { aspect-ratio: auto; height: 280px; }
            .oe-car-prev { left: 8px; }
            .oe-car-next { right: 8px; }
          }
          .oe-estancia {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
            gap: 1.5rem 2.75rem;
            align-items: center;
            max-width: 1120px;
            margin: 3.5rem auto 0;
          }
          .oe-estancia-photo {
            position: relative;
            height: min(42vw, 420px);
            margin: 0;
            overflow: hidden;
            border-radius: 28px;
            background: #0a1240;
          }
          .oe-estancia-img { object-fit: cover; object-position: 34% 42%; }
          .oe-estancia-copy { position: relative; padding-left: 1rem; }
          .oe-estancia-copy::before {
            content: '';
            position: absolute;
            left: 0;
            top: .15rem;
            bottom: .2rem;
            width: 4px;
            border-radius: 999px;
            background: #E3FB07;
          }
          .oe-estancia-kicker {
            margin: 0 0 .55rem;
            color: #013BDF;
            font-size: .75rem;
            font-weight: 800;
            letter-spacing: .18em;
            text-transform: uppercase;
          }
          .oe-estancia h2 {
            margin: 0;
            color: #0a1240;
            font-size: clamp(2.1rem, 3.2vw, 3rem);
            font-weight: 800;
            letter-spacing: -0.04em;
            line-height: .95;
          }
          .oe-estancia-hour {
            margin: .9rem 0 0;
            color: #013BDF;
            font-size: .95rem;
            font-weight: 800;
            letter-spacing: .04em;
          }
          .oe-estancia-copy p:last-child {
            max-width: 38ch;
            margin: .75rem 0 0;
            color: #3d466e;
            line-height: 1.6;
          }
          @media (max-width: 800px) {
            .oe-estancia { grid-template-columns: 1fr; gap: 1.1rem; }
            .oe-estancia-photo { height: 240px; }
            .oe-estancia-copy p:last-child { max-width: none; }
          }
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
            align-items: flex-start;
            max-width: 1180px;
            margin: 0 auto;
            gap: 20px;
          }
          .oe-card {
            position: relative;
            display: grid;
            grid-template-rows: auto auto;
            flex: 1;
            min-width: 0;
            min-height: 560px;
            height: auto;
            overflow: hidden;
            border: 1px solid #e3e8fb;
            border-radius: 28px;
            background: #f6f8ff;
            cursor: pointer;
            transition:
              flex 1s var(--oe-ease),
              background 1s var(--oe-ease),
              box-shadow 1s var(--oe-ease);
          }
          .oe-card.is-active {
            flex: 1.7;
            background: #fff;
            box-shadow: 0 40px 80px -30px rgba(21, 70, 232, .35);
          }
          .oe-card:focus-visible {
            outline: 3px solid var(--oe-blue);
            outline-offset: 3px;
          }
          .oe-card::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
            opacity: 0;
            background: radial-gradient(
              420px circle at var(--mx, 50%) var(--my, 20%),
              rgba(21, 70, 232, .1),
              transparent 60%
            );
            transition: opacity .4s var(--oe-ease);
          }
          .oe-card.is-active::before { opacity: 1; }
          .oe-stage {
            position: relative;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            width: 100%;
            /* 264 foto + 18 halo + aire superior */
            min-height: calc(264px + 18px + 28px);
            padding: 28px 18px 0 0;
            box-sizing: border-box;
          }
          .oe-halo,
          .oe-arch {
            width: 230px;
            height: 264px;
            border-radius: 115px 115px 18px 18px;
          }
          .oe-halo {
            position: absolute;
            z-index: 0;
            top: 28px;
            left: 50%;
            margin-left: -115px;
            background: var(--c);
            opacity: .5;
            transform: translate(14px, 14px);
            transition: transform 1s var(--oe-ease), opacity 1s var(--oe-ease);
          }
          .oe-card.is-active .oe-halo {
            opacity: 1;
            transform: translate(18px, 18px);
          }
          .oe-arch {
            position: relative;
            z-index: 1;
            flex: none;
            overflow: hidden;
            clip-path: inset(100% 0 0 0 round 115px 115px 18px 18px);
            transition: clip-path 1.2s var(--oe-ease), transform .2s linear;
          }
          .oe.is-in .oe-card:nth-child(1) .oe-arch {
            clip-path: inset(0 round 115px 115px 18px 18px);
          }
          .oe.is-in .oe-card:nth-child(2) .oe-arch {
            clip-path: inset(0 round 115px 115px 18px 18px);
            transition: clip-path 1.2s var(--oe-ease) .15s, transform .2s linear;
          }
          .oe.is-in .oe-card:nth-child(3) .oe-arch {
            clip-path: inset(0 round 115px 115px 18px 18px);
            transition: clip-path 1.2s var(--oe-ease) .3s, transform .2s linear;
          }
          .oe-img {
            object-fit: cover;
            object-position: center 16%;
            transform: scale(1.15);
            transition: transform 6s ease-out;
          }
          .oe-card.is-active .oe-img { transform: scale(1.02); }
          .oe-body {
            position: relative;
            z-index: 3;
            display: flex;
            flex-direction: column;
            margin-top: 40px;
            padding: 8px 32px 32px;
          }
          .oe-name {
            margin: 0;
            color: var(--oe-ink);
            font-weight: 800;
            font-size: clamp(1.4rem, 2.4vw, 2rem);
            letter-spacing: -0.03em;
          }
          .oe-rule {
            display: block;
            width: 30px;
            height: 4px;
            margin: 10px 0 0;
            border-radius: 999px;
            background: var(--c);
            transition: width 1s var(--oe-ease);
          }
          .oe-card.is-active .oe-rule { width: 90px; }
          .oe-blurb {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            overflow: hidden;
            margin: 12px 0 0;
            color: var(--oe-muted);
            font-size: 15px;
            line-height: 1.45;
          }
          .oe-cta {
            margin-top: 14px;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transition:
              max-height 1s var(--oe-ease),
              opacity .6s var(--oe-ease),
              visibility 0s linear .6s;
          }
          .oe-card.is-active .oe-cta {
            max-height: 56px;
            opacity: 1;
            visibility: visible;
            transition:
              max-height 1s var(--oe-ease),
              opacity .6s var(--oe-ease) .12s,
              visibility 0s linear 0s;
          }
          .oe-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: var(--oe-blue);
            font-size: .78rem;
            font-weight: 800;
            letter-spacing: .12em;
            text-transform: uppercase;
            text-decoration: none;
          }
          .oe-link:focus-visible {
            outline: 3px solid var(--oe-blue);
            outline-offset: 3px;
          }
          .oe-arrow {
            position: relative;
            display: inline-block;
            width: 22px;
            height: 2px;
            background: currentColor;
            transition: width .4s var(--oe-ease);
          }
          .oe-arrow::after {
            content: '';
            position: absolute;
            right: -1px;
            top: -4px;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 7px solid currentColor;
          }
          .oe-link:hover .oe-arrow,
          .oe-link:focus-visible .oe-arrow {
            width: 40px;
          }

          /* —— Continuidad —— */
          .oe-path {
            max-width: 980px;
            margin: 0 auto;
            padding: 96px 0 24px;
          }
          .oe-path-title {
            margin: 0 0 2.5rem;
            text-align: center;
            color: var(--oe-ink);
            font-weight: 800;
            font-size: clamp(1.8rem, 3.4vw, 2.8rem);
            letter-spacing: -0.03em;
            line-height: 1.1;
            opacity: 0;
            transform: translateY(18px);
            transition: opacity 1s var(--oe-ease), transform 1s var(--oe-ease);
          }
          .oe-path.is-in .oe-path-title {
            opacity: 1;
            transform: translateY(0);
          }
          .oe-path-track {
            position: relative;
            padding-top: 9px;
          }
          .oe-path-base,
          .oe-path-fill {
            position: absolute;
            left: 8%;
            right: 8%;
            top: 17px;
            height: 3px;
            border-radius: 999px;
            transform-origin: left center;
          }
          .oe-path-base { background: #e3e8fb; }
          .oe-path-fill {
            background: var(--oe-blue);
            transform: scaleX(var(--oe-path, 0));
            transition: transform .05s linear;
          }
          .oe-path-dots {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .oe-path-dot {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 14px;
          }
          .oe-path-orb {
            width: 18px;
            height: 18px;
            border-radius: 999px;
            background: var(--c);
            box-shadow: 0 0 0 4px #fff;
            transform: scale(1);
            transition: transform 1s var(--oe-ease);
          }
          .oe-path-dot.is-on .oe-path-orb { transform: scale(1.4); }
          .oe-path-meta {
            display: flex;
            flex-direction: column;
            gap: 6px;
            max-width: 22ch;
          }
          .oe-path-meta strong {
            color: var(--oe-ink);
            font-size: .95rem;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .oe-path-meta span {
            color: var(--oe-muted);
            font-size: .86rem;
            line-height: 1.45;
          }

          /* —— Cierre —— */
          .oe-close {
            position: relative;
            overflow: hidden;
            margin-top: 24px;
            padding: 96px 1.25rem;
            border-radius: 40px 40px 0 0;
            background: #1546e8;
            color: #fff;
            text-align: center;
            font-family: var(--font-poppins), Poppins, sans-serif;
          }
          .oe-close-glow {
            position: absolute;
            left: 50%;
            top: 10%;
            width: 420px;
            height: 420px;
            margin-left: -210px;
            border-radius: 999px;
            background: #dfff00;
            filter: blur(90px);
            opacity: .25;
            pointer-events: none;
          }
          .oe-close-inner {
            position: relative;
            z-index: 1;
            max-width: 820px;
            margin: 0 auto;
          }
          .oe-close-title {
            margin: 0;
            font-weight: 800;
            font-size: clamp(2rem, 4.4vw, 3.6rem);
            letter-spacing: -0.03em;
            line-height: 1.05;
          }
          .oe-close-title .oe-mask { vertical-align: bottom; }
          .oe-close-title .oe-word {
            transform: translateY(110%);
            transition: transform 1s var(--oe-ease);
          }
          .oe-close.is-in .oe-close-title .oe-word { transform: translateY(0); }
          .oe-close.is-in .oe-close-title .oe-mask:nth-child(2) .oe-word { transition-delay: .06s; }
          .oe-close.is-in .oe-close-title .oe-mask:nth-child(3) .oe-word { transition-delay: .12s; }
          .oe-close.is-in .oe-close-title .oe-mask:nth-child(4) .oe-word { transition-delay: .18s; }
          .oe-close.is-in .oe-close-title .oe-mask:nth-child(5) .oe-word { transition-delay: .24s; }
          .oe-close.is-in .oe-close-title .oe-mask:nth-child(6) .oe-word { transition-delay: .3s; }
          .oe-close.is-in .oe-close-title .oe-mask:nth-child(7) .oe-word { transition-delay: .36s; }
          .oe-close-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px;
            margin-top: 2rem;
          }
          .oe-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            height: 56px;
            padding: 0 1.4rem;
            border-radius: 999px;
            font-size: .82rem;
            font-weight: 800;
            letter-spacing: .08em;
            text-transform: uppercase;
            text-decoration: none;
            transition: transform .35s var(--oe-ease), background .35s var(--oe-ease), color .35s var(--oe-ease);
          }
          .oe-btn-solid {
            background: #dfff00;
            color: #0a1240;
          }
          .oe-btn-ghost {
            border: 1.5px solid #fff;
            color: #fff;
            background: transparent;
          }
          .oe-btn:focus-visible {
            outline: 3px solid #fff;
            outline-offset: 3px;
          }
          .oe-btn .oe-arrow {
            background: currentColor;
          }
          .oe-btn .oe-arrow::after {
            border-left-color: currentColor;
          }
          .oe-btn:hover .oe-arrow,
          .oe-btn:focus-visible .oe-arrow {
            width: 40px;
          }
          .oe-close-usa {
            display: inline-block;
            margin-top: 1.5rem;
            color: rgba(255, 255, 255, .82);
            font-size: .9rem;
            font-weight: 600;
            text-decoration: underline;
            text-underline-offset: 4px;
          }
          .oe-close-usa:hover,
          .oe-close-usa:focus-visible {
            color: #dfff00;
          }
          .oe-close-usa:focus-visible {
            outline: 3px solid #fff;
            outline-offset: 3px;
          }
          .oe-close-usa small {
            display: block;
            margin-top: .25rem;
            font-size: .78rem;
            font-weight: 500;
            color: rgba(255, 255, 255, .7);
            text-decoration: none;
          }

          @media (max-width: 899px) {
            .oe-row {
              flex-direction: column;
              gap: 14px;
            }
            .oe-card,
            .oe-card.is-active {
              display: grid;
              grid-template-columns: 130px 1fr;
              grid-template-rows: auto;
              flex: none;
              align-items: center;
              gap: 14px;
              width: 100%;
              min-height: 0;
              padding: 14px;
              box-shadow: none;
            }
            .oe-stage {
              width: 130px;
              min-height: 150px;
              margin: 0;
              padding: 0;
              flex: none;
            }
            .oe-halo { display: none; }
            .oe-arch,
            .oe.is-in .oe-arch {
              width: 130px;
              height: 150px;
              border-radius: 65px 65px 12px 12px;
              clip-path: none;
              transform: none !important;
            }
            .oe-body {
              margin-top: 0;
              padding: 0;
            }
            .oe-blurb {
              -webkit-line-clamp: unset;
              line-clamp: unset;
              font-size: .9rem;
            }
            .oe-cta,
            .oe-card.is-active .oe-cta {
              max-height: none;
              opacity: 1;
              visibility: visible;
            }
            .oe-path {
              padding: 72px 0 8px;
            }
            .oe-path-track {
              padding-top: 0;
              padding-left: 28px;
            }
            .oe-path-base,
            .oe-path-fill {
              left: 8px;
              right: auto;
              top: 0;
              bottom: 0;
              width: 3px;
              height: auto;
              transform-origin: top center;
            }
            .oe-path-fill {
              transform: scaleY(var(--oe-path, 0));
            }
            .oe-path-dots {
              grid-template-columns: 1fr;
              gap: 28px;
            }
            .oe-path-dot {
              flex-direction: row;
              align-items: flex-start;
              text-align: left;
              gap: 16px;
            }
            .oe-path-meta { max-width: none; }
            .oe-close {
              padding: 72px 1.1rem;
              border-radius: 28px 28px 0 0;
            }
            .oe-close-actions { flex-direction: column; align-items: stretch; }
            .oe-btn { width: 100%; }
          }

          @media (prefers-reduced-motion: reduce) {
            .oe-word,
            .oe-close-title .oe-word { transform: none !important; }
            .oe-bar { width: 56px !important; transition: none !important; }
            .oe-lead { opacity: 1 !important; }
            .oe-arch { clip-path: none !important; transition: none !important; }
            .oe-glow { animation: none !important; }
            .oe-path-title { opacity: 1 !important; transform: none !important; }
            .oe-path-fill { transform: scaleX(1) !important; }
            .oe-path-dot .oe-path-orb { transform: scale(1.4) !important; }
            .oe-card,
            .oe-halo,
            .oe-img,
            .oe-cta,
            .oe-rule,
            .oe-arrow,
            .oe-path-orb,
            .oe-btn,
            .oe-shot-img { transition: none !important; }
            .oe-shot-img { transform: none !important; }
            .oe-carousel-track { transition: none !important; }
          }
          @media (max-width: 899px) and (prefers-reduced-motion: reduce) {
            .oe-path-fill { transform: scaleY(1) !important; }
          }
        `}</style>
      </section>

      {includeClosing && (
        <>
          <section
            ref={closeRef}
            className={`oe-close${closeIn ? ' is-in' : ''}`}
            aria-labelledby="oe-close-heading"
          >
            <div className="oe-close-glow" aria-hidden />
            <div className="oe-close-inner">
              <h2 id="oe-close-heading" className="oe-close-title">
                {CLOSE_HEAD.split(' ').map((word) => (
                  <span className="oe-mask" key={word}>
                    <span className="oe-word">{word}&nbsp;</span>
                  </span>
                ))}
              </h2>
              <div className="oe-close-actions">
                <Link href="/contacto" className="oe-btn oe-btn-solid">
                  Agenda tu visita
                  <span className="oe-arrow" aria-hidden />
                </Link>
                <Link href="/admisiones" className="oe-btn oe-btn-ghost">
                  Inicia tu inscripción
                  <span className="oe-arrow" aria-hidden />
                </Link>
              </div>
              <Link href="/#winston-usa" className="oe-close-usa">
                Conoce el Winston USA Program
                <small>Doble titulación opcional</small>
              </Link>
            </div>
          </section>

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
                      <Image
                        src="/images/logos/logo_winston.png"
                        alt="Winston"
                        width={60}
                        height={16}
                        className="h-4 w-auto"
                        sizes="60px"
                        loading="lazy"
                      />
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
                    <Link
                      href={PRIVACY_NOTICE_PATH}
                      className="block text-[6px] font-medium uppercase tracking-wide transition-colors hover:text-yellow-400"
                    >
                      AVISO DE PRIVACIDAD
                    </Link>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://www.facebook.com/institutowinstonchurchill/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                      >
                        <span className="sr-only">Facebook</span>
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                      <a
                        href="https://wa.me/528334378743"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                      >
                        <span className="sr-only">WhatsApp</span>
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.815 0 0020.885 3.488" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/institutowinstonchurchill/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                      >
                        <span className="sr-only">Instagram</span>
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="mt-3">
                    <FooterLegal compact />
                  </div>
                </div>
              ) : (
                <div className="relative z-10 container mx-auto px-4 py-4 sm:px-6 md:px-10 md:py-6">
                  <div className="max-w-2xl">
                    <div className="mb-3 flex items-center md:mb-4">
                      <Image
                        src="/images/logos/logo_winston.png"
                        alt="Winston"
                        width={70}
                        height={19}
                        className="h-5 w-auto md:h-6"
                        sizes="70px"
                        loading="lazy"
                      />
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
                  <div className="mt-4">
                    <FooterLegal compact />
                  </div>
                </div>
              )}

              {!isMobile && (
                <>
                  <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-24">
                    <a
                      href="https://www.facebook.com/institutowinstonchurchill/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/528334378743"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                    >
                      <span className="sr-only">WhatsApp</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.815 0 0020.885 3.488" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/institutowinstonchurchill/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                    >
                      <span className="sr-only">Instagram</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
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
