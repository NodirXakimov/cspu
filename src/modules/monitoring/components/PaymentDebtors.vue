<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { UserRound } from 'lucide-vue-next'
import { useAppStore } from '@/core/stores/app.store'
import { formatSpaced } from '@/core/utils/format'
import { useMonitorScale } from '../composables/useMonitorScale'
import { M } from '../palette'
import type { DebtorStudent } from '../types/monitoring.types'

const props = defineProps<{ items: DebtorStudent[]; contract: number }>()
const { t } = useI18n()
const { theme } = storeToRefs(useAppStore())

// Avatar scales with the viewport: bigger on large screens, smaller on small.
const { scale } = useMonitorScale()
const iconSize = computed(() => Math.round(26 * scale.value))

// Dark blue name on light, soft blue on dark.
const nameColor = computed(() => (theme.value === 'dark' ? '#bfdbfe' : '#1e40af'))

/** Compact money: 8 400 000 → "8.4 mln". */
function money(v: number): string {
  if (v >= 1e9) return `${formatSpaced(v / 1e9, 1)} ${t('monitoring.bln')}`
  if (v >= 1e6) return `${formatSpaced(v / 1e6, 1)} ${t('monitoring.mln')}`
  return formatSpaced(v)
}

const debt = (s: DebtorStudent) => Math.round(props.contract * (1 - s.paidPct))
const paidPercent = (s: DebtorStudent) => Math.round(s.paidPct * 100)
</script>

<template>
  <div class="debtors-grid">
    <div
      v-for="(s, i) in items"
      :key="s.id"
      class="debtor"
      :style="{ animationDelay: `${i * 55}ms` }"
    >
      <div class="main">
        <span class="avatar">
          <el-icon :size="iconSize"><UserRound /></el-icon>
        </span>

        <span class="info">
          <span class="name" :style="{ color: nameColor }">{{ s.name }}</span>
          <span class="group">{{ s.group }}</span>
          <span class="bar">
            <span class="bar-fill" :style="{ width: `${paidPercent(s)}%` }" />
          </span>
        </span>
      </div>

      <div class="figures">
        <span class="debt">{{ money(debt(s)) }}</span>
        <span class="paid">{{ paidPercent(s) }}% {{ t('monitoring.paidShort') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debtors-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  gap: 9px 11px;
  min-height: 0;
  flex: 1;
}
@media (min-width: 640px) {
  .debtors-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.debtor {
  display: flex;
  align-items: stretch;
  min-width: 0;
  border-radius: 12px;
  overflow: hidden;
  background: var(--el-bg-color);
  /* Blue main border */
  border: 1.5px solid color-mix(in srgb, #3b82f6 55%, var(--el-border-color));
  box-shadow: 0 2px 8px -4px rgba(15, 23, 42, 0.18);
  animation: debtor-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

/* Left block: avatar + info (white) */
.main {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  flex: 1;
  padding: 8px 12px;
  background: var(--el-bg-color);
}

/* Square avatar — scales with viewport (bigger on large, smaller on small). */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(52px * var(--mscale, 1));
  height: calc(52px * var(--mscale, 1));
  flex-shrink: 0;
  align-self: center;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.35);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}
.name {
  font-size: calc(14px * var(--mscale, 1));
  font-weight: 700;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.group {
  font-size: calc(12px * var(--mscale, 1));
  line-height: 1.1;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bar {
  position: relative;
  display: block;
  width: 100%;
  height: 7px;
  margin-top: 4px;
  border-radius: 9999px;
  background: color-mix(in srgb, #64748b 15%, transparent);
  overflow: hidden;
}
.bar-fill {
  display: block;
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #059669, v-bind('M.emerald'));
  box-shadow: 0 0 8px -1px color-mix(in srgb, v-bind('M.emerald') 70%, transparent);
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Right block: separated debt panel with its own tint + border */
.figures {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  flex: 0 0 calc(120px * var(--mscale, 1));
  width: calc(120px * var(--mscale, 1));
  padding: 8px 12px;
  text-align: center;
  border-left: 1px solid color-mix(in srgb, #3b82f6 26%, var(--el-border-color));
  background: color-mix(in srgb, #3b82f6 15%, var(--el-bg-color));
}
.debt {
  font-size: calc(19px * var(--mscale, 1));
  font-weight: 800;
  line-height: 1.1;
  color: v-bind('M.rose');
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.paid {
  font-size: calc(13px * var(--mscale, 1));
  font-weight: 700;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

@keyframes debtor-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .debtor {
    animation: none;
  }
}
</style>
