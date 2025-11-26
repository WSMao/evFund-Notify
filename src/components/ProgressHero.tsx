import { useEffect, useState } from 'react';
import type { FundraisingSummary } from '../types/fundraising';
import { formatCurrency } from '../utils/formatters';

interface Props extends Pick<FundraisingSummary, 'goal' | 'difference' | 'avgAmount' | 'planQuota' | 'currentPeople' | 'parkingStats' | 'startDate' | 'endDate'> {
  percentage: number;
  raised: number;
}

function useCountdown(endDate: Date | null) {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    if (!endDate) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      // 結束日期當天 23:59:59 還可以集資，所以要加一天再減去 1 秒
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('⌛️已結束');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days >= 1) {
        setCountdown(`⌛️倒數 ${days} 天`);
      } else {
        setCountdown(`⌛️倒數 ${hours} 時 ${minutes} 分`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // 每分鐘更新一次

    return () => clearInterval(interval);
  }, [endDate]);

  return countdown;
}

export function ProgressHero({ percentage, raised, goal, difference, avgAmount, planQuota, currentPeople, parkingStats, startDate, endDate }: Props) {
  const countdown = useCountdown(endDate);

  return (
    <section className="progress-hero">
      <div className="progress-section">
        <div className="progress-header">
          <p>目前進度</p>
          {countdown && <span className="countdown">{countdown}</span>}
        </div>
        <h2>{percentage}%</h2>
        <div className="progress-bar">
          <span style={{ width: `${percentage}%` }} />
        </div>
      </div>
      <div className="hero-stats">
        <div>
          <p>開始日期</p>
          <strong>{startDate ? new Date(startDate).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '尚未設定'}</strong>
        </div>
        <div>
          <p>結束日期</p>
          <strong>{endDate ? new Date(endDate).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '尚未設定'}</strong>
        </div>
        <div>
          <p>目標金額</p>
          <strong>{goal ? formatCurrency(goal) : '尚未設定'}</strong>
        </div>
        <div>
          <p>已募資</p>
          <strong>{formatCurrency(raised)}</strong>
        </div>
        <div>
          <p>方案名額</p>
          <strong>{planQuota !== null ? `${planQuota} 位` : '尚未設定'}</strong>
        </div>
        <div>
          <p>目前人數</p>
          <strong>{currentPeople !== null ? `${currentPeople} 人` : '尚未設定'}</strong>
        </div>
        <div>
          <p>人均金額</p>
          <strong>{avgAmount !== null ? formatCurrency(avgAmount) : '計算中'}</strong>
        </div>
        <div>
          <p>目標差額</p>
          <strong>{difference !== null ? formatCurrency(difference) : '計算中'}</strong>
        </div>
        <div>
          <p>B1 車位數</p>
          <strong>{parkingStats.b1} 位</strong>
        </div>
        <div>
          <p>B2 車位數</p>
          <strong>{parkingStats.b2} 位</strong>
        </div>
        <div>
          <p>B3 車位數</p>
          <strong>{parkingStats.b3} 位</strong>
        </div>
        <div>
          <p>B4 車位數</p>
          <strong>{parkingStats.b4} 位</strong>
        </div>
      </div>
    </section>
  );
}
