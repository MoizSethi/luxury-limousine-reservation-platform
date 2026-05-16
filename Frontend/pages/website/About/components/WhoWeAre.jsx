import { motion } from "framer-motion";
import { Box, Grid, Typography, Card, Stack } from "@mui/material";
import {
  AirportShuttle,
  BusinessCenter,
  AccessTime,
  Verified,
} from "@mui/icons-material";

const fleetImage =
"https://images.unsplash.com/photo-1603122101829-e56305b0a5f7??auto=format&fit=crop&w=1200&q=80";

const stats = [
  { icon: <AirportShuttle />, label: "Airport Transfers", value: "JFK • LGA • EWR" },
  { icon: <BusinessCenter />, label: "Corporate Travel", value: "Executive Ready" },
  { icon: <AccessTime />, label: "Availability", value: "24/7 Service" },
  { icon: <Verified />, label: "Ride Quality", value: "Premium Fleet" },
];

export default function WhoWeAre() {
  return (
    <Grid container spacing={6} alignItems="center">
      <Grid item xs={12} md={6}>
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 360, md: 460 },
              borderRadius: 5,
              overflow: "hidden",
              boxShadow: "0 28px 70px rgba(15,32,69,0.25)",
            }}
          >
            <Box
              component="img"
              src={fleetImage}
              alt="Premium luxury vehicle for NYC chauffeur service"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(15,32,69,0.92), rgba(15,32,69,0.18))",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 24,
                border: "1px solid rgba(212,175,55,0.42)",
                borderRadius: 4,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                left: 28,
                right: 28,
                bottom: 28,
                zIndex: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: "secondary.light", fontWeight: 900, letterSpacing: 2 }}
              >
                TRUSTED NYC TRANSPORTATION
              </Typography>

              <Typography
                variant="h3"
                sx={{ color: "#fff", fontWeight: 900, mt: 1, mb: 1 }}
              >
                Comfort. Class. Reliability.
              </Typography>

              <Typography sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.8 }}>
                Premium black car and limo service designed for airport travel,
                business trips, private events, and luxury city transportation.
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Grid>

      <Grid item xs={12} md={6}>
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="overline"
            sx={{ color: "secondary.dark", fontWeight: 900, letterSpacing: 2 }}
          >
            WHO WE ARE
          </Typography>

          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 900,
              color: "primary.main",
              mt: 1,
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            A Premium Limo Company Serving New York City
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.9 }}>
            New York Limoz is a professional chauffeur and luxury transportation
            company serving NYC, airports, hotels, corporate clients, events,
            and private travelers. Our goal is to make every ride smooth,
            punctual, comfortable, and dependable.
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 2, color: "text.secondary", lineHeight: 1.9 }}
          >
            From JFK airport limo service to executive black car transportation,
            we focus on clean vehicles, trained chauffeurs, clear communication,
            and a premium customer experience from booking to drop-off.
          </Typography>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {stats.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    p: 2.2,
                    borderRadius: 3,
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 12px 35px rgba(0,0,0,0.06)",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        bgcolor: "rgba(212,175,55,0.15)",
                        color: "secondary.dark",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>{item.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.value}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Grid>
    </Grid>
  );
}