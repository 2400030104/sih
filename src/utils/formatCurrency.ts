/**
 * Indian Currency & Numerical Formatter for Central Infrastructure Budgets (₹ Crore)
 */

export function formatCurrency(amount: number | null | undefined, options: { inCrores?: boolean; compact?: boolean } = {}): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const { inCrores = true, compact = false } = options;

  // Base unit in database is already in ₹ Crore
  if (compact) {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh Cr`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)}k Cr`;
    }
  }

  const formattedNum = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(amount);

  return inCrores ? `₹${formattedNum} Cr` : `₹${formattedNum}`;
}

export function formatPercentage(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.0%';
  }
  return `${Number(value).toFixed(decimals)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN').format(value);
}
