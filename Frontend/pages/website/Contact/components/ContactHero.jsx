import { Box, Typography, Button, Stack } from "@mui/material";
import heroImg from "../../../../assets/hero.webp";
export default function ContactHero() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: { xs: 430, md: 520 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
        px: 3,
        backgroundImage: `linear-gradient(135deg, rgba(26,54,93,0.88), rgba(15,32,69,0.82)), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          bgcolor: "rgba(212,175,55,0.14)",
          top: -110,
          right: -90,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          bgcolor: "rgba(212,175,55,0.10)",
          bottom: -100,
          left: -80,
        }}
      />

      <Box sx={{ position: "relative", maxWidth: 900, zIndex: 2 }}>
        <Typography
          variant="overline"
          sx={{ color: "secondary.light", letterSpacing: 3, fontWeight: 900 }}
        >
          CONTACT NEW YORK LIMOZ
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
          Book Luxury Chauffeur Service in NYC
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            color: "rgba(255,255,255,0.78)",
            maxWidth: 760,
            mx: "auto",
            lineHeight: 1.8,
            fontSize: { xs: "1rem", md: "1.15rem" },
          }}
        >
          Have a question about airport transfers, corporate travel, hourly rides,
          or private limo service? Our team is ready to help with fast support and
          professional transportation across NYC and Yonkers.
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
            href="mailto:info@newyorklimoz.com"
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
            Email Us
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}