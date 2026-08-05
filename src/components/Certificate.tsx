import React from 'react';
import { FundraisingEntry } from '../types/fundraising';
import '../styles/certificate.css';

interface CertificateProps {
  entry: FundraisingEntry;
  certificateRef?: React.RefObject<HTMLDivElement>;
}

export const Certificate: React.FC<CertificateProps> = ({ entry, certificateRef }) => {
  const ownerName = entry.parkingOwner || entry.sponsor || '未填寫';
  const parkingLocation = [entry.parkingFloor, entry.parkingNumber].filter(Boolean).join('-') || entry.fullParkingLocation || '未填寫';

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
          <span className="certificate-value">{ownerName}</span>
        </div>

        <div className="certificate-row">
          <span className="certificate-label">戶號</span>
          <span className="certificate-value">{entry.householdNumber}</span>
        </div>
        
        <div className="certificate-row">
          <span className="certificate-label">使用分盤</span>
          <span className="certificate-value">{entry.usagePanel}</span>
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
