import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function BlogDetails() {
  const { slug } = useParams();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        {slug.replace(/-/g, " ")}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Full blog content will go here...
      </Typography>
    </Box>
  );
}
