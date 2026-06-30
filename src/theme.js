import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Gill Sans", "Trebuchet MS", "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: -1.2 },
    h2: { fontWeight: 800, letterSpacing: -0.9 },
    h3: { fontWeight: 750, letterSpacing: -0.6 },
    h4: { fontWeight: 750, letterSpacing: -0.4 },
    button: { fontWeight: 700, letterSpacing: 0.4 },
  },
  palette: {
    primary: { main: '#071d4f', dark: '#051637', light: '#0b4fd6' },
    secondary: { main: '#0b4fd6', light: '#d6e4ff' },
    background: { default: '#eef3fb', paper: 'rgba(255,255,255,0.88)' },
    text: { primary: '#08162e', secondary: '#66748f' },
    success: { main: '#118d57' },
    warning: { main: '#d9831f' },
    error: { main: '#c33737' },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(9, 31, 77, 0.08)',
          boxShadow: '0 18px 60px rgba(7, 29, 79, 0.08)',
          backdropFilter: 'blur(16px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 14, textTransform: 'none', fontWeight: 700 },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

export default theme;