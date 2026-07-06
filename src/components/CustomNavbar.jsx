import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArticleIcon from '@mui/icons-material/Article';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TableChartIcon from '@mui/icons-material/TableChart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SellaLogo from '../assets/images/LogoSella.png';
import CentricoLogo from '../assets/images/CentricoLogo.png';

const drawerWidth = 280;

const REPORT_ICONS = [ArticleIcon, AccountBalanceIcon, TableChartIcon, ReceiptLongIcon];

const openedMixin = (theme) => ({
  width: drawerWidth,
  backgroundColor: '#032DAD',
  color: 'white',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  overflowY: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#032DAD',
  color: 'white',
  overflowX: 'hidden',
  overflowY: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  '&': {
    color: 'white',
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  '&': {
    backgroundColor: 'white',
    color: '#1b49b9',
  },
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function CustomNavbar({ reportLinks = [], currentReportNumber, onReportLinkClick }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <div style={{ marginLeft: '70px' }}>
            <img
              src={SellaLogo}
              alt="Sella Logo"
              style={{ width: '45%' }}
            />
          </div>
          <div style={{ marginLeft: '16px' }} >
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#032DAD' }}>
              Crediti di Firma — Fideiussioni Reports
            </span>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {!open && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: '5px' }}
            >
              <ChevronRightIcon sx={{ fill: 'white' }} />
            </IconButton>
          )}
          {open && (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon sx={{ fill: 'white' }} />}
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List sx={{ marginTop: '10px' }}>
          {reportLinks.map((reportLink, index) => {
            const IconComponent = REPORT_ICONS[index % REPORT_ICONS.length];
            const isActive = currentReportNumber === reportLink.reportNumber;
            return (
              <ListItem key={reportLink.key} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => onReportLinkClick(reportLink.firstPageKey)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    py: 2,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComponent sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={reportLink.label}
                    sx={{
                      opacity: open ? 1 : 0,
                      '& .MuiListItemText-primary': {
                        color: 'white',
                        fontWeight: isActive ? 700 : 400,
                        fontSize: '13px',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {open && (
          <div style={{ marginTop: 'auto' }} className="flex justify-center items-center py-3 w-full bg-blue-900">
            <img
              loading="lazy"
              src={CentricoLogo}
              alt="Centrico Logo"
            />
          </div>
        )}
      </Drawer>
    </Box>
  );
}
