<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Sun, MoonStar } from 'lucide-vue-next'
import { useTheme } from '@/core/composables/useTheme'

const { isDark, toggle } = useTheme()
const { t } = useI18n()

const label = computed(() =>
  isDark.value ? t('common.lightMode') : t('common.darkMode'),
)
</script>

<template>
  <el-tooltip :content="label" placement="bottom">
    <button class="theme-toggle" :aria-label="label" @click="toggle">
      <el-icon :size="18">
        <MoonStar v-if="!isDark" />
        <Sun v-else />
      </el-icon>
    </button>
  </el-tooltip>
</template>

<style scoped>
.theme-toggle {
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
    color 0.18s ease,
    transform 0.18s ease;
}
.theme-toggle:hover {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
  transform: translateY(-1px);
}
.theme-toggle:active {
  transform: translateY(0);
}
/* Bolder, rounded stroke for a semibold look */
.theme-toggle :deep(svg) {
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
