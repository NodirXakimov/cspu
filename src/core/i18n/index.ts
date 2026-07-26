import { createI18n } from 'vue-i18n'
import type { LocaleKey } from '@/core/types/common'
import { DEFAULT_LOCALE, STORAGE_KEYS } from '@/core/utils/constants'

// Element Plus bundled locales (component-level strings: pagination, datepicker…)
import elEn from 'element-plus/es/locale/lang/en'
import elRu from 'element-plus/es/locale/lang/ru'
import elUz from 'element-plus/es/locale/lang/uz-uz'
import type { Language } from 'element-plus/es/locale'

import en from './locales/en'
import ru from './locales/ru'
import uzLatn from './locales/uz-Latn'
import uzCyrl from './locales/uz-Cyrl'

type LocaleMessages = Record<string, unknown>
type MessageMap = Record<LocaleKey, LocaleMessages>

/**
 * Element Plus has no Cyrillic-Uzbek pack, so we clone the Uz (Latin) pack and
 * override the user-visible strings (pagination / table / select) into Cyrillic.
 */
const elUzCyrl: Language = {
  name: 'uz-cyrl',
  el: {
    ...elUz.el,
    pagination: {
      goto: 'Ўтиш',
      pagesize: 'та/саҳифа',
      total: 'Жами {total} та',
      pageClassifier: 'саҳифа',
      page: 'Саҳифа',
      prev: 'Олдинги саҳифа',
      next: 'Кейинги саҳифа',
      currentPage: '{pager}-саҳифа',
      prevPages: 'Олдинги {pager} саҳифа',
      nextPages: 'Кейинги {pager} саҳифа',
      deprecationWarning: '',
    },
    table: {
      ...elUz.el?.table,
      emptyText: 'Маълумот йўқ',
      confirmFilter: 'Тасдиқлаш',
      resetFilter: 'Тозалаш',
      clearFilter: 'Барчаси',
      sumText: 'Жами',
    },
    select: {
      ...elUz.el?.select,
      loading: 'Юкланмоқда',
      noMatch: 'Мос маълумот йўқ',
      noData: 'Маълумот йўқ',
      placeholder: 'Танланг',
    },
    datepicker: {
      ...elUz.el?.datepicker,
      now: 'Ҳозир',
      today: 'Бугун',
      cancel: 'Бекор қилиш',
      clear: 'Тозалаш',
      confirm: 'Тасдиқлаш',
      selectDate: 'Санани танланг',
      startDate: 'Бошланиш санаси',
      endDate: 'Тугаш санаси',
    },
  },
} as Language

/** Element Plus locale per app locale. */
export const ELEMENT_LOCALES: Record<LocaleKey, Language> = {
  en: elEn,
  ru: elRu,
  'uz-Latn': elUz,
  'uz-Cyrl': elUzCyrl,
}

function deepMerge(target: LocaleMessages, source: LocaleMessages): LocaleMessages {
  for (const key of Object.keys(source)) {
    const sv = source[key]
    if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
      target[key] = deepMerge(
        (target[key] as LocaleMessages) ?? {},
        sv as LocaleMessages,
      )
    } else {
      target[key] = sv
    }
  }
  return target
}

// Start with the global/shared messages…
const messages: MessageMap = {
  en: { ...en },
  ru: { ...ru },
  'uz-Latn': { ...uzLatn },
  'uz-Cyrl': { ...uzCyrl },
}

// …then auto-collect every module's `locales/index.ts` and merge it in.
// Each module file default-exports a partial MessageMap keyed by locale.
const moduleLocales = import.meta.glob<{ default: Partial<MessageMap> }>(
  '../../modules/*/locales/index.ts',
  { eager: true },
)

for (const mod of Object.values(moduleLocales)) {
  const map = mod.default
  for (const locale of Object.keys(messages) as LocaleKey[]) {
    if (map[locale]) {
      deepMerge(messages[locale], map[locale] as LocaleMessages)
    }
  }
}

function initialLocale(): LocaleKey {
  const stored = localStorage.getItem(STORAGE_KEYS.locale) as LocaleKey | null
  return stored && stored in messages ? stored : DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  // Messages are assembled dynamically (global + auto-collected modules); the
  // shape is correct at runtime but too dynamic for vue-i18n's strict typing.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: messages as any,
})
