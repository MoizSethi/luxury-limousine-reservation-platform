import React from "react";
import { Box } from "@mui/material";
import ServiceCard from "./ServiceCard";

export default function ServicesGrid({ services, fallbackImage }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",              // موبائل
          sm: "repeat(2, 1fr)",   // ٹیبلیٹ
          md: "repeat(3, 1fr)",   // ڈیسک ٹاپ
        },
        gap: { xs: 2, sm: 3, md: 4 },
        alignItems: "stretch",
      }}
    >
      {services.map((service, index) => (
        <Box key={service.id} sx={{ minWidth: 0 }}>
          <ServiceCard
            service={service}
            index={index}
            fallbackImage={fallbackImage}
          />
        </Box>
      ))}
    </Box>
  );
}
