import React, { useState, useCallback, useMemo } from 'react';
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

const ROWS_PER_PAGE = 10;
const OPERAZIONI_TYPES = ['TUTTI', 'ADDEBITO', 'ACCREDITO', 'RETTIFICA'];

const COLUMNS = [
  { header: 'Data Calcolo', key: 'dataCalcolo', width: '15%' },
  { header: 'Numero Conto', key: 'numeroConto', width: '18%' },
  { header: 'Divisa', key: 'divisa', width: '10%' },
  { header: 'Denominazione', key: 'denominazione', width: '20%' },
  { header: 'Importo Archivio', key: 'importoArchivio', width: '15%' },
  { header: 'Saldo Contabile', key: 'saldoContabile', width: '15%' },
  { header: 'Tipo Operazione', key: 'stato', width: '12%' },
];

export default function OperazioniContabileReport({ idBanca }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState('TUTTI');
  const [contoAddebito, setContoAddebito] = useState('');
  const [executionDate, setExecutionDate] = useState('');
  const [pageIndex, setPageIndex] = useState(1);

  // Filter data based on selected type
  const filteredData = useMemo(() => {
    if (selectedType === 'TUTTI') {
      return data;
    }
    return data.filter(row => row.stato === selectedType);
  }, [data, selectedType]);

  const totalPages = Math.max(Math.ceil(filteredData.length / ROWS_PER_PAGE), 1);
  const visibleRows = useMemo(() => {
    const start = (pageIndex - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [filteredData, pageIndex]);

  const handleSearch = useCallback(async () => {
    if (!contoAddebito || !executionDate) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setPageIndex(1);

    try {
      const request = {
        bancaId: idBanca || localStorage.getItem('idBanca'),
        contoAddebito: contoAddebito,
        executionDate: executionDate,
        stato: selectedType !== 'TUTTI' ? selectedType : null,
      };

      const result = await ReportsService.getOperazioniContabileReport(request);
      setData(result || []);

      if ((!result || result.length === 0)) {
        setError('No data found for the selected criteria');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch report data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [contoAddebito, executionDate, selectedType, idBanca]);

  const handleExport = useCallback(async () => {
    try {
      if (data.length === 0) {
        setError('No data to export');
        return;
      }

      await ExportService.exportToXLS(data, 'OperazioniContabileReport', COLUMNS);
    } catch (err) {
      try {
        ExportService.exportToCSV(data, 'OperazioniContabileReport', COLUMNS);
      } catch (csvErr) {
        setError('Failed to export data');
      }
    }
  }, [data]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
      {/* Filter Panel */}
      <Paper sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #d6dbea' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
          <TextField
            label="Conto Addebito"
            type="text"
            value={contoAddebito}
            onChange={(e) => setContoAddebito(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Execution Date"
            type="date"
            value={executionDate}
            onChange={(e) => setExecutionDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Tipo Operazione</InputLabel>
            <Select
              value={selectedType}
              label="Tipo Operazione"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {OPERAZIONI_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
              sx={{ backgroundColor: '#0f3aa5', color: 'white' }}
              fullWidth
            >
              {loading ? 'Loading...' : 'Search'}
            </Button>
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
          No data available. Enter search criteria and click Search to fetch reports.
        </Paper>
      )}
    </Box>
  );
}
