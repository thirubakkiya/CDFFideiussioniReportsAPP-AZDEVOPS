/**
 * Date formatting utilities for API communication
 * Converts between YYYY-MM-DD (HTML input format) and dd/MM/yyyy (API format)
 */

/**
 * Convert YYYY-MM-DD format to dd/MM/yyyy format for API
 * @param {string} dateString - Date in YYYY-MM-DD format (from HTML input or state)
 * @returns {string} Date in dd/MM/yyyy format (for API)
 */
export const formatDateForApi = (dateString) => {
  if (!dateString) return '';
  // Handle YYYY-MM-DD format (HTML input or internal state)
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`; // Convert to dd/MM/yyyy
  }
  return dateString; // Already in correct format
};

/**
 * Convert dd/MM/yyyy format to YYYY-MM-DD format for HTML input
 * @param {string} dateString - Date in dd/MM/yyyy format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Handle dd/MM/yyyy format
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return dateString; // Already in YYYY-MM-DD format
};

/**
 * Parse date from dd/MM/yyyy string to YYYY-MM-DD for internal storage
 * @param {string} dateString - Date in dd/MM/yyyy format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const parseItalianDate = (dateString) => {
  if (!dateString) return '';
  const trimmed = dateString.trim();
  const italianDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = trimmed.match(italianDateRegex);

  if (match) {
    const [, day, month, year] = match;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (m < 1 || m > 12) return '';
    if (d < 1 || d > 31) return '';

    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  if (trimmed.includes('-')) {
    return trimmed;
  }

  return '';
};
