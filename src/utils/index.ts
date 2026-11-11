/**
 * Common formatting and calculation utility functions
 */
export const formatTimeRange = (start: string, end: string): string => {
  return `${start} — ${end}`;
};

export const formatPercentage = (val: number): string => {
  return `${Math.round(val)}%`;
};

