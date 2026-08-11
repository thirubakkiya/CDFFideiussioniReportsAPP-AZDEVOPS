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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReportsService from '../../services/ReportsService';
import ExportService from '../../services/ExportService';
import { formatDateForApi } from '../../utils/dateUtils';

const ROWS_PER_PAGE = 10;

const COLUMNS = [
  { header: 'Numero Ordine', key: 'numeroOrdine', width: '10%' },
  { header: 'Numero Conto', key: 'numeroConto', width: '12%' },
  { header: 'Data', key: 'data', width: '10%' },
  { header: 'Divisa', key: 'divisa', width: '8%' },
  { header: 'Importo', key: 'importo', width: '12%' },
  { header: 'Importo Archivio', key: 'importoArchivio', width: '12%' },
  { header: 'Saldo', key: 'saldo', width: '10%' },
  { header: 'Data Fine', key: 'dataFine', width: '10%' },
  { header: 'Natura', key: 'natura', width: '8%' },
];

export default function OperazioniContabileReport({ idBanca }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  // Form fields - EXACT from Figma design
  const [dataEsecuzione, setDataEsecuzione] = useState('');
  const [ottoCifre, setOttoCifre] = useState('');
  const [numeroGaranzia, setNumeroGaranzia] = useState('');
  const [stato, setStato] = useState('Esaurito');
  const [operazioneContabile, setOperazioneContabile] = useState('Tutti');
  const [contoInterno, setContoInterno] = useState('Tutti');

  const totalPages = Math.max(Math.ceil(data.length / ROWS_PER_PAGE), 1);
  const visibleRows = useMemo(() => {
    const start = (pageIndex - 1) * ROWS_PER_PAGE;
    return data.slice(start, start + ROWS_PER_PAGE);
  }, [data, pageIndex]);

  const handleSearch = useCallback(async () => {
    if (!dataEsecuzione) {
      setError('Please fill all required fields - Data Esecuzione is mandatory');
      return;
    }

    setLoading(true);
    setError(null);
    setPageIndex(1);

    try {
      // dataEsecuzione is stored as YYYY-MM-DD internally
      // Convert to dd/MM/yyyy for API
      const formattedDate = formatDateForApi(dataEsecuzione);
      console.log(`?? Date in API format: ${formattedDate}`);
      
      const request = {
        bancaId: idBanca || localStorage.getItem('idBanca'),
        dataEsecuzione: formattedDate,
        ottoCifre: ottoCifre,
        numeroGaranzia: numeroGaranzia,
        stato: stato,
        operazioneContabile: operazioneContabile,
        contoInterno: contoInterno,
      };

      console.log('?? Sending request to API:', request);
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
  }, [dataEsecuzione, ottoCifre, numeroGaranzia, stato, operazioneContabile, contoInterno, idBanca]);

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

  // Sidebar navigation items
  const sidebarItems = [
    { label: 'Elaborazione', icon: '?' },
    { label: 'Input Banca Iniziale', icon: '?' },
    { label: 'Commette (s)', icon: '?' },
    { label: 'Fatture Fornitori', icon: '?' },
    { label: 'Operazioni Contabile', icon: '?' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {/* Top Section with Sidebar and Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
       

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header with "Crediti Di Firma" */}
          <Paper
            sx={{
              p: 2,
              backgroundColor: '#e8f0ff',
              textAlign: 'center',
              fontWeight: 700,
              color: '#0f3aa5',
              fontSize: '16px',
              border: '1px solid #d6dbea',
              borderBottom: '2px solid #0f3aa5',
            }}
          >
            Crediti Di Firma
          </Paper>

          {/* Form Section */}
          <Paper
            sx={{
              m: 2,
              p: 2,
              backgroundColor: '#ffffff',
              border: '1px solid #d6dbea',
              flex: 0,
            }}
          >
            <Box sx={{ fontSize: '16px', fontWeight: 600, color: '#0f3aa5', mb: 2 }}>
              Operazioni Contabile
            </Box>

            {/* 2-Column Form Grid - EXACT from Figma */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 3 }}>
              {/* Left Column - Text and Date Inputs */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="* Data Esecuzione"
                  type="date"
                  value={dataEsecuzione}
                  onChange={(e) => setDataEsecuzione(e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Otto Cifre"
                  type="text"
                  value={ottoCifre}
                  onChange={(e) => setOttoCifre(e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                  inputProps={{ placeholder: '61112866' }}
                />
                <TextField
                  label="Numero Garanzia"
                  type="text"
                  value={numeroGaranzia}
                  onChange={(e) => setNumeroGaranzia(e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                  inputProps={{ placeholder: 'I' }}
                />
              </Box>

              {/* Right Column - Dropdowns */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Stato</InputLabel>
                  <Select
                    value={stato}
                    label="Stato"
                    onChange={(e) => setStato(e.target.value)} 
                  >
                    <MenuItem value="Esaurito">Esaurito</MenuItem>
                    <MenuItem value="Non Esaurito">Non Esaurito</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel>Operazione Contabile</InputLabel>
                  <Select
                    value={operazioneContabile}
                    label="Operazione Contabile"
                    onChange={(e) => setOperazioneContabile(e.target.value)}
                  >
                    <MenuItem value="Tutti">Tutti</MenuItem>
                    <MenuItem value="ADDEBITO">ADDEBITO</MenuItem>
                    <MenuItem value="ACCREDITO">ACCREDITO</MenuItem>
                    <MenuItem value="RETTIFICA">RETTIFICA</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel>Conto Interno</InputLabel>
                  <Select
                    value={contoInterno}
                    label="Conto Interno"
                    onChange={(e) => setContoInterno(e.target.value)}
                  >
                    <MenuItem value="Tutti">Tutti</MenuItem>
                    <MenuItem value="Conto1">Conto 1</MenuItem>
                    <MenuItem value="Conto2">Conto 2</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Action Buttons - EXACT from Figma */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => window.history.back()    }
                sx={{
                  borderColor: '#0f3aa5',
                  color: '#0f3aa5',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { 
                    backgroundColor: '#e8f0ff',
                    borderColor: '#0f3aa5',
                  },
                }}
              >
                INDIETRO
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  backgroundColor: '#0f3aa5',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { backgroundColor: '#0d2d7e' },
                }}
              >
                CONFERMA
              </Button>
            </Box>

            {error && (
              <Alert
                severity="error"
                onClose={() => setError(null)}
                sx={{ mt: 2 }}
              >
                {error}
              </Alert>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, mt: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>

          {/* Results Table Section */}
          {!loading && data.length > 0 && (
            <Paper
              sx={{
                m: 2,
                mt: 0,
                backgroundColor: '#ffffff',
                border: '1px solid #d6dbea',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader size="small">
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
                            padding: '8px',
                            fontSize: '12px',
                          }}
                        >
                          {column.header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleRows.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                      >
                        {COLUMNS.map((column) => (
                          <TableCell
                            key={column.key}
                            sx={{
                              padding: '8px',
                              borderBottom: '1px solid #e4e8f3',
                              fontSize: '11px',
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderTop: '1px solid #e4e8f3',
                }}
              >
                <Box sx={{ fontSize: '12px', color: '#666' }}>
                  Showing {((pageIndex - 1) * ROWS_PER_PAGE) + 1} to{' '}
                  {Math.min(pageIndex * ROWS_PER_PAGE, data.length)} of {data.length} results
                </Box>
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={pageIndex}
                    onChange={(e, value) => setPageIndex(value)}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>
            </Paper>
          )}

          {!loading && data.length === 0 && !error && (
            <Box
              sx={{
                m: 2,
                p: 4,
                textAlign: 'center',
                color: '#999',
                backgroundColor: '#ffffff',
                border: '1px solid #d6dbea',
              }}
            >
              No data available. Enter search criteria and click Continue to fetch reports.
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
