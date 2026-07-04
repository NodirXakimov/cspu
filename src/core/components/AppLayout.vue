<script setup lang="ts">
import AppSidebar from '@/core/components/AppSidebar.vue'
import AppHeader from '@/core/components/AppHeader.vue'
</script>

<template>
  <el-container class="h-full" direction="vertical">
    <AppHeader />
    <el-container class="min-h-0 flex-1">
      <AppSidebar />
      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-main {
  background-color: var(--el-bg-color-page);
  padding: 20px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
