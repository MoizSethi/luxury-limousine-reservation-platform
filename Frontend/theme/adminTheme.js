import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a365d',
      light: '#2d4a8a',
      dark: '#0f2045',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d4af37',
      light: '#e6c158',
      dark: '#b8941f',
      contrastText: '#1a202c',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    sidebar: {
      main: '#1a1f2b',
      hover: '#2d3748',
      active: '#3b82f6',
      text: '#ffffff',
    },
    header: {
      main: '#ffffff',
      text: '#111827',
      border: '#e5e7eb',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
    action: {
      hover: '#f7fafc',
      selected: '#edf2f7',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1a202c',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1a202c',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1a202c',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1a202c',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#1a202c',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#1a202c',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#4a5568',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#718096',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#a0aec0',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#111827',
          boxShadow: 'none',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1f2b',
          color: '#ffffff',
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#2d3748',
          },
          '&.Mui-selected': {
            backgroundColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f7fafc',
          '& th': {
            fontWeight: 600,
            color: '#4a5568',
          },
        },
      },
    },
  },
});