import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import { motion } from 'framer-motion'
import { Anton } from 'next/font/google'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'
import WinstonLife from '@/components/WinstonLife'
import WinstonLifeComunidad from '@/components/sections/WinstonLifeComunidad'

const heroAnton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--wl-hero-display',
})

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Componente Modal para la galería
interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  title: string
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
  title
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative max-w-4xl max-h-full w-full h-full flex flex-col">
        {/* Header del modal */}
        <div className="flex justify-between items-center p-4 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar galería"
            className="text-white hover:text-gray-300 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Contenedor de la imagen */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 2026-07-03: Dimensiones y aria-labels en modal de galería. */}
            <img
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Botón anterior */}
            {images.length > 1 && (
              <button
                onClick={onPrev}
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                ←
              </button>
            )}
            
            {/* Botón siguiente */}
            {images.length > 1 && (
              <button
                onClick={onNext}
                aria-label="Imagen siguiente"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                →
              </button>
            )}
          </div>
        </div>

        {/* Contador de imágenes */}
        {images.length > 1 && (
          <div className="text-center text-white p-4">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  )
}

export default function WinstonLifePage() {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentGallery, setCurrentGallery] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeRibbon, setActiveRibbon] = useState<string | null>(null)
  const [video1Muted, setVideo1Muted] = useState(true)
  const [video2Muted, setVideo2Muted] = useState(true)
  const [video1ManuallyPaused, setVideo1ManuallyPaused] = useState(false)
  const [video2ManuallyPaused, setVideo2ManuallyPaused] = useState(false)
  
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const heroBgRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const heroRibbonRef = useRef<HTMLDivElement>(null)
  const flyTitleRef = useRef<HTMLDivElement>(null)

  // 2026-10-19: Hero → collage: letras viajan y se convierten en el watermark
  useEffect(() => {
    const hero = heroSectionRef.current
    const bg = heroBgRef.current
    const title = heroTitleRef.current
    const sub = heroSubRef.current
    const ribbon = heroRibbonRef.current
    const fly = flyTitleRef.current
    if (!hero || !bg || !title || !sub || !ribbon || !fly) return

    let st: ScrollTrigger | null = null
    let cancelled = false
    let lockedFrom: { left: number; top: number; width: number; height: number } | null =
      null
    let tries = 0

    const applyHeroExit = (p: number) => {
      const exit = Math.min(1, p * 1.35)
      gsap.set(bg, {
        scale: 1 + exit * 0.18,
        opacity: 1 - exit,
        filter: `blur(${exit * 22}px)`,
      })
      gsap.set(sub, {
        y: exit * 70,
        opacity: 1 - exit,
        filter: `blur(${exit * 14}px)`,
      })
      gsap.set(ribbon, {
        y: exit * 120,
        opacity: 1 - Math.min(1, exit * 1.15),
      })
    }

    const boot = () => {
      if (cancelled) return

      // Móvil: solo salida del hero (sin watermark desktop)
      if (window.matchMedia('(max-width: 1023px)').matches) {
        st = ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.15,
          onUpdate: (self) => {
            applyHeroExit(self.progress)
            gsap.set(title, {
              y: self.progress * 90,
              opacity: 1 - self.progress,
              filter: `blur(${self.progress * 10}px)`,
            })
          },
        })
        return
      }

      const collage = document.getElementById('winston-life-collage')
      const watermark = document.getElementById('wl-watermark')
      if (!collage || !watermark) {
        tries += 1
        if (tries < 90) requestAnimationFrame(boot)
        return
      }

      const winLine = fly.querySelector<HTMLElement>('[data-fly-winston]')
      const lifeLine = fly.querySelector<HTMLElement>('[data-fly-life]')
      if (!winLine || !lifeLine) return

      const placeFlyAt = (rect: {
        left: number
        top: number
        width: number
        height: number
      }) => {
        gsap.set(fly, {
          position: 'fixed',
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          zIndex: 70,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          transformOrigin: 'center center',
        })
      }

      const styleHeroLook = () => {
        gsap.set(winLine, {
          color: '#FFFFFF',
          WebkitTextStroke: '0px transparent',
          opacity: 1,
        })
        gsap.set(lifeLine, {
          color: '#E3FB07',
          WebkitTextStroke: '1.5px #013BDF',
          opacity: 1,
        })
      }

      gsap.set(watermark, { opacity: 0 })
      gsap.set(fly, { opacity: 0, visibility: 'hidden' })

      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      const mixHex = (c1: string, c2: string, t: number) => {
        const p1 = c1.replace('#', '')
        const p2 = c2.replace('#', '')
        const n = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16)
        const r = Math.round(lerp(n(p1, 0), n(p2, 0), t))
        const g = Math.round(lerp(n(p1, 2), n(p2, 2), t))
        const b = Math.round(lerp(n(p1, 4), n(p2, 4), t))
        return `rgb(${r},${g},${b})`
      }

      st = ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        endTrigger: collage,
        end: 'top 42%',
        scrub: 1.25,
        invalidateOnRefresh: true,
        onRefresh: () => {
          lockedFrom = null
          if (st && st.progress === 0) {
            gsap.set(fly, { opacity: 0, visibility: 'hidden' })
            gsap.set(title, { opacity: 1, y: 0, filter: 'none' })
            gsap.set(watermark, { opacity: 0 })
            styleHeroLook()
            applyHeroExit(0)
          }
        },
        onUpdate: (self) => {
          const p = self.progress
          applyHeroExit(p)

          const to = watermark.getBoundingClientRect()

          if (p <= 0.03) {
            lockedFrom = null
            gsap.set(title, { opacity: 1 })
            gsap.set(fly, { opacity: 0, visibility: 'hidden' })
            gsap.set(watermark, { opacity: 0 })
            styleHeroLook()
            return
          }

          if (!lockedFrom) {
            const r = title.getBoundingClientRect()
            lockedFrom = {
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
            }
          }

          gsap.set(title, { opacity: 0 })
          gsap.set(fly, { visibility: 'visible' })
          placeFlyAt(lockedFrom)

          const t = Math.min(1, Math.max(0, (p - 0.03) / 0.97))
          const eased = t * t * (3 - 2 * t)

          const fromCx = lockedFrom.left + lockedFrom.width / 2
          const fromCy = lockedFrom.top + lockedFrom.height / 2
          const toCx = to.left + to.width / 2
          const toCy = to.top + to.height / 2
          const scale = to.width / Math.max(lockedFrom.width, 1)

          gsap.set(fly, {
            x: (toCx - fromCx) * eased,
            y: (toCy - fromCy) * eased,
            scale: 1 + (scale - 1) * eased,
            opacity: t < 0.9 ? 1 : 1 - (t - 0.9) / 0.1,
          })

          gsap.set(winLine, {
            color: mixHex('#FFFFFF', '#0A2A6B', eased),
            WebkitTextStroke:
              eased < 0.3 ? '0px transparent' : `${(eased - 0.3) * 2.6}px #E3FB07`,
          })
          gsap.set(lifeLine, {
            color: mixHex('#E3FB07', '#0A2A6B', eased),
            WebkitTextStroke: `${lerp(1.5, 2, eased)}px ${mixHex('#013BDF', '#E3FB07', eased)}`,
          })

          if (t >= 0.9) {
            gsap.set(watermark, { opacity: (t - 0.9) / 0.1 })
          } else {
            gsap.set(watermark, { opacity: 0 })
          }

          if (t >= 0.99) {
            gsap.set(fly, { opacity: 0, visibility: 'hidden' })
            gsap.set(watermark, { opacity: 1 })
          }
        },
      })

      ScrollTrigger.refresh()
    }

    void document.fonts.ready.then(() => {
      requestAnimationFrame(boot)
    })

    return () => {
      cancelled = true
      st?.kill()
    }
  }, [])

  // Sincronizar el estado muted con los elementos de video
  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.muted = video1Muted
    }
  }, [video1Muted])

  useEffect(() => {
    if (video2Ref.current) {
      video2Ref.current.muted = video2Muted
    }
  }, [video2Muted])

  // 2026-09-22: Cargar src del video solo al entrar en viewport (videos 21–70MB).
  useEffect(() => {
    const attach = (video: HTMLVideoElement | null, src: string) => {
      if (!video) return () => undefined
      const load = () => {
        if (video.dataset.srcLoaded === '1') return
        video.dataset.srcLoaded = '1'
        const source = video.querySelector('source')
        if (source && !source.getAttribute('src')) {
          source.setAttribute('src', src)
          video.load()
        }
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            load()
            io.disconnect()
          }
        },
        { rootMargin: '200px' }
      )
      io.observe(video)
      return () => io.disconnect()
    }
    const d1 = attach(video1Ref.current, '/images/Winston Life/video1.mp4')
    const d2 = attach(video2Ref.current, '/images/Winston Life/video2.mp4')
    return () => {
      d1()
      d2()
    }
  }, [])

  // Intersection Observer para video 1 - pausar cuando no está visible
  useEffect(() => {
    const video1 = video1Ref.current
    if (!video1) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!video1ManuallyPaused) {
              video1.play().catch(() => undefined)
            }
          } else if (!video1ManuallyPaused) {
            video1.pause()
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(video1)
    return () => observer.disconnect()
  }, [video1ManuallyPaused])

  // Intersection Observer para video 2 - pausar cuando no está visible
  useEffect(() => {
    const video2 = video2Ref.current
    if (!video2) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video está visible, reproducir solo si no fue pausado manualmente
            if (!video2ManuallyPaused) {
              video2.play().catch((error) => {
                console.log('Error al reproducir video 2:', error)
              })
            }
          } else {
            // Video no está visible, pausar (solo si no fue pausado manualmente)
            if (!video2ManuallyPaused) {
              video2.pause()
            }
          }
        })
      },
      {
        threshold: 0.5 // Se considera visible cuando al menos el 50% está en pantalla
      }
    )

    observer.observe(video2)

    return () => {
      observer.disconnect()
    }
  }, [video2ManuallyPaused])

  const toggleVideo1Audio = () => {
    setVideo1Muted(!video1Muted)
  }

  const toggleVideo2Audio = () => {
    setVideo2Muted(!video2Muted)
  }

  const toggleVideo1PlayPause = () => {
    if (video1Ref.current) {
      if (video1Ref.current.paused) {
        video1Ref.current.play()
        setVideo1ManuallyPaused(false)
      } else {
        video1Ref.current.pause()
        setVideo1ManuallyPaused(true)
      }
    }
  }

  const toggleVideo2PlayPause = () => {
    if (video2Ref.current) {
      if (video2Ref.current.paused) {
        video2Ref.current.play()
        setVideo2ManuallyPaused(false)
      } else {
        video2Ref.current.pause()
        setVideo2ManuallyPaused(true)
      }
    }
  }

  // Galerías de imágenes
  const galleries = {
    soyWinston: {
      title: "#SOY WINSTON",
      gridImages: [
        "/images/Winston Life/galeria soy winston/xantolo.png",
        "/images/Winston Life/galeria soy winston/xantolo1.png",
        "/images/Winston Life/galeria soy winston/posada.png",
        "/images/Winston Life/galeria soy winston/niño.png",
        "/images/Winston Life/galeria soy winston/navidad_primaria.png",
        "/images/Winston Life/galeria soy winston/navidad.png",
        "/images/Winston Life/galeria soy winston/halloween.png",
        "/images/Winston Life/galeria soy winston/acción.png",
        "/images/Winston Life/galeria soy winston/estudiante.png"
      ],
      galleryImages: [
        "/images/Winston Life/galeria soy winston/xantolo_banner.jpg",
        "/images/Winston Life/galeria soy winston/xantolo1_banner.jpg",
        "/images/Winston Life/galeria soy winston/posada_banner.jpg",
        "/images/Winston Life/galeria soy winston/niño_banner.jpg",
        "/images/Winston Life/galeria soy winston/navidad_primaria_banner.jpg",
        "/images/Winston Life/galeria soy winston/navidad_banner.jpg",
        "/images/Winston Life/galeria soy winston/halloween_banner.jpg",
        "/images/Winston Life/galeria soy winston/accion_banner.png",
        "/images/Winston Life/galeria soy winston/estudiante_banner.JPG"
      ]
    }
  }


  const openGallery = (galleryName: string, imageIndex = 0) => {
    setCurrentGallery(galleryName)
    setCurrentImageIndex(imageIndex)
    setGalleryOpen(true)
  }

  const closeGallery = () => {
    setGalleryOpen(false)
    setCurrentGallery(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (currentGallery && galleries[currentGallery as keyof typeof galleries]) {
      const gallery = galleries[currentGallery as keyof typeof galleries]
      setCurrentImageIndex((prev) => (prev + 1) % gallery.galleryImages.length)
    }
  }

  const prevImage = () => {
    if (currentGallery && galleries[currentGallery as keyof typeof galleries]) {
      const gallery = galleries[currentGallery as keyof typeof galleries]
      setCurrentImageIndex((prev) => (prev - 1 + gallery.galleryImages.length) % gallery.galleryImages.length)
    }
  }

  const handleRibbonClick = (section: string) => {
    // Cambiar a la nueva sección seleccionada (la anterior se desactiva automáticamente)
    setActiveRibbon(section)
    
    // Navegar al ancla correspondiente después de que termine la transición de la mueca
    setTimeout(() => {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 650)
  }

  // 2026-07-03: Metadata SEO centralizada para /winston-life.
  const pageSeo = SITE_ROUTES.find((route) => route.path === '/winston-life')!

  return (
    <>
      <Head>
        {/* 2026-09-22: Preload LCP Winston Life */}
        <link
          rel="preload"
          as="image"
          href="/images/Winston Life/portada-480.webp"
          type="image/webp"
        />
      </Head>
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />

      {/* Header */}
      <Navigation currentSection={0} />

      {/* 2026-04-10: Sin pt superior; el hero arranca en y=0 y el nav fijo/transparente se superpone a la portada (igual que home en móvil/tablet). */}
      {/* 2026-10-19: fondo #F9F9F9 continuo con el collage — sin franja blanca en el morph */}
      <div
        className={`min-h-screen ${heroAnton.variable}`}
        style={{ backgroundColor: '#F9F9F9' }}
      >
        {/* Título volador: morph hero → watermark collage */}
        <div
          ref={flyTitleRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[70] opacity-0"
          style={{ visibility: 'hidden' }}
        >
          <p
            data-fly-winston
            className="font-[family-name:var(--wl-hero-display)] text-center text-4xl uppercase leading-[0.82] tracking-[-0.04em] sm:text-6xl md:text-8xl"
          >
            WINSTON
          </p>
          <p
            data-fly-life
            className="font-[family-name:var(--wl-hero-display)] mt-1 text-center text-3xl uppercase leading-[0.82] tracking-[-0.04em] sm:text-4xl md:text-6xl"
            style={{ paintOrder: 'stroke fill' }}
          >
            LIFE
          </p>
        </div>

        {/* Banner Principal */}
        <section
          ref={heroSectionRef}
          className="relative h-[85vh] min-h-[520px] overflow-hidden md:h-screen"
          style={{ backgroundColor: '#F9F9F9' }}
        >
          <div
            ref={heroBgRef}
            className="absolute inset-0 origin-center will-change-transform"
          >
            {/* 2026-09-22: LCP — WebP responsivo + fetchpriority; sin video en primer paint */}
            <img
              src="/images/Winston Life/portada-750.webp"
              srcSet="/images/Winston Life/portada-480.webp 480w, /images/Winston Life/portada-750.webp 750w, /images/Winston Life/portada-1280.webp 1280w"
              sizes="100vw"
              alt="Winston Life - Instituto Winston Churchill"
              width={1920}
              height={1080}
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-full w-full object-cover"
              style={{ aspectRatio: '1920 / 1080' }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            {/* 2026-10-19: Título que se convierte en el watermark del collage */}
            <div className="mb-12 text-center md:mb-16">
              <h1
                ref={heroTitleRef}
                className="font-[family-name:var(--wl-hero-display)] text-4xl font-normal uppercase leading-[0.92] tracking-[-0.04em] sm:text-6xl md:text-8xl"
              >
                <span className="block text-white">WINSTON</span>
                <span
                  className="mt-1 block text-3xl sm:text-4xl md:text-6xl"
                  style={{
                    color: '#E3FB07',
                    WebkitTextStroke: '1.5px #013BDF',
                    paintOrder: 'stroke fill',
                  }}
                >
                  LIFE
                </span>
              </h1>
              <p
                ref={heroSubRef}
                className="mx-auto mt-4 max-w-md px-4 text-sm text-white/90 md:text-base"
              >
                Vida estudiantil, deporte y comunidad en el Instituto Winston Churchill.
              </p>
            </div>

            {/* Cintilla con iconos - Completamente unida con colores sólidos */}
            <motion.div
              ref={heroRibbonRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 flex h-28 will-change-transform sm:h-32"
            >
              {/* Winston Olympics - Azul sólido */}
              <div
                className="relative flex-1 cursor-pointer transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-white bg-blue-600 bg-opacity-80 overflow-visible"
                onClick={() => handleRibbonClick('winston-olympics')}
                style={{
                  maskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  WebkitMaskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  transition: '--hole-r 600ms ease',
                  ['--hole-r' as any]: activeRibbon === 'winston-olympics' ? '80px' : '0px'
                }}
              >
                {/* 2026-03-27: Optimización responsive de cintilla para mantener legibilidad/tacto en móvil. */}
                {/* Icono con z-index muy alto para asegurar visibilidad */}
                <div className={`relative ${activeRibbon === 'winston-olympics' ? 'z-[9999]' : 'z-20'}`}>
                  {/* 2026-07-03: Dimensiones explícitas en iconos de cintilla para reducir CLS. */}
                  <img
                    src="/images/Winston Life/iconos/CARA_LEON.png"
                    alt="Winston Olympics"
                    width={64}
                    height={64}
                    className={`w-11 h-11 sm:w-16 sm:h-16 mb-1 sm:mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'winston-olympics' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-[11px] sm:text-lg md:text-xl text-center relative z-40 text-white px-1">WINSTON OLYMPICS</span>
              </div>

              {/* Entrepreneurs - Verde lima sólido */}
              <div
                className="relative flex-1 cursor-pointer transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-black bg-[#E3FB07] bg-opacity-80 overflow-visible"
                onClick={() => handleRibbonClick('entrepreneurs')}
                style={{
                  maskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  WebkitMaskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  transition: '--hole-r 600ms ease',
                  ['--hole-r' as any]: activeRibbon === 'entrepreneurs' ? '80px' : '0px'
                }}
              >
                {/* Icono con z-index muy alto para asegurar visibilidad */}
                <div className={`relative ${activeRibbon === 'entrepreneurs' ? 'z-[9999]' : 'z-20'}`}>
                  <img
                    src="/images/Winston Life/iconos/FOCO.png"
                    alt="Entrepreneurs"
                    width={64}
                    height={64}
                    className={`w-11 h-11 sm:w-16 sm:h-16 mb-1 sm:mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'entrepreneurs' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-[11px] sm:text-lg md:text-xl text-center relative z-40 text-blue-600 px-1">ENTREPRENEURS</span>
              </div>

              {/* #Soy Winston - Azul sólido */}
              <div
                className="relative flex-1 cursor-pointer transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-white bg-blue-600 bg-opacity-80 overflow-visible"
                onClick={() => handleRibbonClick('soy-winston')}
                style={{
                  maskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  WebkitMaskImage: 'radial-gradient(circle var(--hole-r) at 50% 0%, transparent var(--hole-r), black var(--hole-r))',
                  transition: '--hole-r 600ms ease',
                  ['--hole-r' as any]: activeRibbon === 'soy-winston' ? '80px' : '0px'
                }}
              >
                {/* Icono con z-index muy alto para asegurar visibilidad */}
                <div className={`relative ${activeRibbon === 'soy-winston' ? 'z-[9999]' : 'z-20'}`}>
                  <img
                    src="/images/Winston Life/iconos/icono_winston.png"
                    alt="#Soy Winston"
                    width={64}
                    height={64}
                    className={`w-11 h-11 sm:w-16 sm:h-16 mb-1 sm:mb-2 transition-all duration-700 ease-in-out ${
                      activeRibbon === 'soy-winston' ? 'scale-150 -translate-y-4' : ''
                    }`}
                  />
                </div>
                <span className="text-[11px] sm:text-lg md:text-xl text-center relative z-40 text-white px-1">#SOYWINSTON</span>
              </div>
              {/* Iconos superpuestos para evitar ser enmascarados y asegurar visibilidad */}
              <div
                className="absolute z-[10000] pointer-events-none transition-opacity duration-700 ease-out"
                style={{ left: '16.6667%', transform: 'translateX(-50%)', top: '-28px', opacity: activeRibbon === 'winston-olympics' ? 1 : 0 }}
              >
                <img
                  src="/images/Winston Life/iconos/CARA_LEON.png"
                  alt=""
                  aria-hidden="true"
                  width={64}
                  height={64}
                  className={`w-16 h-16 transition-transform duration-700 ease-out ${
                    activeRibbon === 'winston-olympics' ? 'scale-150 -translate-y-3' : 'scale-100 translate-y-0'
                  }`}
                />
              </div>
              <div
                className="absolute z-[10000] pointer-events-none transition-opacity duration-700 ease-out"
                style={{ left: '50%', transform: 'translateX(-50%)', top: '-28px', opacity: activeRibbon === 'entrepreneurs' ? 1 : 0 }}
              >
                <img
                  src="/images/Winston Life/iconos/FOCO.png"
                  alt=""
                  aria-hidden="true"
                  width={64}
                  height={64}
                  className={`w-16 h-16 transition-transform duration-700 ease-out ${
                    activeRibbon === 'entrepreneurs' ? 'scale-150 -translate-y-3' : 'scale-100 translate-y-0'
                  }`}
                />
              </div>
              <div
                className="absolute z-[10000] pointer-events-none transition-opacity duration-700 ease-out"
                style={{ left: '83.3333%', transform: 'translateX(-50%)', top: '-28px', opacity: activeRibbon === 'soy-winston' ? 1 : 0 }}
              >
                <img
                  src="/images/Winston Life/iconos/icono_winston.png"
                  alt=""
                  aria-hidden="true"
                  width={64}
                  height={64}
                  className={`w-16 h-16 transition-transform duration-700 ease-out ${
                    activeRibbon === 'soy-winston' ? 'scale-150 -translate-y-3' : 'scale-100 translate-y-0'
                  }`}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2026-10-17: Collage orgánico + bento — scroll natural (sin pin) */}
        <WinstonLife id="winston-life-collage" />

        {/* 2026-10-19: Comunidad rediseñada — sticky + tarjetas (textos intactos). */}
        <WinstonLifeComunidad />

        {/* Video Principal - Pantalla completa */}
        <section id="winston-olympics" className="relative h-[70vh] min-h-[420px] overflow-hidden bg-black md:h-screen">
          <video
            ref={video1Ref}
            autoPlay
            loop
            muted={video1Muted}
            playsInline
            className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            preload="none"
            poster="/images/Winston Life/portada-750.webp"
            onClick={toggleVideo1PlayPause}
          >
            <source type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          {/* Botón de control de audio */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleVideo1Audio()
            }}
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110"
            aria-label={video1Muted ? "Activar audio" : "Desactivar audio"}
          >
            {video1Muted ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </section>

        {/* 2026-10-28: tomas de festividades junto al video de Winston Olympics. */}
        <section className="bg-white px-4 py-10 md:px-8" aria-label="Festividades Winston">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['/images/Winston Life/galeria soy winston/navidad.png', 'Posada navideña de alumnos Winston'],
              ['/images/Winston Life/galeria soy winston/navidad_primaria.png', 'Navidad en primaria'],
              ['/images/Winston Life/galeria soy winston/xantolo.png', 'Celebración de Xantolo'],
              ['/images/Winston Life/galeria soy winston/xantolo1.png', 'Alumnos en Xantolo'],
            ].map(([src, alt]) => (
              <img key={src} src={src} alt={alt} className="h-40 w-full rounded-2xl object-cover md:h-52" />
            ))}
          </div>
        </section>

        {/* Sección ENTREPRENEURS — 2026-10-19: imágenes conectan a /programas#finanzas-emprendimiento */}
        <section id="entrepreneurs" className="py-14 md:py-20 bg-white overflow-hidden">
          <div className="mb-10 text-center md:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-gray-600 md:text-5xl">
              ENTREPRENEURS
            </h2>
            <Link
              href="/programas#finanzas-emprendimiento"
              className="inline-flex text-sm font-bold uppercase tracking-[0.14em] text-[#013BDF] hover:underline"
            >
              Ver Finanzas y emprendimiento →
            </Link>
          </div>
          <div className="w-full">
            {/* Track duplicado: dos grupos idénticos para loop perfecto */}
            <div className="relative z-10 overflow-hidden">
              <div className="wl-cintilla-track flex w-max">
                {/* Grupo A */}
                <div className="flex items-center gap-4">
                  {[1,2,3,4,5,6,7].map((num) => (
                    <div key={`a-${num}`} className="flex-shrink-0">
                      <Link
                        href="/programas#finanzas-emprendimiento"
                        className="relative block group"
                        aria-label="Ir a Finanzas y emprendimiento"
                      >
                        <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 rounded-2xl shadow-lg border-2 border-blue-200 transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-400 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:via-white group-hover:to-blue-50 group-hover:-translate-y-2">
                          {/* 2026-07-03: Dimensiones explícitas en carrusel Entrepreneurs para reducir CLS. */}
                          <img src={`/images/Winston Life/emprendedores/emprendedores${num}.${num === 2 ? 'png' : 'jpg'}`} alt={`Programa Entrepreneurs - Actividad ${num}`} width={420} height={300} loading="lazy" decoding="async" className="w-[280px] sm:w-[340px] md:w-[420px] h-[210px] sm:h-[250px] md:h-[300px] object-cover rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:brightness-110" />
                          <div className="absolute inset-4 bg-gradient-to-t from-blue-700/60 via-blue-500/20 to-[#E3FB07]/25 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <p className="text-blue-900 text-sm font-bold text-center uppercase tracking-wide">Programa Entrepreneurs</p>
                            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-1 rounded-full"></div>
                          </div>
                          <div className="absolute top-2 left-2 w-3 h-3 bg-[#E3FB07] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                {/* Grupo B (duplicado) */}
                <div className="flex items-center gap-4" aria-hidden="true">
                  {[1,2,3,4,5,6,7].map((num) => (
                    <div key={`b-${num}`} className="flex-shrink-0">
                      <div className="relative group">
                        <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 rounded-2xl shadow-lg border-2 border-blue-200 transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-400 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:via-white group-hover:to-blue-50 group-hover:-translate-y-2">
                          {/* 2026-07-03: Dimensiones explícitas en carrusel Entrepreneurs para reducir CLS. */}
                          <img src={`/images/Winston Life/emprendedores/emprendedores${num}.${num === 2 ? 'png' : 'jpg'}`} alt={`Programa Entrepreneurs - Actividad ${num}`} width={420} height={300} loading="lazy" decoding="async" className="w-[280px] sm:w-[340px] md:w-[420px] h-[210px] sm:h-[250px] md:h-[300px] object-cover rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:brightness-110" />
                          <div className="absolute inset-4 bg-gradient-to-t from-blue-700/60 via-blue-500/20 to-[#E3FB07]/25 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <p className="text-blue-900 text-sm font-bold text-center uppercase tracking-wide">Programa Entrepreneurs</p>
                            <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-1 rounded-full"></div>
                          </div>
                          <div className="absolute top-2 left-2 w-3 h-3 bg-[#E3FB07] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bordes sutiles y desvanecidos full-bleed */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2 z-20">
              <div className="wl-cintilla-track flex w-max">
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20"></div>
                {/* duplicado */}
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/60 to-transparent" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-[#E3FB07]/40 to-blue-100/20" aria-hidden="true"></div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 z-20">
              <div className="wl-cintilla-track flex w-max">
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40"></div>
                {/* duplicado */}
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-transparent to-blue-100/60" aria-hidden="true"></div>
                <div className="w-[320px] h-full bg-gradient-to-r from-blue-100/20 to-[#E3FB07]/40" aria-hidden="true"></div>
              </div>
            </div>
          </div>
          {/* Animación de marquee verdaderamente continua para la cintilla */}
          <style jsx>{`
            @keyframes wl-marquee-x {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .wl-cintilla-track {
              will-change: transform;
              /* 2026-04-16: Se ajusta la velocidad del slider a 52 segundos por solicitud del usuario. */
              animation: wl-marquee-x 52s linear infinite;
            }
          `}</style>
        </section>

        {/* Sección #SOY WINSTON */}
        <section id="soy-winston" className="py-14 md:py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            {/* 2026-10-02: Título #SOY WINSTON con color de marca (azul + lima) y movimiento: entrada al hacer scroll, brillo en bucle y subrayado animado. */}
            <div className="text-center mb-10 md:mb-16">
              <motion.h2
                className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="inline-block text-[#013BDF]"
                  initial={{ rotate: -12, scale: 0.6 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.25 }}
                >
                  #
                </motion.span>
                <span className="sw-title-shine">SOY WINSTON</span>
              </motion.h2>
              <motion.div
                aria-hidden="true"
                className="mx-auto h-1.5 w-24 md:w-32 rounded-full bg-gradient-to-r from-[#E3FB07] via-[#9BE15D] to-[#013BDF] origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.35 }}
              />
            </div>
            <style jsx>{`
              .sw-title-shine {
                background-image: linear-gradient(100deg, #013bdf 0%, #013bdf 40%, #5b8cff 50%, #013bdf 60%, #013bdf 100%);
                background-size: 250% 100%;
                background-position: 100% 0;
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                animation: sw-shine 4.5s ease-in-out infinite;
              }
              @keyframes sw-shine {
                0% { background-position: 100% 0; }
                60%, 100% { background-position: 0% 0; }
              }
              @media (prefers-reduced-motion: reduce) {
                .sw-title-shine { animation: none; }
              }
            `}</style>
            
            {/* Grid de imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 max-w-6xl mx-auto">
              {galleries.soyWinston.gridImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => openGallery('soyWinston', index)}
                >
                  {/* 2026-07-03: Dimensiones explícitas en galería #SoyWinston para reducir CLS. */}
                  <img
                    src={image}
                    alt={`#Soy Winston ${index + 1}`}
                    width={640}
                    height={320}
                    loading="lazy"
                    decoding="async"
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-72 md:h-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-60 px-4 py-2 rounded-full">
                        <span className="text-blue-900 font-medium text-xs sm:text-sm uppercase tracking-wide">
                          VER COMPLETA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2026-08-24: Video final sin recorte agresivo — object-contain + fondo marca. */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0A1F44] md:min-h-screen">
          <video
            ref={video2Ref}
            autoPlay
            loop
            muted={video2Muted}
            playsInline
            className="relative z-10 mx-auto max-h-[100vh] w-full cursor-pointer object-contain"
            preload="none"
            poster="/images/Winston Life/portada-750.webp"
            onClick={toggleVideo2PlayPause}
          >
            <source type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          {/* Botón de control de audio */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleVideo2Audio()
            }}
            className="absolute bottom-4 right-4 z-20 rounded-full bg-black bg-opacity-50 p-3 text-white transition-all duration-300 hover:scale-110 hover:bg-opacity-75 md:bottom-8 md:right-8 md:p-4"
            aria-label={video2Muted ? "Activar audio" : "Desactivar audio"}
          >
            {video2Muted ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </section>

        {/* Modal de Galería */}
        {galleryOpen && currentGallery && (
          <GalleryModal
            isOpen={galleryOpen}
            onClose={closeGallery}
            images={galleries[currentGallery as keyof typeof galleries].galleryImages}
            currentIndex={currentImageIndex}
            onNext={nextImage}
            onPrev={prevImage}
            title={galleries[currentGallery as keyof typeof galleries].title}
          />
        )}
      </div>
      
    </>
  )
}
