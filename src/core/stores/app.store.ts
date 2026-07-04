import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LocaleKey, ThemeMode } from '@/core/types/common'
import { DEFAULT_LOCALE, STORAGE_KEYS } from '@/core/utils/constants'

function storedTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) as ThemeMode | null
  if (saved === 'light' || saved === 'dark') return saved
  // Fall back to OS preference on first visit.
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function storedLocale(): LocaleKey {
  return (
    (localStorage.getItem(STORAGE_KEYS.locale) as LocaleKey | null) ??
    DEFAULT_LOCALE
  )
}

export const useAppStore = defineStore('app', () => {
  const theme = ref<ThemeMode>(storedTheme())
  const locale = ref<LocaleKey>(storedLocale())
  const sidebarCollapsed = ref<boolean>(
    localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true',
  )

  function setTheme(mode: ThemeMode) {
    theme.value = mode
    localStorage.setItem(STORAGE_KEYS.theme, mode)
  }

  function setLocale(key: LocaleKey) {
    locale.value = key
    localStorage.setItem(STORAGE_KEYS.locale, key)
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem(
      STORAGE_KEYS.sidebarCollapsed,
      String(sidebarCollapsed.value),
    )
  }

  return {
    theme,
    locale,
    sidebarCollapsed,
    setTheme,
    setLocale,
    toggleSidebar,
  }
})
