import React from "react";
import { Helmet } from "react-helmet-async";
import { Box, Typography, Grid } from "@mui/material";

import HeroSection from "./HeroSection";
import CarCarousel from "./CarCarousel";
import WhyChooseUs from "./WhyChooseUs";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>NYC Limo Service | Chauffeur & Airport Transfers</title>
        <meta
          name="description"
          content="Book luxury limo service in NYC. Airport transfers to JFK, LaGuardia, and Newark, corporate chauffeur service, hourly rides, and premium black car transportation."
        />
        <meta
          name="keywords"
          content="NYC limo service, New York chauffeur service, JFK airport limo, LaGuardia airport transfer, Newark airport limo, black car service NYC, luxury car service New York"
        />
        <link rel="canonical" href="https://newyorklimoz.com/" />
      </Helmet>

      {/* 🔥 MAIN UI */}
      <HeroSection />
      <CarCarousel />
      <WhyChooseUs />

      {/* 🔥 SEO SECTION */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2.5, md: 4 },
          bgcolor: "#0b0b0b",
          color: "#fff",
        }}
      >
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
            <Typography
              variant="overline"
              sx={{
                color: "#fbbf24",
                letterSpacing: 3,
                fontWeight: 800,
              }}
            >
              PREMIUM NYC TRANSPORTATION
            </Typography>

            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 900,
                mt: 1,
                mb: 2,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Professional Limo Service in NYC
            </Typography>

            <Typography
              variant="body1"
              sx={{
                maxWidth: 850,
                mx: "auto",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.9,
              }}
            >
              New York Limoz provides reliable luxury transportation across New York City and the Tri-State area. Whether you need an airport transfer, corporate ride, hourly chauffeur service, or private event transportation, our professional drivers deliver a smooth, comfortable, and punctual travel experience.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                title: "Airport Transfers to JFK, LaGuardia & Newark",
                text: "We specialize in airport limo service for JFK, LaGuardia, and Newark Airport. Enjoy stress-free travel with professional chauffeurs and luxury vehicles.",
              },
              {
                title: "Corporate & Hourly Chauffeur Services",
                text: "Ideal for business meetings, events, and city travel. Book hourly rides with a premium vehicle and driver available for multiple stops.",
              },
              {
                title: "Luxury Fleet for Every Occasion",
                text: "Choose from sedans, SUVs, limousines, sprinter vans, and more. Every ride is designed for comfort, safety, and reliability.",
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    transition: "0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "#fbbf24",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 800, mb: 1.5 }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.8,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Home;