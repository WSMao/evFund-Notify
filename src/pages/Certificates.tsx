import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useFundraisingData } from '../hooks/useFundraisingData';
import { FundraisingEntry } from '../types/fundraising';
import { Certificate } from '../components/Certificate';
import { Navbar } from '../components/Navbar';
import { formatCurrency } from '../utils/formatters';
import '../styles/certificates.css';

export const CertificatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useFundraisingData();
  const [previewEntry, setPreviewEntry] = useState<FundraisingEntry | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [hiddenEntry, setHiddenEntry] = useState<FundraisingEntry | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const hiddenCertificateRef = useRef<HTMLDivElement>(null);

  // 切換選取狀態
  const toggleSelection = (householdNumber: string, entry: FundraisingEntry) => {
    // 檢查是否符合人均金額標準
    if (data?.avgAmount && entry.amount < data.avgAmount) {
      return; // 不允許選取
    }
    
    setSelectedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(householdNumber)) {
        newSet.delete(householdNumber);
      } else {
        newSet.add(householdNumber);
      }
      return newSet;
    });
  };

  // 全部選取/取消全部選取
  const toggleSelectAll = () => {
    // 只選取符合人均金額標準的項目
    const eligibleEntries = data?.entries.filter(e => 
      data?.avgAmount ? e.amount >= data.avgAmount : true
    ) || [];
    
    if (selectedEntries.size === eligibleEntries.length && eligibleEntries.length > 0) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(eligibleEntries.map(e => e.householdNumber)));
    }
  };

  // 檢查是否符合發放標準
  const isEligibleForCertificate = (entry: FundraisingEntry): boolean => {
    if (!data?.avgAmount) return true; // 如果沒有人均金額資料，預設為符合
    return entry.amount >= data.avgAmount;
  };

  const generatePDF = async (entry: FundraisingEntry) => {
    setIsGenerating(entry.householdNumber);
    
    try {
      console.log('開始生成 PDF，entry:', entry);
      
      // 設置要在隱藏元素中渲染的 entry
      setHiddenEntry(entry);
      
      // 等待 React 渲染完成
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!hiddenCertificateRef.current) {
        throw new Error('找不到證書元素');
      }

      console.log('證書元素已找到，開始轉換為 canvas...');

      // 使用 html2canvas 將證書轉換為圖片
      const canvas = await html2canvas(hiddenCertificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      console.log('Canvas 生成成功，尺寸:', canvas.width, 'x', canvas.height);

      // 創建 PDF (橫向 A5 尺寸)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
      });

      const imgWidth = 210; // A5 橫向寬度 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // 下載 PDF
      const fileName = `充電權證_${entry.sponsor}_${entry.householdNumber}.pdf`;
      console.log('準備下載 PDF:', fileName);
      pdf.save(fileName);
      
      console.log('PDF 下載成功');
      
      // 清除隱藏的 entry
      setHiddenEntry(null);
    } catch (error) {
      console.error('生成 PDF 時發生錯誤：', error);
      alert(`生成 PDF 失敗：${error instanceof Error ? error.message : '未知錯誤'}\n\n請檢查瀏覽器控制台獲取更多信息。`);
    } finally {
      setIsGenerating(null);
    }
  };

  // 批次下載選取的證書（合併成一個 PDF）
  const generateBatchPDF = async () => {
    if (selectedEntries.size === 0) {
      alert('請至少選擇一個證書');
      return;
    }

    setIsBatchGenerating(true);

    try {
      console.log('開始批次生成 PDF，共', selectedEntries.size, '個證書');

      // 創建 PDF (橫向 A5 尺寸)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
      });

      const selectedEntriesList = data?.entries.filter(e => selectedEntries.has(e.householdNumber)) || [];
      
      for (let i = 0; i < selectedEntriesList.length; i++) {
        const entry = selectedEntriesList[i];
        console.log(`正在處理第 ${i + 1}/${selectedEntriesList.length} 個證書:`, entry.sponsor);

        // 設置要在隱藏元素中渲染的 entry
        setHiddenEntry(entry);

        // 等待 React 渲染完成
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!hiddenCertificateRef.current) {
          throw new Error('找不到證書元素');
        }

        // 使用 html2canvas 將證書轉換為圖片
        const canvas = await html2canvas(hiddenCertificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        const imgWidth = 210; // A5 橫向寬度 (mm)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/png');

        // 如果不是第一頁，添加新頁面
        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      // 下載 PDF
      const fileName = `充電權證_批次下載_${selectedEntriesList.length}份.pdf`;
      console.log('準備下載批次 PDF:', fileName);
      pdf.save(fileName);

      console.log('批次 PDF 下載成功');

      // 清除隱藏的 entry
      setHiddenEntry(null);
      
      // 清除選取狀態
      setSelectedEntries(new Set());
      
      alert(`成功下載 ${selectedEntriesList.length} 份證書！`);
    } catch (error) {
      console.error('生成批次 PDF 時發生錯誤：', error);
      alert(`生成批次 PDF 失敗：${error instanceof Error ? error.message : '未知錯誤'}\n\n請檢查瀏覽器控制台獲取更多信息。`);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const handlePreview = (entry: FundraisingEntry) => {
    setPreviewEntry(entry);
  };

  const closePreview = () => {
    setPreviewEntry(null);
  };

  if (error) {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="certificates-page">
          <div className="error-message">載入資料時發生錯誤：{error.message}</div>
        </div>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="certificates-page">
          <div className="loading-message">載入中，請稍候...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="certificates-page">
        <div className="certificates-header">
          <button className="btn-back" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回首頁
          </button>
          <h1>充電權證管理</h1>
          <div className="batch-actions">
            <button
              className="btn-select-all"
              onClick={toggleSelectAll}
            >
              {selectedEntries.size === data?.entries.length ? '✓ 取消全選' : '☐ 全部選取'}
            </button>
            <button
              className="btn-batch-download"
              onClick={generateBatchPDF}
              disabled={selectedEntries.size === 0 || isBatchGenerating}
            >
              {isBatchGenerating ? (
                <>⏳ 批次生成中... ({selectedEntries.size} 份)</>
              ) : (
                <>📥 合併下載 ({selectedEntries.size} 份)</>
              )}
            </button>
          </div>
        </div>

        <div className="contributors-list">
          {data?.entries.map((entry, index) => {
            const isEligible = isEligibleForCertificate(entry);
            
            return (
              <div 
                key={`${entry.householdNumber}-${index}`} 
                className={`contributor-item ${!isEligible ? 'contributor-item-disabled' : ''}`}
              >
                <div className="contributor-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedEntries.has(entry.householdNumber)}
                    onChange={() => toggleSelection(entry.householdNumber, entry)}
                    id={`checkbox-${entry.householdNumber}`}
                    disabled={!isEligible}
                  />
                  <label htmlFor={`checkbox-${entry.householdNumber}`}></label>
                </div>
              
                <div className="contributor-info">
                <div className="contributor-field">
                  <span className="contributor-label">住戶</span>
                  <span className="contributor-value">{entry.sponsor}</span>
                </div>
                
                <div className="contributor-field">
                  <span className="contributor-label">戶號</span>
                  <span className="contributor-value">{entry.householdNumber}</span>
                </div>
                
                <div className="contributor-field">
                  <span className="contributor-label">車位號</span>
                  <span className="contributor-value">
                    {entry.parkingFloor}-{entry.parkingNumber}
                  </span>
                </div>
                
                <div className="contributor-field">
                  <span className="contributor-label">出資金額</span>
                  <span className={`contributor-value amount ${!isEligible ? 'amount-insufficient' : ''}`}>
                    {formatCurrency(entry.amount)}
                    {!isEligible && data?.avgAmount && (
                      <span className="insufficient-notice">
                        （未達人均 {formatCurrency(data.avgAmount)}）
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="contributor-actions">
                <button
                  className="btn-preview"
                  onClick={() => handlePreview(entry)}
                  disabled={!isEligible}
                  title={!isEligible ? '出資金額未達人均標準，無法預覽' : ''}
                >
                  👁️ 預覽
                </button>
                <button
                  className="btn-download"
                  onClick={() => generatePDF(entry)}
                  disabled={isGenerating === entry.householdNumber || !isEligible}
                  title={!isEligible ? '出資金額未達人均標準，無法下載' : ''}
                >
                  {isGenerating === entry.householdNumber ? (
                    <>⏳ 生成中...</>
                  ) : (
                    <>📥 下載</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
        </div>

        {/* 預覽模態框 */}
        {previewEntry && (
          <div className="certificate-modal" onClick={closePreview}>
            <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="certificate-modal-close" onClick={closePreview}>
                ×
              </button>
              <Certificate entry={previewEntry} />
            </div>
          </div>
        )}

        {/* 隱藏的證書元素，用於生成 PDF */}
        {hiddenEntry && (
          <div className="hidden-certificate">
            <Certificate entry={hiddenEntry} certificateRef={hiddenCertificateRef} />
          </div>
        )}
      </div>
    </div>
  );
};
