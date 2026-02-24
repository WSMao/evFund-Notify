import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/plan-updates.css';

interface ImageItem {
  path: string;
  name: string;
}

interface UpdateItem {
  date: string;
  title: string;
  content: string[];
  images: ImageItem[];
}

export function PlanUpdates() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});

  // 方案動態資料
  const updates: UpdateItem[] = [
      // 可以在這裡添加更多動態
    {
      date: '2026/02/24',
      title: 'V1 - 第 1 版方案',
      content: [
        '方案總額： 184 萬',
        '方案名額： 54 個',
        '目前人數： 39 位',
      ],
      images: [
        { path: '/V1/B1 配置圖.png', name: 'B1 配置圖' },
        { path: '/V1/B2 配置圖.png', name: 'B2 配置圖' },
        { path: '/V1/B3 配置圖.png', name: 'B3 配置圖' },
        { path: '/V1/B4 配置圖.png', name: 'B4 配置圖' },
      ],
    },
    {
      date: '2025/11/26',
      title: ' V0 - 初始集資方案',
      content: [
        '方案總額： 184 萬',
        '方案名額： 54 個',
        '目前人數： 41 位',
      ],
      images: [
        { path: '/V0/B1 配置圖.png', name: 'B1 配置圖' },
        { path: '/V0/B2 配置圖.png', name: 'B2 配置圖' },
        { path: '/V0/B3 配置圖.png', name: 'B3 配置圖' },
        { path: '/V0/B4 配置圖.png', name: 'B4 配置圖' },
      ],
    },
  ];

  const handleBack = () => {
    navigate('/');
  };

  const handlePreviousImage = (updateIndex: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [updateIndex]: ((prev[updateIndex] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleNextImage = (updateIndex: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [updateIndex]: ((prev[updateIndex] || 0) + 1) % totalImages
    }));
  };

  return (
    <div className="plan-updates">
      <header className="updates-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回
        </button>
        <h1>方案動態</h1>
        <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
      </header>

      <main className="updates-content">
        <div className="updates-container">
          {updates.map((update, index) => (
            <article key={index} className="update-card">
              <div className="update-header">
                <h2 className="update-title">{update.title}</h2>
                <time className="update-date">{update.date}</time>
              </div>
              
              <div className="update-body">
                {update.content.map((item, i) => (
                  <p key={i} className="update-content-item">
                    <span className="bullet-point">•</span>
                    {item}
                  </p>
                ))}
              </div>

              {update.images.length > 0 && (
                <div className="update-images-carousel">
                  <div className="carousel-header">
                    <span className="image-name">
                      {update.images[currentImageIndex[index] || 0].name}
                    </span>
                    <div className="carousel-controls">
                      <span className="image-counter">
                        {(currentImageIndex[index] || 0) + 1} / {update.images.length}
                      </span>
                      <button 
                        className="carousel-btn carousel-btn-prev"
                        onClick={() => handlePreviousImage(index, update.images.length)}
                        aria-label="上一張圖片"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 18l-6-6 6-6"/>
                        </svg>
                      </button>
                      <button 
                        className="carousel-btn carousel-btn-next"
                        onClick={() => handleNextImage(index, update.images.length)}
                        aria-label="下一張圖片"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="carousel-image-container">
                    <div className="carousel-image-wrapper">
                      {update.images[currentImageIndex[index] || 0].path ? (
                        <img 
                          src={update.images[currentImageIndex[index] || 0].path}
                          alt={update.images[currentImageIndex[index] || 0].name}
                          className="carousel-image"
                        />
                      ) : (
                        <div className="empty-image">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <span>請填入圖片路徑</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
