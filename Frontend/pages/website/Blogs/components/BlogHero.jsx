import { Box, Typography, Button, Stack, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

export default function BlogHero() {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{ mb: 6 }}
    >
      <Box
        sx={{
          p: 6,
          borderRadius: 4,
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          background: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" fontWeight={700}>Latest Stories & Insights</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Guides, tips and deep dives to help you travel smarter.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" component={RouterLink} to="/services">Explore Services</Button>
          </Stack>
        </Box>

        <Box sx={{ width: 360, height: 200, borderRadius: 2, overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>
      </Box>
    </Box>
  );
}
