// src/pages/website/Rates/Rates.jsx
import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";

import HourlyRates from "./components/HourlyRates";
import DailyRates from "./components/DailyRates";

const API_BASE_URL = "https://localhost:3000/api";

function Rates() {
  const [vehicles, setVehicles] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const isDailyPage = location.pathname.includes("/rates/daily");

  const getActiveTab = () => {
    if (isDailyPage) return 1;
    return 0;
  };

  const fetchVehicleImages = async (vehicleId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}/images`);
      return res.data?.images || res.data || [];
    } catch (err) {
      console.warn(`Could not load images for vehicle ${vehicleId}`, err);
      return [];
    }
  };

  const fetchVehiclesWithImages = async () => {
    const vehiclesRes = await axios.get(`${API_BASE_URL}/vehicles`);
    const vehiclesData = vehiclesRes.data || [];

    const vehiclesWithImages = await Promise.all(
      vehiclesData.map(async (v) => {
        const images = await fetchVehicleImages(v.vehicle_id);
        return { ...v, images };
      })
    );

    return vehiclesWithImages;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [vehiclesWithImages, pricesRes] = await Promise.all([
        fetchVehiclesWithImages(),
        axios.get(`${API_BASE_URL}/prices`),
      ]);

      setVehicles(vehiclesWithImages);
      setPrices(pricesRes.data?.prices || []);
    } catch (err) {
      console.error("Error fetching rates:", err);
      setError("Failed to load rates data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pageTitle = isDailyPage
    ? "Daily Limo Rates NYC | Luxury Chauffeur Pricing"
    : "Hourly Limo Rates NYC | Chauffeur & Black Car Pricing";

  const pageDescription = isDailyPage
    ? "View daily limo rates in NYC for luxury sedans, SUVs, sprinter vans, limousines, and group transportation. Book premium chauffeur service with transparent pricing."
    : "View hourly limo rates in NYC for luxury chauffeur service, airport transfers, corporate travel, private events, and black car transportation.";

  const canonicalUrl = isDailyPage
    ? "https://newyorklimoz.com/rates/daily"
    : "https://newyorklimoz.com/rates";

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="420px"
        >
          <CircularProgress size={56} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading rates...
          </Typography>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Box textAlign="center">
            <Button variant="contained" onClick={fetchData} sx={{ mt: 2 }}>
              Try Again
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="NYC limo rates, hourly limo rates NYC, daily limo rates NYC, chauffeur pricing NYC, black car service rates, airport limo pricing New York"
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Box
          component="section"
          sx={{
            position: "relative",
            py: { xs: 9, md: 13 },
            px: 3,
            textAlign: "center",
            color: "#fff",
            background:
              "linear-gradient(135deg, rgba(26,54,93,0.98), rgba(15,32,69,0.96))",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 340,
              height: 340,
              borderRadius: "50%",
              bgcolor: "rgba(212,175,55,0.13)",
              top: -120,
              right: -90,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 240,
              height: 240,
              borderRadius: "50%",
              bgcolor: "rgba(212,175,55,0.09)",
              bottom: -100,
              left: -70,
            }}
          />

          <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
            <Typography
              variant="overline"
              sx={{
                color: "secondary.light",
                letterSpacing: 3,
                fontWeight: 900,
              }}
            >
              TRANSPARENT LUXURY PRICING
            </Typography>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 900,
                mt: 1.5,
                mb: 2,
                fontSize: { xs: "2.2rem", md: "4rem" },
                lineHeight: 1.12,
              }}
            >
              {isDailyPage ? "Daily Limo Rates in NYC" : "Hourly Limo Rates in NYC"}
            </Typography>

            <Typography
              variant="h6"
              component="p"
              sx={{
                color: "rgba(255,255,255,0.78)",
                maxWidth: 760,
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              Compare premium chauffeur pricing for luxury sedans, SUVs,
              limousines, sprinter vans, airport transfers, corporate travel,
              and private transportation across New York City.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                href="/reservation"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "secondary.main",
                  color: "#111",
                  px: 4,
                  py: 1.4,
                  fontWeight: 900,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "secondary.dark" },
                }}
              >
                Reserve Now
              </Button>

              <Button
                href="/contact"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(255,255,255,0.45)",
                  color: "#fff",
                  px: 4,
                  py: 1.4,
                  borderRadius: 3,
                  "&:hover": {
                    borderColor: "secondary.main",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Ask for Quote
              </Button>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="overline"
              sx={{
                color: "secondary.dark",
                fontWeight: 900,
                letterSpacing: 2,
              }}
            >
              CHOOSE YOUR RATE TYPE
            </Typography>

            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 900,
                color: "primary.main",
                mt: 1,
                mb: 1.5,
              }}
            >
              Simple, Clear & Premium Pricing
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 720, mx: "auto", lineHeight: 1.8 }}
            >
              Select hourly service for flexible city rides and multiple stops,
              or daily service for extended chauffeur availability, events,
              business travel, and group transportation.
            </Typography>
          </Box>

          <Box
            sx={{
              mb: 6,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                boxShadow: "0 18px 45px rgba(15,32,69,0.08)",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={getActiveTab()}
                centered
                sx={{
                  "& .MuiTab-root": {
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    py: 2,
                    px: { xs: 2.5, md: 5 },
                    minWidth: { xs: 150, md: 220 },
                    textTransform: "none",
                  },
                  "& .MuiTabs-indicator": {
                    height: 4,
                    borderRadius: "4px 4px 0 0",
                    bgcolor: "secondary.main",
                  },
                }}
              >
                <Tab label="Hourly Rates" component={Link} to="/rates" />
                <Tab label="Daily Rates" component={Link} to="/rates/daily" />
              </Tabs>
            </Box>
          </Box>

          <Routes>
            <Route
              path="/"
              element={<HourlyRates vehicles={vehicles} prices={prices} />}
            />
            <Route
              path="/daily"
              element={<DailyRates vehicles={vehicles} prices={prices} />}
            />
          </Routes>

          <Box
            component="section"
            sx={{
              mt: { xs: 7, md: 10 },
              p: { xs: 3, md: 5 },
              borderRadius: 5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 18px 45px rgba(15,32,69,0.08)",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 900, color: "primary.main", mb: 2 }}
            >
              NYC Limo Pricing for Airport Transfers, Corporate Travel & Events
            </Typography>

            <Typography sx={{ color: "text.secondary", lineHeight: 1.9, mb: 2 }}>
              New York Limoz offers transparent rates for premium chauffeur
              services across NYC, Yonkers, JFK, LaGuardia, Newark, Manhattan,
              Brooklyn, Queens, and the Tri-State area. Our pricing is designed
              for travelers who want luxury vehicles, professional chauffeurs,
              and dependable service.
            </Typography>

            <Typography sx={{ color: "text.secondary", lineHeight: 1.9 }}>
              Hourly limo service is ideal for meetings, city rides, events, and
              multiple stops. Daily rates are best for longer bookings,
              executive travel, group transportation, weddings, and custom
              itineraries.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Rates;