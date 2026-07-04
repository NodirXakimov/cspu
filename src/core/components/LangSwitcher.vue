<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { useLocale } from '@/core/composables/useLocale'
import type { LocaleKey } from '@/core/types/common'

const { options, current, setLocale } = useLocale()

function onSelect(key: string | number | object) {
  setLocale(key as LocaleKey)
}
</script>

<template>
  <el-dropdown trigger="click" @command="onSelect">
    <el-button text class="!px-2">
      <span class="mr-1">{{ current?.flag }}</span>
      <span class="hidden sm:inline">{{ current?.label }}</span>
      <el-icon class="ml-1"><ArrowDown /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="opt in options"
          :key="opt.key"
          :command="opt.key"
          :class="{ 'is-active-lang': opt.key === current?.key }"
        >
          <span class="mr-2">{{ opt.flag }}</span>{{ opt.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.is-active-lang {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
