<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useTheme } from '@/core/composables/useTheme'

const { isDark, toggle } = useTheme()
const { t } = useI18n()

const label = computed(() =>
  isDark.value ? t('common.lightMode') : t('common.darkMode'),
)
</script>

<template>
  <el-tooltip :content="label" placement="bottom">
    <el-button circle text @click="toggle">
      <el-icon :size="18">
        <Moon v-if="!isDark" />
        <Sunny v-else />
      </el-icon>
    </el-button>
  </el-tooltip>
</template>
