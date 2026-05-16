// src/pages/Admin/Blogs/components/BlogCard.jsx
import React from "react";
import { Card, CardContent, CardMedia, Typography, Stack, Chip, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BlogCard({ blog }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/dashboard/blog/article/${blog.id}`); // Navigate to Article page
  };

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardMedia
        component="img"
        height="180"
        image={blog.cover_image}
        alt={blog.title}
      />
      <CardContent sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip label={blog.category} size="small" />
          <Typography variant="caption" color="text.secondary">
            {new Date(blog.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>

        <Typography variant="h6" mb={1} sx={{ fontWeight: 700 }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {blog.excerpt}
        </Typography>

        <Button variant="outlined" size="small" onClick={handleEdit}>
          Edit
        </Button>
      </CardContent>
    </Card>
  );
}
