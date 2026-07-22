import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
import SearchIcon from '@mui/icons-material/Search';
import ReportsService from '../../services/ReportsService';
import ExportService from '../../services/ExportService';

const SERVER_PAGE_SIZE = 30;
const TIPO_CONTROLLO_PARENT_KEY = 'TIPO_CONTROLLO';
const ALL_CONTROLLO_SALDI_TYPE = 'TC_TUTTI_CONTI';

/**
 * Convert dd/MM/yyyy to YYYY-MM-DD format (for HTML date input)
 */
const formatDateToISO = (dateString) => {
  if (!dateString) return '';
  // Handle both dd/MM/yyyy and YYYY-MM-DD formats
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }
  return dateString; // Already in ISO format
};

/**
 * Convert YYYY-MM-DD to dd/MM/yyyy format (for display)
 */
const formatDateToItalian = (dateString) => {
  if (!dateString) return '';
  // Handle both YYYY-MM-DD and dd/MM/yyyy formats
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  return dateString; // Already in Italian format
};

const COLUMNS = [
  { header: 'Data Calcolo', key: 'dataCalcoloFormatted', width: '12%' },
  { header: 'Numero Conto', key: 'numeroConto', width: '14%' },
  { header: 'Divisa', key: 'divisa', width: '10%' },
  { header: 'Denominazione o Rag. Sociale', key: 'denominazione', width: '22%' },
  { header: '8 cifre', key: 'ottoCifre', width: '10%' },
  { header: 'Importo Archivio', key: 'importoArchivio', width: '14%' },
  { header: 'Saldo Contabile', key: 'saldoContabile', width: '14%' },
  { header: 'Differenza', key: 'differenza', width: '14%' },
];

export default function ControlloSaldiReport({ idBanca }) {
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedType, setSelectedType] = useState(ALL_CONTROLLO_SALDI_TYPE);
  const [executionDate, setExecutionDate] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [searchParams, setSearchParams] = useState(null);

  const resolvedBancaId = Number(idBanca || localStorage.getItem('idBanca') || '1');
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / SERVER_PAGE_SIZE) : 0;

  const normalizeChildParamOption = useCallback((item) => ({
    key: String(item?.key || '').trim(),
    value: String(item?.value || '').trim(),
    visible: String(item?.visible || 'Y').toUpperCase(),
    defaultValue: String(item?.defaultValue || 'N').toUpperCase(),
  }), []);

  useEffect(() => {
    const loadControlloTypes = async () => {
      setOptionsLoading(true);

      try {
        const childParams = await ReportsService.getChildParams({
          parentKey: TIPO_CONTROLLO_PARENT_KEY,
          idBanca: resolvedBancaId,
        });

        const normalizedOptions = childParams
          .map(normalizeChildParamOption)
          .filter((item) => item.visible !== 'N' && item.key && item.value);

        setTypeOptions(normalizedOptions);

        if (normalizedOptions.length === 0) {
          setSelectedType(ALL_CONTROLLO_SALDI_TYPE);
          setError('No Tipo Controllo options available from param collection');
          return;
        }

        setError(null);
        setSelectedType(ALL_CONTROLLO_SALDI_TYPE);
      } catch (err) {
        setTypeOptions([]);
        setSelectedType(ALL_CONTROLLO_SALDI_TYPE);
        setError(err.message || 'Failed to load Tipo Controllo options');
      } finally {
        setOptionsLoading(false);
      }
    };

    loadControlloTypes();
  }, [normalizeChildParamOption, resolvedBancaId]);

  const handleSearch = useCallback(async () => {
    if (!executionDate) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setPageNumber(0);

    try {
      // Send date in ISO format (YYYY-MM-DD) for backend LocalDate deserialization
      const request = {
        bancaId: resolvedBancaId,
        executionDate: executionDate,
        tipoControllo: selectedType !== ALL_CONTROLLO_SALDI_TYPE ? selectedType : null,
        pageNumber: 0,
        pageSize: SERVER_PAGE_SIZE,
      };

      setSearchParams(request);
      const result = await ReportsService.getControlloSaldi(request);
      
      // Handle WrappedResponse<PaginatedResponseDto> structure
      if (result && result.payload) {
        // Check if payload is the PaginatedResponseDto or array directly
        const responseData = result.payload.data || result.payload;
        const dataArray = Array.isArray(responseData) ? responseData : (responseData?.data || []);
        const count = result.payload.totalCount || dataArray.length;
        
        setData(dataArray);
        setTotalCount(count);
        
        if (dataArray.length === 0) {
          setError('No data found for the selected criteria');
        }
      } else {
        setData([]);
        setTotalCount(0);
        setError('Invalid response structure from API');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch report data');
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [executionDate, selectedType, resolvedBancaId]);

  const handlePageChange = useCallback(async (newPageNumber) => {
    if (!searchParams) return;

    setLoading(true);
    setError(null);

    try {
      const request = {
        ...searchParams,
        pageNumber: newPageNumber,
        pageSize: SERVER_PAGE_SIZE,
      };

      const result = await ReportsService.getControlloSaldi(request);
      
      // Handle WrappedResponse<PaginatedResponseDto> structure
      if (result && result.payload) {
        const responseData = result.payload.data || result.payload;
        const dataArray = Array.isArray(responseData) ? responseData : (responseData?.data || []);
        setData(dataArray);
        setPageNumber(newPageNumber);
      } else {
        setError('Failed to load page data');
        setData([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch page data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleExport = useCallback(async () => {
    try {
      if (totalCount === 0) {
        setError('No data to export');
        return;
      }

      setLoading(true);
      setError(null);
      
      // Fetch all data across all pages for export
      let allExportData = [];
      const pagesToFetch = Math.ceil(totalCount / SERVER_PAGE_SIZE);
      
      for (let pageNum = 0; pageNum < pagesToFetch; pageNum++) {
        try {
          const request = {
            ...searchParams,
            pageNumber: pageNum,
            pageSize: SERVER_PAGE_SIZE,
          };
          
          // Pass isExport=true to use extended timeout for export operations
          const result = await ReportsService.getControlloSaldi(request, true);
          
          if (result && result.payload) {
            const responseData = result.payload.data || result.payload;
            const pageData = Array.isArray(responseData) ? responseData : (responseData?.data || []);
            allExportData = allExportData.concat(pageData);
          }
        } catch (pageErr) {
          console.warn(`Failed to fetch page ${pageNum} for export:`, pageErr);
          // Continue with next page if one fails
        }
      }
      
      if (allExportData.length === 0) {
        setError('No data available to export');
        return;
      }
      
      // Export all collected data
      await ExportService.exportToXLS(allExportData, 'ControlloSaldiReport', COLUMNS);
    } catch (err) {
      console.error('Export error:', err);
      try {
        await ExportService.exportToCSV(data, 'ControlloSaldiReport', COLUMNS);
      } catch (csvErr) {
        setError('Failed to export data');
      }
    } finally {
      setLoading(false);
    }
  }, [data, totalCount, searchParams]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
      {/* Filter Panel */}
      <Paper sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #d6dbea' }}>

         <Box sx={{ fontSize: '24px', fontWeight: 700, color: '#0f3aa5', mb: 2 }}>
            Controllo Saldi K5
          </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
          
          <Box>
            <TextField
              label="Data Calcolo"
              type="date"
              value={executionDate}
              onChange={(e) => setExecutionDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
          </Box>
          <FormControl size="small" fullWidth>
            <InputLabel>Tipo Controllo</InputLabel>
            <Select
              value={selectedType}
              label="Tipo Controllo"
              disabled={optionsLoading}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              { /* <MenuItem value={ALL_CONTROLLO_SALDI_TYPE}>{ALL_CONTROLLO_SALDI_TYPE}</MenuItem> */ }
              {typeOptions.map((type) => (
                <MenuItem key={type.key} value={type.key}>{type.value}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading || optionsLoading}
              sx={{ backgroundColor: '#0f3aa5', color: 'white' }}
              fullWidth
            >
              {loading ? 'Loading...' : 'Search'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              disabled={loading || totalCount === 0}
              sx={{ borderColor: '#0f3aa5', color: '#0f3aa5' }}
            >
              Export
            </Button>
          </Box>
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
                {data.map((row, index) => (
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
                        {row[column.key] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={pageNumber + 1}
                onChange={(e, value) => handlePageChange(value - 1)}
                color="primary"
                disabled={loading}
              />
            </Box>
          )}

          {/* Results Summary */}
          <Box sx={{ p: 2, textAlign: 'right', fontSize: '12px', color: '#666' }}>
            Showing {pageNumber * SERVER_PAGE_SIZE + 1} to{' '}
            {Math.min((pageNumber + 1) * SERVER_PAGE_SIZE, totalCount)} of {totalCount} results
          </Box>
        </Paper>
      )}

      {!loading && data.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: 'center', color: '#999' }}>
          No data available. Enter search criteria and click Search to fetch reports.
        </Paper>
      )}
    </Box>
  );
}

