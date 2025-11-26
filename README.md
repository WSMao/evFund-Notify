# 新月充電站募資進度網站

即時顯示充電樁集資進度的 Web 應用程式，資料來源為 Google Sheets。

## 功能特色

### 📊 即時資料顯示
- 募資進度條與百分比
- 目標金額、已募金額、差額統計
- 申請人數統計
- B1-B4 各樓層車位數統計
- 最新贊助者列表（含隱私保護）

### 🗺️ 規劃地圖
- 圖片輪播展示充電樁配置圖
- 支援左右切換瀏覽
- 自動顯示檔名作為說明

### ⏱️ 倒數計時
- 顯示募資剩餘天數
- 最後一天顯示小時和分鐘
- 自動計算至結束日當天 23:59:59

### 🔐 隱私保護
- 戶號簡化顯示（A249-11F → A-11F）
- 僅顯示車位樓層，不顯示完整車位號碼
- 只顯示已查核的申請者

### 📱 響應式設計
- 支援桌面、平板、手機瀏覽
- 手機版優化佈局

## 技術架構

- **框架**: React 18 + TypeScript
- **建置工具**: Vite 5
- **路由**: React Router DOM
- **資料來源**: Google Sheets API v4
- **部署平台**: Netlify
- **樣式**: CSS Modules

## 環境變數設定

在根目錄創建 `.env` 文件（參考 `.env.example`）：

```env
# Google Sheet 設定
VITE_GOOGLE_SHEET_ID="your-google-sheet-id"
VITE_GOOGLE_SHEET_RANGE="Fundraising!A9:I500"
VITE_GOOGLE_START_DATE_CELL="Fundraising!B6"
VITE_GOOGLE_END_DATE_CELL="Fundraising!C6"
VITE_GOOGLE_GOAL_CELL="Fundraising!D6"
VITE_GOOGLE_ACCUMULATED_CELL="Fundraising!E6"
VITE_GOOGLE_PLAN_QUOTA_CELL="Fundraising!F6"
VITE_GOOGLE_CURRENT_PEOPLE_CELL="Fundraising!G6"
VITE_GOOGLE_AVG_AMOUNT_CELL="Fundraising!H6"
VITE_GOOGLE_DIFFERENCE_CELL="Fundraising!I6"
VITE_GOOGLE_PARKING_STATS_RANGE="Fundraising!I1:I4"
VITE_GOOGLE_API_KEY="your-google-api-key"

# 前端輪詢間隔（毫秒）
VITE_POLL_INTERVAL_MS="5000"
```

## 本機開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 開啟瀏覽器
# http://localhost:5173
```

## 建置部署

```bash
# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

建置輸出位於 `dist/` 目錄。

## Netlify 部署設定

### Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### 環境變數
在 Netlify 專案設定中添加所有 `VITE_*` 環境變數（與 `.env` 相同）。

### 路由設定
Netlify 會自動處理 SPA 路由，如需手動設定可參考 `netlify.toml`。

## 規劃地圖設定

1. 將地圖圖片放在 `public/` 資料夾
2. 編輯 `src/pages/MapGallery.tsx` 更新圖片列表：

```typescript
const images = [
  '/B1.png',
  '/B2.png',
  '/B3.png',
  '/B4.png',
];
```

支援格式：JPG, PNG, WebP, SVG

## Google Sheets 結構

### 主要資料範圍 (A9:I500)
- A 欄：加入時間
- B 欄：申請人
- C 欄：戶號
- E 欄：已查核（TRUE/FALSE）
- F 欄：車位樓層（如：B3）
- G 欄：車位號碼
- I 欄：出資金額

### 統計儲存格
- B6：目前人數
- D6：目標金額
- F6：累積金額
- H6：差額
- I1:I4：B1-B4 車位數

### 日期儲存格
- C2：開始日期
- E2：結束日期

## 授權

MIT License

## 作者

新月天地充電樁社群
```



### LINE Bot
當 Google Sheet 內容更動後，自動透過 LINE Message API 發訊息到群組。

- 是不是可以使用 Netlify .function，然後可能設定一段時間去 trigger 一次這個 function，或者 Google Sheet 內容更動可以自己 trigger .function？
- 目前我們已經建立好 LINE 群組，不知道是否要把 LIEN bot 加入，感覺是要，這樣才有個身分可以發訊息。

> 建議後續以 Netlify Scheduled Functions 或 Google Apps Script webhook 監聽同一份 Sheet，再串接 LINE Messaging API，確保網頁與推播訊息同步。