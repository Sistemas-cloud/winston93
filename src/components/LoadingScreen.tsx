import { motion } from 'framer-motion'
import Image from 'next/image'

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-blue-900 to-blue-800 z-50 flex items-center justify-center"
    >
      {/* Efecto sutil de fondo */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Partículas adicionales distribuidas por toda la pantalla */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`distributed-${i}`}
            className="absolute w-0.5 h-0.5 bg-blue-300 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.08, 0.25, 0.08],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}

        {/* Partículas doradas esparcidas */}
        {[...Array(18)].map((_, i) => (
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
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Partículas muy pequeñas para textura */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`tiny-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.06, 0.18, 0.06],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Partículas adicionales en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`bottom-${i}`}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Partículas más pequeñas en la parte inferior */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`small-bottom-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Logo principal elegante */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1,
          }}
          transition={{ 
            duration: 1,
            ease: "easeOut",
          }}
          className="mb-12"
        >
          <Image
            src="/images/logos/logo_winston.png"
            alt="Winston Churchill"
            width={96}
            height={96}
            className="h-28 w-auto mx-auto drop-shadow-lg"
          />
        </motion.div>
        
        {/* Texto institucional serio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-white text-xl font-bold mb-2 tracking-wide">
            INSTITUTO WINSTON CHURCHILL
          </h1>
          
          <p className="text-blue-200 text-sm font-medium">
            Working for a Brighter Future
          </p>
        </motion.div>
        
        {/* Barra de progreso elegante */}
        <div className="w-48 mx-auto mb-8">
          <div className="bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
        
        {/* Indicadores de carga discretos */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        
        {/* Texto de carga profesional */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-white mt-6 text-sm font-medium"
        >
          Cargando contenido...
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LoadingScreen 