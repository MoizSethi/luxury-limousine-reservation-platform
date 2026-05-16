import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:3000/api",
});

// Get all blogs
const getBlogs = async () => {
  const res = await API.get("/blogs");

  if (!res.data.success) throw new Error("Invalid API response");

  return {
    blogs: res.data.data,          // array of blogs
    pagination: res.data.pagination,
  };
};

// Get one blog by ID
const getBlogById = async (id) => {
  const res = await API.get(`/blogs/${id}`);

  if (!res.data.success) throw new Error("Invalid API response");

  return res.data.data; // return single blog object
};

// Create blog
const createBlog = async (formData) => {
  const res = await API.post("/blogs", formData);
  return res.data; // created blog
};

// Update blog
const updateBlog = async (id, formData) => {
  const res = await API.put(`/blogs/${id}`, formData);
  return res.data; // updated blog
};

// Helpers
const parseBlogData = (blog) => ({
  id: blog.id,
  title: blog.title,
  category: blog.category,
  excerpt: blog.excerpt,
  content: blog.content,
  cover: blog.cover_image,
  tags: blog.tags || [],
  status: blog.status,
});

const formatBlogData = (form) => ({
  title: form.title,
  excerpt: form.excerpt,
  category: form.category,
  content: form.content,
  cover_image: form.cover,
  tags: form.tags,
  status: form.status,
});

export const blogService = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  parseBlogData,
  formatBlogData,
};
