import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './layout/AppShell';
import ScreenPage from './components/ScreenPage';
import { screenCatalog } from './data/appData';

const routeMap = [
  { path: '/', key: 'dashboard' },
  { path: '/ricerca', key: 'ricerca' },
  { path: '/richieste', key: 'richieste' },
  { path: '/dettaglio', key: 'dettaglio' },
  { path: '/scadenze', key: 'scadenze' },
  { path: '/export', key: 'export' },
  { path: '/impostazioni', key: 'impostazioni' },
  { path: '/audit', key: 'audit' },
  { path: '/conferma', key: 'conferma' },
];

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {routeMap.map((route) => (
          <Route
            key={route.path}
            path={route.path === '/' ? undefined : route.path.slice(1)}
            index={route.path === '/'}
            element={<ScreenPage screen={screenCatalog[route.key]} />}
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}