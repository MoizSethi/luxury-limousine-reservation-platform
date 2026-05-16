import { Box, Typography, Button, Stack } from "@mui/material";

export default function CTASection() {
  return (
    <Box
      component="section"
      sx={{
        mt: { xs: 9, md: 14 },
        textAlign: "center",
        py: { xs: 7, md: 10 },
        px: 3,
        borderRadius: 5,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          bgcolor: "rgba(212,175,55,0.14)",
          top: -100,
          right: -80,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="overline"
          sx={{ color: "secondary.light", fontWeight: 900, letterSpacing: 2 }}
        >
          READY TO RIDE?
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          sx={{ fontWeight: 900, mt: 1, mb: 2 }}
        >
          Book Your Luxury Chauffeur Service Today
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 680,
            mx: "auto",
            mb: 4,
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.8,
          }}
        >
          Reserve a premium limo, black car, SUV, or chauffeur-driven ride for
          airport transfers, corporate travel, hourly service, and special
          events across New York City.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            href="/reservation"
            sx={{
              bgcolor: "secondary.main",
              color: "#111",
              px: 4,
              py: 1.5,
              fontWeight: 900,
              borderRadius: 3,
              "&:hover": { bgcolor: "secondary.dark" },
            }}
          >
            Book Now
          </Button>

          <Button
            variant="outlined"
            size="large"
            href="/contact"
            sx={{
              borderColor: "rgba(255,255,255,0.45)",
              color: "#fff",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              "&:hover": {
                borderColor: "secondary.main",
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Contact Us
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}