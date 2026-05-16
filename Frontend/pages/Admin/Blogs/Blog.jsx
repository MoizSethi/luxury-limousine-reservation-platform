import React, { useEffect, useState } from "react";
import { Box, Grid, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BlogCard from "./components/BlogCard";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  // Fetch Blogs From API
  useEffect(() => {
    fetch("https://localhost:3000/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data);
        } else {
          console.warn("Invalid API response:", data);
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Add new blog
  const handleAdd = () => {
    navigate("/dashboard/blog/article/new");
  };

  // Edit blog
  const handleEdit = (blog) => {
    navigate(`/dashboard/blog/article/${blog.id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="flex-end" mb={3}>
        <Button variant="contained" onClick={handleAdd}>
          Add New Blog
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <BlogCard blog={blog} onEdit={() => handleEdit(blog)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
