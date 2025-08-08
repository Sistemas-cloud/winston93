import { motion } from 'framer-motion'
import Image from 'next/image'

const PageLoadingScreen = () => {
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
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mb-8"
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
        
        {/* Texto institucional */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-white text-lg font-bold mb-1 tracking-wide">
            INSTITUTO WINSTON CHURCHILL
          </h1>
          
          <p className="text-blue-200 text-sm font-medium">
            Working for a Brighter Future
          </p>
        </motion.div>
        
        {/* Barra de progreso rápida */}
        <div className="w-32 mx-auto mb-6">
          <div className="bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
        
        {/* Indicadores de carga */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Texto de carga */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-white mt-4 text-sm font-medium"
        >
          Cargando página...
        </motion.p>
      </div>
    </motion.div>
  )
}

export default PageLoadingScreen 