export const googleSheetConfig = {
  spreadsheetId: import.meta.env.VITE_GOOGLE_SHEET_ID ?? '',
  range: import.meta.env.VITE_GOOGLE_SHEET_RANGE ?? 'Fundraising!A9:I500',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY ?? '',
  startDateCell: import.meta.env.VITE_GOOGLE_START_DATE_CELL ?? 'Fundraising!B6',
  endDateCell: import.meta.env.VITE_GOOGLE_END_DATE_CELL ?? 'Fundraising!C6',
  goalCell: import.meta.env.VITE_GOOGLE_GOAL_CELL ?? 'Fundraising!D6',
  accumulatedCell: import.meta.env.VITE_GOOGLE_ACCUMULATED_CELL ?? 'Fundraising!E6',
  planQuotaCell: import.meta.env.VITE_GOOGLE_PLAN_QUOTA_CELL ?? 'Fundraising!F6',
  currentPeopleCell: import.meta.env.VITE_GOOGLE_CURRENT_PEOPLE_CELL ?? 'Fundraising!G6',
  avgAmountCell: import.meta.env.VITE_GOOGLE_AVG_AMOUNT_CELL ?? 'Fundraising!H6',
  differenceCell: import.meta.env.VITE_GOOGLE_DIFFERENCE_CELL ?? 'Fundraising!I6',
  parkingStatsRange: import.meta.env.VITE_GOOGLE_PARKING_STATS_RANGE ?? 'Fundraising!I1:I4'
};

export const POLLING_INTERVAL_MS = Number(import.meta.env.VITE_POLL_INTERVAL_MS ?? 60_000);
