<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LangSwitcher from '@/core/components/LangSwitcher.vue'
import LoginForm from '../components/LoginForm.vue'
import AuthShowcase from '../components/AuthShowcase.vue'
</script>

<template>
  <div class="login-page">
    <!-- Left half: form -->
    <section class="pane-form">
      <header class="pane-top">
        <div class="top-left">
          <!-- Brand only where the showcase (which carries it) is hidden -->
          <span class="brand-logo">U</span>
          <router-link to="/monitoring" class="back-link">
            <el-icon :size="15"><ArrowLeft /></el-icon>
            {{ $t('auth.backToMonitoring') }}
          </router-link>
        </div>
        <div class="controls">
          <LangSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <div class="form-wrap">
        <LoginForm />
      </div>

      <footer class="pane-foot">
        © {{ new Date().getFullYear() }} {{ $t('app.title') }}
      </footer>
    </section>

    <!-- Right half: illustration (desktop only) -->
    <AuthShowcase class="pane-art" />
  </div>
</template>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--el-bg-color);
}
@media (min-width: 1024px) {
  .login-page {
    grid-template-columns: 1fr 1fr;
  }
}

/* --- form pane ------------------------------------------------------ */
.pane-form {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 22px 24px;
  overflow: hidden;
}
/* Soft brand glow behind the form (subtle, keeps the pane from feeling flat) */
.pane-form::before {
  content: '';
  position: absolute;
  top: -180px;
  left: -140px;
  width: 420px;
  height: 420px;
  border-radius: 9999px;
  background: var(--el-color-primary);
  opacity: 0.07;
  filter: blur(90px);
  pointer-events: none;
}

.pane-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.top-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  color: var(--el-text-color-secondary);
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}
.back-link:hover {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}
/* Same gradient mark as AppHeader */
.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 11px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #3b82f6 55%, #60a5fa);
  box-shadow: 0 4px 12px -3px color-mix(in srgb, #2563eb 55%, transparent);
}
.controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-wrap {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
}

.pane-foot {
  position: relative;
  text-align: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* --- art pane ------------------------------------------------------- */
.pane-art {
  display: none;
}
@media (min-width: 1024px) {
  .pane-art {
    display: block;
  }
  .top-left .brand-logo {
    /* the showcase already carries the brand on desktop */
    display: none;
  }
  .pane-form {
    padding: 26px 40px;
  }
}
</style>
