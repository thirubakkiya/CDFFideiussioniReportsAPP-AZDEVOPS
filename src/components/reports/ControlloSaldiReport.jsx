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

const COLUMNS = [
  { header: 'Data Calcolo', key: 'dataCalcolo', width: '15%' },
  { header: 'Numero Conto', key: 'numeroConto', width: '18%' },
  { header: 'Divisa', key: 'divisa', width: '10%' },
  { header: 'Denominazione', key: 'denominazione', width: '20%' },
  { header: 'Importo Archivio', key: 'importoArchivio', width: '15%' },
  { header: 'Saldo Contabile', key: 'saldoContabile', width: '15%' },
  { header: 'Stato', key: 'stato', width: '12%' },
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
      const request = {
        bancaId: resolvedBancaId,
        executionDate: executionDate,
        tipoControllo: selectedType !== ALL_CONTROLLO_SALDI_TYPE ? selectedType : null,
        pageNumber: 0,
        pageSize: SERVER_PAGE_SIZE,
      };

      setSearchParams(request);
      const result = await ReportsService.getControlloSaldi(request);
      
      // Handle paginated response
      if (result && result.data) {
        setData(result.data || []);
        setTotalCount(result.totalCount || 0);
      } else {
        setData([]);
        setTotalCount(0);
      }

      if (!result || !result.data || result.data.length === 0) {
        setError('No data found for the selected criteria');
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
      
      if (result && result.data) {
        setData(result.data || []);
        setPageNumber(newPageNumber);
      } else {
        setError('Failed to load page data');
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

      // Prepare export data - could fetch all pages or just current page
      // For large datasets, limit to current page to avoid memory issues
      const exportData = data;
      
      await ExportService.exportToXLS(exportData, 'ControlloSaldiReport', COLUMNS);
    } catch (err) {
      try {
        ExportService.exportToCSV(data, 'ControlloSaldiReport', COLUMNS);
      } catch (csvErr) {
        setError('Failed to export data');
      }
    }
  }, [data, totalCount]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
      {/* Filter Panel */}
      <Paper sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #d6dbea' }}>

         <Box sx={{ fontSize: '24px', fontWeight: 700, color: '#0f3aa5', mb: 2 }}>
            Controllo Saldi K5
          </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
          
          <TextField
            label="Data Calcolo"
            type="date"
            value={executionDate}
            onChange={(e) => setExecutionDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
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
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={pageNumber + 1}
                onChange={(e, value) => handlePageChange(value - 1)}
                color="primary"
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

