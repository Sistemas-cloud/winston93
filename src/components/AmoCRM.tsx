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
  
  // 2026-09-22: Diferir AmoCRM hasta idle/interacción — evita CLS y main-thread block en móvil.
  useEffect(() => {
    if (typeof window === 'undefined') return

    let teardownGreetingClose: (() => void) | undefined
    let cancelled = false
    let idleId: number | undefined
    let timeoutId: number | undefined

    const loadAmo = () => {
      if (cancelled) return
      if (document.getElementById('amo_social_button_script')) {
        teardownGreetingClose = setupAmoGreetingCloseObserver()
        return
      }

      window.amo_social_button = {
        id: id,
        hash: hash,
        locale: locale,
        inline: false,
        setMeta: function (p) {
          this.params = (this.params || []).concat([p])
        },
        params: [],
      }

      const amoSocialButtonFn = function (...args: any[]) {
        ;(amoSocialButtonFn.q = amoSocialButtonFn.q || []).push(args)
      } as ((...args: any[]) => void) & { q?: any[] }
      amoSocialButtonFn.q = []
      window.amoSocialButton = amoSocialButtonFn

      teardownGreetingClose = setupAmoGreetingCloseObserver()

      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.id = 'amo_social_button_script'
      script.src = 'https://gso.amocrm.com/js/button.js?1658160430'
      document.head?.appendChild(script)
    }

    const onInteract = () => {
      loadAmo()
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('touchstart', onInteract)
      window.removeEventListener('click', onInteract)
    }

    window.addEventListener('scroll', onInteract, { once: true, passive: true })
    window.addEventListener('touchstart', onInteract, { once: true, passive: true })
    window.addEventListener('click', onInteract, { once: true })

    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({ didTimeout: true, timeRemaining: () => 0 } as IdleDeadline), 5000))
    idleId = ric(() => loadAmo(), { timeout: 6000 }) as number
    timeoutId = window.setTimeout(loadAmo, 7000)

    return () => {
      cancelled = true
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('touchstart', onInteract)
      window.removeEventListener('click', onInteract)
      if (typeof window.cancelIdleCallback === 'function' && idleId !== undefined) {
        window.cancelIdleCallback(idleId)
      } else if (idleId !== undefined) {
        window.clearTimeout(idleId)
      }
      if (timeoutId) window.clearTimeout(timeoutId)
      teardownGreetingClose?.()
    }
  }, [id, hash, locale])

  // Este componente no renderiza nada visible
  return null
}
