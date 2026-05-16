// src/pages/website/Blogs/components/BlogCard.jsx
import { Card, CardMedia, CardContent, Typography, Chip, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function BlogCard({ blog, glass }) {
  // Ensure cover image exists, fallback to placeholder
  const cover = blog.cover_image || "https://via.placeholder.com/400x200?text=No+Image";

  // Use createdAt date for display
  const date = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ ...glass, height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia component="img" height="170" image={cover} alt={blog.title} />

        <CardContent sx={{ flexGrow: 1 }}>
          <Chip label={blog.category} size="small" />
          <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">
            {date}
          </Typography>

          <Typography
            variant="h6"
            sx={{ mt: 1, fontWeight: 700, textDecoration: "none" }}
            component={RouterLink}
            to={`/blogs/${blog.slug}`} // Navigate using slug
            color="inherit"
          >
            {blog.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {blog.excerpt}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button size="small" component={RouterLink} to={`/blogs/${blog.slug}`}>
              Read more
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
