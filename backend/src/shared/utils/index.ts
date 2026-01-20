/**
 * Utility functions for common operations
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate financial year
 */
export function getFinancialYear(date: Date = new Date(), startMonth: number = 4): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month >= startMonth) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

/**
 * Get financial year range
 */
export function getFinancialYearRange(
  year: string,
  startMonth: number = 4,
): { start: Date; end: Date } {
  const [startYear] = year.split('-').map(Number);

  return {
    start: new Date(startYear, startMonth - 1, 1),
    end: new Date(startYear + 1, startMonth - 2, 28),
  };
}

/**
 * Round to 2 decimal places
 */
export function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(percentage: number, amount: number): number {
  return roundToTwo((percentage / 100) * amount);
}

/**
 * Check if date is within range
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Get month name
 */
export function getMonthName(monthNumber: number): string {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

export default {
  generateId,
  getFinancialYear,
  getFinancialYearRange,
  roundToTwo,
  calculatePercentage,
  isDateInRange,
  formatCurrency,
  getMonthName,
  sleep,
  retryWithBackoff,
};
