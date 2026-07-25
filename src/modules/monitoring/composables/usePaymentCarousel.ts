import { onMounted, onUnmounted, ref } from 'vue'

/** Payment-tile carousel views, in rotation order. */
export const PAYMENT_VIEWS = ['summary', 'debtors'] as const
export type PaymentView = (typeof PAYMENT_VIEWS)[number]

/** How long each view holds before auto-advancing. */
const DWELL: Record<PaymentView, number> = {
  summary: 5000,
  debtors: 20000,
}

/**
 * Shared carousel state for the payment tile — instantiated once in
 * MonitoringView so the top-bar switcher and PaymentSection stay in sync.
 * Manually picking a view pauses auto-rotation until Play is pressed.
 */
export function usePaymentCarousel() {
  const view = ref<PaymentView>('summary')
  const playing = ref(true)
  let timer: ReturnType<typeof setTimeout> | undefined

  function clearTimer() {
    if (timer) clearTimeout(timer)
    timer = undefined
  }

  function schedule() {
    clearTimer()
    if (!playing.value) return
    timer = setTimeout(() => {
      advance()
      schedule()
    }, DWELL[view.value])
  }

  function advance() {
    const i = PAYMENT_VIEWS.indexOf(view.value)
    view.value = PAYMENT_VIEWS[(i + 1) % PAYMENT_VIEWS.length]
  }

  /** Jump to a view and pause the rotation (presenter mode). */
  function setView(v: PaymentView) {
    view.value = v
    playing.value = false
    clearTimer()
  }

  /** Stop or resume auto-rotation (resumes from the current view). */
  function togglePlay() {
    playing.value = !playing.value
    schedule()
  }

  onMounted(schedule)
  onUnmounted(clearTimer)

  return { view, playing, views: PAYMENT_VIEWS, setView, togglePlay }
}
