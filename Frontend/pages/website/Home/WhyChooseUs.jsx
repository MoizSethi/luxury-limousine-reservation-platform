import React from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import {
  DirectionsCarFilled,
  SupportAgent,
  LocationOn,
  MiscellaneousServices,
} from "@mui/icons-material";

const features = [
  {
    icon: <DirectionsCarFilled sx={{ fontSize: 40, color: "#fbbf24" }} />,
    title: "Luxury Cars",
    desc: "Travel in premium sedans, SUVs, limousines, and executive vehicles for airport transfers, business rides, and special occasions.",
  },
  {
    icon: <SupportAgent sx={{ fontSize: 40, color: "#fbbf24" }} />,
    title: "24/7 Support",
    desc: "Our team is available around the clock to help with reservations, airport pickups, schedule changes, and custom ride requests.",
  },
  {
    icon: <LocationOn sx={{ fontSize: 40, color: "#fbbf24" }} />,
    title: "NYC & Tri-State Coverage",
    desc: "We serve Manhattan, Brooklyn, Queens, Bronx, Staten Island, JFK, LaGuardia, Newark, and nearby Tri-State locations.",
  },
  {
    icon: <MiscellaneousServices sx={{ fontSize: 40, color: "#fbbf24" }} />,
    title: "Custom Transportation",
    desc: "From hourly chauffeur service to corporate travel, weddings, events, and group transportation, every ride is planned around your needs.",
  },
];

const WhyChooseUs = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{ py: 10, maxWidth: "1400px", mx: "auto", px: { xs: 3, md: 6 } }}
    >
      <Typography
        variant="h6"
        component="p"
        sx={{
          textAlign: "center",
          color: theme.palette.secondary.main,
          letterSpacing: 2,
          fontWeight: 500,
          mb: 1,
        }}
      >
        WHY CHOOSE NEW YORK LIMOZ
      </Typography>

      <Typography
        variant="h3"
        component="h2"
        sx={{
          textAlign: "center",
          fontWeight: 800,
          mb: 2,
        }}
      >
        Reliable NYC Chauffeur Service
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          maxWidth: "900px",
          mx: "auto",
          mb: 8,
          color: theme.palette.text.secondary,
          lineHeight: 1.7,
        }}
      >
        We provide premium limo and chauffeur services across New York City,
        including airport transfers, corporate transportation, hourly rides, and
        luxury private travel. Our focus is comfort, reliability, safety, and
        customer satisfaction.
      </Typography>

      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid item xs={12} md={4} sx={{ width: { md: "25%" } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {features.slice(0, 2).map((item, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
              >
                {item.icon}
                <Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          sx={{
            width: { md: "40%" },
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            my: { xs: 6, md: 0 },
          }}
        >
          <Box
            component="img"
            src="https://break2theborder.com/wp-content/uploads/2022/12/xtsbanner2.png"
            alt="Luxury black car service in New York City"
            sx={{
              width: "100%",
              maxWidth: "460px",
            }}
          />
        </Grid>

        <Grid item xs={12} md={4} sx={{ width: { md: "25%" } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {features.slice(2, 4).map((item, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
              >
                {item.icon}
                <Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhyChooseUs;