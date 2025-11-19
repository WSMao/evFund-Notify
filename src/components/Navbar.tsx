import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 公開的 URL 連結
  const pdfUrl = 'https://drive.google.com/file/d/1qjQt_PM7W7iVRmnDtlLwb5VXlrKF3fS5/view?usp=sharing';
  const qrCodeUrl = '/line_group_qrcode.jpeg';

  const handleViewPlan = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    setShowDropdown(false);
  };

  const handleViewMap = () => {
    navigate('/map');
    setShowDropdown(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="dropdown">
              <button 
                className="navbar-btn btn-plan" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                查看方案
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ marginLeft: '0.25rem' }}>
                  <path d="M6 8L2 4h8L6 8z"/>
                </svg>
              </button>
              {showDropdown && (
                <>
                  <div className="dropdown-backdrop" onClick={() => setShowDropdown(false)} />
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleViewPlan}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      集資方案
                    </button>
                    <button className="dropdown-item" onClick={handleViewMap}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      規劃地圖
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <h1 className="navbar-title">新月充電站募資進度</h1>
          
          <button 
            className="navbar-btn btn-line" 
            onClick={() => setShowQRCode(true)}
            aria-label="LINE 社區"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
          </button>
        </div>
      </nav>

      {showQRCode && (
        <div className="qrcode-modal" onClick={() => setShowQRCode(false)}>
          <div className="qrcode-content" onClick={(e) => e.stopPropagation()}>
            <button className="qrcode-close" onClick={() => setShowQRCode(false)}>
              ✕
            </button>
            <h3>新月天地充電樁社群</h3>
            <img src={qrCodeUrl} alt="LINE 社區 QR Code" />
            <p>掃描 QR Code 加入</p>
          </div>
        </div>
      )}
    </>
  );
}
