<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { InputInstance } from 'element-plus'
import { User, Lock, ShieldCheck, LogIn } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const { form, loading, error, submit } = useAuth()

const usernameRef = ref<InputInstance | null>(null)
const passwordRef = ref<InputInstance | null>(null)

onMounted(() => {
  // Remembered username → jump straight to the password field.
  ;(form.username ? passwordRef.value : usernameRef.value)?.focus()
})
</script>

<template>
  <form class="login-form" novalidate @submit.prevent="submit">
    <h1 class="title">{{ $t('auth.welcome') }}</h1>
    <p class="subtitle">{{ $t('auth.subtitle') }}</p>

    <transition name="err">
      <el-alert
        v-if="error"
        class="mb-4"
        type="error"
        :title="error"
        :closable="false"
        show-icon
      />
    </transition>

    <label class="field-label" for="login-username">{{ $t('auth.username') }}</label>
    <el-input
      id="login-username"
      ref="usernameRef"
      v-model="form.username"
      size="large"
      autocomplete="username"
      :placeholder="$t('auth.usernamePlaceholder')"
      :disabled="loading"
    >
      <template #prefix><el-icon :size="17"><User /></el-icon></template>
    </el-input>

    <label class="field-label mt-4" for="login-password">{{ $t('auth.password') }}</label>
    <el-input
      id="login-password"
      ref="passwordRef"
      v-model="form.password"
      type="password"
      size="large"
      show-password
      autocomplete="current-password"
      :placeholder="$t('auth.passwordPlaceholder')"
      :disabled="loading"
      @keyup.enter="submit"
    >
      <template #prefix><el-icon :size="17"><Lock /></el-icon></template>
    </el-input>

    <div class="row-between">
      <el-checkbox v-model="form.remember" :disabled="loading">
        {{ $t('auth.remember') }}
      </el-checkbox>
    </div>

    <button type="submit" class="submit" :disabled="loading">
      <span v-if="loading" class="spinner" aria-hidden="true" />
      <el-icon v-else :size="17"><LogIn /></el-icon>
      {{ loading ? $t('auth.signingIn') : $t('auth.signIn') }}
    </button>

    <p class="secure-note">
      <el-icon :size="14"><ShieldCheck /></el-icon>
      {{ $t('auth.secureNote') }}
    </p>
  </form>
</template>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
}

.title {
  margin: 0 0 6px;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--el-text-color-primary);
}
.subtitle {
  margin: 0 0 26px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--el-text-color-secondary);
}

.field-label {
  display: block;
  margin-bottom: 7px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-regular);
}

.login-form :deep(.el-input__wrapper) {
  padding: 4px 12px;
  border-radius: 11px;
}
.login-form :deep(.el-input--large .el-input__inner) {
  height: 42px;
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 22px;
}

.submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #1d4ed8, #2563eb 55%, #3b82f6);
  box-shadow: 0 10px 24px -12px rgba(37, 99, 235, 0.95);
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}
.submit:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.06);
  box-shadow: 0 14px 28px -12px rgba(37, 99, 235, 1);
}
.submit:active:not(:disabled) {
  transform: translateY(0);
}
.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.secure-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 22px 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.err-enter-active,
.err-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.err-enter-from,
.err-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .spinner { animation-duration: 1.6s; }
  .submit:hover:not(:disabled) { transform: none; }
}
</style>
