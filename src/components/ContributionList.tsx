import type { FundraisingEntry } from '../types/fundraising';
import { formatCurrency, formatDateTime } from '../utils/formatters';

interface Props {
  entries: FundraisingEntry[];
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

export function ContributionList({ entries }: Props) {
  if (!entries.length) {
    return (
      <section className="card">
        <h3>贊助者名單</h3>
        <p>尚無贊助者資料。</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-header">
        <h3>贊助者名單</h3>
        <span>{entries.length} 人</span>
      </div>
      <ul className="contribution-list">
        {entries.map((entry, index) => (
          <li key={`${entry.householdNumber}-${index}`}>
            <div>
              <strong>{entry.sponsor || '匿名贊助者'}</strong>
              <span>{formatDateTime(entry.timestamp)}</span>
              <span>戶號：{simplifyHouseholdNumber(entry.householdNumber)}，車位樓層：{entry.parkingFloor || 'N/A'}</span>
            </div>
            <span className="amount">{formatCurrency(entry.amount)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
