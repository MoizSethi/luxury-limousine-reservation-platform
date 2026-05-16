import { motion } from "framer-motion";
import { Box, Typography, Button, Stack } from "@mui/material";

const luxuryCar =
  "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1400&q=80";

export default function HeroBanner() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: { xs: 560, md: 640 },
        display: "flex",
        alignItems: "center",
        color: "#fff",
        px: 3,
        background:
          "linear-gradient(135deg, rgba(26,54,93,0.98), rgba(15,32,69,0.96))",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={luxuryCar}
        alt="Luxury chauffeur vehicle in New York City"
        sx={{
          position: "absolute",
          right: { xs: "-35%", md: 0 },
          bottom: 0,
          width: { xs: "115%", md: "58%" },
          height: "100%",
          objectFit: "cover",
          opacity: { xs: 0.28, md: 0.52 },
          filter: "saturate(0.9) contrast(1.05)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(15,32,69,0.98) 0%, rgba(15,32,69,0.88) 42%, rgba(15,32,69,0.35) 100%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          maxWidth: "1200px",
          mx: "auto",
          width: "100%",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box sx={{ maxWidth: 720 }}>
            <Typography
              variant="overline"
              sx={{
                color: "secondary.light",
                letterSpacing: 3,
                fontWeight: 900,
              }}
            >
              ABOUT NEW YORK LIMOZ
            </Typography>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 900,
                mt: 1.5,
                mb: 2,
                fontSize: { xs: "2.2rem", md: "4rem" },
                lineHeight: 1.12,
              }}
            >
              Luxury Chauffeur Service Built for NYC Travel
            </Typography>

            <Typography
              variant="h6"
              component="p"
              sx={{
                color: "rgba(255,255,255,0.78)",
                maxWidth: 680,
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.18rem" },
              }}
            >
              New York Limoz provides premium limo service, airport transfers,
              corporate transportation, hourly rides, and private chauffeur
              services across New York City and the Tri-State area.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
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
                Book a Ride
              </Button>

              <Button
                href="/services"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
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
                View Services
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}