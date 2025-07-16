// Utility functions for currency formatting and conversion

/**
 * Format a number as FCFA currency
 * @param amount - The amount to format
 * @param locale - The locale for formatting (default: 'fr-FR')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, locale: string = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'XAF', // West African CFA franc
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('XAF', 'FCFA');
};

/**
 * Format a number as FCFA with custom suffix
 * @param amount - The amount to format
 * @returns Formatted currency string with FCFA suffix
 */
export const formatFCFA = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};

/**
 * Parse a currency string and return the numeric value
 * @param currencyString - The currency string to parse
 * @returns Numeric value
 */
export const parseCurrency = (currencyString: string): number => {
  return parseFloat(currencyString.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
};

/**
 * Convert EUR to FCFA (approximate rate)
 * @param eurAmount - Amount in EUR
 * @returns Amount in FCFA
 */
export const convertEurToFcfa = (eurAmount: number): number => {
  const exchangeRate = 655.957; // Fixed EUR to XAF rate
  return Math.round(eurAmount * exchangeRate);
};