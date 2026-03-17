// Utility functions for working with report data samples

/**
 * Format number with locale string (Vietnamese)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('vi-VN');
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): {
  value: string;
  up: boolean;
} {
  const change = ((current - previous) / previous) * 100;
  return {
    value: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
    up: change >= 0
  };
}

/**
 * Get status badge color based on status value
 */
export function getStatusBadgeColor(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
    'active': 'success',
    'completed': 'success',
    'passed': 'success',
    'good': 'success',
    'resolved': 'success',
    'warning': 'warning',
    'upcoming': 'warning',
    'critical': 'danger',
    'failed': 'danger',
    'bad': 'danger',
    'revoked': 'danger',
    'depleted': 'neutral',
    'pending': 'neutral'
  };
  return statusMap[status.toLowerCase()] || 'neutral';
}

/**
 * Get color for severity level
 */
export function getSeverityColor(severity: string): string {
  const colorMap: Record<string, string> = {
    'critical': '#ef4444', // red
    'high': '#f97316',      // orange
    'medium': '#f59e0b',   // amber
    'low': '#22c55e',      // green
    'normal': '#6b7280'    // gray
  };
  return colorMap[severity.toLowerCase()] || '#6b7280';
}

/**
 * Calculate total from array of numbers
 */
export function calculateTotal(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return calculateTotal(numbers) / numbers.length;
}

/**
 * Find max value in array
 */
export function findMaxValue(numbers: number[]): number {
  return Math.max(...numbers);
}

/**
 * Find min value in array
 */
export function findMinValue(numbers: number[]): number {
  return Math.min(...numbers);
}

/**
 * Sort array of objects by a key
 */
export function sortByKey<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'desc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
}

/**
 * Filter array by search term in multiple keys
 */
export function filterBySearch<T>(
  array: T[],
  searchTerm: string,
  searchKeys: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return array;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return array.filter((item) =>
    searchKeys.some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowerSearchTerm);
      }
      return false;
    })
  );
}

/**
 * Generate trend data for charts
 */
export function generateTrendData(
  months: string[],
  baseValue: number,
  growthRate: number = 0.02,
  variance: number = 0.1
): Array<{ month: string; value: number }> {
  return months.map((month, index) => {
    const growth = 1 + (growthRate * index);
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    return {
      month,
      value: Math.round(baseValue * growth * randomFactor)
    };
  });
}

/**
 * Calculate percentage of part from total
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/**
 * Format date range
 */
export function formatDateRange(startDate: string, endDate: string): string {
  return `${startDate} - ${endDate}`;
}

/**
 * Get Vietnamese month name from number (1-12)
 */
export function getVietnameseMonthName(monthNumber: number): string {
  const months = [
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
    'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
  ];
  return months[monthNumber - 1] || 'T1';
}

/**
 * Generate Vietnamese months array
 */
export function generateVietnameseMonths(count: number = 12): string[] {
  return Array.from({ length: count }, (_, i) => getVietnameseMonthName(i + 1));
}

/**
 * Calculate success rate
 */
export function calculateSuccessRate(successful: number, total: number): number {
  if (total === 0) return 0;
  return (successful / total) * 100;
}

/**
 * Group array by key
 */
export function groupByKey<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const keyValue = String(item[key]);
    if (!groups[keyValue]) {
      groups[keyValue] = [];
    }
    groups[keyValue].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Get top N items from array sorted by value
 */
export function getTopItems<T extends Record<string, any>>(
  array: T[],
  valueKey: keyof T,
  count: number = 10
): T[] {
  return sortByKey(array, valueKey, 'desc').slice(0, count);
}

/**
 * Calculate year-to-date total
 */
export function calculateYTD(monthlyData: Array<{ value: number }>, currentMonth: number): number {
  return monthlyData.slice(0, currentMonth).reduce((sum, item) => sum + item.value, 0);
}

/**
 * Compare with same period last year
 */
export function compareWithSamePeriodLastYear(
  currentData: Array<{ month: string; value: number }>,
  lastYearData: Array<{ month: string; value: number }>,
  months: number = 12
): {
  currentTotal: number;
  lastYearTotal: number;
  changePercentage: string;
  isPositive: boolean;
} {
  const currentTotal = calculateYTD(currentData, months);
  const lastYearTotal = calculateYTD(lastYearData, months);

  const change = lastYearTotal === 0 ? 0 : ((currentTotal - lastYearTotal) / lastYearTotal) * 100;

  return {
    currentTotal,
    lastYearTotal,
    changePercentage: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
    isPositive: change >= 0
  };
}
