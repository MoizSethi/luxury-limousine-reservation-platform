import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, ThemeProvider } from "@mui/material";
import { adminTheme } from "../theme/adminTheme";
import Dashboard_Header from "../components/Dashboard_Header";
import Dashboard_Sidebar from "../components/Dashboard_Sidebar";

export default function Dashboard_Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar */}
        <Dashboard_Sidebar 
          mobileOpen={mobileOpen} 
          onMobileClose={() => setMobileOpen(false)} 
        />
        
        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header */}
          <Dashboard_Header onMenuToggle={handleDrawerToggle} />
          
          {/* Page Content */}
          <Box 
            component="main" 
            sx={{ 
              flex: 1, 
              p: { xs: 2, sm: 3 },
              overflow: 'auto',
              maxWidth: '100%',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}