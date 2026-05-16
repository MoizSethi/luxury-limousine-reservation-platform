import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Link,
  Stack,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";

import Logo from "../assets/Logo.png";
import WhatsAppWidget from "./WhatsAppWidget";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        bgcolor: "#070707",
        color: "#fff",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Box sx={{ maxWidth: "1300px", mx: "auto", px: { xs: 3, md: 6 }, py: 7 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box component="img" src={Logo} alt="New York Limoz" sx={{ height: 72, mb: 2 }} />

            <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, maxWidth: 380 }}>
              New York Limoz provides luxury chauffeur and limo services across NYC,
              JFK, LaGuardia, Newark, and the Tri-State area.
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.08)",
                    "&:hover": { bgcolor: "#fbbf24", color: "#000" },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Quick Links
            </Typography>

            <Stack spacing={1.2}>
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Services", "/services"],
                ["Rates", "/rates"],
                ["Blogs", "/blogs"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link key={label} href={href} underline="none" sx={{ color: "rgba(255,255,255,0.72)", "&:hover": { color: "#fbbf24" } }}>
                  {label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Services
            </Typography>

            <Stack spacing={1.2}>
              {[
                "NYC Limo Service",
                "Airport Transfers",
                "Corporate Chauffeur",
                "Hourly Car Service",
                "Wedding Transportation",
                "Luxury SUV Service",
              ].map((item) => (
                <Typography key={item} sx={{ color: "rgba(255,255,255,0.72)" }}>
                  {item}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Contact
            </Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.2}>
                <LocationOn sx={{ color: "#fbbf24" }} />
                <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
                  New York City, NY
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.2}>
                <Phone sx={{ color: "#fbbf24" }} />
                <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
                  +1 (929) 378-4673
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.2}>
                <Email sx={{ color: "#fbbf24" }} />
                <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
                  info@newyorklimoz.com
                </Typography>
              </Stack>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Get Updates
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  size="small"
                  placeholder="Your email"
                  fullWidth
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 1,
                    input: { color: "#000" },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#fbbf24",
                    color: "#000",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#d99b00" },
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
            © {new Date().getFullYear()} New York Limoz. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Link href="/privacy-policy" underline="none" sx={{ color: "rgba(255,255,255,0.65)", "&:hover": { color: "#fbbf24" } }}>
              Privacy Policy
            </Link>
            <Link href="/terms" underline="none" sx={{ color: "rgba(255,255,255,0.65)", "&:hover": { color: "#fbbf24" } }}>
              Terms
            </Link>
          </Stack>
        </Stack>
      </Box>
      <WhatsAppWidget />
    </Box>
  );
};

export default Footer;