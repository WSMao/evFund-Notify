import type { FundraisingEntry } from '../types/fundraising';
import { formatCurrency, formatDateTime } from '../utils/formatters';

interface Props {
  entries: FundraisingEntry[];
  avgAmount: number | null;
}

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
  if (!entries.length) {
    return (
      <section className="card">
        <h3>贊助者名單</h3>
        <p>尚無贊助者資料。</p>
      </section>
    );
  }

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
        <h3>贊助者名單</h3>
        <span>{entries.length} 人</span>
      </div>
      <ul className="contribution-list">
        {entries.map((entry, index) => {
          const amountClass = getAmountClass(entry.amount);
          const isBelowAvg = avgAmount && entry.amount < avgAmount;
          
          return (
            <li key={`${entry.householdNumber}-${index}`}>
              <div>
                <strong>{entry.sponsor || '匿名贊助者'}</strong>
                <span>{formatDateTime(entry.timestamp)}</span>
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
