export interface FundraisingEntry {
  timestamp: Date;
  sponsor: string;
  householdNumber: string;   // 戶號，如 A249-11F
  isVerified: boolean;       // 是否已查核
  parkingFloor: string;      // 車位樓層，如 B3
  parkingNumber: string;     // 車位號碼，如 211
  fullParkingLocation: string; // 完整車位號碼，如 B3211 (from col D)
  amount: number;
  note?: string;
}

export interface FundraisingSummary {
  goal: number | null;
  accumulated: number | null;  // 累積金額
  difference: number | null;    // 目標差額
  avgAmount: number | null;     // 人均金額
  planQuota: number | null;     // 方案名額
  currentPeople: number | null; // 目前人數
  startDate: Date | null;       // 開始日期
  endDate: Date | null;         // 結束日期
  parkingStats: {               // B1~B4 車位統計
    b1: number;
    b2: number;
    b3: number;
    b4: number;
  };
  entries: FundraisingEntry[];
  lastUpdated: Date | null;
}
