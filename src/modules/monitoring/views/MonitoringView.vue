<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  Building2,
  Maximize,
  Minimize,
  LogIn,
  LayoutDashboard,
} from 'lucide-vue-next'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LangSwitcher from '@/core/components/LangSwitcher.vue'
import { useAppStore } from '@/core/stores/app.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useMonitoring } from '../composables/useMonitoring'
import { useMonitorScale } from '../composables/useMonitorScale'
import TeacherDisciplineSection from '../components/TeacherDisciplineSection.vue'
import AttendanceSection from '../components/AttendanceSection.vue'
import PaymentSection from '../components/PaymentSection.vue'
import PerformanceSection from '../components/PerformanceSection.vue'

const router = useRouter()
const { t, te } = useI18n()
const { locale } = storeToRefs(useAppStore())
// Hydrated from localStorage when the store is created — no request needed here.
const { isAuthenticated } = storeToRefs(useAuthStore())

// Viewport-relative interior scale, published as --mscale for all descendants.
const { scale } = useMonitorScale()
const hs = (n: number) => Math.round(n * scale.value)

const {
  teacher,
  attendance,
  payments,
  debtors,
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
    if (!o.value) return { ...o }
    const key = `faculties.names.${o.value}`
    return { ...o, label: te(key) ? t(key) : o.label }
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

/** Enter the admin area — signing in first when there is no session. */
function enter() {
  if (isAuthenticated.value) router.push('/dashboard')
  else router.push({ name: 'login', query: { redirect: '/dashboard' } })
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

// No Escape-to-exit: this is the landing screen, and a stray keypress on a wall
// display must not kick it to a login prompt. Escape still leaves fullscreen.
onMounted(() => {
  document.addEventListener('fullscreenchange', onFsChange)
})
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFsChange)
})
</script>

<template>
  <div
    class="monitoring-page flex min-h-[100dvh] w-full flex-col gap-3 overflow-y-auto p-2 sm:p-3 [@media(min-width:1024px)_and_(min-height:800px)]:h-screen [@media(min-width:1024px)_and_(min-height:800px)]:overflow-hidden"
    :style="{ '--mscale': scale }"
  >
    <!-- Top control row (above all cards) -->
    <header class="flex shrink-0 flex-wrap items-center justify-between gap-2 sm:gap-3">
      <!-- Global faculty filter (applies to all four cards) -->
      <div class="ctrl-pill faculty-filter w-full sm:w-auto">
        <el-select
          v-model="faculty"
          size="large"
          class="faculty-filter__select"
        >
          <template #prefix>
            <el-icon :size="hs(18)" class="faculty-filter__icon"><Building2 /></el-icon>
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
      <div class="ctrl-pill control-bar ml-auto">
        <span class="updated-text hidden items-center gap-2 pl-1 pr-1 font-medium text-[var(--el-text-color-secondary)] sm:flex">
          <span class="live-dot" />
          {{ t('monitoring.updated') }} {{ updatedLabel }}
        </span>
        <span class="live-dot ml-1 sm:hidden" />
        <span class="cluster-divider" />
        <LangSwitcher />
        <ThemeToggle />
        <el-tooltip :content="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'" placement="bottom">
          <button class="ctrl-btn" @click="toggleFullscreen">
            <el-icon :size="hs(18)">
              <Minimize v-if="isFullscreen" />
              <Maximize v-else />
            </el-icon>
          </button>
        </el-tooltip>
        <!-- Kiosk mode: no way into the admin area from a wall display -->
        <template v-if="!isFullscreen">
          <span class="cluster-divider" />
          <button class="enter-btn" @click="enter">
            <el-icon :size="hs(17)">
              <LayoutDashboard v-if="isAuthenticated" />
              <LogIn v-else />
            </el-icon>
            {{ isAuthenticated ? t('nav.dashboard') : t('auth.signIn') }}
          </button>
        </template>
      </div>
    </header>

    <!-- Responsive: 1-col phone · 2-col tablet+ (scroll, fixed-height tiles) ·
         fit 2×2 only when the screen is both wide AND tall enough (TV/desktop) -->
    <div class="grid min-h-0 w-full flex-1 grid-cols-1 auto-rows-[minmax(360px,1fr)] gap-3 md:grid-cols-2 [@media(min-width:1024px)_and_(min-height:800px)]:auto-rows-auto [@media(min-width:1024px)_and_(min-height:800px)]:grid-rows-2">
      <PaymentSection :data="payments" :debtors="debtors" />
      <AttendanceSection :data="attendance" v-model:range="range" />
      <TeacherDisciplineSection :data="teacher" />
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
  height: calc(44px * var(--mscale, 1));
  border-radius: 12px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 2px 6px -3px rgba(0, 0, 0, 0.2);
}
.updated-text {
  font-size: calc(12px * var(--mscale, 1));
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
  width: 100%;
  font-size: calc(14px * var(--mscale, 1));
}
@media (min-width: 640px) {
  .faculty-filter__select {
    width: calc(220px * var(--mscale, 1));
  }
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
  width: calc(34px * var(--mscale, 1));
  height: calc(34px * var(--mscale, 1));
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
  height: calc(20px * var(--mscale, 1));
  background: var(--el-border-color);
}

/* Primary entry point into the admin area (mirrors the login submit button) */
.enter-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: calc(34px * var(--mscale, 1));
  padding: 0 calc(14px * var(--mscale, 1));
  border: none;
  border-radius: 10px;
  font-size: calc(13px * var(--mscale, 1));
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #1d4ed8, #2563eb 55%, #3b82f6);
  box-shadow: 0 8px 18px -10px rgba(37, 99, 235, 0.95);
  transition:
    transform 0.15s ease,
    filter 0.2s ease,
    box-shadow 0.2s ease;
}
.enter-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
  box-shadow: 0 12px 22px -10px rgba(37, 99, 235, 1);
}
.enter-btn:active {
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .enter-btn:hover {
    transform: none;
  }
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
