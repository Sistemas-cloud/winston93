import { useEffect } from 'react'

// Declaración de tipos para el objeto AmoCRM en window
declare global {
  interface Window {
    amoSocialButton?: ((...args: any[]) => void) & { q?: any[] }
    amo_social_button?: {
      id: string
      hash: string
      locale?: string
      inline?: boolean
      setMeta?: (params: any) => void
      params?: any[]
    }
  }
}

interface AmoCRMProps {
  id?: string
  hash?: string
  locale?: string
}

// 2026-08-31: Cierra la burbuja de bienvenida del chat (Kommo/AmoCRM) con botón X.
const AMO_GREETING_DISMISSED_KEY = 'winston93_amo_greeting_dismissed'

function isAmoGreetingDismissed(): boolean {
  try {
    return sessionStorage.getItem(AMO_GREETING_DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

function dismissAmoGreeting(): void {
  try {
    sessionStorage.setItem(AMO_GREETING_DISMISSED_KEY, '1')
  } catch {
    /* ignore */
  }
}

function hideAmoGreetingBubble(node: HTMLElement): void {
  node.style.display = 'none'
  node.setAttribute('aria-hidden', 'true')
  node.dataset.dismissed = 'true'
}

function attachCloseToAmoGreeting(node: HTMLElement): void {
  if (node.dataset.closeEnhanced === 'true') return
  node.dataset.closeEnhanced = 'true'

  const host = node.parentElement ?? node
  if (getComputedStyle(host).position === 'static') {
    host.style.position = 'relative'
  }

  const closeBtn = document.createElement('button')
  closeBtn.type = 'button'
  closeBtn.className = 'amo-greeting-close'
  closeBtn.setAttribute('aria-label', 'Cerrar mensaje')
  closeBtn.innerHTML = '&times;'
  closeBtn.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    hideAmoGreetingBubble(node)
    dismissAmoGreeting()
    closeBtn.remove()
  })

  host.appendChild(closeBtn)
}

function enhanceAmoGreetingBubbles(root: ParentNode = document): void {
  if (typeof window === 'undefined') return

  const dismissed = isAmoGreetingDismissed()
  root.querySelectorAll<HTMLElement>('.amo-livechat_bubble').forEach((bubble) => {
    if (dismissed || bubble.dataset.dismissed === 'true') {
      hideAmoGreetingBubble(bubble)
      return
    }
    attachCloseToAmoGreeting(bubble)
  })
}

function setupAmoGreetingCloseObserver(): () => void {
  enhanceAmoGreetingBubbles()

  const observer = new MutationObserver(() => {
    enhanceAmoGreetingBubbles()
  })

  observer.observe(document.body, { childList: true, subtree: true })

  const retryTimer = window.setInterval(() => {
    enhanceAmoGreetingBubbles()
  }, 1500)
  window.setTimeout(() => window.clearInterval(retryTimer), 15000)

  return () => {
    observer.disconnect()
    window.clearInterval(retryTimer)
  }
}

export default function AmoCRM({ 
  id = "238716",
  hash = "29c870677258fc88d0be09ef388efbacb487dc265acc4ee2e4bb24478ce29784",
  locale = "es"
}: AmoCRMProps) {
  
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return

    // Verificar si ya está cargado
    if (document.getElementById('amo_social_button_script')) {
      console.log('✅ AmoCRM ya está cargado')
      const teardownGreetingClose = setupAmoGreetingCloseObserver()
      return () => teardownGreetingClose()
    }

    console.log('🔄 Iniciando carga de AmoCRM...')
    console.log('📋 Configuración:', { id, hash: hash.substring(0, 10) + '...', locale })

    // PASO 1: Configurar el objeto AmoCRM PRIMERO (antes del script)
    window.amo_social_button = {
      id: id,
      hash: hash,
      locale: locale,
      inline: false, // Importante: false para que sea flotante
      setMeta: function(p) {
        this.params = (this.params || []).concat([p])
      },
      params: []
    }

    // PASO 2: Función para inicializar amoSocialButton
    // 2026-07-03: Asignación tipada segura para evitar error de strictNullChecks en build.
    const amoSocialButtonFn = function (...args: any[]) {
      ;(amoSocialButtonFn.q = amoSocialButtonFn.q || []).push(args)
    } as ((...args: any[]) => void) & { q?: any[] }
    amoSocialButtonFn.q = []
    window.amoSocialButton = amoSocialButtonFn

    console.log('✅ Objeto amo_social_button configurado:', window.amo_social_button)
    console.log('✅ Función amoSocialButton inicializada')

    const teardownGreetingClose = setupAmoGreetingCloseObserver()

    // PASO 3: AHORA crear y cargar el script (después de configurar todo)
    const script = document.createElement('script')
    script.async = true
    script.id = 'amo_social_button_script'
    script.src = 'https://gso.amocrm.com/js/button.js?1658160430'
    
    // Evento cuando se carga exitosamente
    script.onload = () => {
      console.log('✅ Script de AmoCRM cargado exitosamente')
      console.log('📦 Objeto amo_social_button:', window.amo_social_button)
      
      // Verificar después de 2 segundos si el widget apareció
      setTimeout(() => {
        const widget = document.querySelector('[id*="amo"], [class*="amo"]')
        if (widget) {
          console.log('✅ Widget de AmoCRM encontrado:', widget)
        } else {
          console.warn('⚠️ Widget de AmoCRM no encontrado en el DOM')
          console.warn('💡 Verifica que el widget esté habilitado en tu panel de AmoCRM')
        }
      }, 2000)
    }

    // Evento de error
    script.onerror = (error) => {
      console.error('❌ Error al cargar el script de AmoCRM:', error)
      console.error('🔍 Verifica tu conexión a internet y las credenciales')
    }
    
    // Agregar el script al head
    if (document.head) {
      document.head.appendChild(script)
      console.log('📝 Script agregado al <head>')
    }

    // Cleanup: remover el script cuando el componente se desmonte
    return () => {
      teardownGreetingClose()
      const existingScript = document.getElementById('amo_social_button_script')
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
        console.log('🗑️ Script de AmoCRM removido')
      }
    }
  }, [id, hash, locale])

  // Este componente no renderiza nada visible
  return null
}

