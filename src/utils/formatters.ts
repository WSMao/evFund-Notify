const currencyFormatter = new Intl.NumberFormat('zh-Hant-TW', {
  style: 'currency',
  currency: 'TWD',
  maximumFractionDigits: 0
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('zh-Hant-TW', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-Hant-TW', {
    dateStyle: 'medium'
  }).format(date);
}
