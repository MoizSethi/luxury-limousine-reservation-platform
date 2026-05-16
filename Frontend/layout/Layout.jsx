import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { lightTheme, darkTheme } from '../theme/theme';

export default function Layout() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleThemeToggle = () => setDarkMode(!darkMode);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          color: 'text.primary',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {/* Header with Theme Toggle */}
        <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: '1440px',
            mx: 'auto',
            px: { xs: 3, sm: 6, md: 8 },
            py: 10,
            animation: 'fadeIn 0.6s ease-in-out',
          }}
        >
          <Outlet />
        </Box>

        {/* Footer */}
        <Footer />
      </Box>

      {/* Optional: FadeIn Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </ThemeProvider>
  );
}
