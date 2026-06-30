import { Avatar, Box, Button, Card, CardContent, Chip, Divider, FormControlLabel, Grid, LinearProgress, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { alpha } from '@mui/material/styles';

function PageShell({ screen, children }) {
  return (
    <Stack spacing={3.2}>
      <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 5, background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(245,249,255,0.9) 55%, rgba(227,236,255,0.92) 100%)', border: '1px solid rgba(9, 31, 77, 0.08)', position: 'relative', overflow: 'hidden', '&:before': { content: '""', position: 'absolute', inset: 'auto -80px -120px auto', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11,79,214,0.18) 0%, rgba(11,79,214,0) 70%)' } }}>
        <Stack spacing={1.1} sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.4, color: 'primary.main' }}>{screen.eyebrow}</Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 } }}>{screen.title}</Typography>
          <Typography sx={{ maxWidth: 860, fontSize: 15, color: 'text.secondary', lineHeight: 1.65 }}>{screen.subtitle}</Typography>
          <Stack direction="row" spacing={1.2} sx={{ pt: 0.8, flexWrap: 'wrap' }}>
            <Button variant="contained" endIcon={<ArrowForwardIcon />}>{screen.primaryAction}</Button>
            <Button variant="outlined">{screen.secondaryAction}</Button>
          </Stack>
        </Stack>
      </Paper>
      {children}
    </Stack>
  );
}

function MetricCard({ metric }) {
  const tone = { primary: '#0b4fd6', warning: '#d9831f', success: '#118d57', accent: '#071d4f' }[metric.tone || 'primary'];
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary' }}>{metric.label}</Typography>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h4" sx={{ fontSize: 30, color: tone }}>{metric.value}</Typography>
            <Chip size="small" label={metric.delta} sx={{ height: 24, fontWeight: 800, color: tone, backgroundColor: alpha(tone, 0.1) }} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function PanelCard({ title, subtitle, children, action }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 800 }}>{title}</Typography>
              {subtitle ? <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.4 }}>{subtitle}</Typography> : null}
            </Box>
            {action}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function DashboardLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}>
        {screen.metrics.map((metric) => <Grid key={metric.label} item xs={12} sm={6} xl={3}><MetricCard metric={metric} /></Grid>)}
      </Grid>
      <Grid container spacing={2.4}>
        <Grid item xs={12} xl={8}>
          <PanelCard title="Andamento giornaliero" subtitle="Lettura sintetica del flusso operativo.">
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.2, height: 220, pt: 2 }}>
              {screen.chartBands.map((height, index) => <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}><Box sx={{ height: `${height}%`, minHeight: 18, borderRadius: 2, background: 'linear-gradient(180deg, #0b4fd6 0%, #071d4f 100%)', boxShadow: '0 18px 32px rgba(7, 29, 79, 0.16)' }} /></Box>)}
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>{['Import', 'Validazione', 'Conferma', 'Archivio'].map((label, index) => <Chip key={label} label={label} sx={{ backgroundColor: index === 0 ? 'primary.main' : 'rgba(7,29,79,0.06)', color: index === 0 ? '#fff' : 'text.primary', fontWeight: 700 }} />)}</Stack>
          </PanelCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <PanelCard title="Attivit? recenti" subtitle="Ultime operazioni nel sistema." action={<InfoOutlinedIcon color="primary" />}>
            <Stack spacing={1.5}>{screen.activity.map((item) => <Box key={item} sx={{ p: 1.5, borderRadius: 3, backgroundColor: 'rgba(7,29,79,0.04)' }}><Typography sx={{ fontSize: 13.5, lineHeight: 1.6 }}>{item}</Typography></Box>)}</Stack>
          </PanelCard>
        </Grid>
      </Grid>
      <Grid container spacing={2.4}>{screen.highlights.map((highlight) => <Grid key={highlight.title} item xs={12} md={6}><Card><CardContent sx={{ p: 2.8 }}><Typography sx={{ fontSize: 14, fontWeight: 800, mb: 0.7 }}>{highlight.title}</Typography><Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.65 }}>{highlight.text}</Typography></CardContent></Card></Grid>)}</Grid>
    </PageShell>
  );
}

function TableLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}>
        <Grid item xs={12} xl={8}><PanelCard title="Filtri di ricerca" subtitle="Seleziona il perimetro di analisi."><Grid container spacing={1.5}>{screen.filters.map((filter) => <Grid key={filter.label} item xs={12} md={4}><TextField fullWidth label={filter.label} defaultValue={filter.value} /></Grid>)}</Grid></PanelCard></Grid>
        <Grid item xs={12} xl={4}><PanelCard title="Sintesi" subtitle="Indicatori di supporto alle decisioni."><Stack spacing={1.2}>{screen.summary.map((item) => <Stack key={item} direction="row" spacing={1.1} alignItems="center"><CheckCircleOutlineIcon color="success" fontSize="small" /><Typography sx={{ fontSize: 13.5 }}>{item}</Typography></Stack>)}</Stack></PanelCard></Grid>
      </Grid>
      <Card><CardContent sx={{ p: 0 }}><TableContainer><Table><TableHead><TableRow sx={{ backgroundColor: 'rgba(7,29,79,0.04)' }}><TableCell sx={{ fontWeight: 800 }}>ID</TableCell><TableCell sx={{ fontWeight: 800 }}>Oggetto</TableCell><TableCell sx={{ fontWeight: 800 }}>Stato</TableCell><TableCell sx={{ fontWeight: 800 }}>Owner</TableCell><TableCell align="right" sx={{ fontWeight: 800 }}>Importo</TableCell></TableRow></TableHead><TableBody>{screen.results.map((row) => <TableRow key={row.id} hover><TableCell>{row.id}</TableCell><TableCell>{row.object}</TableCell><TableCell><Chip size="small" label={row.state} sx={{ fontWeight: 700 }} /></TableCell><TableCell>{row.owner}</TableCell><TableCell align="right">{row.amount}</TableCell></TableRow>)}</TableBody></Table></TableContainer></CardContent></Card>
    </PageShell>
  );
}

function FormLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}>
        <Grid item xs={12} xl={8}><PanelCard title="Passaggi operativi" subtitle="La richiesta avanza in step sequenziali."><Stack spacing={1.2}>{screen.steps.map((step, index) => <Paper key={step.title} sx={{ p: 2, borderRadius: 3, backgroundColor: index === 0 ? 'rgba(11,79,214,0.08)' : 'rgba(7,29,79,0.03)' }}><Stack direction="row" spacing={2} alignItems="center"><Avatar sx={{ bgcolor: index === 0 ? 'primary.main' : 'rgba(7,29,79,0.14)', color: index === 0 ? '#fff' : 'text.primary', fontWeight: 800 }}>{index + 1}</Avatar><Box><Typography sx={{ fontSize: 14.5, fontWeight: 800 }}>{step.title}</Typography><Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{step.text}</Typography></Box></Stack></Paper>)}</Stack></PanelCard><PanelCard title="Campi principali" subtitle="Compilazione guidata e controlli inline."><Grid container spacing={1.6}>{['Codice pratica', 'Importo', 'Durata', 'Note operative'].map((label) => <Grid key={label} item xs={12} md={label === 'Note operative' ? 12 : 6}><TextField fullWidth label={label} /></Grid>)}</Grid></PanelCard></Grid>
        <Grid item xs={12} xl={4}><PanelCard title="Riepilogo" subtitle="Visibile mentre modifichi i dati."><Stack spacing={1.2}>{screen.summary.map((item) => <Box key={item} sx={{ p: 1.5, borderRadius: 3, backgroundColor: 'rgba(7,29,79,0.04)' }}><Typography sx={{ fontSize: 13.5 }}>{item}</Typography></Box>)}</Stack></PanelCard><PanelCard title="Checklist" subtitle="Controlli prima della conferma."><Stack spacing={1.1}>{screen.checklist.map((item) => <FormControlLabel key={item} control={<Switch defaultChecked />} label={item} />)}</Stack></PanelCard></Grid>
      </Grid>
    </PageShell>
  );
}

function DetailLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}>
        <Grid item xs={12} xl={8}><Grid container spacing={2.4}>{screen.facts.map((fact) => <Grid key={fact.label} item xs={12} sm={6}><MetricCard metric={{ label: fact.label, value: fact.value, delta: 'info', tone: 'accent' }} /></Grid>)}</Grid><PanelCard title="Cronologia" subtitle="Le tappe principali della pratica."><Stack spacing={1.2}>{screen.timeline.map((entry) => <Box key={entry} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', mt: 0.7, bgcolor: 'primary.main' }} /><Typography sx={{ fontSize: 14.5, lineHeight: 1.65 }}>{entry}</Typography></Box>)}</Stack></PanelCard></Grid>
        <Grid item xs={12} xl={4}><PanelCard title="Documenti allegati" subtitle="Lista sintetica delle evidenze disponibili."><Stack spacing={1.1}>{screen.attachments.map((item) => <Stack key={item} direction="row" alignItems="center" spacing={1.1} sx={{ p: 1.2, borderRadius: 3, backgroundColor: 'rgba(7,29,79,0.04)' }}><VerifiedOutlinedIcon color="primary" fontSize="small" /><Typography sx={{ fontSize: 13.5 }}>{item}</Typography></Stack>)}</Stack></PanelCard></Grid>
      </Grid>
    </PageShell>
  );
}

function TimelineLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}>{screen.milestones.map((milestone) => <Grid key={milestone.label} item xs={12} md={4}><Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary' }}>{milestone.label}</Typography><Typography sx={{ mt: 0.7, fontSize: 28, fontWeight: 800, color: 'primary.main' }}>{milestone.value}</Typography></CardContent></Card></Grid>)}</Grid>
      <Grid container spacing={2.4}><Grid item xs={12} xl={8}><PanelCard title="Cronoprogramma" subtitle="Eventi prioritari in sequenza temporale."><Stack spacing={1.4}>{screen.events.map((event, index) => <Box key={event.title} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}><Box sx={{ width: 14, height: 14, mt: 0.5, borderRadius: '50%', bgcolor: index === 0 ? 'error.main' : index === 1 ? 'warning.main' : 'primary.main' }} /><Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 14.5, fontWeight: 800 }}>{event.title}</Typography><Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{event.note}</Typography></Box><Chip size="small" label={event.tone} sx={{ textTransform: 'uppercase', fontWeight: 800 }} /></Box>)}</Stack></PanelCard></Grid><Grid item xs={12} xl={4}><PanelCard title="Osservazioni" subtitle="Punti da tenere sotto controllo."><Stack spacing={1.2}><Typography sx={{ fontSize: 14.5, lineHeight: 1.65 }}>Le scadenze critiche sono concentrate nella seconda met? della settimana.</Typography><LinearProgress variant="determinate" value={72} sx={{ height: 10, borderRadius: 999 }} /></Stack></PanelCard></Grid></Grid>
    </PageShell>
  );
}

function ExportLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}><Grid item xs={12} xl={8}><Grid container spacing={2.4}>{screen.exportCards.map((card) => <Grid key={card.title} item xs={12} md={4}><Card sx={{ height: '100%' }}><CardContent sx={{ p: 2.5 }}><Stack spacing={1.5}><DownloadOutlinedIcon color="primary" /><Typography sx={{ fontSize: 15, fontWeight: 800 }}>{card.title}</Typography><Typography sx={{ fontSize: 13.5, color: 'text.secondary', lineHeight: 1.65 }}>{card.text}</Typography></Stack></CardContent></Card></Grid>)}</Grid></Grid><Grid item xs={12} xl={4}><PanelCard title="Esportazioni recenti" subtitle="Storico delle ultime generazioni."><Stack spacing={1.2}>{screen.recentExports.map((item) => <Box key={item} sx={{ p: 1.3, borderRadius: 3, backgroundColor: 'rgba(7,29,79,0.04)' }}><Typography sx={{ fontSize: 13.5 }}>{item}</Typography></Box>)}</Stack></PanelCard></Grid></Grid>
    </PageShell>
  );
}

function SettingsLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}><Grid item xs={12} xl={8}><PanelCard title="Preferenze principali" subtitle="Controlli rapidi sulle aree pi? usate."><Stack spacing={1.5}>{screen.preferences.map((preference) => <Paper key={preference.title} sx={{ p: 2, borderRadius: 3, backgroundColor: 'rgba(7,29,79,0.04)' }}><Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}><Box><Typography sx={{ fontSize: 14.5, fontWeight: 800 }}>{preference.title}</Typography><Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{preference.text}</Typography></Box><Switch defaultChecked /></Stack></Paper>)}</Stack></PanelCard></Grid><Grid item xs={12} xl={4}><PanelCard title="Sicurezza" subtitle="Ultimo controllo e stato del profilo."><Stack spacing={1.2}><Typography sx={{ fontSize: 14.5 }}>Autenticazione MFA attiva.</Typography><Typography sx={{ fontSize: 14.5 }}>Sessione scaduta dopo 15 minuti.</Typography><Divider /><Button variant="outlined">Scarica policy</Button></Stack></PanelCard></Grid></Grid>
    </PageShell>
  );
}

function AuditLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}><Grid item xs={12} xl={8}><PanelCard title="Feed attivit?" subtitle="Eventi rilevanti ordinati per tempo."><Stack spacing={1.4}>{screen.feed.map((entry) => <Paper key={entry.time} sx={{ p: 2, borderRadius: 3, backgroundColor: 'rgba(7,29,79,0.04)' }}><Stack direction="row" justifyContent="space-between" spacing={1.5}><Box><Typography sx={{ fontSize: 14.5, fontWeight: 800 }}>{entry.actor}</Typography><Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>{entry.action}</Typography></Box><Chip label={entry.time} size="small" /></Stack></Paper>)}</Stack></PanelCard></Grid><Grid item xs={12} xl={4}><PanelCard title="Controlli" subtitle="Stato dei presidi principali."><Stack spacing={1.2}>{screen.controls.map((item) => <Stack key={item} direction="row" spacing={1.1} alignItems="center"><CheckCircleOutlineIcon color="success" fontSize="small" /><Typography sx={{ fontSize: 13.5 }}>{item}</Typography></Stack>)}</Stack></PanelCard></Grid></Grid>
    </PageShell>
  );
}

function ConfirmationLayout({ screen }) {
  return (
    <PageShell screen={screen}>
      <Grid container spacing={2.4}><Grid item xs={12} xl={8}><Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 5, background: 'linear-gradient(135deg, #071d4f 0%, #0b4fd6 100%)', color: '#fff' }}><Stack spacing={2.2}><Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', width: 64, height: 64 }}><CheckCircleOutlineIcon sx={{ fontSize: 34 }} /></Avatar><Box><Typography variant="h4" sx={{ color: '#fff', fontSize: { xs: 28, md: 36 } }}>{screen.title}</Typography><Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.82)', maxWidth: 680, lineHeight: 1.7 }}>{screen.subtitle}</Typography></Box><Stack direction="row" spacing={1.2} sx={{ flexWrap: 'wrap' }}><Button variant="contained" sx={{ backgroundColor: '#fff', color: 'primary.main', '&:hover': { backgroundColor: 'rgba(255,255,255,0.92)' } }}>{screen.primaryAction}</Button><Button variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>{screen.secondaryAction}</Button></Stack></Stack></Card></Grid><Grid item xs={12} xl={4}><PanelCard title="Prossimi passi" subtitle="Azioni suggerite dopo la conferma."><Stack spacing={1.1}>{screen.successItems.map((item) => <Stack key={item} direction="row" spacing={1.1} alignItems="center"><CheckCircleOutlineIcon color="success" fontSize="small" /><Typography sx={{ fontSize: 13.5, lineHeight: 1.55 }}>{item}</Typography></Stack>)}</Stack></PanelCard></Grid></Grid>
    </PageShell>
  );
}

export default function ScreenPage({ screen }) {
  switch (screen.mode) {
    case 'table': return <TableLayout screen={screen} />;
    case 'form': return <FormLayout screen={screen} />;
    case 'detail': return <DetailLayout screen={screen} />;
    case 'timeline': return <TimelineLayout screen={screen} />;
    case 'export': return <ExportLayout screen={screen} />;
    case 'settings': return <SettingsLayout screen={screen} />;
    case 'audit': return <AuditLayout screen={screen} />;
    case 'confirmation': return <ConfirmationLayout screen={screen} />;
    default: return <DashboardLayout screen={screen} />;
  }
}