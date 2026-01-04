import React from 'react';
import { FundraisingEntry } from '../types/fundraising';
import { formatCurrency } from '../utils/formatters';
import '../styles/certificate.css';

interface CertificateProps {
  entry: FundraisingEntry;
  certificateRef?: React.RefObject<HTMLDivElement>;
}

export const Certificate: React.FC<CertificateProps> = ({ entry, certificateRef }) => {
  const joinDate = entry.timestamp.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 使用完整的車位號碼
  const parkingLocation = entry.fullParkingLocation || `${entry.parkingFloor}-${entry.parkingNumber}`;

  return (
    <div className="certificate-container" ref={certificateRef}>
      {/* 裝飾性角落 */}
      <div className="certificate-corner"></div>

      {/* 標題 */}
      <div className="certificate-title-wrapper">
        <div className="certificate-title">充電權證</div>
      </div>
      <div className="certificate-subtitle">EV CHARGING RIGHT CERTIFICATE</div>
      <div className="certificate-description">特發此狀以資證明享有安裝充電樁及使用電力基礎設施的權益。</div>

      {/* 內容 */}
      <div className="certificate-content">
        <div className="certificate-row">
          <span className="certificate-label">住戶（區權人）</span>
          <span className="certificate-value">{entry.sponsor}</span>
        </div>

        <div className="certificate-row">
          <span className="certificate-label">加入日期</span>
          <span className="certificate-value">{joinDate}</span>
        </div>

        <div className="certificate-row">
          <span className="certificate-label">戶號</span>
          <span className="certificate-value">{entry.householdNumber}</span>
        </div>

        <div className="certificate-row">
          <span className="certificate-label">車位號</span>
          <span className="certificate-value">{parkingLocation}</span>
        </div>
        
      </div>

      {/* 頁尾 */}
      <div className="certificate-footer">
        <div className="certificate-seal">
          管委會用印
        </div>
      </div>
    </div>
  );
};
