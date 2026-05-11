import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1f3a5f',
      light: '#dce6f2',
    },
    text: {
      primary: '#16202a',
      secondary: '#5f6b76',
    },
    background: {
      default: '#f6f7f5',
      paper: '#ffffff',
    },
    divider: '#e5e8eb',
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.98rem',
      lineHeight: 1.65,
    },
    body2: {
      fontSize: '0.88rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #e5e8eb',
          boxShadow: '0 10px 30px rgba(16, 24, 40, 0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
