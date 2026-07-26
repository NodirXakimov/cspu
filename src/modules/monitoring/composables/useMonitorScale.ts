import { readonly, ref } from 'vue'

/**
 * Viewport-driven scale factor (0.72–1) for the monitoring page's interior
 * typography and graphics, so a fit-view 2×2 reads correctly on shorter screens
 * (e.g. 1280×800) and returns to full size on large TVs/monitors.
 *
 * Module-singleton: one shared ref + one resize listener for all callers. Feeds
 * both CSS (via a `--mscale` custom property set on the page root) and the
 * ECharts option objects (as a plain number).
 */

const REF_W = 1680
const REF_H = 945
const MIN = 0.72

function compute(): number {
  if (typeof window === 'undefined') return 1
  const raw = Math.min(window.innerWidth / REF_W, window.innerHeight / REF_H)
  return Math.max(MIN, Math.min(raw, 1))
}

const scale = ref(compute())
let installed = false
let raf = 0

function onResize() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    scale.value = compute()
  })
}

export function useMonitorScale() {
  if (!installed && typeof window !== 'undefined') {
    installed = true
    window.addEventListener('resize', onResize, { passive: true })
  }
  return { scale: readonly(scale) }
}
