import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/core/stores/app.store'
import { ELEMENT_LOCALES } from '@/core/i18n'
import { LOCALE_OPTIONS } from '@/core/utils/constants'
import type { LocaleKey } from '@/core/types/common'
import type { Language } from 'element-plus/es/locale'

/**
 * Single source of truth for the active language. Swaps vue-i18n locale,
 * the Element Plus component locale, and the <html lang> attribute together.
 */
export function useLocale() {
  const store = useAppStore()
  const { locale } = storeToRefs(store)
  const { locale: i18nLocale } = useI18n({ useScope: 'global' })

  const options = LOCALE_OPTIONS
  const current = computed(() =>
    options.find((o) => o.key === locale.value),
  )

  /** Reactive Element Plus locale object for <el-config-provider :locale>. */
  const elementLocale = computed<Language>(
    () => ELEMENT_LOCALES[locale.value],
  )

  function setLocale(key: LocaleKey) {
    store.setLocale(key)
  }

  watch(
    locale,
    (key) => {
      i18nLocale.value = key
      document.documentElement.setAttribute('lang', key)
    },
    { immediate: true },
  )

  return { locale, options, current, elementLocale, setLocale }
}
