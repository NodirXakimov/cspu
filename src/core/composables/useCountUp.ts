import { ref, watch, type Ref } from 'vue'

/** easeOutCubic — fast start, gentle settle. */
function ease(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Animate a number from its previous value to a new target with requestAnimationFrame.
 * `source` may be null (loading) → displays 0 without animating.
 */
export function useCountUp(
  source: Ref<number | null | undefined>,
  duration = 1200,
) {
  const display = ref(0)
  let raf = 0

  watch(
    source,
    (to) => {
      cancelAnimationFrame(raf)
      if (to == null || Number.isNaN(to)) {
        display.value = 0
        return
      }
      const from = display.value
      const delta = to - from
      if (delta === 0) return
      const start = performance.now()

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        display.value = from + delta * ease(t)
        if (t < 1) raf = requestAnimationFrame(step)
        else display.value = to
      }
      raf = requestAnimationFrame(step)
    },
    { immediate: true },
  )

  return display
}
