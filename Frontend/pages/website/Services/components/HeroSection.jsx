import React from "react";
import { Box, Typography, Container } from "@mui/material";

export default function HeroSection({ image }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 260, sm: 320, md: 420 },
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={image}
        alt="Our Services"
        loading="lazy"
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.70), rgba(0,0,0,0.25))",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ color: "#fff", maxWidth: 780 }}>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: 30, sm: 42, md: 56 },
              lineHeight: 1.1,
              mb: 1.5,
            }}
          >
            Our Services
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: 14, sm: 16, md: 18 },
              opacity: 0.95,
              lineHeight: 1.7,
            }}
          >
            Explore our premium limousine services designed to make your journey
            stylish, comfortable, and unforgettable.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
