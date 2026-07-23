/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** Dev-only proxy target (see vite.config.ts); never read by app code. */
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
