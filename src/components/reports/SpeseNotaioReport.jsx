import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReportsService from '../../services/ReportsService';
import ExportService from '../../services/ExportService';

const ROWS_PER_PAGE = 10;

const COLUMNS = [
  { header: 'Operation Name', key: 'operationName', width: '15%' },
  { header: 'Conto Fideiussione', key: 'contoFideiussione', width: '15%' },
  { header: 'Numero Garanzia', key: 'numeroGaranzia', width: '15%' },
  { header: 'Spese Notaio', key: 'speseNotaio', width: '12%' },
  { header: 'Spese Notaio Attuale', key: 'speseNotaioAttuale', width: '12%' },
  { header: 'Operation Date', key: 'operationDate', width: '18%' },
];

/**
 * Convert YYYY-MM-DD to dd/MM/yyyy format (for display and API)
 */
const formatDateDisplay = (dateString) => {
  if (!dateString) return '';
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  return dateString;
};

/**
 * Convert dd/MM/yyyy to YYYY-MM-DD format for API
 */
const toApiDate = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  // Handle YYYY-MM-DD format (HTML date input)
  if (dateValue.includes('-')) {
    const [year, month, day] = dateValue.split('-');
    return `${day}/${month}/${year}`; // Convert to dd/MM/yyyy for API
  }

  // Handle dd/MM/yyyy format (shouldn't happen with date picker)
  return dateValue;
};

const pickValue = (row, aliases, fallback = '') => {
  for (const alias of aliases) {
    if (row && Object.prototype.hasOwnProperty.call(row, alias) && row[alias] !== null && row[alias] !== undefined) {
      return row[alias];
    }
  }
  return fallback;
};

const normalizeSpeseNotaioRow = (row) => ({
  operationName: pickValue(row, ['operationName', 'operation_name', 'OPERATION_NAME', 'nomeOperazione', 'NOME_OPERAZIONE'], ''),
  contoFideiussione: pickValue(row, ['contoFideiussione', 'conto_fideiussione', 'CONTO_FIDEIUSSIONE', 'conto', 'CONTO'], ''),
  numeroGaranzia: pickValue(row, ['numeroGaranzia', 'numero_garanzia', 'NUMERO_GARANZIA', 'guaranteeId', 'GUARANTEE_ID'], ''),
  speseNotaio: pickValue(row, ['speseNotaio', 'spese_notaio', 'SPESE_NOTAIO', 'importoNotaio', 'IMPORTO_NOTAIO'], 0),
  speseNotaioAttuale: pickValue(row, ['speseNotaioAttuale', 'spese_notaio_attuale', 'SPESE_NOTAIO_ATTUALE', 'importoNotaioAttuale', 'IMPORTO_NOTAIO_ATTUALE'], 0),
  operationDate: pickValue(row, ['operationDate', 'operation_date', 'OPERATION_DATE', 'dataOperazione', 'DATA_OPERAZIONE'], null),
});

export default function SpeseNotaioReport({ idBanca }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pageIndex, setPageIndex] = useState(1);

  const buildSpeseRequestPayload = useCallback((from, to) => ({
    bancaId: Number(idBanca || localStorage.getItem('idBanca') || '1'),
    fromDate: from,
    toDate: to,
  }), [idBanca]);

  // Filter data based on selected type
  const filteredData = useMemo(() => data, [data]);

  const totalPages = Math.max(Math.ceil(filteredData.length / ROWS_PER_PAGE), 1);
  const visibleRows = useMemo(() => {
    const start = (pageIndex - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [filteredData, pageIndex]);

  useEffect(() => {
    if (pageIndex > totalPages) {
      setPageIndex(totalPages);
    }
  }, [pageIndex, totalPages]);

  const handleSearch = useCallback(async () => {
    if (!fromDate || !toDate) {
      setError('Please select both From Date and To Date');
      return;
    }

    // Validate date range by converting to comparable format
    const parseDate = (dateStr) => {
      // dateStr is in YYYY-MM-DD format from date picker
      return new Date(dateStr);
    };

    const fromDateObj = parseDate(fromDate);
    const toDateObj = parseDate(toDate);

    if (fromDateObj > toDateObj) {
      setError('From Date must be before To Date');
      return;
    }

    setLoading(true);
    setError(null);
    setPageIndex(1);

    try {
      // Send dates in ISO format (YYYY-MM-DD) for backend LocalDate deserialization
      const request = buildSpeseRequestPayload(fromDate, toDate);

      console.log('API Request:', request);

      const result = await ReportsService.getSpeseNotaioReport(request);
      console.log('API Response:', result);

      if (result && Array.isArray(result)) {
        const normalizedRows = result.map(normalizeSpeseNotaioRow);
        setData(normalizedRows);
        if (normalizedRows.length === 0) {
          setError('No data found for the selected date range');
        }
      } else {
        setData([]);
        setError('Invalid response format from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch report data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  const handleExport = useCallback(async () => {
    let exportRows = [];

    try {
      if (filteredData.length === 0) {
        setError('No data to export. Please search for data first.');
        return;
      }

      exportRows = filteredData.map((row) => ({
        ...row,
        speseNotaio: formatCurrency(row.speseNotaio),
        speseNotaioAttuale: formatCurrency(row.speseNotaioAttuale),
        operationDate: formatDate(row.operationDate),
      }));

      console.log(`Exporting ${filteredData.length} records to XLS...`);
      await ExportService.exportToXLS(
        exportRows,
        'SpeseNotaioReport',
        COLUMNS
      );
      console.log('Export completed successfully');
    } catch (err) {
      console.error('XLS export failed, attempting CSV fallback...', err);
      // Fallback to CSV if XLS fails
      try {
        await ExportService.exportToCSV(exportRows, 'SpeseNotaioReport', COLUMNS);
        console.log('CSV export completed successfully');
      } catch (csvErr) {
        console.error('CSV export also failed:', csvErr);
        setError('Failed to export data in any format');
      }
    }
  }, [filteredData]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      // Handle both ISO string and Date object
      const date = typeof dateString === 'string' 
        ? new Date(dateString) 
        : dateString;
      
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '\u20AC 0,00';
    try {
      return `\u20AC ${parseFloat(value).toLocaleString('it-IT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } catch {
      return value;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
      {/* Filter Panel */}
      <Paper sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #d6dbea' }}>
        <Box sx={{ fontSize: '24px', fontWeight: 700, color: '#0f3aa5', mb: 2 }}>
          Report Spese Notaio
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 260px 160px' }, justifyContent: { xs: 'stretch', md: 'space-between' }, alignItems: 'end', gap: 2, mb: 2 }}>
          <TextField
            label="* Data Da"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <TextField
            label="* Data A"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{ backgroundColor: '#0f3aa5', color: 'white', borderRadius: '12px', height: '40px', minWidth: '160px', justifySelf: { xs: 'stretch', md: 'start' } }}
            fullWidth={false}
          >
            {loading ? 'LOADING...' : 'CONFERMA'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={loading || data.length === 0}
            sx={{ borderColor: '#0f3aa5', color: '#0f3aa5' }}
          >
            Export
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>

      {/* Results Grid */}
      {!loading && data.length > 0 && (
        <Paper sx={{ backgroundColor: '#ffffff', border: '1px solid #d6dbea' }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 450px)', overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  {COLUMNS.map((column) => (
                    <TableCell
                      key={column.key}
                      sx={{
                        width: column.width,
                        fontWeight: 700,
                        backgroundColor: '#f5f5f5',
                        color: '#1d3f9f',
                        borderBottom: '1px solid #d6dbea',
                        padding: '12px',
                      }}
                    >
                      {column.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row, index) => (
                  <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    {COLUMNS.map((column) => (
                      <TableCell
                        key={column.key}
                        sx={{
                          padding: '12px',
                          borderBottom: '1px solid #e4e8f3',
                          fontSize: '12px',
                          color: '#26406f',
                        }}
                      >
                        {column.key === 'operationDate'
                          ? formatDate(row[column.key])
                          : column.key === 'speseNotaio' || column.key === 'speseNotaioAttuale'
                          ? formatCurrency(row[column.key])
                          : row[column.key] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, p: 2 }}>
              <Pagination
                count={totalPages}
                page={pageIndex}
                onChange={(e, value) => setPageIndex(value)}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
              <Box sx={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
                Page {pageIndex} of {totalPages}
              </Box>
            </Box>
          )}

          {/* Results Summary */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', borderTop: '1px solid #d6dbea' }}>
            <Box sx={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>
              Total Records: {filteredData.length}
            </Box>
            <Box sx={{ fontSize: '12px', color: '#666' }}>
              Showing {filteredData.length === 0 ? 0 : ((pageIndex - 1) * ROWS_PER_PAGE) + 1} to{' '}
              {Math.min(pageIndex * ROWS_PER_PAGE, filteredData.length)} of {filteredData.length} results
            </Box>
          </Box>
        </Paper>
      )}

      {!loading && data.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: 'center', color: '#999', backgroundColor: '#fafafa' }}>
          <Box sx={{ fontSize: '16px', mb: 1 }}>No Data Available</Box>
          <Box sx={{ fontSize: '14px' }}>
            Select a date range and click <strong>Search</strong> to fetch Report Spese Notaio data.
          </Box>
        </Paper>
      )}
    </Box>
  );
}
