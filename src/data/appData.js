import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

export const navigationItems = [
  { path: '/', label: 'Dashboard', icon: DashboardOutlinedIcon },
  { path: '/ricerca', label: 'Ricerca', icon: SearchOutlinedIcon },
  { path: '/richieste', label: 'Richieste', icon: AssignmentOutlinedIcon },
  { path: '/dettaglio', label: 'Dettaglio', icon: DescriptionOutlinedIcon },
  { path: '/scadenze', label: 'Scadenze', icon: EventOutlinedIcon },
  { path: '/export', label: 'Export', icon: DownloadOutlinedIcon },
  { path: '/impostazioni', label: 'Impostazioni', icon: TuneOutlinedIcon },
  { path: '/audit', label: 'Audit', icon: FactCheckOutlinedIcon },
  { path: '/conferma', label: 'Conferma', icon: TaskAltOutlinedIcon },
];

const baseInfo = {
  clientName: 'Banca Sella Holding',
  portfolioName: 'CDF - Fideiussioni Reports',
  reportDate: '29 giugno 2026',
  user: 'M. Rossi',
  role: 'Operations',
};

export const screenCatalog = {
  dashboard: {
    ...baseInfo,
    mode: 'dashboard',
    eyebrow: 'Home',
    title: 'Pannello di controllo',
    subtitle: 'Panoramica operativa con KPI, alert e attivit? recenti.',
    primaryAction: 'Nuovo report',
    secondaryAction: 'Esporta sintesi',
    metrics: [
      { label: 'Pratiche aperte', value: '128', delta: '+12%', tone: 'primary' },
      { label: 'Scadenze in 7 giorni', value: '24', delta: '-3%', tone: 'warning' },
      { label: 'Esiti positivi', value: '94%', delta: '+1.4%', tone: 'success' },
      { label: 'Documenti archiviati', value: '1.248', delta: '+86', tone: 'accent' },
    ],
    chartBands: [22, 34, 48, 40, 62, 52, 78, 70, 86, 74, 94, 88],
    activity: [
      'Import dati completato per lotto 24-06.',
      '7 pratiche richiedono validazione manuale.',
      'Nuove esportazioni programmate per le 18:30.',
    ],
    highlights: [
      { title: 'Focus odierno', text: 'Priorit? alle posizioni in lavorazione con scadenza entro 72 ore.' },
      { title: 'Rilevazioni', text: 'Nessun errore bloccante negli ultimi due cicli di pubblicazione.' },
    ],
  },
  ricerca: {
    ...baseInfo,
    mode: 'table',
    eyebrow: 'Ricerca',
    title: 'Interroga posizioni e pratiche',
    subtitle: 'Filtri rapidi e risultati strutturati per operare senza perdere il contesto.',
    primaryAction: 'Avvia ricerca',
    secondaryAction: 'Salva filtro',
    filters: [
      { label: 'Stato', value: 'Aperto' },
      { label: 'Periodo', value: 'Ultimi 90 giorni' },
      { label: 'Canale', value: 'Tutti' },
    ],
    results: [
      { id: 'RB-23041', object: 'Fideiussione IVA', state: 'In lavorazione', owner: 'Back office', amount: '€ 120.000' },
      { id: 'RB-23028', object: 'Rimborso imposte', state: 'Validata', owner: 'Operations', amount: '€ 75.500' },
      { id: 'RB-23017', object: 'Una tantum', state: 'In attesa', owner: 'Front office', amount: '€ 19.200' },
    ],
    summary: ['3 risultati in evidenza', '1 filtro salvato', '2 record con documentazione incompleta'],
  },
  richieste: {
    ...baseInfo,
    mode: 'form',
    eyebrow: 'Nuova richiesta',
    title: 'Compila una pratica guidata',
    subtitle: 'Sequenza di acquisizione dati con riepilogo laterale sempre visibile.',
    primaryAction: 'Salva bozza',
    secondaryAction: 'Prosegui',
    steps: [
      { title: 'Anagrafica', text: 'Dati cliente e contatti.' },
      { title: 'Parametri', text: 'Durata, massimali e condizioni.' },
      { title: 'Allegati', text: 'Documenti richiesti e note.' },
    ],
    checklist: ['Anagrafica valida', 'Parametri compilati', 'Allegati presenti', 'Firma digitale pronta'],
    summary: ['Stato bozza', 'Ultimo salvataggio 2 minuti fa', '3 campi obbligatori rimanenti'],
  },
  dettaglio: {
    ...baseInfo,
    mode: 'detail',
    eyebrow: 'Dettaglio pratica',
    title: 'Vista completa della posizione',
    subtitle: 'Anagrafica, stato avanzamento e documenti collegati nella stessa schermata.',
    primaryAction: 'Apri allegati',
    secondaryAction: 'Stampa',
    facts: [
      { label: 'Cliente', value: 'Sella S.p.A.' },
      { label: 'Pratica', value: 'RT-48392' },
      { label: 'Importo', value: '€ 240.000' },
      { label: 'Stato', value: 'Confermato' },
    ],
    timeline: ['09:20 - Dati importati dal sistema sorgente.', '11:05 - Validazione completata dal back office.', '15:40 - Documento firmato e archiviato.'],
    attachments: ['Mandato firmato', 'Visura aggiornata', 'Documento identit?'],
  },
  scadenze: {
    ...baseInfo,
    mode: 'timeline',
    eyebrow: 'Scadenze',
    title: 'Controllo delle priorit?',
    subtitle: 'Vista temporale dei prossimi eventi, con blocchi ad alta urgenza evidenziati.',
    primaryAction: 'Aggiorna calendario',
    secondaryAction: 'Condividi',
    milestones: [
      { label: 'Oggi', value: '6 attivit? critiche' },
      { label: 'Domani', value: '4 verifiche in corso' },
      { label: '7 giorni', value: '24 milestone in attesa' },
    ],
    events: [
      { title: 'Scadenza pagamento', note: 'Entro le 14:30', tone: 'error' },
      { title: 'Rilascio lotto', note: 'Programmata alle 18:00', tone: 'warning' },
      { title: 'Revisione periodica', note: 'Priorit? media', tone: 'primary' },
    ],
  },
  export: {
    ...baseInfo,
    mode: 'export',
    eyebrow: 'Export',
    title: 'Distribuisci i report',
    subtitle: 'Pacchetti di esportazione pronti per Excel, PDF o invio programmato.',
    primaryAction: 'Genera file',
    secondaryAction: 'Crea schedule',
    exportCards: [
      { title: 'Excel multi-sheet', text: 'Raggruppa riepiloghi e dettaglio in un unico pacchetto.' },
      { title: 'CSV operativo', text: 'Formato leggero per il caricamento su altri sistemi.' },
      { title: 'PDF firmato', text: 'Stampa con branding e dati di audit.' },
    ],
    recentExports: ['Report mensile - 08:12', 'Estrazione scadenze - 10:40', 'Consolidato area nord - 11:15'],
  },
  impostazioni: {
    ...baseInfo,
    mode: 'settings',
    eyebrow: 'Configurazione',
    title: 'Preferenze applicative',
    subtitle: 'Tutte le impostazioni principali raccolte in una vista leggibile e coerente.',
    primaryAction: 'Salva modifiche',
    secondaryAction: 'Ripristina',
    preferences: [
      { title: 'Notifiche', text: 'Avvisi email e alert in-app attivi.' },
      { title: 'Sicurezza', text: 'Sessione bloccata dopo 15 minuti di inattivit?.' },
      { title: 'Layout', text: 'Navigazione espandibile e area contenuti ampia.' },
    ],
  },
  audit: {
    ...baseInfo,
    mode: 'audit',
    eyebrow: 'Audit',
    title: 'Traccia le attivit?',
    subtitle: 'Registro degli ultimi eventi di sistema e degli utenti con accesso alle funzioni principali.',
    primaryAction: 'Esporta log',
    secondaryAction: 'Filtra eventi',
    feed: [
      { actor: 'M. Rossi', action: 'ha validato una pratica', time: '09:45' },
      { actor: 'Sistema', action: 'ha completato un import batch', time: '10:20' },
      { actor: 'A. Verdi', action: 'ha scaricato un export PDF', time: '11:02' },
    ],
    controls: ['Accessi monitorati', 'Rollback disponibile', 'Ultimo controllo 5 min fa'],
  },
  conferma: {
    ...baseInfo,
    mode: 'confirmation',
    eyebrow: 'Esito',
    title: 'Operazione completata',
    subtitle: 'Messaggio di conferma con azioni rapide per archiviare, stampare o continuare il flusso.',
    primaryAction: 'Scarica ricevuta',
    secondaryAction: 'Nuova operazione',
    successItems: ['La richiesta ? stata salvata con successo.', 'Il documento ? disponibile in archivio.', 'Puoi continuare con la pratica successiva.'],
  },
};