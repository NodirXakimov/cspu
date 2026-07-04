<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { X } from 'lucide-vue-next'
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
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') exit()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="monitoring-page h-screen w-screen overflow-hidden p-4">
    <!-- Floating control cluster -->
    <div
      class="fixed right-4 top-4 z-50 flex items-center gap-1 rounded-full border border-[var(--el-border-color-light)] bg-[var(--el-bg-color)] px-2 py-1 shadow-lg"
    >
      <span class="px-2 text-xs text-[var(--el-text-color-secondary)]">
        {{ t('monitoring.updated') }} {{ updatedLabel }}
      </span>
      <LangSwitcher />
      <ThemeToggle />
      <el-tooltip :content="t('monitoring.exit')" placement="bottom">
        <el-button circle text @click="exit">
          <el-icon :size="18"><X /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <!-- 2×2 sections -->
    <div class="grid h-full w-full grid-cols-2 grid-rows-2 gap-4">
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
</style>
