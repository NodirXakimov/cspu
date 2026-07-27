/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** Dev-only proxy target (see vite.config.ts); never read by app code. */
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_USE_MOCK: string
  /** Temporary offline sign-in while the backend is unreachable. */
  readonly VITE_USE_MOCK_AUTH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
