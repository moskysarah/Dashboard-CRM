/// <reference types="vite/client" />

declare module 'canvas-confetti';

interface ImportMetaEnv {
  readonly REACT_APP_GOOGLE_TRANSLATE_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
