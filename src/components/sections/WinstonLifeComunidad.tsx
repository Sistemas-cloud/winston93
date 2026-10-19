// 2026-10-19: Comunidad — recorrido horizontal pinneado (scroll vertical).
// Tipografía de marca: Poppins. Sin librerías nuevas.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'

const TITLE = '¿Qué es Winston Life?'

const INTRO =
  'Winston Life es la vida fuera del salón en el Instituto Winston Churchill. Aquí el alumno crece con deporte, proyectos y sentido de pertenencia. Es la forma en que vivimos el día a día en Ciudad Madero.'

const SCENES = [
  {
    id: 'wl-olympics',
    label: 'Deporte y actividad física con sentido de equipo.',
    title: 'Winston Olympics',
    body:
      'En Winston Olympics practicamos deporte en equipo. Buscamos disciplina, respeto y salud. Los juegos y competencias refuerzan hábitos sanos. También fortalecen la amistad entre compañeros.',
    image: '/images/Winston Life/portada-1280.webp',
    alt: 'Alumnos del Instituto Winston Churchill en Winston Olympics',
    accent: '#00d8ff',
    // grupo amplio: centro-arriba para no cortar caras
    focus: 'center 28%',
  },
  {
    id: 'wl-entrepreneurs',
    label: 'Emprendimiento con proyectos concretos.',
    title: 'Entrepreneurs',
    body:
      'En Entrepreneurs los alumnos presentan ideas. Aprenden a planear, hablar en público y trabajar en equipo. No es solo un taller. Es práctica real de liderazgo desde edades tempranas.',
    image: '/images/Winston Life/emprendedores/emprendedores1.jpg',
    alt: 'Alumnos del programa Entrepreneurs en el Instituto Winston Churchill',
    accent: '#dfff00',
    focus: 'center 42%',
  },
  {
    id: 'wl-soywinston',
    label: 'Eventos y vida escolar con la comunidad Winston.',
    title: '#SoyWinston',
    body:
      '#SoyWinston es nuestra comunidad. Celebramos logros, eventos y tradiciones del colegio. Familias y alumnos se reconocen en esa identidad. Es pertenencia con valores claros.',
    // paisaje del mismo momento — cabe mejor en el marco panorámico
    image: '/images/Winston Life/galeria soy winston/estudiante_banner.JPG',
    alt: 'Comunidad #SoyWinston del Instituto Winston Churchill',
    accent: '#dfff00',
    focus: 'center 30%',
  },
] as const

export default function WinstonLifeComunidad() {
  const wrapRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const progressRefNav = useRef<HTMLElement>(null)
  const sceneRefs = useRef<(HTMLElement | null)[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)

  const xRef = useRef(0)
  const targetXRef = useRef(0)
  const maxXRef = useRef(0)
  const progressRef = useRef(0)
  const rafRef = useRef(0)

  const [pinMode, setPinMode] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [wrapHeight, setWrapHeight] = useState<string | undefined>(undefined)
  const [titleIn, setTitleIn] = useState(false)

  useEffect(() => {
    const syncMode = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const narrow = window.matchMedia('(max-width: 900px)').matches
      setReduced(reduce)
      setPinMode(!reduce && !narrow)
      if (reduce || narrow) setTitleIn(true)
    }
    syncMode()
    window.addEventListener('resize', syncMode)
    return () => window.removeEventListener('resize', syncMode)
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return

    const measure = () => {
      if (!pinMode) {
        setWrapHeight(undefined)
        maxXRef.current = 0
        targetXRef.current = 0
        xRef.current = 0
        track.style.transform = 'translate3d(0,0,0)'
        return
      }
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxX = Math.max(0, track.scrollWidth - vw)
      maxXRef.current = maxX
      setWrapHeight(`${vh + maxX}px`)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinMode])

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track || !pinMode) return

    let titleDone = titleIn

    const tick = () => {
      const rect = wrap.getBoundingClientRect()
      const travel = Math.max(1, wrap.offsetHeight - window.innerHeight)
      const raw = Math.min(1, Math.max(0, -rect.top / travel))
      progressRef.current = raw
      targetXRef.current = raw * maxXRef.current

      const next = xRef.current + (targetXRef.current - xRef.current) * 0.12
      xRef.current = Math.abs(next - targetXRef.current) < 0.3 ? targetXRef.current : next
      track.style.transform = `translate3d(${-xRef.current}px,0,0)`

      if (!titleDone && raw > 0.01) {
        titleDone = true
        setTitleIn(true)
      }

      hintRef.current?.classList.toggle('is-gone', raw > 0.06)

      const vw = window.innerWidth
      const maxX = maxXRef.current || 1
      let best = 0
      let bestFill = -1

      sceneRefs.current.forEach((el, i) => {
        if (!el) return
        const left = el.getBoundingClientRect().left
        if (left < vw * 0.85) {
          el.classList.add('is-in', 'is-title')
        }
        const center = left + el.offsetWidth / 2
        const offset = (center - vw / 2) / vw
        el.style.setProperty('--px', `${Math.max(-8, Math.min(8, -offset * 8))}%`)
        const near = 1 - Math.min(1, Math.abs(center - vw / 2) / (vw * 0.7))
        el.style.setProperty('--zoom', String(1.06 - near * 0.06))

        const start = Math.max(0, (el.offsetLeft - vw * 0.35) / maxX)
        const end = Math.min(1, (el.offsetLeft + el.offsetWidth * 0.55) / maxX)
        let fill = 0
        if (raw >= end) fill = 1
        else if (raw > start) fill = (raw - start) / Math.max(0.001, end - start)
        const bar = progressRefNav.current?.querySelectorAll<HTMLElement>('.wl-pin-seg-track i')[i]
        if (bar) bar.style.transform = `scaleX(${fill})`
        const seg = progressRefNav.current?.querySelectorAll<HTMLElement>('.wl-pin-seg')[i]
        if (fill >= bestFill) {
          bestFill = fill
          best = i
        }
        seg?.classList.toggle('is-on', false)
      })
      progressRefNav.current?.querySelectorAll<HTMLElement>('.wl-pin-seg')[best]?.classList.add('is-on')

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pinMode, titleIn])

  useEffect(() => {
    if (!pinMode || reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const cursor = cursorRef.current
    const pin = pinRef.current
    if (!cursor || !pin) return

    let cx = 0
    let cy = 0
    let tx = 0
    let ty = 0
    let frame = 0
    let running = false

    const loop = () => {
      cx += (tx - cx) * 0.2
      cy += (ty - cy) * 0.2
      cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) {
        frame = requestAnimationFrame(loop)
      } else {
        running = false
      }
    }
    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!running) {
        running = true
        frame = requestAnimationFrame(loop)
      }
    }
    const onEnter = () => cursor.classList.add('is-on')
    const onLeave = () => {
      cursor.classList.remove('is-on')
      wrapRef.current?.classList.remove('is-photo')
    }
    const onOver = (e: MouseEvent) => {
      const photo = (e.target as Element | null)?.closest?.('.wl-pin-scene')
      wrapRef.current?.classList.toggle('is-photo', !!photo)
    }

    pin.addEventListener('mousemove', onMove)
    pin.addEventListener('mousemove', onOver)
    pin.addEventListener('mouseenter', onEnter)
    pin.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      pin.removeEventListener('mousemove', onMove)
      pin.removeEventListener('mousemove', onOver)
      pin.removeEventListener('mouseenter', onEnter)
      pin.removeEventListener('mouseleave', onLeave)
    }
  }, [pinMode, reduced])

  const scrollToScene = (index: number) => {
    const wrap = wrapRef.current
    const el = sceneRefs.current[index]
    if (!wrap || !el) return
    if (!pinMode) {
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      return
    }
    const maxX = maxXRef.current || 1
    const vw = window.innerWidth
    const targetProgress = Math.min(
      1,
      Math.max(0, (el.offsetLeft - (vw - el.offsetWidth) / 2) / maxX)
    )
    const travel = Math.max(1, wrap.offsetHeight - window.innerHeight)
    window.scrollTo({
      top: wrap.offsetTop + targetProgress * travel,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      ref={wrapRef}
      id="wl-comunidad"
      className={`wl-pin${pinMode ? ' is-pin' : ' is-stack'}${reduced ? ' is-reduced' : ''}${titleIn ? ' is-title' : ''}`}
      style={pinMode && wrapHeight ? { height: wrapHeight } : undefined}
      aria-labelledby="wl-about-heading"
    >
      <div ref={pinRef} className="wl-pin-sticky">
        <div ref={cursorRef} className="wl-pin-cursor" aria-hidden />
        <div ref={trackRef} className="wl-pin-track">
          <div className="wl-pin-intro">
            <div className="wl-pin-drift" aria-hidden />
            <p className="wl-pin-eyebrow">Comunidad</p>
            <h2 id={pinMode ? 'wl-about-heading' : undefined} className="wl-pin-title">
              {TITLE.split(' ').map((word) => (
                <span className="wl-pin-mask" key={word}>
                  <span className="wl-pin-word">{word}</span>
                </span>
              ))}
            </h2>
            <span className="wl-pin-bar" aria-hidden />
            <p className="wl-pin-lead">{INTRO}</p>
            <p ref={hintRef} className="wl-pin-hint" aria-hidden>
              <span className="wl-pin-arrow" />
              Sigue
            </p>
          </div>

          {SCENES.map((scene, index) => (
            <article
              key={scene.id}
              id={scene.id}
              ref={(el) => {
                sceneRefs.current[index] = el
              }}
              className="wl-pin-scene"
              style={
                {
                  ['--accent' as string]: scene.accent,
                  ['--focus' as string]: scene.focus,
                } as CSSProperties
              }
            >
              <div className="wl-pin-frame">
                <div className="wl-pin-media">
                  <Image
                    src={scene.image}
                    alt={scene.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 78vw"
                    className="wl-pin-img"
                    priority={index === 0}
                    style={{ objectPosition: scene.focus }}
                  />
                </div>
                <div className="wl-pin-shade" aria-hidden />
                <div className="wl-pin-glass">
                  <span className="wl-pin-quote" aria-hidden>
                    “
                  </span>
                  <span className="wl-pin-rule" aria-hidden />
                  <p>{scene.body}</p>
                </div>
              </div>
              <h3 className="wl-pin-scene-title">
                {scene.title.startsWith('#') ? (
                  <span className="wl-pin-mask">
                    <span className="wl-pin-word">
                      <span className="wl-pin-hash">#</span>
                      {scene.title.slice(1)}
                    </span>
                  </span>
                ) : (
                  scene.title.split(' ').map((word) => (
                    <span className="wl-pin-mask" key={`${scene.id}-${word}`}>
                      <span className="wl-pin-word">{word}</span>
                    </span>
                  ))
                )}
              </h3>
            </article>
          ))}

          <div className="wl-pin-spacer" aria-hidden />
        </div>

        <nav ref={progressRefNav} className="wl-pin-progress" aria-label="Recorrido Winston Life">
          {SCENES.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              className="wl-pin-seg"
              onClick={() => scrollToScene(index)}
            >
              <span className="wl-pin-seg-label">{scene.label}</span>
              <span className="wl-pin-seg-track" aria-hidden>
                <i />
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="wl-pin-mobile">
        <div className="wl-pin-mobile-intro">
          <p className="wl-pin-eyebrow">Comunidad</p>
          <h2 className="wl-pin-title" id={pinMode ? undefined : 'wl-about-heading'}>
            {TITLE}
          </h2>
          <span className="wl-pin-bar is-full" aria-hidden />
          <p className="wl-pin-lead">{INTRO}</p>
        </div>
        {SCENES.map((scene) => (
          <article
            key={`m-${scene.id}`}
            className="wl-pin-mobile-card"
            id={pinMode ? undefined : scene.id}
            style={
              {
                ['--accent' as string]: scene.accent,
                ['--focus' as string]: scene.focus,
              } as CSSProperties
            }
          >
            <div className="wl-pin-mobile-frame">
              <Image
                src={scene.image}
                alt={scene.alt}
                fill
                sizes="100vw"
                className="wl-pin-mobile-img"
                style={{ objectPosition: scene.focus }}
              />
            </div>
            <h3>
              {scene.title.startsWith('#') ? (
                <>
                  <span className="wl-pin-hash">#</span>
                  {scene.title.slice(1)}
                </>
              ) : (
                scene.title
              )}
            </h3>
            <p>
              <span className="wl-pin-mobile-quote" aria-hidden>
                “
              </span>
              {scene.body}
            </p>
          </article>
        ))}
      </div>

      <style jsx global>{`
        .wl-pin {
          --wl-blue: #1546e8;
          --wl-ink: #0a1240;
          --wl-lime: #dfff00;
          --wl-body: #3d4670;
          --wl-ease: cubic-bezier(.16,1,.3,1);
          position: relative;
          z-index: 1;
          background: #fff;
          color: var(--wl-ink);
          font-family: var(--font-poppins), Poppins, sans-serif;
          overflow-x: clip;
        }
        .wl-pin-sticky { position: relative; }
        .wl-pin.is-pin .wl-pin-sticky {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
        }
        .wl-pin.is-pin .wl-pin-mobile { display: none; }
        .wl-pin.is-stack .wl-pin-sticky { display: none; }
        .wl-pin.is-stack .wl-pin-mobile { display: block; padding: 72px 1.15rem 80px; }

        .wl-pin-cursor {
          position: fixed;
          top: 0; left: 0;
          z-index: 40;
          width: 14px; height: 14px;
          margin: -7px 0 0 -7px;
          border-radius: 999px;
          background: #1546e8;
          mix-blend-mode: multiply;
          pointer-events: none;
          opacity: 0;
          transition: width .35s var(--wl-ease), height .35s var(--wl-ease), margin .35s var(--wl-ease), opacity .25s;
        }
        .wl-pin.is-pin .wl-pin-sticky { cursor: none; }
        .wl-pin-cursor.is-on { opacity: 1; }
        .wl-pin.is-photo .wl-pin-cursor {
          width: 70px; height: 70px;
          margin: -35px 0 0 -35px;
        }
        @media (pointer: coarse) {
          .wl-pin.is-pin .wl-pin-sticky { cursor: auto; }
          .wl-pin-cursor { display: none !important; }
        }

        .wl-pin-track {
          display: flex;
          align-items: center;
          gap: 40px;
          height: 100%;
          width: max-content;
          padding: 0 6vw;
          will-change: transform;
        }
        .wl-pin-intro {
          position: relative;
          flex: 0 0 60vw;
          max-width: 720px;
          padding-right: 2rem;
        }
        .wl-pin-drift {
          position: absolute;
          z-index: 0;
          left: -40px; top: 10%;
          width: 260px; height: 260px;
          border-radius: 999px;
          background: var(--wl-lime);
          filter: blur(90px);
          opacity: .25;
          pointer-events: none;
          animation: wlPinDrift 18s ease-in-out infinite alternate;
        }
        @keyframes wlPinDrift {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(30px,-20px,0); }
        }
        .wl-pin-eyebrow {
          position: relative;
          margin: 0 0 .7rem;
          color: var(--wl-blue);
          font-size: 14px;
          font-weight: 600;
        }
        .wl-pin-title {
          position: relative;
          margin: 0;
          max-width: 12ch;
          color: var(--wl-ink);
          font-size: clamp(2.6rem, 5.6vw, 5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .wl-pin-mask {
          display: inline-block;
          overflow: hidden;
          margin-right: .28em;
          vertical-align: bottom;
        }
        .wl-pin-word {
          display: inline-block;
          transform: translateY(105%);
          transition: transform 1s var(--wl-ease);
        }
        .wl-pin.is-title .wl-pin-intro .wl-pin-word { transform: translateY(0); }
        .wl-pin.is-title .wl-pin-intro .wl-pin-mask:nth-child(2) .wl-pin-word { transition-delay: .1s; }
        .wl-pin.is-title .wl-pin-intro .wl-pin-mask:nth-child(3) .wl-pin-word { transition-delay: .2s; }
        .wl-pin.is-title .wl-pin-intro .wl-pin-mask:nth-child(4) .wl-pin-word { transition-delay: .3s; }
        .wl-pin-bar {
          position: relative;
          display: block;
          width: 0;
          height: 5px;
          margin-top: 1rem;
          border-radius: 999px;
          background: var(--wl-lime);
          transition: width 1s var(--wl-ease) .3s;
        }
        .wl-pin.is-title .wl-pin-bar,
        .wl-pin-bar.is-full { width: 56px; }
        .wl-pin-lead {
          position: relative;
          max-width: 44ch;
          margin: 1.2rem 0 0;
          color: var(--wl-body);
          font-size: 18px;
          line-height: 1.6;
        }
        .wl-pin-hint {
          display: inline-flex;
          align-items: center;
          gap: .55rem;
          margin-top: 2rem;
          color: var(--wl-ink);
          font-size: .92rem;
          font-weight: 700;
          opacity: 1;
          transition: opacity .5s var(--wl-ease);
        }
        .wl-pin-hint.is-gone { opacity: 0; pointer-events: none; }
        .wl-pin-arrow {
          position: relative;
          width: 28px; height: 2px;
          background: currentColor;
          animation: wlPinArrow 1.4s ease-in-out infinite;
        }
        .wl-pin-arrow::after {
          content: '';
          position: absolute;
          right: -1px; top: -4px;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 7px solid currentColor;
        }
        @keyframes wlPinArrow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }

        .wl-pin-scene {
          position: relative;
          flex: 0 0 78vw;
          height: 72vh;
          overflow: visible;
        }
        .wl-pin-frame {
          position: relative;
          height: 100%;
          border-radius: 36px;
          overflow: hidden;
          clip-path: inset(0 100% 0 0 round 36px);
          transition: clip-path 1.1s var(--wl-ease);
        }
        .wl-pin-scene.is-in .wl-pin-frame { clip-path: inset(0 round 36px); }
        .wl-pin-media {
          position: absolute;
          inset: -1% -2%;
          overflow: hidden;
        }
        .wl-pin-img {
          object-fit: cover;
          object-position: var(--focus, center 30%);
          transform: translate3d(var(--px, 0%), 0, 0) scale(var(--zoom, 1.06));
          will-change: transform;
        }
        .wl-pin-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 28%, rgba(10,18,64,.55) 78%, rgba(10,18,64,.72));
          pointer-events: none;
        }
        .wl-pin-glass {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 2;
          width: min(360px, calc(100% - 48px));
          padding: 22px 24px 24px;
          border: 1px solid color-mix(in srgb, var(--accent) 55%, #fff);
          border-radius: 24px;
          background: linear-gradient(160deg, rgba(10,18,64,.42), rgba(10,18,64,.22));
          backdrop-filter: blur(14px);
          box-shadow: 0 18px 40px rgba(10,18,64,.22), inset 0 0 0 1px rgba(255,255,255,.12);
          color: #f4f7ff;
        }
        .wl-pin-quote {
          display: block;
          margin: -.35rem 0 .15rem;
          color: var(--accent);
          font-size: 3.2rem;
          font-weight: 800;
          line-height: .7;
          letter-spacing: -0.04em;
          text-shadow: 0 0 24px color-mix(in srgb, var(--accent) 55%, transparent);
        }
        .wl-pin-rule {
          display: block;
          width: 0;
          height: 5px;
          margin-bottom: .85rem;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 70%, transparent);
          transition: width 1s var(--wl-ease) .15s;
        }
        .wl-pin-scene.is-in .wl-pin-rule { width: 80px; }
        .wl-pin-glass p {
          margin: 0;
          color: #eef2ff;
          font-size: 17px;
          line-height: 1.55;
          text-shadow: 0 1px 10px rgba(10,18,64,.35);
        }
        .wl-pin-scene-title {
          position: absolute;
          left: 28px;
          bottom: 0;
          z-index: 3;
          margin: 0;
          max-width: 92%;
          color: #fff;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: .9;
          text-shadow: 0 10px 40px rgba(10,18,64,.35);
          transform: translateY(40px);
          pointer-events: none;
        }
        .wl-pin-hash {
          color: var(--accent);
          text-shadow: 0 0 28px color-mix(in srgb, var(--accent) 65%, transparent);
        }
        .wl-pin-scene.is-title .wl-pin-scene-title .wl-pin-word { transform: translateY(0); }
        .wl-pin-scene.is-title .wl-pin-scene-title .wl-pin-mask:nth-child(2) .wl-pin-word { transition-delay: .1s; }
        .wl-pin-scene.is-title .wl-pin-scene-title .wl-pin-mask:nth-child(3) .wl-pin-word { transition-delay: .2s; }

        .wl-pin-spacer { flex: 0 0 30vw; height: 1px; }

        .wl-pin-progress {
          position: absolute;
          left: 50%;
          bottom: 32px;
          z-index: 5;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: .85rem;
          width: min(720px, calc(100% - 2.5rem));
          transform: translateX(-50%);
        }
        .wl-pin-seg {
          display: grid;
          gap: .45rem;
          padding: 0;
          border: 0;
          background: transparent;
          color: #8a93bc;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.35;
          text-align: left;
          cursor: pointer;
          transition: color .35s var(--wl-ease);
        }
        .wl-pin-seg.is-on { color: var(--wl-ink); }
        .wl-pin-seg:focus-visible {
          outline: 3px solid var(--wl-blue);
          outline-offset: 3px;
        }
        .wl-pin-seg-track {
          display: block;
          height: 4px;
          overflow: hidden;
          border-radius: 999px;
          background: #e3e8fb;
        }
        .wl-pin-seg-track i {
          display: block;
          width: 100%;
          height: 100%;
          transform: scaleX(0);
          transform-origin: left center;
        }
        .wl-pin-seg:nth-child(1) .wl-pin-seg-track i { background: #00d8ff; }
        .wl-pin-seg:nth-child(2) .wl-pin-seg-track i { background: #dfff00; }
        .wl-pin-seg:nth-child(3) .wl-pin-seg-track i { background: #dfff00; }

        .wl-pin-mobile-intro { max-width: 46ch; margin-bottom: 2.2rem; }
        .wl-pin-mobile-card { margin-bottom: 2.4rem; }
        .wl-pin-mobile-frame {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 28px;
          background: #0a1240;
        }
        .wl-pin-mobile-img { object-fit: cover; object-position: var(--focus, center 30%); }
        .wl-pin-mobile-card h3 {
          position: relative;
          z-index: 1;
          margin: -24px 0 0 1rem;
          max-width: 16ch;
          color: var(--wl-ink);
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: .95;
        }
        .wl-pin-mobile-card p {
          position: relative;
          margin: .9rem 0 0;
          padding: 1.1rem 1.15rem 1.15rem 1.35rem;
          border: 1px solid #e3e8fb;
          border-left: 4px solid var(--accent, var(--wl-blue));
          border-radius: 20px;
          background: #fff;
          color: var(--wl-body);
          font-size: 17px;
          line-height: 1.55;
        }
        .wl-pin-mobile-quote {
          display: block;
          color: var(--accent, #1546e8);
          font-size: 2.4rem;
          font-weight: 800;
          line-height: .7;
          margin-bottom: .35rem;
        }
        .wl-pin-mobile-card .wl-pin-hash { color: var(--accent, #1546e8); }

        @media (max-width: 900px) {
          .wl-pin.is-pin .wl-pin-sticky { display: none; }
          .wl-pin.is-pin .wl-pin-mobile { display: block; padding: 72px 1.15rem 80px; }
          .wl-pin.is-pin { height: auto !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wl-pin-word, .wl-pin-bar, .wl-pin-frame, .wl-pin-rule, .wl-pin-arrow, .wl-pin-drift, .wl-pin-hint {
            animation: none !important;
            transition: none !important;
          }
          .wl-pin-word { transform: none !important; }
          .wl-pin-bar { width: 56px !important; }
          .wl-pin-frame { clip-path: inset(0 round 36px) !important; }
          .wl-pin-rule { width: 80px !important; }
          .wl-pin-cursor { display: none !important; }
          .wl-pin.is-pin .wl-pin-sticky { cursor: auto; }
        }
      `}</style>
    </section>
  )
}
