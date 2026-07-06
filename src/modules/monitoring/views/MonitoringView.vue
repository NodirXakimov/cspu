<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
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
  range,
  term,
  terms,
} = useMonitoring()

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
const dockOpen = ref(false)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (dockOpen.value) dockOpen.value = false
    else exit()
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="monitoring-page h-screen w-screen overflow-hidden p-3">
    <!-- Slide-in control dock (top-right) -->
    <div class="control-dock" :class="{ 'is-open': dockOpen }">
      <button
        class="dock-tab"
        :aria-label="dockOpen ? 'Hide' : 'Show'"
        @click="dockOpen = !dockOpen"
      >
        <el-icon :size="18">
          <ChevronRight v-if="dockOpen" />
          <ChevronLeft v-else />
        </el-icon>
      </button>

      <span class="flex items-center gap-2 pl-1 pr-1 text-xs font-medium text-[var(--el-text-color-secondary)]">
        <span class="live-dot" />
        {{ t('monitoring.updated') }} {{ updatedLabel }}
      </span>
      <span class="cluster-divider" />
      <LangSwitcher />
      <ThemeToggle />
      <el-tooltip :content="t('monitoring.exit')" placement="bottom">
        <el-button circle text @click="exit">
          <el-icon :size="18"><X /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <!-- 2×2 sections -->
    <div class="grid h-full w-full grid-cols-2 grid-rows-2 gap-3">
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

/* Slide-in control dock — anchored to the right edge, peeks a tab when closed */
.control-dock {
  position: fixed;
  top: 12px;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 4px;
  border-radius: 14px 0 0 14px;
  background: color-mix(in srgb, var(--el-bg-color) 82%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--el-border-color-light);
  border-right: none;
  box-shadow:
    0 10px 30px -12px rgba(0, 0, 0, 0.35),
    0 2px 6px -2px rgba(0, 0, 0, 0.15);
  transform: translateX(calc(100% - 40px));
  transition: transform 0.34s cubic-bezier(0.4, 0, 0.2, 1);
}
.control-dock.is-open {
  transform: translateX(0);
}
.dock-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 34px;
  flex-shrink: 0;
  border: none;
  border-radius: 9px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}
.dock-tab:hover {
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
