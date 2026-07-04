<script setup lang="ts">
import { useTheme } from '@/core/composables/useTheme'
import { useLocale } from '@/core/composables/useLocale'

// Apply persisted theme + keep <html> class/lang in sync for the whole app.
useTheme()
const { elementLocale } = useLocale()
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <router-view />
  </el-config-provider>
</template>
