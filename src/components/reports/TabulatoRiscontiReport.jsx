import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import ReportsService from '../../services/ReportsService';
import ExportService from '../../services/ExportService';

const ROWS_PER_PAGE = 10;
const TIPO_RISCONTI_PARENT_KEY = 'TIPO_RISCONTI';

const COLUMNS = [
  { header: 'Succursale', key: 'succursale', width: '12%' },
  { header: 'Tipo RC', key: 'rcType', width: '12%' },
  { header: 'Cliente', key: 'cliente', width: '18%' },
  { header: 'Numero Garanzia', key: 'numeroGaranzia', width: '14%' },
  { header: 'Operazione', key: 'operationName', width: '16%' },
  { header: 'Importo', key: 'importo', width: '12%' },
  { header: 'Data Risconto', key: 'dataRisconto', width: '16%' },
];

const toApiDate = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  const [year, month, day] = dateValue.split('-');
  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day}/${month}/${year}`;
};

const pickValue = (row, aliases, fallback = '') => {
  for (const alias of aliases) {
    if (row && Object.prototype.hasOwnProperty.call(row, alias) && row[alias] !== null && row[alias] !== undefined) {
      return row[alias];
    }
  }
  return fallback;
};

const normalizeTabulatoRiscontiRow = (row) => ({
  succursale: pickValue(row, ['succursale', 'SUCCURSALE'], ''),
  rcType: pickValue(row, ['rcType', 'rc_type', 'RC_TYPE'], ''),
  cliente: pickValue(row, ['cliente', 'CLIENTE'], ''),
  numeroGaranzia: pickValue(row, ['numeroGaranzia', 'numero_garanzia', 'NUMERO_GARANZIA'], ''),
  operationName: pickValue(row, ['operationName', 'operation_name', 'OPERATION_NAME'], ''),
  importo: pickValue(row, ['importo', 'IMPORTO', 'amount', 'AMOUNT'], 0),
  dataRisconto: pickValue(row, ['dataRisconto', 'data_risconto', 'DATA_RISCONTO'], ''),
  tipoRisconto: pickValue(row, ['rcType', 'rc_type', 'RC_TYPE', 'tipoRisconto', 'tipo_risconto'], ''),
});

export default function TabulatoRiscontiReport({ idBanca }) {
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [riscontiOptions, setRiscontiOptions] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [pageIndex, setPageIndex] = useState(1);

  const resolvedBancaId = Number(idBanca || localStorage.getItem('idBanca') || '1');

  const normalizeChildParamOption = useCallback((item) => ({
    key: String(item?.key || '').trim(),
    value: String(item?.value || '').trim(),
    visible: String(item?.visible || 'Y').toUpperCase(),
    defaultValue: String(item?.defaultValue || 'N').toUpperCase(),
  }), []);

  useEffect(() => {
    const loadRiscontiOptions = async () => {
      setOptionsLoading(true);

      try {
        const childParams = await ReportsService.getChildParams({
          parentKey: TIPO_RISCONTI_PARENT_KEY,
          idBanca: resolvedBancaId,
        });

        const normalizedOptions = childParams
          .map(normalizeChildParamOption)
          .filter((item) => item.visible !== 'N' && item.key && item.value);

        setRiscontiOptions(normalizedOptions);

        if (normalizedOptions.length === 0) {
          setSelectedType('');
          setError('No Tipo Risconti options available from param collection');
          return;
        }

        const defaultOption = normalizedOptions.find((item) => item.defaultValue === 'Y') || normalizedOptions[0];
        setSelectedType(defaultOption.key);
      } catch (err) {
        setSelectedType('');
        setRiscontiOptions([]);
        setError(err.message || 'Failed to load Tipo Risconti options');
      } finally {
        setOptionsLoading(false);
      }
    };

    loadRiscontiOptions();
  }, [normalizeChildParamOption, resolvedBancaId]);

  const buildTabulatoRequestPayload = useCallback(() => {
    return {
      bancaId: resolvedBancaId,
      dataRisconto: toApiDate(searchDate),
      tipoRisconti: selectedType,
    };
  }, [resolvedBancaId, searchDate, selectedType]);

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
    if (!searchDate) {
      setError('Please select Data Risconto');
      return;
    }

    if (!selectedType) {
      setError('Please select Tipo Risconti');
      return;
    }

    setLoading(true);
    setError(null);
    setPageIndex(1);

    try {
      const request = buildTabulatoRequestPayload();

      const result = await ReportsService.getTabulatoRiscontiReport(request);
      const normalizedRows = Array.isArray(result)
        ? result.map(normalizeTabulatoRiscontiRow)
        : [];
      setData(normalizedRows);

      if (normalizedRows.length === 0) {
        setError('No data found for the selected criteria');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch report data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [searchDate, selectedType, buildTabulatoRequestPayload]);

  const handleExport = useCallback(async () => {
    let exportRows = [];

    try {
      if (filteredData.length === 0) {
        setError('No data to export');
        return;
      }

      exportRows = filteredData.map((row) => ({
        ...row,
        importo: formatCurrency(row.importo),
        dataRisconto: formatDate(row.dataRisconto),
      }));

      await ExportService.exportToXLS(
        exportRows,
        'TabulatoRiscontiReport',
        COLUMNS
      );
    } catch (err) {
      try {
        ExportService.exportToCSV(exportRows, 'TabulatoRiscontiReport', COLUMNS);
      } catch (csvErr) {
        setError('Failed to export data');
      }
    }
  }, [filteredData]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleString('it-IT');
    } catch {
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
          Tabulato Risconti
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 344px 160px' }, justifyContent: { xs: 'stretch', md: 'space-between' }, alignItems: 'end', gap: 2, mb: 2 }}>

          <TextField
            label="* Data Risconto"
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />

          

          <FormControl size="small" fullWidth>

            <InputLabel>Tipo Risconti</InputLabel>
            <Select
              value={selectedType}
              label="Tipo Risconti"
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={optionsLoading || riscontiOptions.length === 0}
            >
              {riscontiOptions.map((option) => (
                <MenuItem key={option.key} value={option.key}>{option.value}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || optionsLoading || !selectedType}
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
            disabled={loading || filteredData.length === 0}
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
                        {column.key === 'dataRisconto'
                          ? formatDate(row[column.key])
                          : column.key === 'importo'
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
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={pageIndex}
                onChange={(e, value) => setPageIndex(value)}
                color="primary"
              />
            </Box>
          )}

          {/* Results Summary */}
          <Box sx={{ p: 2, textAlign: 'right', fontSize: '12px', color: '#666' }}>
            Showing {((pageIndex - 1) * ROWS_PER_PAGE) + 1} to{' '}
            {Math.min(pageIndex * ROWS_PER_PAGE, filteredData.length)} of {filteredData.length} results
          </Box>
        </Paper>
      )}

      {!loading && data.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: 'center', color: '#999' }}>
          No data available. Select filters and click <strong>CONFERMA</strong> to fetch reports.
        </Paper>
      )}
    </Box>
  );
}
