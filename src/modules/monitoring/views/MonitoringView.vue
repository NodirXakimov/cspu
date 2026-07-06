<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { X, Building2, Maximize, Minimize } from 'lucide-vue-next'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LangSwitcher from '@/core/components/LangSwitcher.vue'
import { useAppStore } from '@/core/stores/app.store'
import { useMonitoring } from '../composables/useMonitoring'
import TeacherDisciplineSection from '../components/TeacherDisciplineSection.vue'
import AttendanceSection from '../components/AttendanceSection.vue'
import PaymentSection from '../components/PaymentSection.vue'
import PerformanceSection from '../components/PerformanceSection.vue'

const router = useRouter()
const { t } = useI18n()
const { locale } = storeToRefs(useAppStore())

const {
  teacher,
  attendance,
  payments,
  performance,
  lastUpdated,
  faculty,
  facultyOptions,
  range,
  term,
  terms,
} = useMonitoring()

// Translate each option: 'all' + per-faculty names (fallback to the raw name).
const facultySelectOptions = computed(() =>
  facultyOptions.value.map((o) => {
    if (o.value === 'all') return { ...o, label: t('monitoring.allFaculties') }
    const key = `faculties.names.${o.value}`
    const translated = t(key)
    return { ...o, label: translated === key ? o.label : translated }
  }),
)

const INTL: Record<string, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  'uz-Latn': 'uz-Latn-UZ',
  'uz-Cyrl': 'uz-Cyrl-UZ',
}
const updatedLabel = computed(() =>
  lastUpdated.value
    ? lastUpdated.value.toLocaleTimeString(INTL[locale.value] ?? 'en-US')
    : '—',
)

function exit() {
  router.push('/dashboard')
}

// Fullscreen
const isFullscreen = ref(false)
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
  else document.exitFullscreen?.()
}
function onFsChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && !document.fullscreenElement) exit()
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.addEventListener('fullscreenchange', onFsChange)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('fullscreenchange', onFsChange)
})
</script>

<template>
  <div class="monitoring-page flex h-screen w-screen flex-col gap-3 overflow-hidden p-3">
    <!-- Top control row (above all cards) -->
    <header class="flex shrink-0 items-center justify-between gap-3">
      <!-- Global faculty filter (applies to all four cards) -->
      <div class="ctrl-pill faculty-filter">
        <el-select
          v-model="faculty"
          size="large"
          class="faculty-filter__select"
        >
          <template #prefix>
            <el-icon :size="18" class="faculty-filter__icon"><Building2 /></el-icon>
          </template>
          <el-option
            v-for="opt in facultySelectOptions"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
          />
        </el-select>
      </div>

      <!-- Controls -->
      <div class="ctrl-pill control-bar">
        <span class="flex items-center gap-2 pl-1 pr-1 text-xs font-medium text-[var(--el-text-color-secondary)]">
          <span class="live-dot" />
          {{ t('monitoring.updated') }} {{ updatedLabel }}
        </span>
        <span class="cluster-divider" />
        <LangSwitcher />
        <ThemeToggle />
        <el-tooltip :content="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'" placement="bottom">
          <button class="ctrl-btn" @click="toggleFullscreen">
            <el-icon :size="18">
              <Minimize v-if="isFullscreen" />
              <Maximize v-else />
            </el-icon>
          </button>
        </el-tooltip>
        <el-tooltip :content="t('monitoring.exit')" placement="bottom">
          <button class="ctrl-btn" @click="exit">
            <el-icon :size="18"><X /></el-icon>
          </button>
        </el-tooltip>
      </div>
    </header>

    <!-- 2×2 sections -->
    <div class="grid min-h-0 w-full flex-1 grid-cols-2 grid-rows-2 gap-3">
      <TeacherDisciplineSection :data="teacher" />
      <AttendanceSection :data="attendance" v-model:range="range" />
      <PaymentSection :data="payments" />
      <PerformanceSection :data="performance" v-model:term="term" :terms="terms" />
    </div>
  </div>
</template>

<style scoped>
.monitoring-page {
  background-color: var(--el-bg-color-page);
}

/* Shared pill container for the top-row controls */
.ctrl-pill {
  display: flex;
  align-items: center;
  height: 44px;
  border-radius: 12px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 2px 6px -3px rgba(0, 0, 0, 0.2);
}

.faculty-filter {
  padding: 0;
  overflow: hidden;
}
.faculty-filter__icon {
  color: var(--el-color-primary);
  flex-shrink: 0;
}
.faculty-filter__select {
  width: 220px;
}
/* Strip the inner select's own box; inner padding lives here so the popper
   still aligns to the pill's left edge (wrapper box = pill box). */
.faculty-filter__select :deep(.el-select__wrapper) {
  background: transparent;
  box-shadow: none !important;
  border: none;
  padding: 0 12px;
  min-height: 42px;
  font-weight: 600;
}
/* Space between the building icon and the selected text */
.faculty-filter__select :deep(.el-select__prefix) {
  margin-right: 10px;
}

.control-bar {
  gap: 6px;
  padding: 0 8px;
}
.ctrl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}
.ctrl-btn:hover {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}
.cluster-divider {
  width: 1px;
  height: 20px;
  background: var(--el-border-color);
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #22c55e;
  box-shadow: 0 0 0 3px color-mix(in srgb, #22c55e 22%, transparent);
  animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
