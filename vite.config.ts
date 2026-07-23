import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  // Dev proxy: the app calls a RELATIVE base URL (e.g. `/api/v1`), Vite forwards
  // it to the backend. Same-origin from the browser's point of view → no CORS
  // and no preflight for our custom ngrok header.
  const apiBase = env.VITE_API_BASE_URL || '/api/v1'
  const proxyTarget = env.VITE_API_PROXY_TARGET
  const useProxy = apiBase.startsWith('/') && Boolean(proxyTarget)

  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: { enabled: false },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/components.d.ts',
        dirs: [], // module components are imported explicitly, keep auto-import for EP only
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      open: true,
      proxy: useProxy
        ? {
            [apiBase]: {
              target: proxyTarget,
              changeOrigin: true,
              secure: false, // ngrok/self-signed certs
              headers: {
                // ngrok's free tier serves an HTML interstitial without this
                'ngrok-skip-browser-warning': 'true',
              },
            },
          }
        : undefined,
    },
  }
})
