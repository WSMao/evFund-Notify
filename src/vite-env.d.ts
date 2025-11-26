/// <reference types="vite/client" />

declare namespace ImportMeta {
  interface Env {
    readonly VITE_GOOGLE_SHEET_ID: string;
    readonly VITE_GOOGLE_SHEET_RANGE: string;
    readonly VITE_GOOGLE_API_KEY: string;
    readonly VITE_GOOGLE_START_DATE_CELL: string;
    readonly VITE_GOOGLE_END_DATE_CELL: string;
    readonly VITE_GOOGLE_GOAL_CELL: string;
    readonly VITE_GOOGLE_ACCUMULATED_CELL: string;
    readonly VITE_GOOGLE_PLAN_QUOTA_CELL: string;
    readonly VITE_GOOGLE_CURRENT_PEOPLE_CELL: string;
    readonly VITE_GOOGLE_AVG_AMOUNT_CELL: string;
    readonly VITE_GOOGLE_DIFFERENCE_CELL: string;
    readonly VITE_GOOGLE_PARKING_STATS_RANGE: string;
    readonly VITE_POLL_INTERVAL_MS: string;
  }

  interface ImportMeta {
    readonly env: Env;
  }
}
