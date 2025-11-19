import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/map-gallery.css';

export function MapGallery() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 規劃地圖圖片列表 - 請將圖片放在 public 資料夾中
  const images = [
    '/B1 配置圖.png',
    '/B2 配置圖.png',
    '/B3 配置圖.png',
    '/B4 配置圖.png',
    // 可以繼續添加更多圖片
  ];

  // 從檔名提取說明文字（去除路徑和副檔名）
  const getImageName = (path: string) => {
    return path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="map-gallery">
      <header className="gallery-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回
        </button>
        <h1>規劃地圖</h1>
        <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
      </header>

      <main className="gallery-content">
        <p className="image-description">{getImageName(images[currentIndex])}</p>
        
        <div className="image-container">
          <img 
            src={images[currentIndex]} 
            alt={`規劃地圖 ${currentIndex + 1}`}
            className="gallery-image"
          />
          
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        <div className="gallery-controls">
          <button 
            className="control-btn btn-prev" 
            onClick={handlePrevious}
            disabled={images.length <= 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            上一張
          </button>
          
          <button 
            className="control-btn btn-next" 
            onClick={handleNext}
            disabled={images.length <= 1}
          >
            下一張
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
