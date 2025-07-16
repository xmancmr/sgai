// Utility functions for automatic date handling

/**
 * Get current date in French format
 * @returns Current date as DD/MM/YYYY string
 */
export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString('fr-FR');
};

/**
 * Get current date and time in French format
 * @returns Current date and time as DD/MM/YYYY HH:MM string
 */
export const getCurrentDateTime = (): string => {
  return new Date().toLocaleString('fr-FR');
};

/**
 * Format date for French locale
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR');
};

/**
 * Format date and time for French locale
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('fr-FR');
};

/**
 * Get date range for the current month
 * @returns Object with start and end dates of current month
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    start: formatDate(start),
    end: formatDate(end),
    startDate: start,
    endDate: end
  };
};

/**
 * Get agricultural season based on current date
 * @returns Current agricultural season information
 */
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  
  if (month >= 3 && month <= 5) {
    return {
      season: "Saison Sèche",
      phase: "Préparation des sols",
      nextPhase: "Plantation",
      daysUntilNext: calculateDaysUntilDate(new Date(new Date().getFullYear(), 5, 1))
    };
  } else if (month >= 6 && month <= 10) {
    return {
      season: "Saison des Pluies",
      phase: "Plantation et Croissance",
      nextPhase: "Récolte",
      daysUntilNext: calculateDaysUntilDate(new Date(new Date().getFullYear(), 10, 1))
    };
  } else {
    return {
      season: "Saison des Récoltes",
      phase: "Récolte et Stockage",
      nextPhase: "Préparation Hiver",
      daysUntilNext: calculateDaysUntilDate(new Date(new Date().getFullYear() + 1, 2, 1))
    };
  }
};

/**
 * Calculate days until a specific date
 * @param targetDate - Target date
 * @returns Number of days until target date
 */
export const calculateDaysUntilDate = (targetDate: Date): number => {
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get automatic date for transactions (current date)
 * @returns ISO date string for current date
 */
export const getTransactionDate = (): string => {
  return new Date().toISOString().split('T')[0];
};