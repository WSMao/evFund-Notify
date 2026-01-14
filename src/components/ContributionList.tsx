import { useState } from 'react';
import type { FundraisingEntry } from '../types/fundraising';
import { formatCurrency, formatDate } from '../utils/formatters';

interface Props {
  entries: FundraisingEntry[];
  avgAmount: number | null;
}

type SortOrder = 'newest' | 'oldest';

// 簡化戶號格式，保護個資
// 例如：A249-11F → A-11F, B22-5F → B-5F
function simplifyHouseholdNumber(householdNumber: string): string {
  if (!householdNumber) return 'N/A';
  
  // 使用正則表達式匹配格式：字母 + 數字 + - + 數字 + 字母
  const match = householdNumber.match(/^([A-Z])(\d+)-(\d+)([A-Z])$/i);
  if (match) {
    const [, prefix, , suffix, floor] = match;
    return `${prefix}-${suffix}${floor}`;
  }
  
  return householdNumber;
}

export function ContributionList({ entries, avgAmount }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  if (!entries.length) {
    return (
      <section className="card">
        <h3>贊助者名單</h3>
        <p>尚無贊助者資料。</p>
      </section>
    );
  }

  // 根據排序順序對 entries 進行排序
  const sortedEntries = [...entries].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.timestamp.getTime() - a.timestamp.getTime(); // 最晚到最早
    } else {
      return a.timestamp.getTime() - b.timestamp.getTime(); // 最早到最晚
    }
  });

  // 切換排序順序
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  // 判斷金額與人均金額的關係
  const getAmountClass = (amount: number): string => {
    if (!avgAmount) return '';
    if (amount < avgAmount) return 'amount-below-avg';
    if (amount > avgAmount) return 'amount-above-avg';
    return ''; // 等於人均金額，維持預設黑色
  };

  return (
    <section className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3>贊助者名單</h3>
          <button 
            onClick={toggleSortOrder}
            title={sortOrder === 'newest' ? '切換為最早到最晚' : '切換為最晚到最早'}
            style={{
              padding: '6px 8px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.borderColor = '#bbb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            {sortOrder === 'newest' ? '▼' : '▲'}
          </button>
        </div>
        <span>{entries.length} 人</span>
      </div>
      <ul className="contribution-list">
        {sortedEntries.map((entry, index) => {
          const amountClass = getAmountClass(entry.amount);
          const isBelowAvg = avgAmount && entry.amount < avgAmount;
          
          return (
            <li key={`${entry.householdNumber}-${index}`}>
              <div>
                <strong>{entry.sponsor || '匿名贊助者'}</strong>
                <span>{formatDate(entry.timestamp)}</span>
                <span>戶號：{simplifyHouseholdNumber(entry.householdNumber)}，車位樓層：{entry.parkingFloor || 'N/A'}</span>
              </div>
              <div className="amount-wrapper">
                <span className={`amount ${amountClass}`}>
                  {formatCurrency(entry.amount)}
                </span>
                {isBelowAvg && (
                  <span className="amount-note">（未達人均金額）</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
