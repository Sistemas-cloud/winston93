import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const PageLoadingScreen = () => {
  const [currentQuote, setCurrentQuote] = useState('')

  const motivationalQuotes = [
    "Learning that leaves a mark for life.",
    "Small steps today, big impact tomorrow.",
    "Global minds with strong values.",
    "A school where confidence grows daily.",
    "Every day is a step toward their future.",
    "Aquí, el aprendizaje cobra sentido.",
    "Formamos personas íntegras, seguras y felices.",
    "Cada alumno es una historia de éxito en proceso.",
    "Educamos para transformar vidas.",
    "Creamos experiencias que inspiran a aprender."
  ]

  useEffect(() => {
    // Seleccionar una frase aleatoria al cargar
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setCurrentQuote(randomQuote)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-blue-900 to-blue-800 z-50 flex items-center justify-center"
    >
      {/* Efecto sutil de fondo - menos partículas para mayor velocidad */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Partículas doradas - menos cantidad */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`golden-${i}`}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.12, 0.35, 0.12],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Logo principal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1,
          }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut",
          }}
          className="mb-6"
        >
          <Image
            src="/images/logos/logo_winston.png"
            alt="Winston Churchill"
            width={300}
            height={75}
            className="h-20 w-auto mx-auto drop-shadow-lg"
            priority
            quality={100}
          />
        </motion.div>
        
        {/* Texto institucional y frase motivacional juntos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          {/* 2026-08-15: Sin H1 en pantallas de carga (evita múltiples H1 en auditoría SEO). */}
          <p className="text-white text-lg font-bold mb-1 tracking-wide">
            INSTITUTO WINSTON CHURCHILL
          </p>
          
          <p className="text-blue-200 text-sm font-medium mb-3">
            Working for a Brighter Future
          </p>

          {/* Frase motivacional aleatoria - aparece inmediatamente */}
          {currentQuote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-4"
            >
              <p className="text-yellow-300 text-sm font-medium italic text-center max-w-sm mx-auto leading-relaxed">
                &ldquo;{currentQuote}&rdquo;
              </p>
            </motion.div>
          )}
        </motion.div>
        
        {/* Barra de progreso rápida */}
        <div className="w-32 mx-auto mb-4">
          <div className="bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              // 2026-07-03: Duración alineada al timer de transición de página (700ms).
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
        
        {/* Indicadores de carga */}
        <div className="flex justify-center space-x-2 mb-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
        
        {/* Texto de carga */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-white text-sm font-medium"
        >
          Cargando página...
        </motion.p>
      </div>
    </motion.div>
  )
}

export default PageLoadingScreen 