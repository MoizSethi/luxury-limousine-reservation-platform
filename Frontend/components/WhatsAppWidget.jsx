import React from "react";
import { Box } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function WhatsAppWidget() {
  const phoneNumber = "19293784673";
  const message = "Hello, I would like to get more information.";

  return (
    <Box
      component="a"
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        position: "fixed",
        right: { xs: 16, md: 24 },
        bottom: { xs: 18, md: 24 },
        width: { xs: 56, md: 62 },
        height: { xs: 56, md: 62 },
        borderRadius: "50%",
        bgcolor: "#25D366",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        transition: "0.25s ease",
        textDecoration: "none",
        "&:hover": {
          bgcolor: "#1ebe5d",
          transform: "translateY(-4px) scale(1.04)",
        },
      }}
    >
      <WhatsAppIcon sx={{ fontSize: { xs: 30, md: 34 } }} />
    </Box>
  );
}