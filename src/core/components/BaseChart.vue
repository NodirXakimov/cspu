<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import '@/core/components/echarts'
import { useTheme } from '@/core/composables/useTheme'

const props = withDefaults(
  defineProps<{
    option: EChartsOption
    height?: string
    loading?: boolean
  }>(),
  { height: '320px', loading: false },
)

const { isDark } = useTheme()

// echarts 'dark' theme paints its own bg; force transparent so the EP card shows.
const mergedOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Inter, system-ui, sans-serif' },
  ...props.option,
}))

const theme = computed(() => (isDark.value ? 'dark' : undefined))
</script>

<template>
  <VChart
    class="w-full"
    :style="{ height }"
    :option="mergedOption"
    :theme="theme"
    :loading="loading"
    autoresize
  />
</template>
