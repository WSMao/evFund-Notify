/// <reference types="vite/client" />

declare namespace ImportMeta {
  interface Env {
    readonly VITE_GOOGLE_SHEET_ID: string;
    readonly VITE_GOOGLE_SHEET_RANGE: string;
    readonly VITE_GOOGLE_API_KEY: string;
    readonly VITE_GOOGLE_GOAL_CELL: string;
    readonly VITE_POLL_INTERVAL_MS: string;
  }

  interface ImportMeta {
    readonly env: Env;
  }
}
