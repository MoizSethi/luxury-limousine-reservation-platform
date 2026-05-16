import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { BASE_URL } from "../Services";
import { useNavigate } from "react-router-dom";

export default function ServiceCard({ service, index, fallbackImage }) {
  const navigate = useNavigate();

  const imageSrc = service?.image ? `${BASE_URL}${service.image}` : fallbackImage;

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        transition: "transform .25s ease, box-shadow .25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          src={imageSrc}
          alt={service?.title || "Service"}
          loading="lazy"
          sx={{
            width: "100%",
            height: { xs: 190, sm: 200, md: 210 },
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.55))",
          }}
        />

        {/* Optional category badge */}
        {service?.category && (
          <Box
            sx={{
              position: "absolute",
              left: 14,
              bottom: 14,
              bgcolor: "rgba(255,255,255,0.95)",
              color: "#111",
              px: 1.2,
              py: 0.6,
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {service.category}
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "3.2em",
          }}
        >
          {service?.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
            lineHeight: 1.7,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          {service?.description}
        </Typography>

        <Stack direction="row" spacing={1.2}>
          <Button
            variant="contained"
            onClick={() => navigate("/reservation")}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            Book Now
          </Button>

          {/* Optional: open service detail page by id (recommended) */}
          <Button
            variant="outlined"
            onClick={() => navigate(`/services/${service.id}`)}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
