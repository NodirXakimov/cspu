<script setup lang="ts">
import { ChevronDown, Globe } from 'lucide-vue-next'
import { useLocale } from '@/core/composables/useLocale'
import type { LocaleKey } from '@/core/types/common'

const { options, current, setLocale } = useLocale()

function onSelect(key: string | number | object) {
  setLocale(key as LocaleKey)
}
</script>

<template>
  <el-dropdown trigger="click" @command="onSelect">
    <button class="lang-trigger">
      <el-icon :size="16"><Globe /></el-icon>
      <span class="hidden font-medium sm:inline">{{ current?.label }}</span>
      <el-icon :size="14" class="chev"><ChevronDown /></el-icon>
    </button>
    <template #dropdown>
      <el-dropdown-menu class="lang-menu">
        <el-dropdown-item
          v-for="opt in options"
          :key="opt.key"
          :command="opt.key"
          :class="{ 'is-active-lang': opt.key === current?.key }"
        >
          <span class="mr-2 text-base">{{ opt.flag }}</span>
          <span>{{ opt.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.lang-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--el-text-color-primary);
  font-size: 13px;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}
.lang-trigger:hover {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}
.chev {
  opacity: 0.6;
}
.is-active-lang {
  color: var(--el-color-primary);
  font-weight: 600;
  background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
  border-radius: 6px;
}
</style>
