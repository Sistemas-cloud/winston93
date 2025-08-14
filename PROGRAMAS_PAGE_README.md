# Página de Programas - Instituto Winston Churchill

## Descripción
Esta página presenta tres programas especializados del Instituto Winston Churchill en un formato de pantalla completa con scroll suave entre secciones.

## Características Principales

### 🎯 Diseño de Pantalla Completa
- Cada sección ocupa el 100% de la altura de la pantalla
- Scroll suave entre secciones con snap automático
- Header siempre transparente para no interferir con el contenido

### 🖼️ Layout de Tres Tercios
- **Izquierda (2/3 de pantalla)**: Imagen de fondo con efecto parallax
- **Derecha (1/3 de pantalla)**: Panel de texto con información del programa
- Fundido suave entre imagen y texto para mejor legibilidad

### ✨ Efectos Visuales
- Animaciones de entrada escalonadas para cada elemento
- Efecto parallax sutil en las imágenes
- Transiciones suaves entre secciones
- Indicador visual de la sección actual

## Secciones Implementadas

### 1. Formación Social y Humana (Mindfulness)
- **Imagen**: `/images/mindfulness/mindfulness1.jpg`
- **Color de fondo**: Azul degradado
- **Contenido**: Información sobre mindfulness y bienestar emocional

### 2. Educación Financiera (Entrepreneurs)
- **Imagen**: `/images/entrepreneurs/emprendedores1.jpg`
- **Color de fondo**: Amarillo degradado
- **Contenido**: Descripción del programa de emprendimiento

### 3. Mindfulness
- **Imagen**: `/images/mindfulness/mindfulness2.png`
- **Color de fondo**: Azul degradado
- **Contenido**: Detalles sobre ejercicios de respiración y concentración

## Navegación

### Controles de Scroll
- **Flechas de navegación**: Botones arriba/abajo en cada sección
- **Indicador de sección**: Puntos en el lado derecho de la pantalla
- **Scroll del mouse**: Navegación natural con scroll snapping

### Funcionalidades
- Navegación por teclado (flechas arriba/abajo)
- Scroll suave automático
- Indicador visual de la sección actual
- Botones deshabilitados en secciones extremas

## Tecnologías Utilizadas

- **Next.js 15**: Framework de React
- **Framer Motion**: Animaciones y transiciones
- **Tailwind CSS**: Estilos y diseño responsive
- **TypeScript**: Tipado estático
- **CSS personalizado**: Scroll snapping y efectos especiales

## Estructura de Archivos

```
src/
├── pages/
│   └── programas.tsx          # Página principal
└── styles/
    └── globals.css            # Estilos CSS personalizados
```

## Características Técnicas

### Scroll Snapping
- `scroll-snap-type: y mandatory`
- `scroll-snap-align: start`
- Navegación suave entre secciones

### Animaciones
- Entrada escalonada de elementos
- Efectos de hover en botones
- Transiciones suaves de opacidad y transformación

### Responsive Design
- Adaptable a diferentes tamaños de pantalla
- Mantiene proporciones en dispositivos móviles
- Navegación optimizada para touch

## Uso

### Acceso
La página está disponible en `/programas` y se puede acceder desde:
- Navegación principal del sitio
- Enlaces directos
- Redirecciones programáticas

### Personalización
Para agregar nuevas secciones:
1. Modificar el array `sections` en `programas.tsx`
2. Agregar las imágenes correspondientes en `/public/images/`
3. Ajustar colores y estilos según sea necesario

## Optimizaciones Implementadas

- **Lazy Loading**: Imágenes se cargan solo cuando son visibles
- **Scroll Performance**: Uso de `useCallback` y optimizaciones de renderizado
- **Accessibility**: Etiquetas ARIA y navegación por teclado
- **SEO**: Meta tags optimizados y estructura semántica

## Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Dispositivos móviles (iOS/Android)
- ✅ Navegadores con soporte para CSS Grid y Flexbox

## Mantenimiento

### Actualizaciones de Contenido
- Modificar el array `sections` para cambiar texto
- Reemplazar imágenes en `/public/images/`
- Ajustar colores en la configuración de cada sección

### Mejoras de Performance
- Optimizar imágenes antes de subirlas
- Monitorear métricas de Core Web Vitals
- Implementar lazy loading adicional si es necesario 