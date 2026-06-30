import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AppBar, Avatar, Box, Divider, Drawer, IconButton, Stack, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { navigationItems, screenCatalog } from '../data/appData';

const drawerWidth = 296;
const railWidth = 80;

function BrandMark({ compact }) {
  return (
    <Stack spacing={compact ? 0.5 : 1} sx={{ px: compact ? 0 : 0.5 }}>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1.25, lineHeight: 1 }}>
        <Typography sx={{ fontSize: compact ? 20 : 29, fontWeight: 900, letterSpacing: -1.1, color: '#ffffff' }}>Sella</Typography>
        <Typography sx={{ fontSize: compact ? 11 : 13, fontWeight: 700, color: 'rgba(255,255,255,0.74)', letterSpacing: 0.8 }}>centrico:</Typography>
      </Box>
      {!compact && <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.45 }}>CDF Fideiussioni Reports</Typography>}
    </Stack>
  );
}

export default function AppShell() {
  const theme = useTheme();
  const location = useLocation();
  const isCompactViewport = useMediaQuery(theme.breakpoints.down('lg'));
  const [drawerOpen, setDrawerOpen] = useState(!isCompactViewport);

  const currentScreen = useMemo(() => {
    const matchedRoute = location.pathname === '/'
      ? screenCatalog.dashboard
      : Object.values(screenCatalog).find((screen, index) => navigationItems[index]?.path === location.pathname);
    return matchedRoute ?? screenCatalog.dashboard;
  }, [location.pathname]);

  const drawerSize = drawerOpen ? drawerWidth : railWidth;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, rgba(246,249,255,0.92) 0%, rgba(236,242,251,0.96) 100%)' }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: theme.zIndex.drawer + 1, ml: `${drawerSize}px`, width: `calc(100% - ${drawerSize}px)`, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(9, 31, 77, 0.08)', color: theme.palette.text.primary, transition: theme.transitions.create(['margin-left', 'width'], { duration: theme.transitions.duration.shorter }) }}>
        <Toolbar sx={{ minHeight: 80, px: 3, display: 'flex', gap: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.3 }}>{currentScreen.eyebrow}</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: 'primary.main' }}>{currentScreen.portfolioName}</Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box sx={{ px: 1.5, py: 0.9, borderRadius: 999, border: '1px solid rgba(9, 31, 77, 0.08)', background: 'rgba(255,255,255,0.88)', minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>{currentScreen.reportDate}</Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1.1}>
              <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontSize: 14, fontWeight: 800 }}>MR</Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2 }}>{currentScreen.user}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{currentScreen.role}</Typography>
              </Box>
            </Stack>
            <Tooltip title={drawerOpen ? 'Riduci sidebar' : 'Espandi sidebar'}>
              <IconButton onClick={() => setDrawerOpen((value) => !value)} sx={{ ml: 0.5 }}>
                {drawerOpen ? <MenuOpenIcon /> : <MenuIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout"><IconButton><LogoutOutlinedIcon /></IconButton></Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerSize, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerSize, boxSizing: 'border-box', borderRight: 'none', color: '#fff', background: 'linear-gradient(180deg, #071d4f 0%, #092660 28%, #06163e 72%, #04112f 100%)', transition: theme.transitions.create('width', { duration: theme.transitions.duration.shorter }), overflowX: 'hidden' } }}>
        <Stack sx={{ height: '100%', px: drawerOpen ? 2.25 : 1.1, py: 2.4 }}>
          <Box sx={{ mb: 3 }}><BrandMark compact={!drawerOpen} /></Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
          <Stack spacing={0.8} sx={{ flex: 1 }}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = item.path === location.pathname || (item.path === '/' && location.pathname === '/');
              return (
                <Box key={item.path} component={NavLink} to={item.path} sx={{ display: 'flex', alignItems: 'center', gap: drawerOpen ? 1.5 : 0, px: 1.5, py: 1.25, borderRadius: 3, transition: 'all 160ms ease', color: active ? '#071d4f' : 'rgba(255,255,255,0.92)', background: active ? 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(214,228,255,0.94) 100%)' : 'transparent', boxShadow: active ? '0 18px 35px rgba(5, 16, 42, 0.22)' : 'none', '& .MuiListItemIcon-root': { minWidth: 0, color: 'rgba(255,255,255,0.86)', marginRight: 0 }, '&:hover': { background: active ? 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(214,228,255,0.94) 100%)' : alpha('#ffffff', 0.08) } }}>
                  <Icon sx={{ fontSize: 22 }} />
                  <Typography sx={{ fontSize: 14, fontWeight: 800, opacity: drawerOpen ? 1 : 0, whiteSpace: 'nowrap', transition: 'opacity 120ms ease' }}>{item.label}</Typography>
                </Box>
              );
            })}
          </Stack>
          <Box sx={{ mt: 2, p: drawerOpen ? 2 : 1.2, borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', mb: 0.8 }}>Status</Typography>
            {drawerOpen ? <BrandMark compact /> : <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.72)' }}>OK</Typography>}
          </Box>
        </Stack>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, ml: `${drawerSize}px`, pt: '80px', transition: theme.transitions.create('margin-left', { duration: theme.transitions.duration.shorter }) }}>
        <Box sx={{ px: { xs: 2, md: 3, xl: 4 }, pb: 4, minHeight: 'calc(100vh - 80px)' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}