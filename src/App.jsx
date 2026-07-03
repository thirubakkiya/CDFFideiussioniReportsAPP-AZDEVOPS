import { useMemo, useState } from 'react';
import ActionRow from './components/ActionRow';
import AppFooter from './components/AppFooter';
import FilterPanel from './components/FilterPanel';
import LeftNav from './components/LeftNav';
import ResultPanel from './components/ResultPanel';
import SubheaderRow from './components/SubheaderRow';

const NODE_IDS = [
  '75-3026',
  '75-3025',
  '75-2989',
  '75-2966',
  '75-1617',
  '75-1596',
  '75-1585',
  '75-1623',
  '75-1624',
  '57-4076',
  '75-1577',
  '75-875',
  '75-861',
  '75-822',
  '57-4095',
  '75-876',
  '75-3003',
  '75-834',
  '75-3027',
  '75-811',
  '57-4096',
  '1-1447',
  '57-4083',
  '57-4064',
  '75-2977',
  '57-4094',
  '57-4081',
  '75-1625',
  '57-4051',
  '75-1565',
  '57-4082',
];

const ROWS_PER_PAGE = 8;

const REPORT_META = {
  1: {
    label: 'Report Spese Notaio',
    headingPrefix: 'Report Spese Notaio',
    sectionPrefix: 'Risultato Spese Notaio',
    filterLabel: '* Tipo Report',
    filterOptions: ['TUTTI', 'ATTO', 'IMPOSTA', 'ONORARIO'],
    primaryButton: 'SCARICA REPORT',
  },
  2: {
    label: 'Controllo Saldi',
    headingPrefix: 'Controllo Saldi',
    sectionPrefix: 'Quadratura Risultato',
    filterLabel: '* Tipo Controllo',
    filterOptions: ['TUTTI', 'SCOSTAMENTO', 'QUADRATO', 'DA VERIFICARE'],
    primaryButton: 'CONFERMA',
  },
  3: {
    label: 'Tabulato Risconti Report',
    headingPrefix: 'Tabulato Risconti Report',
    sectionPrefix: 'Risultato Risconti',
    filterLabel: '* Tipo Riscontro',
    filterOptions: ['TUTTI', 'DA RISCONTRARE', 'RISCONTRATO', 'ANOMALIA'],
    primaryButton: 'APPLICA',
  },
  4: {
    label: 'Operazioni Contabile',
    headingPrefix: 'Operazioni Contabile',
    sectionPrefix: 'Operazioni Contabili',
    filterLabel: '* Tipo Operazione',
    filterOptions: ['TUTTI', 'ADDEBITO', 'ACCREDITO', 'RETTIFICA'],
    primaryButton: 'CONFERMA',
  },
};

const DESIGN_NAMES = {
  '75-3026': 'Fideiussione - Dashboard',
  '75-3025': 'Fideiussione - Elenco Pratiche',
  '75-2989': 'Fideiussione - Dettaglio Pratica',
  '75-2966': 'Fideiussione - Verifica Coperture',
  '75-1617': 'Fideiussione - Esito Controlli',
  '75-1596': 'Fideiussione - Riconciliazione',
  '75-1585': 'Fideiussione - Scostamenti',
  '75-1623': 'Fideiussione - Riepilogo Finale',
  '75-1624': 'Report Spese Notaio - Selezione',
  '57-4076': 'Report Spese Notaio - Risultati',
  '75-1577': 'Report Spese Notaio - Dettaglio',
  '75-1554': 'Report Spese Notaio - Esportazione',
  '75-875': 'Report Spese Notaio - Filtri Avanzati',
  '75-861': 'Report Spese Notaio - Confronto',
  '75-822': 'Report Spese Notaio - Riconciliazione',
  '57-4095': 'Report Spese Notaio - Chiusura',
  '75-876': 'Controllo Saldi K5 - Selezione',
  '75-3003': 'Controllo Saldi K5 - Quadratura',
  '75-834': 'Controllo Saldi K5 - Scostamenti',
  '75-3027': 'Controllo Saldi K5 - Dettaglio Conto',
  '75-811': 'Controllo Saldi K5 - Validazione',
  '57-4096': 'Controllo Saldi K5 - Esiti',
  '1-1447': 'Controllo Saldi K5 - Storico',
  '57-4083': 'Controllo Saldi K5 - Chiusura',
  '57-4064': 'Risultati Riscontri - Dashboard',
  '75-2977': 'Risultati Riscontri - Elenco',
  '57-4094': 'Risultati Riscontri - Dettaglio',
  '57-4081': 'Risultati Riscontri - Scostamenti',
  '75-1625': 'Differenze Contabili - Selezione',
  '57-4051': 'Differenze Contabili - Risultato',
  '75-1565': 'Differenze Contabili - Analisi',
  '57-4082': 'Differenze Contabili - Chiusura',
};

const NODE_INSPECT = {
  '75-3026': { layer: 'Text Field', width: 202, height: 50 },
  '75-3025': { layer: 'Pagination / Standard', width: 308, height: 40 },
  '75-2989': { layer: 'Frame 216', width: 1498, height: 331 },
  '75-2966': { layer: 'Base', width: 1920, height: 1074 },
  '75-1617': { layer: 'Frame 214', width: 1887, height: 46 },
  '75-1596': { layer: 'Frame 215', width: 1894, height: 465 },
  '75-1585': { layer: 'elenco', width: 344, height: 141 },
  '75-1623': { layer: 'Pagination / Standard', width: 308, height: 35 },
  '57-4076': { layer: 'Report Spese Notaio', width: 1537, height: 194 },
  '75-1624': { layer: 'Text Field', width: 202, height: 45 },
  '75-1577': { layer: 'Frame 191', width: 1494, height: 257 },
  '75-1554': { layer: 'Unavailable', invalid: true },
  '75-875': { layer: 'Provided by user', width: 64, height: 14 },
  '75-861': { layer: 'Frame 195', width: 1464, height: 613 },
  '75-822': { layer: 'Standard Widget / List', width: 275, height: 305 },
  '57-4095': { layer: 'Pagination / Standard', width: 308, height: 40 },
  '75-876': { layer: 'Subheader-homeIstruttoria', width: 1851, height: 35 },
  '75-3003': { layer: 'Frame 217', width: 1875, height: 470 },
  '75-834': { layer: 'Frame 190', width: 1464, height: 258 },
  '75-3027': { layer: 'Button CTA', width: 80, height: 14 },
  '75-811': { layer: 'Base', width: 1901, height: 1063 },
  '57-4096': { layer: 'Text Field', width: 202, height: 50 },
  '1-1447': { layer: 'Button with Icons', width: 197, height: 50 },
  '57-4083': { layer: 'Frame 194', width: 1537, height: 565 },
  '57-4064': { layer: 'Standard Widget / List', width: 275, height: 292 },
  '75-2977': { layer: 'Standard Widget / List', width: 275, height: 252 },
  '57-4094': { layer: 'Button with Icons', width: 197, height: 50 },
  '57-4081': { layer: 'Button CTA', width: 80, height: 14 },
  '75-1625': { layer: 'Button CTA', width: 80, height: 10 },
  '57-4051': { layer: 'Group 122', width: 1920, height: 1189 },
  '75-1565': { layer: 'Standard Widget / List', width: 275, height: 212 },
  '57-4082': { layer: 'Provided by user', width: 312, height: 26 },
};

function buildRows(nodeId, reportNumber, designNumber, filterOptions) {
  const statusOptions = filterOptions.slice(1);

  return Array.from({ length: 26 }).map((_, index) => {
    const accountNumber = `${reportNumber}${designNumber}${String(index + 1).padStart(3, '0')}210`;
    const sign = index % 4 === 0 ? '-' : '';
    const baseAmount = 12000 + reportNumber * 1500 + designNumber * 280 + index * 115;
    const status = statusOptions[index % statusOptions.length];

    return {
      dataCalcolo: `29/${String(8 + (index % 2)).padStart(2, '0')}/2025`,
      numeroConto: `${reportNumber}9KS${accountNumber}`,
      divisa: 'EUR',
      denominazione: `Ragione sociale ${String(index + 1).padStart(2, '0')}`,
      oltre: `${accountNumber}`,
      importoArchivio: `${sign}${baseAmount.toLocaleString('it-IT')},00`,
      saldoContabile: `${sign}${(baseAmount + 20).toLocaleString('it-IT')},00`,
      stato: status,
    };
  });
}

const PAGE_ITEMS = NODE_IDS.map((nodeId, index) => {
  const reportNumber = Math.floor(index / 8) + 1;
  const designNumber = index + 1;
  const key = `node-${nodeId}`;
  const reportMeta = REPORT_META[reportNumber] ?? REPORT_META[1];
  const defaultDesignName = `${reportMeta.label} - Design ${String((index % 8) + 1).padStart(2, '0')}`;
  const resolvedDesignName = DESIGN_NAMES[nodeId] ?? defaultDesignName;

  return {
    key,
    nodeId,
    reportNumber,
    designNumber,
    reportLabel: reportMeta.label,
    designName: resolvedDesignName,
    menuLabel: resolvedDesignName,
    heading: `${reportMeta.headingPrefix} - ${resolvedDesignName}`,
    sectionTitle: `${reportMeta.sectionPrefix}`,
    date: '29/08/2025',
    inspect: NODE_INSPECT[nodeId] ?? null,
    filterLabel: reportMeta.filterLabel,
    filterOptions: reportMeta.filterOptions,
    buttonPrimary: reportMeta.primaryButton,
    buttonSecondary: 'INDIETRO',
    rows: buildRows(nodeId, reportNumber, designNumber, reportMeta.filterOptions),
  };
});

const FIRST_REPORT_KEY = PAGE_ITEMS[0].key;
const PAGE_MAP = PAGE_ITEMS.reduce((accumulator, item) => {
  accumulator[item.key] = item;
  return accumulator;
}, {});

const REPORT_LINKS = [1, 2, 3, 4].map((reportNumber) => {
  const firstItem = PAGE_ITEMS.find((item) => item.reportNumber === reportNumber);
  const reportMeta = REPORT_META[reportNumber] ?? REPORT_META[1];
  return {
    key: `report-${reportNumber}`,
    label: reportMeta.label,
    firstPageKey: firstItem ? firstItem.key : FIRST_REPORT_KEY,
    reportNumber,
  };
});

export default function App() {
  const [activePage, setActivePage] = useState(FIRST_REPORT_KEY);
  const [selectedType, setSelectedType] = useState(PAGE_MAP[FIRST_REPORT_KEY].filterOptions[0]);
  const [pageIndex, setPageIndex] = useState(1);

  const currentPage = useMemo(() => {
    return PAGE_MAP[activePage] ?? PAGE_MAP[FIRST_REPORT_KEY];
  }, [activePage]);

  const filteredRows = useMemo(() => {
    if (selectedType === currentPage.filterOptions[0]) {
      return currentPage.rows;
    }
    return currentPage.rows.filter((row) => row.stato === selectedType);
  }, [currentPage.filterOptions, currentPage.rows, selectedType]);

  const totalPages = Math.max(Math.ceil(filteredRows.length / ROWS_PER_PAGE), 1);
  const normalizedPage = Math.min(pageIndex, totalPages);
  const rowPaginationWindow = buildPaginationWindow(normalizedPage, totalPages);

  const visibleRows = useMemo(() => {
    const start = (normalizedPage - 1) * ROWS_PER_PAGE;
    return filteredRows.slice(start, start + ROWS_PER_PAGE);
  }, [filteredRows, normalizedPage]);

  const handleReportLinkClick = (firstPageKey) => {
    const targetPage = PAGE_MAP[firstPageKey] ?? PAGE_MAP[FIRST_REPORT_KEY];
    setActivePage(firstPageKey);
    setSelectedType(targetPage.filterOptions[0]);
    setPageIndex(1);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setPageIndex(1);
  };

  const goToPreviousResultPage = () => setPageIndex((previous) => Math.max(previous - 1, 1));
  const goToNextResultPage = () => setPageIndex((previous) => Math.min(previous + 1, totalPages));

  return (
    <div className="cdf-page">
      <SubheaderRow
        reportLabel={currentPage.reportLabel}
        designName={currentPage.designName}
        date="29/08/2025"
      />

      <div className="main-shell">
        <LeftNav
          reportLinks={REPORT_LINKS}
          currentReportNumber={currentPage.reportNumber}
          onReportLinkClick={handleReportLinkClick}
        />

        <section className="content-area">
          <FilterPanel
            heading={currentPage.heading}
            date={currentPage.date}
            filterLabel={currentPage.filterLabel}
            filterOptions={currentPage.filterOptions}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
          />

          <ActionRow secondaryLabel={currentPage.buttonSecondary} primaryLabel={currentPage.buttonPrimary} />

          <ResultPanel
            sectionTitle={currentPage.sectionTitle}
            visibleRows={visibleRows}
            normalizedPage={normalizedPage}
            totalPages={totalPages}
            filteredRowsCount={filteredRows.length}
            rowPaginationWindow={rowPaginationWindow}
            onPrevious={goToPreviousResultPage}
            onNext={goToNextResultPage}
            onPageSelect={setPageIndex}
          />
        </section>
      </div>

      <AppFooter reportLabel={currentPage.reportLabel} designName={currentPage.designName} />
    </div>
  );
}

function buildPaginationWindow(currentPage, totalPages) {
  const pageCount = Math.max(totalPages, 1);
  const current = Math.min(Math.max(currentPage, 1), pageCount);
  const start = Math.max(1, current - 2);
  const end = Math.min(pageCount, start + 4);
  const normalizedStart = Math.max(1, end - 4);

  return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
}