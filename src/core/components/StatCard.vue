<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string | number
  icon?: Component
  trend?: number // percentage, +/-
  accent?: string // css color
}>()
</script>

<template>
  <el-card shadow="hover" class="stat-card" body-class="!p-4">
    <div class="flex items-center gap-4">
      <div
        v-if="icon"
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
        :style="{ backgroundColor: accent ?? 'var(--el-color-primary)' }"
      >
        <el-icon :size="24"><component :is="icon" /></el-icon>
      </div>
      <div class="min-w-0">
        <p class="m-0 text-sm text-[var(--el-text-color-secondary)] truncate">
          {{ label }}
        </p>
        <p class="m-0 text-2xl font-semibold leading-tight">{{ value }}</p>
        <p
          v-if="trend !== undefined"
          class="m-0 text-xs"
          :class="trend >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          {{ trend >= 0 ? '▲' : '▼' }} {{ Math.abs(trend) }}%
        </p>
      </div>
    </div>
  </el-card>
</template>
