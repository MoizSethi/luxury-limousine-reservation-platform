// src/pages/website/Blogs/Blogs.jsx
import React, { useEffect, useState } from "react";
import { Grid, Box, useTheme, alpha, CircularProgress, Typography } from "@mui/material";
import BlogGrid from "./components/BlogGrid";
import BlogSidebar from "./components/BlogSidebar";
import BlogFilters from "./components/BlogFilters";
import BlogHero from "./components/BlogHero";
import { blogService } from "../../../services/blogservice";

export default function Blogs() {
  const theme = useTheme();
  const glass = {
    background: alpha(theme.palette.background.paper, 0.5),
    backdropFilter: "blur(10px)",
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
  };

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  // Filters
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError("");
      try {
        const { blogs: apiBlogs, pagination } = await blogService.getBlogs();
        setBlogs(apiBlogs);
        setFilteredBlogs(apiBlogs);
        setPageCount(pagination.totalPages);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter & search blogs
  useEffect(() => {
    let temp = [...blogs];

    if (query) {
      temp = temp.filter((b) =>
        b.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category) {
      temp = temp.filter((b) => b.category === category);
    }

    if (sort === "latest") {
      temp.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setFilteredBlogs(temp);
    setPage(1); // reset page when filter changes
    setPageCount(Math.ceil(temp.length / 10)); // 10 blogs per page
  }, [query, category, sort, blogs]);

  // Paginated visible blogs
  const visible = filteredBlogs.slice((page - 1) * 10, page * 10);

  return (
    <Box>
      <BlogHero />

      <BlogFilters
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
        categories={[...new Set(blogs.map((b) => b.category))]}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 5, textAlign: "center" }}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {/* Blog Grid - 80% */}
          <Grid item xs={12} sm={6} md={6}>
            <BlogGrid
              visible={visible}
              page={page}
              setPage={setPage}
              pageCount={pageCount}
              glass={glass}
            />
          </Grid>

          {/* Sidebar - 20% */}
          <Grid item xs={12} md={2}>
            <BlogSidebar glass={glass} blogs={filteredBlogs} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
