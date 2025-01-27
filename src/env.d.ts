/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEANCLOUD_APP_ID: string
  readonly VITE_LEANCLOUD_APP_KEY: string
  readonly VITE_LEANCLOUD_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 