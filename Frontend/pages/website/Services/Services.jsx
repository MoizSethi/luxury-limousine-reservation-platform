import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import servicesService from "../../../services/service";

import HeroSection from "./components/HeroSection";
import ServicesGrid from "./components/ServicesGrid";

export const BASE_URL = "https://localhost:3000/";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=2000&q=80";

export default function Services() {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState("");

  const fetchServices = useCallback(async () => {
    try {
      setStatus("loading");
      setError("");

      const data = await servicesService.getAllServices();
      setServices(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
      setError(err?.message || "Failed to load services");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Add top spacing so header doesn't overlap (adjust if your header height differs) */}
      <Box sx={{ pt: { xs: 9, md: 10 } }}>
        <HeroSection image={HERO_IMAGE} />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        {status === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {status === "error" && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </Box>
        )}

        {status === "success" && services.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              No services available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please check back soon.
            </Typography>
          </Box>
        )}

        {status === "success" && services.length > 0 && (
          <ServicesGrid services={services} fallbackImage={HERO_IMAGE} />
        )}
      </Container>
    </Box>
  );
}
