/**
 * Date Formatter Utilities
 */

export function formatDate(dateString: string | null | undefined, formatType: 'standard' | 'monthYear' | 'full' = 'standard'): string {
  if (!dateString) return '—';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    if (formatType === 'monthYear') {
      return new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        year: 'numeric'
      }).format(date);
    }

    if (formatType === 'full') {
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }

    // Standard DD MMM YYYY
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return '—';
  }
}
