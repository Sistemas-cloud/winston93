import AnimatedElement from '@/components/AnimatedElement'

export default function HeroSection() {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/winston-video.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>
    </div>
  )
}