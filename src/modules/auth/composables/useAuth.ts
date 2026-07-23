import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ApiError } from '@/core/api/client'
import { useAuthStore } from '../stores/auth.store'

const REMEMBER_KEY = 'ums.remember_username'

/** Login form state + submit, shared by LoginForm/LoginView. */
export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()

  const remembered = localStorage.getItem(REMEMBER_KEY)

  const form = reactive({
    username: remembered ?? '',
    password: '',
    remember: Boolean(remembered),
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  function messageFor(err: unknown): string {
    if (err instanceof ApiError) {
      if (err.status === 401 || err.status === 400) return t('auth.errors.invalid')
      if (err.status === null) return t('auth.errors.network')
      if (err.status >= 500) return t('auth.errors.server')
      return err.message
    }
    return t('auth.errors.network')
  }

  async function submit() {
    if (loading.value) return
    if (!form.username.trim() || !form.password) {
      error.value = t('auth.errors.required')
      return
    }

    loading.value = true
    error.value = null
    try {
      await store.login({
        username: form.username.trim(),
        password: form.password,
      })

      if (form.remember) localStorage.setItem(REMEMBER_KEY, form.username.trim())
      else localStorage.removeItem(REMEMBER_KEY)

      const redirect = route.query.redirect
      await router.replace(
        typeof redirect === 'string' && redirect.startsWith('/')
          ? redirect
          : '/dashboard',
      )
    } catch (err) {
      store.clear()
      form.password = ''
      error.value = messageFor(err)
    } finally {
      loading.value = false
    }
  }

  return { form, loading, error, submit }
}
