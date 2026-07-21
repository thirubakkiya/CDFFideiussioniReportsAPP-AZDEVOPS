import { useState } from 'react';
import { Box } from '@mui/material';
import UpdatedLayout from './components/UpdatedLayout';
import SpeseNotaioReport from './components/reports/SpeseNotaioReport';
import TabulatoRiscontiReport from './components/reports/TabulatoRiscontiReport';
import ControlloSaldiReport from './components/reports/ControlloSaldiReport';
import OperazioniContabileReport from './components/reports/OperazioniContabileReport';
import AppFooter from './components/AppFooter';

const REPORT_LINKS = [
  {
    key: 'report-1',
    label: 'Report Spese Notaio',
    reportNumber: 1,
    firstPageKey: 'report-1',
  },
  {
    key: 'report-2',
    label: 'Controllo Saldi K5',
    reportNumber: 2,
    firstPageKey: 'report-2',
  },
  {
    key: 'report-3',
    label: 'Tabulato Risconti',
    reportNumber: 3,
    firstPageKey: 'report-3',
  },
  {
    key: 'report-4',
    label: 'Operazioni Contabile',
    reportNumber: 4,
    firstPageKey: 'report-4',
  },
];


export default function App() {
  const [currentReport, setCurrentReport] = useState(1);

  const handleReportLinkClick = (firstPageKey) => {
    const report = REPORT_LINKS.find(r => r.firstPageKey === firstPageKey);
    if (report) {
      setCurrentReport(report.reportNumber);
    }
  };

  // Get bank ID from localStorage
  const idBanca = localStorage.getItem('idBanca') || '1';

  const renderReport = () => {
    switch (currentReport) {
      case 1:
        return <SpeseNotaioReport idBanca={idBanca} />;
      case 2:
        return <ControlloSaldiReport idBanca={idBanca} />;
      case 3:
        return <TabulatoRiscontiReport idBanca={idBanca} />;
      case 4:
        return <OperazioniContabileReport idBanca={idBanca} />;
      default:
        return <SpeseNotaioReport idBanca={idBanca} />;
    }
  };

  return (
    <UpdatedLayout
      reportLinks={REPORT_LINKS}
      currentReportNumber={currentReport}
      onReportLinkClick={handleReportLinkClick}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F5F5F5',
        }}
      >
        {renderReport()}
        <Box sx={{ mt: 'auto' }}>
          <AppFooter
            reportLabel={REPORT_LINKS[currentReport - 1]?.label}
            designName="Fideiussioni Report"
          />
        </Box>
      </Box>
    </UpdatedLayout>
  );
}