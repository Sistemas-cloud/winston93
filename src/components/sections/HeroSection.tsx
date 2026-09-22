// 2026-09-22: Performance móvil — poster LCP (WebP/AVIF), video diferido, sin preload=auto.
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const POSTER_AVIF_640 = '/images/slider/SLIDE_INICIO_1-640.avif'
const POSTER_AVIF_960 = '/images/slider/SLIDE_INICIO_1-960.avif'
const POSTER_AVIF_1280 = '/images/slider/SLIDE_INICIO_1-1280.avif'
const POSTER_WEBP_640 = '/images/slider/SLIDE_INICIO_1-640.webp'
const POSTER_WEBP_960 = '/images/slider/SLIDE_INICIO_1-960.webp'
const POSTER_WEBP_1280 = '/images/slider/SLIDE_INICIO_1-1280.webp'
const POSTER_JPG = '/images/slider/SLIDE_INICIO_1-lcp.jpg'

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(true)
  const [videoReady, setVideoReady] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [showPlayOverlay, setShowPlayOverlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // 2026-09-22: En móvil el LCP es el poster; el video solo tras idle/interacción.
  // En desktop se carga tras requestIdleCallback para no competir con LCP.
  useEffect(() => {
    let idleId: number | undefined
    let timeoutId: number | undefined

    const enableVideo = () => setShouldLoadVideo(true)

    if (isMobile) {
      // Móvil: esperar gesto o idle largo (no bloquear LCP con 20MB)
      const onInteract = () => {
        enableVideo()
        window.removeEventListener('touchstart', onInteract)
        window.removeEventListener('click', onInteract)
      }
      window.addEventListener('touchstart', onInteract, { once: true, passive: true })
      window.addEventListener('click', onInteract, { once: true })
      timeoutId = window.setTimeout(enableVideo, 8000)
      return () => {
        window.removeEventListener('touchstart', onInteract)
        window.removeEventListener('click', onInteract)
        if (timeoutId) window.clearTimeout(timeoutId)
      }
    }

    const ric = window.requestIdleCallback ?? ((cb: IdleRequestCallback) =>
      window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline), 2500))
    idleId = ric(() => enableVideo(), { timeout: 4000 }) as number

    return () => {
      if (typeof window.cancelIdleCallback === 'function' && idleId !== undefined) {
        window.cancelIdleCallback(idleId)
      } else if (idleId !== undefined) {
        window.clearTimeout(idleId)
      }
    }
  }, [isMobile])

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return

    const video = videoRef.current
    const tryPlay = async () => {
      try {
        video.muted = true
        video.playsInline = true
        await video.play()
        setVideoReady(true)
        setShowPlayOverlay(false)
      } catch {
        setShowPlayOverlay(true)
        setVideoReady(false)
      }
    }

    if (video.readyState >= 2) {
      void tryPlay()
    } else {
      video.addEventListener('canplay', () => void tryPlay(), { once: true })
      video.load()
    }
  }, [shouldLoadVideo])

  const handlePlayClick = async () => {
    if (!videoRef.current) {
      setShouldLoadVideo(true)
      return
    }
    try {
      videoRef.current.muted = true
      await videoRef.current.play()
      setVideoReady(true)
      setShowPlayOverlay(false)
    } catch {
      setShowPlayOverlay(true)
    }
  }

  return (
    <div className="relative h-full min-h-[85vh] w-full overflow-hidden md:min-h-screen">
      {/* 2026-09-22: Imagen LCP con dimensiones/aspect-ratio fijos — evita CLS y acelera paint */}
      <picture>
        <source
          type="image/avif"
          srcSet={`${POSTER_AVIF_640} 640w, ${POSTER_AVIF_960} 960w, ${POSTER_AVIF_1280} 1280w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`${POSTER_WEBP_640} 640w, ${POSTER_WEBP_960} 960w, ${POSTER_WEBP_1280} 1280w`}
          sizes="100vw"
        />
        <img
          src={POSTER_JPG}
          alt=""
          width={1366}
          height={768}
          decoding="async"
          // @ts-expect-error React 18 SSR: fetchpriority en minúsculas para HTML
          fetchpriority="high"
          fetchPriority="high"
          loading="eager"
          className="absolute inset-0 z-10 h-full w-full object-cover"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            aspectRatio: '1366 / 768',
          }}
        />
      </picture>

      {showPlayOverlay && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label="Reproducir video"
            className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-3 font-semibold text-blue-700 shadow-lg backdrop-blur-sm hover:bg-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Reproducir
          </button>
        </div>
      )}

      {shouldLoadVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={POSTER_JPG}
          controls={false}
          className="absolute inset-0 z-20 h-full w-full object-cover transition-opacity duration-700"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: videoReady ? 1 : 0,
          }}
          onCanPlay={() => {
            setVideoReady(true)
            setShowPlayOverlay(false)
          }}
        >
          <source src="/videos/winston-video.mp4" type="video/mp4" />
        </video>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/30 to-transparent pb-0 pt-24 md:pt-32">
        <div className="pointer-events-auto mx-auto flex max-w-4xl flex-col items-center px-4 pb-4 text-center md:pb-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E3FB07] md:text-xs">
            Instituto Winston Churchill
          </p>
          <p className="mb-4 text-lg font-bold text-white drop-shadow md:text-2xl">
            Working for a Brighter Future
          </p>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/admisiones"
              className="rounded-full bg-[#E3FB07] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-black shadow-lg transition hover:scale-[1.02] md:text-sm"
            >
              Admisiones
            </Link>
            <Link
              href="/admisiones#examen-admision"
              className="rounded-full border border-white/50 bg-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-[#E3FB07] hover:text-[#E3FB07] md:text-sm"
            >
              Agenda una cita
            </Link>
          </div>
        </div>
        <div className="pointer-events-auto border-t border-white/15 bg-[#012A9E]/95 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
            {[
              { label: '30+ años', sub: 'de experiencia' },
              { label: 'Bilingüe', sub: 'formación integral' },
              { label: 'Cambridge', sub: 'University' },
              { label: 'Cd. Madero', sub: 'Tamaulipas' },
            ].map((item) => (
              <div key={item.label} className="px-2 py-3 text-center md:py-3.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#E3FB07] md:text-sm">
                  {item.label}
                </p>
                <p className="text-[10px] text-white/75 md:text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
