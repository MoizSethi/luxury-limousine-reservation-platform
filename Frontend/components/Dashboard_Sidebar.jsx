import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Dashboard,
  CalendarToday,
  AddBox,
  DirectionsCar,
  AttachMoney,
  People,
  BarChart,
  Logout,
  MiscellaneousServices,
} from "@mui/icons-material";

import ArticleIcon from "@mui/icons-material/Article";

// In Dashboard_Sidebar.jsx - add to menuItems
const menuItems = [
  { text: "Dashboard", link: "/dashboard", icon: <Dashboard /> },
  { text: "Track Reservations", link: "/dashboard/reservations", icon: <CalendarToday /> },
  { text: "New Reservation", link: "/dashboard/new-reservation", icon: <AddBox /> },
  { text: "Manage Cars", link: "/dashboard/cars", icon: <DirectionsCar /> },
  { text: "Manage Services", link: "/dashboard/service", icon: <MiscellaneousServices /> },
  { text: "Blogs", link: "/dashboard/blog", icon: <ArticleIcon /> },
  { text: "Manage Drivers", link: "/dashboard/drivers", icon: <People /> },
  { text: "Set Pricing", link: "/dashboard/pricing", icon: <AttachMoney /> },
  { text: "Users", link: "/dashboard/users", icon: <BarChart /> },
];

export default function Dashboard_Sidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Close mobile drawer if open
    if (isMobile) {
      onMobileClose();
    }
    
    // Redirect to login page
    navigate("/auth");
  };

  const drawerContent = (
    <>
      {/* Logo/Brand Area */}
      <Toolbar sx={{ borderBottom: '1px solid #2d3748' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
          Limo Admin
        </Typography>
      </Toolbar>

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.link;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.link}
                selected={isActive}
                onClick={isMobile ? onMobileClose : undefined}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout Section */}
      <Box sx={{ p: 1 }}>
        <Divider sx={{ borderColor: '#2d3748', mb: 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: '#f56565',
              '&:hover': {
                backgroundColor: '#2d3748',
                color: '#fc8181',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            borderRight: 'none',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}