/**
 * Export utility to convert data to XLS format
 * Uses client-side library to generate Excel files
 */

export const ExportService = {
  /**
   * Export data array to XLS format
   * @param {Array} data - Array of objects to export
   * @param {string} fileName - Name of the file to download
   * @param {Array} columns - Column definitions with header and key
   */
  exportToXLS: async (data, fileName, columns) => {
    try {
      // Dynamically import xlsx library
      const XLSX = await import('xlsx');

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Transform data to match column structure
      const exportData = data.map(row => {
        const newRow = {};
        columns.forEach(col => {
          newRow[col.header] = row[col.key];
        });
        return newRow;
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Auto-size columns
      const colWidths = columns.map(col => ({
        wch: Math.max(col.header.length, 20),
      }));
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Report');

      // Generate file name with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const finalFileName = `${fileName}_${timestamp}.xlsx`;

      // Write file
      XLSX.writeFile(wb, finalFileName);

      return true;
    } catch (error) {
      console.error('Error exporting to XLS:', error);
      throw new Error('Failed to export data. Please ensure xlsx library is installed.');
    }
  },

  /**
   * Export to CSV as fallback
   */
  exportToCSV: (data, fileName, columns) => {
    try {
      // Create CSV header
      const headers = columns.map(col => `"${col.header}"`).join(',');

      // Create CSV rows
      const rows = data.map(row => {
        return columns
          .map(col => {
            const value = row[col.key];
            // Escape quotes in values
            const escapedValue = value ? String(value).replace(/"/g, '""') : '';
            return `"${escapedValue}"`;
          })
          .join(',');
      });

      // Combine header and rows
      const csv = [headers, ...rows].join('\n');

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${timestamp}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  },
};

export default ExportService;
