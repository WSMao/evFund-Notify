# PDF 生成故障排除指南

## 問題診斷步驟

### 1. 檢查瀏覽器控制台
打開瀏覽器開發者工具（F12），查看 Console 標籤中的錯誤訊息。

當你點擊「下載 PDF」按鈕時，應該會看到以下日誌：
- `開始生成 PDF，entry: {...}`
- `證書元素已找到，開始轉換為 canvas...`
- `Canvas 生成成功，尺寸: XXX x XXX`
- `準備下載 PDF: 區權證書_XXX_XXX.pdf`
- `PDF 下載成功`

如果在某個步驟失敗，錯誤訊息會顯示在控制台。

### 2. 常見錯誤及解決方法

#### 錯誤：找不到證書元素
**原因**：React 組件還沒有渲染完成
**解決**：代碼中已經增加了 500ms 的等待時間，通常足夠

#### 錯誤：html2canvas 失敗
**原因**：可能是 CSS 樣式問題或跨域資源問題
**解決**：
1. 確保所有 CSS 檔案都已正確載入
2. 檢查是否有外部圖片資源（目前沒有使用外部圖片）
3. 查看控制台是否有 CSS 錯誤

#### 錯誤：PDF 無法下載
**原因**：瀏覽器阻止了檔案下載
**解決**：
1. 檢查瀏覽器的下載設置
2. 允許此網站的彈出視窗和下載
3. 檢查是否有廣告攔截器干擾

### 3. 測試步驟

1. **基本測試**
   - 訪問 `/certificates` 頁面
   - 確認可以看到集資人列表
   - 點擊「預覽」按鈕，確認證書顯示正常

2. **PDF 生成測試**
   - 點擊「下載 PDF」按鈕
   - 按鈕應該變為「⏳ 生成中...」
   - 等待約 1-2 秒
   - PDF 應該自動開始下載

3. **檢查下載的 PDF**
   - 打開下載的 PDF 檔案
   - 檢查內容是否完整
   - 檢查格式是否正確

### 4. 瀏覽器兼容性

| 瀏覽器 | 版本 | 支援狀態 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支援 |
| Firefox | 88+ | ✅ 完全支援 |
| Safari | 14+ | ✅ 完全支援 |
| Edge | 90+ | ✅ 完全支援 |

### 5. 手動調試

如果自動生成失敗，你可以手動測試：

1. 打開瀏覽器控制台
2. 執行以下命令來測試 html2canvas：

\`\`\`javascript
import('html2canvas').then(({ default: html2canvas }) => {
  const element = document.querySelector('.certificate-container');
  if (element) {
    html2canvas(element).then(canvas => {
      console.log('Canvas 生成成功！', canvas);
      // 在新視窗中顯示 canvas
      const img = canvas.toDataURL('image/png');
      const win = window.open();
      win.document.write('<img src="' + img + '"/>');
    }).catch(err => {
      console.error('html2canvas 失敗：', err);
    });
  } else {
    console.error('找不到證書元素');
  }
});
\`\`\`

### 6. 替代方案

如果 PDF 生成持續失敗，可以考慮：

1. **直接下載圖片**
   修改代碼，直接下載 PNG 圖片而不是 PDF：
   \`\`\`javascript
   const link = document.createElement('a');
   link.download = \`區權證書_\${entry.sponsor}.png\`;
   link.href = canvas.toDataURL();
   link.click();
   \`\`\`

2. **使用瀏覽器打印功能**
   添加一個「列印」按鈕，讓用戶使用瀏覽器的打印功能儲存為 PDF

3. **後端生成**
   在伺服器端生成 PDF（需要額外的後端設置）

### 7. 聯絡資訊

如果問題持續存在，請提供：
- 瀏覽器名稱和版本
- 控制台的完整錯誤訊息
- 截圖（如果可能）

## 成功案例

如果 PDF 生成成功，你應該會看到：
1. 按鈕顯示「⏳ 生成中...」約 1-2 秒
2. 瀏覽器的下載提示出現
3. PDF 檔案自動下載到下載資料夾
4. PDF 檔名格式為：`區權證書_住戶名_戶號.pdf`
5. 打開 PDF 可以看到完整的證書內容

## 程式碼改進建議

如果需要進一步改進，可以考慮：
- 添加進度條顯示生成進度
- 批量下載多個證書
- 自訂證書模板
- 添加浮水印
- 支援多種輸出格式
