import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import {
  EmojiTransportation,
  SupportAgent,
  Shield,
  Payments,
} from "@mui/icons-material";

const FEATURES = [
  {
    icon: <EmojiTransportation />,
    title: "Professional Chauffeurs",
    desc: "Experienced, courteous chauffeurs focused on safety, comfort, punctuality, and a polished travel experience.",
  },
  {
    icon: <Shield />,
    title: "Luxury Fleet Options",
    desc: "Choose sedans, SUVs, limousines, sprinter vans, and group transportation options for any occasion.",
  },
  {
    icon: <SupportAgent />,
    title: "24/7 Customer Support",
    desc: "Our support team helps with bookings, airport pickups, schedule changes, and special travel requests.",
  },
  {
    icon: <Payments />,
    title: "Transparent Premium Pricing",
    desc: "Reliable luxury transportation with clear pricing for airport transfers, hourly rides, and custom service.",
  },
];

export default function WhyChooseUs() {
  return (
    <Box component="section" sx={{ mt: { xs: 9, md: 14 } }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="overline"
          sx={{ color: "secondary.dark", fontWeight: 900, letterSpacing: 2 }}
        >
          WHY CHOOSE US
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          sx={{ fontWeight: 900, color: "primary.main", mt: 1 }}
        >
          Designed for Premium NYC Travel
        </Typography>

        <Typography
          sx={{
            maxWidth: 760,
            mx: "auto",
            mt: 2,
            color: "text.secondary",
            lineHeight: 1.8,
          }}
        >
          We combine professional chauffeurs, luxury vehicles, reliable support,
          and flexible booking options to make every ride feel effortless.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {FEATURES.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 18px 45px rgba(15,32,69,0.08)",
                transition: "0.25s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 28px 70px rgba(15,32,69,0.16)",
                  borderColor: "secondary.main",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(212,175,55,0.15)",
                    color: "secondary.dark",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    "& svg": { fontSize: 30 },
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: 900, mb: 1.3, color: "primary.main" }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.8 }}
                >
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}