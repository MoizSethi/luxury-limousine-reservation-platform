import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Switch,
  Divider,
  Menu,
  MenuItem,
  Collapse,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Rates", path: "/rates" },
  { label: "About", path: "/about" },
  { label: "Blogs", path: "/blogs" },
  { label: "Contact", path: "/contact" },
];

const SERVICES_API = "https://localhost:3000/api/services";

const Header = ({ darkMode, onThemeToggle }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Desktop dropdown
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const openServices = Boolean(servicesAnchor);

  // Mobile collapse
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  // API state
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Fetch services dynamically
  useEffect(() => {
    let alive = true;

    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        setServicesError("");

        const res = await fetch(SERVICES_API, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Services API failed: ${res.status}`);

        const data = await res.json();

        if (!alive) return;

        // Data format: array of objects with id, title, category... :contentReference[oaicite:2]{index=2}
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;
        setServices([]);
        setServicesError(err?.message || "Failed to load services");
      } finally {
        if (!alive) return;
        setLoadingServices(false);
      }
    };

    fetchServices();

    return () => {
      alive = false;
    };
  }, []);

  // Normalize to dropdown items
  const servicesList = useMemo(() => {
    return (services || []).map((s) => ({
      id: s.id,
      label: s.category || s.title || `Service ${s.id}`,
      path: `/services/${s.id}`, // ✅ recommended: use ID routes
    }));
  }, [services]);

  const drawer = (
    <Box sx={{ width: 280 }}>
      <IconButton
        sx={{ float: "right", m: 1, color: "#111" }}
        onClick={() => setDrawerOpen(false)}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <List sx={{ mt: 6 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}

        {/* Mobile Services */}
        <ListItem button onClick={() => setMobileServicesOpen((p) => !p)}>
          <ListItemText primary="Services" />
        </ListItem>

        <Collapse in={mobileServicesOpen} unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              sx={{ pl: 4 }}
              onClick={() => {
                navigate("/services");
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="All Services" sx={{ color: "#111" }} />
            </ListItem>

            {loadingServices && (
              <ListItem sx={{ pl: 4 }}>
                <CircularProgress size={18} />
                <Typography sx={{ ml: 1, color: "#111" }} variant="body2">
                  Loading...
                </Typography>
              </ListItem>
            )}

            {!loadingServices && servicesError && (
              <ListItem sx={{ pl: 4 }}>
                <Typography sx={{ color: "#111" }} variant="body2">
                  {servicesError}
                </Typography>
              </ListItem>
            )}

            {!loadingServices &&
              !servicesError &&
              servicesList.map((service) => (
                <ListItem
                  key={service.id}
                  button
                  sx={{ pl: 4 }}
                  onClick={() => {
                    navigate(service.path);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={service.label} sx={{ color: "#111" }} />
                </ListItem>
              ))}
          </List>
        </Collapse>
      </List>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
        <Typography variant="body2" sx={{ mr: 1, color: "#111" }}>
          Dark Mode
        </Typography>
        <Switch checked={darkMode} onChange={onThemeToggle} />
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: "#fff",
        color: "#111",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img src={Logo} alt="Logo" style={{ height: 64 }} />
        </Box>

        {/* Desktop Nav */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                fontWeight: 600,
                color: "#111",
                borderBottom: isActive(item.path)
                  ? "2px solid #111"
                  : "2px solid transparent",
                borderRadius: 0,
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* Services Dropdown (stable) */}
          <Box
            onMouseEnter={(e) => setServicesAnchor(e.currentTarget)}
            onMouseLeave={() => setServicesAnchor(null)}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Button
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ fontWeight: 600, color: "#111" }}
            >
              Services
            </Button>

            <Menu
              anchorEl={servicesAnchor}
              open={openServices}
              onClose={() => setServicesAnchor(null)}
              disableAutoFocusItem
              PaperProps={{ sx: { minWidth: 260, borderRadius: 2 } }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/services");
                  setServicesAnchor(null);
                }}
                sx={{ fontWeight: 700, color: "#111" }}
              >
                All Services
              </MenuItem>

              <Divider />

              {loadingServices ? (
                <MenuItem disabled sx={{ color: "#111" }}>
                  Loading...
                </MenuItem>
              ) : servicesError ? (
                <MenuItem disabled sx={{ color: "#111" }}>
                  Failed to load services
                </MenuItem>
              ) : servicesList.length ? (
                servicesList.map((service) => (
                  <MenuItem
                    key={service.id}
                    onClick={() => {
                      navigate(service.path);
                      setServicesAnchor(null);
                    }}
                    sx={{ color: "#111" }}
                  >
                    {service.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled sx={{ color: "#111" }}>
                  No services yet
                </MenuItem>
              )}
            </Menu>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/reservation")}
            sx={{
              ml: 2,
              backgroundColor: "#111",
              color: "#fff",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#000" },
            }}
          >
            Reserve Now
          </Button>

          <Switch checked={darkMode} onChange={onThemeToggle} />
        </Box>

        {/* Mobile Menu */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, color: "#111" }}
          onClick={() => setDrawerOpen(true)}
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;