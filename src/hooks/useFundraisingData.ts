import { useCallback, useEffect, useState } from 'react';
import { googleSheetConfig, POLLING_INTERVAL_MS } from '../config';
import type { FundraisingEntry, FundraisingSummary } from '../types/fundraising';

async function fetchGoogleSheet(): Promise<FundraisingSummary> {
  const { spreadsheetId, range, apiKey, goalCell, accumulatedCell, differenceCell, parkingStatsRange, startDateCell, endDateCell } = googleSheetConfig;

  if (!spreadsheetId || !apiKey) {
    throw new Error('Google Sheet 設定不完整，請確認環境變數。');
  }

  const encodedRanges = [range, goalCell, accumulatedCell, differenceCell, parkingStatsRange, startDateCell, endDateCell]
    .map((r) => `ranges=${encodeURIComponent(r)}`)
    .join('&');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${encodedRanges}&majorDimension=ROWS&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`無法讀取 Google Sheet：${response.statusText}`);
  }

  const json = await response.json();
  const [entriesRange, goalRange, accumulatedRange, differenceRange, parkingStatsRange_, startDateRange, endDateRange] = json.valueRanges;
  const rows: string[][] = entriesRange?.values ?? [];

  // 從 row 9 開始，欄位對應：A=加入時間, B=申請人, C=戶號, E=已查核, F=車位樓層, G=車位號碼, I=出資金額
  const entries: FundraisingEntry[] = rows
    .map((row) => {
      // 解析加入時間，格式如：2025/11/19 15：20
      const timeStr = row[0] ?? '';
      let timestamp = new Date();
      if (timeStr) {
        // 替換全形冒號為半形冒號
        const normalizedTime = timeStr.replace(/：/g, ':');
        const parsedDate = new Date(normalizedTime);
        if (!isNaN(parsedDate.getTime())) {
          timestamp = parsedDate;
        }
      }
      
      // 檢查是否已查核 (col E, index 4)
      const isVerified = row[4]?.toUpperCase() === 'TRUE';
      
      return {
        timestamp,
        sponsor: row[1] ?? '匿名',        // col B (index 1)
        householdNumber: row[2] ?? '',    // col C (index 2)
        isVerified,                        // col E (index 4)
        parkingFloor: row[5] ?? '',       // col F (index 5, 因為 A=0, B=1, C=2, D=3, E=4, F=5)
        parkingNumber: row[6] ?? '',      // col G (index 6)
        amount: Number(row[8] ?? 0),      // col I (index 8, 因為 A=0, B=1, ..., I=8)
        note: ''
      };
    })
    .filter((entry) => 
      !Number.isNaN(entry.amount) && 
      entry.amount > 0 && 
      entry.isVerified  // 只顯示已查核的申請人
    );

  const sortedEntries = [...entries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime() // 依加入時間排序（最新的在前）
  );

  const goal = goalRange?.values?.[0]?.[0] ? Number(goalRange.values[0][0]) : null;
  const accumulated = accumulatedRange?.values?.[0]?.[0] ? Number(accumulatedRange.values[0][0]) : null;
  const difference = differenceRange?.values?.[0]?.[0] ? Number(differenceRange.values[0][0]) : null;
  
  // 解析車位數資料 (I1:I4)，格式如 "2位"
  const parkingStatsValues = parkingStatsRange_?.values ?? [];
  const parseCount = (str: string) => {
    const match = str?.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  };
  const parkingStats = {
    b1: parseCount(parkingStatsValues[0]?.[0] ?? '0'),
    b2: parseCount(parkingStatsValues[1]?.[0] ?? '0'),
    b3: parseCount(parkingStatsValues[2]?.[0] ?? '0'),
    b4: parseCount(parkingStatsValues[3]?.[0] ?? '0')
  };
  
  // 解析開始和結束日期
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const normalizedDate = dateStr.replace(/：/g, ':');
    const parsedDate = new Date(normalizedDate);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };
  
  const startDate = parseDate(startDateRange?.values?.[0]?.[0] ?? '');
  const endDate = parseDate(endDateRange?.values?.[0]?.[0] ?? '');
  
  const lastUpdated = new Date();

  return { entries: sortedEntries, goal, accumulated, difference, parkingStats, startDate, endDate, lastUpdated };
}

export function useFundraisingData() {
  const [data, setData] = useState<FundraisingSummary | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGoogleSheet();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
    const interval = setInterval(() => {
      void refetch();
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
