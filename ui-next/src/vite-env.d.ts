/// <reference types="vite/client" />

// Typed environment variables. Vite only exposes vars prefixed with VITE_.
interface ImportMetaEnv {
  /** Base URL of the application REST API, e.g. http://localhost:8081. */
  readonly VITE_API_BASE?: string;
  /** WebSocket URL of the health-check service, e.g. ws://localhost:8085. */
  readonly VITE_WS_BASE?: string;
  /** When "true", the UI uses src/data/mock.ts instead of the backend. */
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
