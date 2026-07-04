import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/core/stores/app.store'
import type { ThemeMode } from '@/core/types/common'

/**
 * Drives dark/light for BOTH Tailwind (`.dark` class) and Element Plus
 * (`html.dark` css-vars). Call once at app root; use anywhere for toggling.
 */
export function useTheme() {
  const store = useAppStore()
  const { theme } = storeToRefs(store)

  const isDark = computed(() => theme.value === 'dark')

  function apply(mode: ThemeMode) {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    root.setAttribute('data-theme', mode)
  }

  function setTheme(mode: ThemeMode) {
    store.setTheme(mode)
  }

  function toggle() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  // Keep the DOM in sync with store changes (immediate = apply on mount).
  watch(theme, apply, { immediate: true })

  return { theme, isDark, setTheme, toggle }
}
