import React from "react";
import { Grid } from "@mui/material";
import BlogCard from "./BlogCard";

export default function BlogList({ blogs, onEdit }) {
  return (
    <Grid container spacing={3}>
      {blogs.map((b) => (
        <Grid item xs={12} sm={6} md={4} key={b.id}>
          <BlogCard blog={b} onEdit={onEdit} />
        </Grid>
      ))}
    </Grid>
  );
}
