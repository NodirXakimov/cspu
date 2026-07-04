import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Self-hosted Inter (covers Latin + Cyrillic → all four app languages)
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

// Element Plus dark-mode css variables (light vars ship with the components)
import 'element-plus/theme-chalk/dark/css-vars.css'

// Tailwind + app base styles
import '@/core/styles/index.css'

import App from './App.vue'
import { router } from '@/core/router'
import { i18n } from '@/core/i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
