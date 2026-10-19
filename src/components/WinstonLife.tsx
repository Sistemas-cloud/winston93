'use client'

/**
 * 2026-10-17: WinstonLife — sticky collage único (16:9 en u).
 * Captions al hover. Videos limpios (sin stickers). Título watermark + caída.
 */

import { useEffect, useRef, useState } from 'react'
import { Anton, Inter, JetBrains_Mono } from 'next/font/google'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const CONFIG = {
  bg: '#F9F9F9',
  brand: '#0A2A6B',
  accent: '#FFD60A',
  lime: '#E3FB07',
  bright: '#013BDF',
  ink: '#0B0B0F',

  STAGE_SCROLL: 420,
  scrub: 1.2,
  headerH: '4.5rem',
  closingText: 'Esto es Winston Life',

  /** Colores de caption (contraste sobre off-white y sobre el título) */
  textColors: {
    campus: { label: '#013BDF', title: '#0B0B0F', mark: '#FFD60A' },
    comunidad: { label: '#0A2A6B', title: '#013BDF', mark: '#E3FB07' },
    deporte: { label: '#013BDF', title: '#0B0B0F', mark: '#FFD60A' },
    emprende: { label: '#0A2A6B', title: '#013BDF', mark: '#E3FB07' },
  } as const,

  /** Lienzo 100u × 56.25u (16:9) */
  canvasW: 100,
  canvasH: 56.25,

  lenisLerp: 0.09,
  lenisDuration: 1.4,

  scrubMobile: 1,
  parallaxMobilePx: 32,
  unpackFrom: 'inset(22% 22% 22% 22% round 28px)',
  unpackTo: 'inset(0% 0% 0% 0% round 18px)',
  enterScale: 0.55,
  innerScaleFrom: 1.5,

  stickerDesktop: 56,
  stickerMobile: 52,
  magnetRadius: 140,
  magnetForce: 0.32,

  /** Tramos timeline 0→1 */
  titleReveal: { start: 0, end: 0.08 },
  tramos: [
    { id: 'campus', start: 0.06, end: 0.3 },
    { id: 'comunidad', start: 0.26, end: 0.5 },
    { id: 'deporte', start: 0.46, end: 0.7 },
    { id: 'emprende', start: 0.66, end: 0.88 },
  ] as const,
  settle: { start: 0.88, end: 1 },

  /** Cuadrícula 2×2 — caen a celdas, sin amontonarse */
  slots: {
    campus: { x: 5, y: 3.2, w: 43, rot: 0, z: 10 },
    comunidad: { x: 52, y: 3.2, w: 43, rot: 0, z: 10 },
    deporte: { x: 5, y: 29.4, w: 43, rot: 0, z: 20 },
    emprende: { x: 52, y: 29.4, w: 43, rot: 0, z: 20 },
  } as const,

  /** Captions anclados a cada celda */
  captions: {
    campus: { x: 6, y: 22, w: 20 },
    comunidad: { x: 53, y: 22, w: 20 },
    deporte: { x: 6, y: 48, w: 20 },
    emprende: { x: 53, y: 48, w: 20 },
    closing: { x: 5, y: 51.5, w: 22 },
  } as const,

  /** Caída desde fuera → aterrizan en grid */
  from: {
    campus: { x: -48, y: -18, rot: -12 },
    comunidad: { x: 110, y: -22, rot: 12 },
    deporte: { x: -40, y: 72, rot: -10 },
    emprende: { x: 108, y: 70, rot: 10 },
  } as const,
} as const

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--wl-display',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--wl-body',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--wl-mono',
})

type StickerKind =
  | 'book'
  | 'grad'
  | 'trophy'
  | 'medal'
  | 'chat'
  | 'heart'
  | 'gear'
  | 'rocket'

type VideoId = 'campus' | 'comunidad' | 'deporte' | 'emprende'

export type WinstonVideoConfig = {
  id: VideoId
  label: string
  title: string
  body: string
  src: string
  poster: string
  stickers: StickerKind[]
  tape?: boolean
  dogear?: boolean
  /** Solo móvil */
  mobileRot?: number
  mobileSpeed?: number
}

export const VIDEOS: WinstonVideoConfig[] = [
  {
    id: 'campus',
    label: '01 — Campus',
    title: 'El día en el colegio',
    body: 'Rutina, instalaciones y atmósfera bilingüe en Ciudad Madero.',
    src: '/images/Winston Life/video1.mp4',
    poster: '/images/Winston Life/portada-750.webp',
    stickers: ['book', 'grad'],
    tape: true,
    mobileRot: -1.5,
    mobileSpeed: -0.55,
  },
  {
    id: 'comunidad',
    label: '02 — Comunidad',
    title: 'Somos #SoyWinston',
    body: 'Familias, tradiciones y la energía que nos une cada día.',
    src: '/images/Winston Life/video2.mp4',
    poster: '/images/Winston Life/portada-750.webp',
    stickers: ['heart', 'chat'],
    dogear: true,
    mobileRot: 1.2,
    mobileSpeed: -0.9,
  },
  {
    id: 'deporte',
    label: '03 — Deporte',
    title: 'Winston Olympics',
    body: 'Disciplina, equipo y movimiento que construye carácter.',
    src: '/images/Winston Life/video1.mp4',
    poster: '/images/Winston Life/portada-480.webp',
    stickers: ['trophy', 'medal'],
    tape: true,
    mobileRot: -1,
    mobileSpeed: -0.4,
  },
  {
    id: 'emprende',
    label: '04 — Emprende',
    title: 'Ideas en acción',
    body: 'Proyectos, liderazgo y creatividad fuera del salón.',
    src: '/videos/winston-video.mp4',
    poster: '/images/Winston Life/portada-480.webp',
    stickers: ['gear', 'rocket'],
    mobileRot: 1.5,
    mobileSpeed: -1,
  },
]

const MOBILE_WIDTHS = ['w-full', 'w-[86%] ml-auto', 'w-[92%]', 'w-[78%] mx-auto'] as const

const PHOTO_SHADOW =
  '0 2px 4px rgba(0,0,0,.06), 0 24px 48px -16px rgba(10,42,107,.28), inset 0 0 0 1px rgba(255,255,255,.4)'

type Props = { className?: string; videos?: WinstonVideoConfig[] }

function refreshTriggers() {
  ScrollTrigger.refresh()
}

function u(n: number) {
  return `calc(var(--wl-u) * ${n})`
}

export default function WinstonLife({ className = '', videos = VIDEOS }: Props) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const rootRef = useRef<HTMLElement>(null)
  const stageWrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fillTitleRef = useRef<HTMLHeadingElement>(null)
  const strokeTitleRef = useRef<HTMLHeadingElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const closingRef = useRef<HTMLParagraphElement>(null)
  const decorRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const captionRefs = useRef<(HTMLDivElement | null)[]>([])
  const stickerLayerRefs = useRef<(HTMLDivElement | null)[]>([])
  const fineRef = useRef(false)

  useEffect(() => {
    fineRef.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (isDesktop === null) return
    gsap.registerPlugin(ScrollTrigger)

    const root = rootRef.current
    if (!root) return

    const observers: IntersectionObserver[] = []
    const watchVideo = (video: HTMLVideoElement | null, rootEl?: Element | null) => {
      if (!video) return
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) void video.play().catch(() => undefined)
            else video.pause()
          })
        },
        { root: rootEl instanceof Element ? null : null, rootMargin: '80px', threshold: 0.12 }
      )
      io.observe(video)
      observers.push(io)
    }
    videoRefs.current.forEach((v) => watchVideo(v))

    let lenis: Lenis | null = null
    const tickerFn = (time: number) => {
      lenis?.raf(time * 1000)
    }

    const onResize = () => refreshTriggers()
    window.addEventListener('resize', onResize)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (isDesktop) {
          setDesktopComposed(videos, {
            cards: cardRefs.current,
            medias: mediaRefs.current,
            captions: captionRefs.current,
            stickers: stickerLayerRefs.current,
            closing: closingRef.current,
            decor: decorRef.current,
            fill: fillTitleRef.current,
            stroke: strokeTitleRef.current,
            counter: counterRef.current,
          })
          if (closingRef.current) {
            gsap.fromTo(closingRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 })
          }
          if (decorRef.current) {
            gsap.set(decorRef.current.querySelectorAll('[data-decor]'), {
              opacity: 1,
              scale: 1,
              x: 0,
            })
          }
        } else {
          gsap.set(cardRefs.current, { clearProps: 'clipPath,transform,opacity' })
          gsap.set(mediaRefs.current, { clearProps: 'transform' })
          gsap.set(captionRefs.current, { clearProps: 'all' })
          if (closingRef.current) {
            gsap.set(closingRef.current, { opacity: 1, y: 0, filter: 'none' })
          }
          if (counterRef.current) counterRef.current.textContent = '04/04'
        }
      })

      // ========== DESKTOP: sticky único ==========
      if (isDesktop) {
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          const wrap = stageWrapRef.current
          if (!wrap) return

          lenis = new Lenis({
            lerp: CONFIG.lenisLerp,
            duration: CONFIG.lenisDuration,
            smoothWheel: true,
          })
          lenis.on('scroll', ScrollTrigger.update)
          gsap.ticker.add(tickerFn)
          gsap.ticker.lagSmoothing(0)

          void document.fonts.ready.then(refreshTriggers)
          videos.forEach((cfg, i) => {
            const poster = new Image()
            poster.src = cfg.poster
            poster.onload = () => refreshTriggers()
            videoRefs.current[i]?.addEventListener('loadedmetadata', refreshTriggers)
          })

          setupDesktopTimeline(videos, {
            wrap,
            cards: cardRefs.current,
            medias: mediaRefs.current,
            captions: captionRefs.current,
            stickers: stickerLayerRefs.current,
            closing: closingRef.current,
            decor: decorRef.current,
            fill: fillTitleRef.current,
            stroke: strokeTitleRef.current,
            counter: counterRef.current,
          })

          // Caption solo al hover del video
          const showCap = (i: number) => {
            const cap = captionRefs.current[i]
            if (!cap) return
            gsap.to(cap, {
              opacity: 1,
              y: 0,
              duration: 0.35,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          }
          const hideCap = (i: number) => {
            const cap = captionRefs.current[i]
            if (!cap) return
            gsap.to(cap, {
              opacity: 0,
              y: 8,
              duration: 0.28,
              ease: 'power2.in',
              overwrite: 'auto',
            })
          }
          const hoverCleanups: Array<() => void> = []
          cardRefs.current.forEach((card, i) => {
            if (!card) return
            const onEnter = () => showCap(i)
            const onLeave = () => hideCap(i)
            card.addEventListener('pointerenter', onEnter)
            card.addEventListener('pointerleave', onLeave)
            hoverCleanups.push(() => {
              card.removeEventListener('pointerenter', onEnter)
              card.removeEventListener('pointerleave', onLeave)
            })
          })

          if (fineRef.current) {
            const onMove = (e: PointerEvent) => {
              stickerLayerRefs.current.forEach((layer) => {
                layer?.querySelectorAll<HTMLElement>('[data-sticker]').forEach((icon) => {
                  const r = icon.getBoundingClientRect()
                  const cx = r.left + r.width / 2
                  const cy = r.top + r.height / 2
                  const dx = e.clientX - cx
                  const dy = e.clientY - cy
                  const dist = Math.hypot(dx, dy)
                  if (dist < CONFIG.magnetRadius) {
                    const f = (1 - dist / CONFIG.magnetRadius) * CONFIG.magnetForce
                    gsap.to(icon, {
                      x: dx * f,
                      y: dy * f,
                      duration: 0.35,
                      overwrite: 'auto',
                    })
                  } else {
                    gsap.to(icon, {
                      x: 0,
                      y: 0,
                      duration: 0.6,
                      ease: 'elastic.out(1, 0.55)',
                      overwrite: 'auto',
                    })
                  }
                })
              })
            }
            root.addEventListener('pointermove', onMove)
            return () => {
              hoverCleanups.forEach((fn) => fn())
              root.removeEventListener('pointermove', onMove)
              gsap.ticker.remove(tickerFn)
              lenis?.destroy()
              lenis = null
            }
          }

          return () => {
            hoverCleanups.forEach((fn) => fn())
            gsap.ticker.remove(tickerFn)
            lenis?.destroy()
            lenis = null
          }
        })
      } else {
        // ========== MÓVIL: pila (sin finale) ==========
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          videos.forEach((cfg, i) => {
            const card = cardRefs.current[i]
            const media = mediaRefs.current[i]
            const caption = captionRefs.current[i]
            if (!card || !media) return

            const rot = cfg.mobileRot ?? 0
            const speed = cfg.mobileSpeed ?? -0.5

            gsap.set(card, {
              clipPath: CONFIG.unpackFrom,
              scale: CONFIG.enterScale,
              opacity: 0,
              rotate: rot * 2.2,
              force3D: true,
            })
            gsap.set(media, { scale: CONFIG.innerScaleFrom })

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: card,
                  start: 'top 95%',
                  end: 'top 55%',
                  scrub: CONFIG.scrubMobile,
                },
              })
              .to(
                card,
                {
                  clipPath: CONFIG.unpackTo,
                  scale: 1,
                  opacity: 1,
                  rotate: rot,
                  ease: 'none',
                  duration: 1,
                },
                0
              )
              .to(media, { scale: 1, ease: 'none', duration: 1 }, 0)

            const travel = CONFIG.parallaxMobilePx * Math.abs(speed)
            const wrap = card.parentElement
            if (wrap) {
              gsap.fromTo(
                wrap,
                { y: -travel * 0.4 },
                {
                  y: travel,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: wrap,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: CONFIG.scrubMobile,
                  },
                }
              )
            }

            if (caption) {
              const parts = caption.querySelectorAll('[data-copy-part]')
              gsap.set(parts, { opacity: 0, y: 36, filter: 'blur(6px)' })
              gsap.to(parts, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1.1,
                stagger: 0.08,
                ease: 'expo.out',
                scrollTrigger: { trigger: caption, start: 'top 88%', once: true },
              })
            }

            ScrollTrigger.create({
              trigger: card,
              start: 'top 60%',
              end: 'bottom 40%',
              onToggle: (self) => {
                if (self.isActive && counterRef.current) {
                  counterRef.current.textContent = `${String(i + 1).padStart(2, '0')}/04`
                }
              },
            })
          })

          if (closingRef.current) {
            gsap.set(closingRef.current, { opacity: 0, y: 28, filter: 'blur(6px)' })
            gsap.to(closingRef.current, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: closingRef.current,
                start: 'top 90%',
                once: true,
              },
            })
          }
        })
      }
    }, root)

    void document.fonts.ready.then(refreshTriggers)
    requestAnimationFrame(() => refreshTriggers())

    return () => {
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(tickerFn)
      lenis?.destroy()
      ctx.revert()
    }
  }, [videos, isDesktop])

  const titleLines = ['WINSTON', 'LIFE']

  return (
    <section
      ref={rootRef}
      aria-label="Winston Life"
      className={`relative isolate ${anton.variable} ${inter.variable} ${mono.variable} ${className}`}
      style={
        {
          backgroundColor: CONFIG.bg,
          color: CONFIG.ink,
          clipPath: 'inset(0)',
          isolation: 'isolate',
          overflow: 'clip',
          ['--wl-brand' as string]: CONFIG.brand,
          ['--wl-accent' as string]: CONFIG.accent,
          ['--wl-header-h' as string]: CONFIG.headerH,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-[60] opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className={`pointer-events-none fixed bottom-6 z-[70] ${
          isDesktop ? 'right-6' : 'left-5'
        }`}
      >
        <span
          ref={counterRef}
          className="font-[family-name:var(--wl-mono)] text-xs tracking-[0.2em]"
          style={{ color: CONFIG.brand }}
        >
          01/04
        </span>
      </div>

      {isDesktop === null ? (
        <div className="min-h-[40vh]" aria-hidden />
      ) : isDesktop ? (
        <DesktopStage
          videos={videos}
          titleLines={titleLines}
          stageWrapRef={stageWrapRef}
          stageRef={stageRef}
          canvasRef={canvasRef}
          fillTitleRef={fillTitleRef}
          strokeTitleRef={strokeTitleRef}
          closingRef={closingRef}
          decorRef={decorRef}
          cardRefs={cardRefs}
          mediaRefs={mediaRefs}
          videoRefs={videoRefs}
          captionRefs={captionRefs}
          stickerLayerRefs={stickerLayerRefs}
        />
      ) : (
        <MobileStack
          videos={videos}
          closingRef={closingRef}
          cardRefs={cardRefs}
          mediaRefs={mediaRefs}
          videoRefs={videoRefs}
          captionRefs={captionRefs}
          stickerLayerRefs={stickerLayerRefs}
        />
      )}
    </section>
  )
}

function setupDesktopTimeline(
  videos: WinstonVideoConfig[],
  refs: {
    wrap: HTMLDivElement
    cards: (HTMLDivElement | null)[]
    medias: (HTMLDivElement | null)[]
    captions: (HTMLDivElement | null)[]
    stickers: (HTMLDivElement | null)[]
    closing: HTMLParagraphElement | null
    decor: HTMLDivElement | null
    fill: HTMLHeadingElement | null
    stroke: HTMLHeadingElement | null
    counter: HTMLSpanElement | null
  }
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: refs.wrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: CONFIG.scrub,
    },
  })

  // Título reveal 0–0.08
  ;[refs.fill, refs.stroke].forEach((el) => {
    if (!el) return
    const letters = el.querySelectorAll('[data-letter]')
    gsap.set(letters, { yPercent: 110 })
    tl.to(
      letters,
      { yPercent: 0, ease: 'none', duration: CONFIG.titleReveal.end - CONFIG.titleReveal.start, stagger: 0.012 },
      CONFIG.titleReveal.start
    )
  })
  tl.to(
    [refs.fill, refs.stroke].filter(Boolean),
    { y: -6, ease: 'none', duration: 0.92 },
    0.08
  )

  videos.forEach((cfg, i) => {
    const card = refs.cards[i]
    const media = refs.medias[i]
    const caption = refs.captions[i]
    if (!card) return

    const slot = CONFIG.slots[cfg.id]
    const from = CONFIG.from[cfg.id]
    const tramo = CONFIG.tramos[i]
    const span = tramo.end - tramo.start
    const travel = span * 0.8
    const settle = span * 0.2
    const overshoot = from.rot >= 0 ? 1.4 : -1.4

    gsap.set(card, {
      left: u(from.x),
      top: u(from.y),
      width: u(slot.w),
      rotate: from.rot,
      scale: CONFIG.enterScale,
      opacity: 0,
      clipPath: 'inset(36% round 28px)',
      zIndex: slot.z,
      filter: 'brightness(1)',
      force3D: true,
    })
    if (media) gsap.set(media, { scale: CONFIG.innerScaleFrom })
    // Caption: oculto; solo aparece al hover del video
    if (caption) {
      gsap.set(caption, { opacity: 0, y: 10 })
      gsap.set(caption.querySelectorAll('[data-copy-part]'), {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      })
    }

    // Caída hacia la celda de la cuadrícula
    tl.to(
      card,
      {
        left: u(slot.x),
        top: u(slot.y),
        rotate: slot.rot + overshoot,
        scale: 1.03,
        opacity: 1,
        clipPath: CONFIG.unpackTo,
        ease: 'none',
        duration: travel,
      },
      tramo.start
    )
    if (media) {
      tl.to(media, { scale: 1, ease: 'none', duration: travel }, tramo.start)
    }

    // Asienta plano en la celda (sin amontonar)
    tl.to(
      card,
      {
        rotate: slot.rot,
        scale: 1,
        ease: 'none',
        duration: settle,
      },
      tramo.start + travel
    )

    // Contador + pop elástico
    tl.call(
      () => {
        if (!refs.counter) return
        refs.counter.textContent = `${String(i + 1).padStart(2, '0')}/04`
        gsap.fromTo(
          refs.counter,
          { scale: 1.35, y: -6 },
          { scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.55)' }
        )
      },
      undefined,
      tramo.start + span * 0.15
    )

    // Foco: anteriores atenuados cuando entra este
    if (i > 0) {
      for (let j = 0; j < i; j++) {
        const prev = refs.cards[j]
        if (prev) {
          tl.to(
            prev,
            { filter: 'brightness(0.92)', ease: 'none', duration: 0.06 },
            tramo.start
          )
        }
      }
    }
  })

  // 0.88–1.00: grid estable + cierre + decor
  const settleStart = CONFIG.settle.start
  videos.forEach((_, i) => {
    const card = refs.cards[i]
    const cap = refs.captions[i]
    if (card) {
      tl.to(card, { filter: 'brightness(1)', y: 0, rotate: 0, ease: 'none', duration: 0.06 }, settleStart)
    }
    if (cap) gsap.set(cap, { opacity: 0, y: 10 })
  })

  // Título watermark: pulso suave
  if (refs.fill && refs.stroke) {
    tl.to(
      [refs.fill, refs.stroke],
      { scale: 1.015, ease: 'none', duration: 0.05 },
      settleStart + 0.02
    )
    tl.to(
      [refs.fill, refs.stroke],
      { scale: 1, ease: 'none', duration: 0.06 },
      settleStart + 0.07
    )
  }

  tl.call(
    () => {
      if (!refs.counter) return
      refs.counter.textContent = '04/04'
      gsap.fromTo(
        refs.counter,
        { scale: 1.4, y: -8 },
        { scale: 1, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' }
      )
    },
    undefined,
    settleStart
  )

  if (refs.closing) {
    gsap.set(refs.closing, { opacity: 0, y: 28, filter: 'blur(10px)', scale: 0.92 })
    tl.to(
      refs.closing,
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        ease: 'none',
        duration: 0.1,
      },
      settleStart + 0.02
    )
  }

  // Decor derecha: entra con pop
  if (refs.decor) {
    const bits = refs.decor.querySelectorAll<HTMLElement>('[data-decor]')
    gsap.set(bits, { opacity: 0, scale: 0.6, x: 24 })
    tl.to(
      bits,
      {
        opacity: 1,
        scale: 1,
        x: 0,
        ease: 'none',
        duration: 0.08,
        stagger: 0.02,
      },
      settleStart + 0.03
    )
    bits.forEach((el, di) => {
      gsap.to(el, {
        y: `+=${8 + di * 4}`,
        rotate: `+=${di % 2 === 0 ? 4 : -4}`,
        duration: 2.2 + di * 0.35,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 0.2,
      })
    })
  }

}

function setDesktopComposed(
  videos: WinstonVideoConfig[],
  refs: {
    cards: (HTMLDivElement | null)[]
    medias: (HTMLDivElement | null)[]
    captions: (HTMLDivElement | null)[]
    stickers: (HTMLDivElement | null)[]
    closing: HTMLParagraphElement | null
    decor?: HTMLDivElement | null
    fill: HTMLHeadingElement | null
    stroke: HTMLHeadingElement | null
    counter: HTMLSpanElement | null
  }
) {
  videos.forEach((cfg, i) => {
    const slot = CONFIG.slots[cfg.id]
    const card = refs.cards[i]
    if (card) {
      gsap.set(card, {
        left: u(slot.x),
        top: u(slot.y),
        width: u(slot.w),
        rotate: slot.rot,
        scale: 1,
        opacity: 1,
        clipPath: 'inset(0% round 16px)',
        zIndex: slot.z,
        filter: 'brightness(1)',
        y: 0,
      })
    }
    if (refs.medias[i]) gsap.set(refs.medias[i], { scale: 1 })
    if (refs.captions[i]) {
      gsap.set(refs.captions[i], { opacity: 0, y: 10 })
      gsap.set(refs.captions[i]!.querySelectorAll('[data-copy-part]'), {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      })
    }
    refs.stickers[i]
      ?.querySelectorAll('[data-sticker]')
      .forEach((el) => gsap.set(el, { scale: 1, opacity: 1 }))
  })
  ;[refs.fill, refs.stroke].forEach((el) => {
    if (el) gsap.set(el.querySelectorAll('[data-letter]'), { yPercent: 0 })
  })
  if (refs.closing) gsap.set(refs.closing, { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 })
  if (refs.decor) {
    gsap.set(refs.decor.querySelectorAll('[data-decor]'), { opacity: 1, scale: 1, x: 0 })
  }
  if (refs.counter) refs.counter.textContent = '04/04'
}

function DesktopStage({
  videos,
  titleLines,
  stageWrapRef,
  stageRef,
  canvasRef,
  fillTitleRef,
  strokeTitleRef,
  closingRef,
  decorRef,
  cardRefs,
  mediaRefs,
  videoRefs,
  captionRefs,
  stickerLayerRefs,
}: {
  videos: WinstonVideoConfig[]
  titleLines: string[]
  stageWrapRef: React.MutableRefObject<HTMLDivElement | null>
  stageRef: React.MutableRefObject<HTMLDivElement | null>
  canvasRef: React.MutableRefObject<HTMLDivElement | null>
  fillTitleRef: React.MutableRefObject<HTMLHeadingElement | null>
  strokeTitleRef: React.MutableRefObject<HTMLHeadingElement | null>
  closingRef: React.MutableRefObject<HTMLParagraphElement | null>
  decorRef: React.MutableRefObject<HTMLDivElement | null>
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  mediaRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>
  captionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  stickerLayerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}) {
  return (
    <div
      ref={(el) => {
        stageWrapRef.current = el
      }}
      className="relative pb-[min(8vh,3.5rem)]"
      style={{
        height: `${CONFIG.STAGE_SCROLL}vh`,
        backgroundColor: CONFIG.bg,
      }}
    >
      <div
        ref={(el) => {
          stageRef.current = el
        }}
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{
          backgroundColor: CONFIG.bg,
          paddingTop: 'var(--wl-header-h)',
          // --wl-u: min(1vw, (100svh - header) / 56.25)
          ['--wl-u' as string]:
            'min(1vw, calc((100svh - var(--wl-header-h)) / 56.25))',
        }}
      >
        <div
          ref={(el) => {
            canvasRef.current = el
          }}
          className="relative shrink-0"
          style={{
            width: u(CONFIG.canvasW),
            height: u(CONFIG.canvasH),
          }}
        >
          {/* Título watermark centrado — azul sólido Winston + contorno lima */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ width: u(92) }}
          >
            <h2
              ref={(el) => {
                fillTitleRef.current = el
              }}
              className="font-[family-name:var(--wl-display)] uppercase leading-[0.82] tracking-[-0.04em]"
              style={{
                color: CONFIG.brand,
                fontSize: u(14.5),
                opacity: 0.88,
              }}
              aria-hidden
            >
              <TitleLetters lines={titleLines} />
            </h2>
            <h2
              ref={(el) => {
                strokeTitleRef.current = el
              }}
              className="pointer-events-none absolute left-0 top-0 z-[50] w-full font-[family-name:var(--wl-display)] uppercase leading-[0.82] tracking-[-0.04em]"
              style={{
                color: 'transparent',
                WebkitTextStroke: `calc(var(--wl-u) * 0.16) ${CONFIG.lime}`,
                fontSize: u(14.5),
                opacity: 0.95,
              }}
            >
              <span className="sr-only">Winston Life</span>
              <TitleLetters lines={titleLines} ariaHidden />
            </h2>
          </div>

          {videos.map((cfg, i) => {
            const slot = CONFIG.slots[cfg.id]
            const cap = CONFIG.captions[cfg.id]
            const from = CONFIG.from[cfg.id]
            return (
              <div key={cfg.id}>
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  className="absolute will-change-transform"
                  style={{
                    left: u(from.x),
                    top: u(from.y),
                    width: u(slot.w),
                    zIndex: slot.z,
                    opacity: 0,
                  }}
                >
                  {/* Sin stickers / cinta / dogear sobre el video */}
                  <div
                    className="relative cursor-pointer overflow-hidden rounded-2xl bg-slate-200"
                    style={{ boxShadow: PHOTO_SHADOW }}
                  >
                    <div
                      ref={(el) => {
                        mediaRefs.current[i] = el
                      }}
                      className="aspect-video w-full origin-center"
                    >
                      <video
                        ref={(el) => {
                          videoRefs.current[i] = el
                        }}
                        className="h-full w-full cursor-pointer object-cover"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={cfg.poster}
                        aria-label={cfg.title}
                        src={cfg.src}
                      />
                    </div>
                  </div>
                </div>

                <div
                  ref={(el) => {
                    captionRefs.current[i] = el
                  }}
                  className="pointer-events-none absolute z-[40] overflow-visible"
                  style={{
                    left: u(cap.x),
                    top: u(cap.y),
                    width: u(cap.w),
                    opacity: 0,
                  }}
                >
                  <div
                    className="rounded-xl px-[0.65em] pb-[0.65em] pt-[0.5em]"
                    style={{
                      background: 'rgba(249,249,249,.92)',
                      boxShadow: '0 8px 28px -12px rgba(10,42,107,.28)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span
                      data-copy-part
                      className="mb-[0.35em] block h-[0.35em] w-[2.2em] rounded-sm"
                      style={{ backgroundColor: CONFIG.textColors[cfg.id].mark }}
                      aria-hidden
                    />
                    <p
                      data-copy-part
                      className="font-[family-name:var(--wl-mono)] font-medium tracking-[0.16em]"
                      style={{
                        color: CONFIG.textColors[cfg.id].label,
                        fontSize: u(1.3),
                      }}
                    >
                      {cfg.label}
                    </p>
                    <h3
                      data-copy-part
                      className="mt-[0.35em] font-[family-name:var(--wl-display)] uppercase leading-[0.92] tracking-tight"
                      style={{
                        color: CONFIG.textColors[cfg.id].title,
                        fontSize: u(2.5),
                        paddingBottom: '0.08em',
                      }}
                    >
                      {cfg.title}
                    </h3>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Decor derecha — llena el vacío */}
          <div
            ref={(el) => {
              decorRef.current = el
            }}
            className="pointer-events-none absolute inset-0 z-[35]"
            aria-hidden
          >
            <p
              data-decor
              className="absolute font-[family-name:var(--wl-mono)] font-medium uppercase tracking-[0.35em]"
              style={{
                right: u(3),
                top: u(10),
                color: CONFIG.bright,
                fontSize: u(1.4),
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                opacity: 0,
              }}
            >
              #SoyWinston
            </p>
            <span
              data-decor
              className="absolute rounded-full"
              style={{
                right: u(8),
                top: u(28),
                width: u(3.2),
                height: u(3.2),
                backgroundColor: CONFIG.accent,
                opacity: 0,
              }}
            />
            <span
              data-decor
              className="absolute rounded-full"
              style={{
                right: u(5),
                top: u(36),
                width: u(1.8),
                height: u(1.8),
                backgroundColor: CONFIG.lime,
                opacity: 0,
              }}
            />
            <span
              data-decor
              className="absolute"
              style={{
                right: u(4),
                top: u(42),
                width: u(0.35),
                height: u(10),
                backgroundColor: CONFIG.bright,
                borderRadius: 2,
                opacity: 0,
              }}
            />
          </div>

          <p
            ref={(el) => {
              closingRef.current = el
            }}
            className="pointer-events-none absolute z-[45] font-[family-name:var(--wl-display)] uppercase leading-none tracking-tight"
            style={{
              left: u(CONFIG.captions.closing.x),
              top: u(CONFIG.captions.closing.y),
              width: u(CONFIG.captions.closing.w),
              color: CONFIG.accent,
              WebkitTextStroke: `1.5px ${CONFIG.brand}`,
              paintOrder: 'stroke fill',
              fontSize: u(3.4),
              opacity: 0,
            }}
          >
            {CONFIG.closingText}
          </p>
        </div>
      </div>
    </div>
  )
}

function MobileStack({
  videos,
  closingRef,
  cardRefs,
  mediaRefs,
  videoRefs,
  captionRefs,
  stickerLayerRefs,
}: {
  videos: WinstonVideoConfig[]
  closingRef: React.MutableRefObject<HTMLParagraphElement | null>
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  mediaRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>
  captionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  stickerLayerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}) {
  return (
    <div
      className="relative px-5 pb-16 pt-[calc(var(--wl-header-h)+2vh)]"
      style={{ scrollMarginTop: '5rem' }}
    >
      <h2
        className="mb-12 font-[family-name:var(--wl-display)] uppercase leading-[0.85] tracking-[-0.03em]"
        style={{
          color: CONFIG.brand,
          fontSize: 'clamp(5rem, 22vw, 9rem)',
        }}
      >
        Winston
        <br />
        Life
      </h2>

      <div className="flex flex-col gap-10">
        {videos.map((cfg, i) => (
          <div
            key={`m-${cfg.id}`}
            className={`${MOBILE_WIDTHS[i]} ${i > 0 ? '-mt-4' : ''}`}
            style={{ transform: `rotate(${cfg.mobileRot ?? 0}deg)` }}
          >
            <div
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className="will-change-transform"
            >
              <div className="relative">
                <div
                  className="relative cursor-pointer overflow-hidden rounded-2xl bg-slate-200"
                  style={{ boxShadow: PHOTO_SHADOW }}
                >
                  <div
                    ref={(el) => {
                      mediaRefs.current[i] = el
                    }}
                    className="aspect-video w-full origin-center"
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el
                      }}
                      className="h-full w-full cursor-pointer object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={cfg.poster}
                      aria-label={cfg.title}
                      src={cfg.src}
                    />
                  </div>
                </div>

                <div
                  ref={(el) => {
                    captionRefs.current[i] = el
                  }}
                  className="relative z-[50] mt-5 max-w-[28ch]"
                >
                  <span
                    data-copy-part
                    className="mb-2 block h-1.5 w-8 rounded-sm"
                    style={{ backgroundColor: CONFIG.textColors[cfg.id].mark }}
                    aria-hidden
                  />
                  <p
                    data-copy-part
                    className="font-[family-name:var(--wl-mono)] text-[11px] font-medium tracking-[0.18em]"
                    style={{ color: CONFIG.textColors[cfg.id].label }}
                  >
                    {cfg.label}
                  </p>
                  <h3
                    data-copy-part
                    className="mt-2 font-[family-name:var(--wl-display)] text-2xl uppercase leading-none tracking-tight"
                    style={{ color: CONFIG.textColors[cfg.id].title }}
                  >
                    {cfg.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p
        ref={(el) => {
          closingRef.current = el
        }}
        className="mt-14 font-[family-name:var(--wl-display)] text-3xl uppercase tracking-tight"
        style={{
          color: CONFIG.accent,
          WebkitTextStroke: `1.5px ${CONFIG.brand}`,
          paintOrder: 'stroke fill',
          opacity: 0,
        }}
      >
        {CONFIG.closingText}
      </p>
    </div>
  )
}

function TitleLetters({
  lines,
  ariaHidden,
}: {
  lines: string[]
  ariaHidden?: boolean
}) {
  return (
    <span aria-hidden={ariaHidden}>
      {lines.map((line) => (
        <span key={line} className="block whitespace-nowrap overflow-hidden">
          {line.split('').map((ch, i) => (
            <span
              key={`${line}-${i}`}
              data-letter
              className="inline-block"
              style={{ whiteSpace: ch === ' ' ? 'pre' : undefined }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

function GlassSticker({
  kind,
  index,
  size,
}: {
  kind: StickerKind
  index: number
  size: number
}) {
  const pos = [
    'left-[-6%] top-[-5%]',
    'right-[-5%] top-[10%]',
    'left-[6%] bottom-[-6%]',
  ][index % 3]

  return (
    <span
      data-sticker
      className={`absolute ${pos}`}
      style={{ width: size, height: size, pointerEvents: 'auto' }}
    >
      <span
        data-sticker-bob
        className="relative flex h-full w-full items-center justify-center rounded-2xl"
        style={{
          background: 'rgba(255,255,255,.18)',
          border: '1px solid rgba(255,255,255,.55)',
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
          boxShadow:
            '0 10px 24px -12px rgba(10,42,107,.35), inset 0 1px 0 rgba(255,255,255,.55)',
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-70"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,.55) 0%, transparent 45%)',
          }}
        />
        <StickerGlyph kind={kind} />
      </span>
    </span>
  )
}

function StickerGlyph({ kind }: { kind: StickerKind }) {
  const c = 'h-[55%] w-[55%] text-[color:var(--wl-brand)]'
  switch (kind) {
    case 'book':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" strokeLinecap="round" />
        </svg>
      )
    case 'grad':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m3 10 9-5 9 5-9 5-9-5Z" strokeLinejoin="round" />
          <path d="M7 12v4c2 2 8 2 10 0v-4" strokeLinecap="round" />
        </svg>
      )
    case 'trophy':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
          <path d="M12 13v3M9 20h6" strokeLinecap="round" />
        </svg>
      )
    case 'medal':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="14" r="5" />
          <path d="m9 4 3 4 3-4" strokeLinecap="round" />
        </svg>
      )
    case 'chat':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 6h14v9H9l-4 3V6Z" strokeLinejoin="round" />
        </svg>
      )
    case 'heart':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10Z" />
        </svg>
      )
    case 'gear':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4v2M12 18v2M4.9 7l1.5 1.5M17.6 15.5 19 17M5 12H3M21 12h-2" strokeLinecap="round" />
        </svg>
      )
    case 'rocket':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3c3 3 5 8 5 12l-5 3-5-3c0-4 2-9 5-12Z" strokeLinejoin="round" />
          <circle cx="12" cy="11" r="1.5" />
        </svg>
      )
    default:
      return null
  }
}

export function useWinstonLifeLightbox() {
  return useRef<(src: string) => void>(() => undefined)
}
