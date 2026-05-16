// Updated BlogForm.jsx with file upload support
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { blogServiceWithUpload } from '../../../services/blogServiceWithUpload';

const categories = ["Travel", "Guides", "Tips"];

export default function BlogForm({ open, blog, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [coverType, setCoverType] = useState("url"); // 'url' or 'file'
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Load blog data when editing
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setExcerpt(blog.excerpt);
      setCategory(blog.category);
      setCoverUrl(blog.cover || "");
      setCoverType("url");
      setCoverFile(null);
      setPreview(blog.cover || "");
    } else {
      setTitle("");
      setExcerpt("");
      setCategory(categories[0]);
      setCoverUrl("");
      setCoverFile(null);
      setCoverType("url");
      setPreview("");
    }
  }, [blog]);

  // Preview uploaded file
  useEffect(() => {
    if (coverFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(coverFile);
    } else {
      setPreview(coverUrl);
    }
  }, [coverFile, coverUrl]);

  const handleCoverTypeChange = (_, newType) => {
    if (newType) setCoverType(newType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !excerpt.trim()) {
      alert('Title and excerpt are required');
      return;
    }

    setLoading(true);

    try {
      const blogData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        category,
        content: '<p>Default content - edit in full editor</p>', // Default content
        status: 'draft'
      };

      let savedBlog;
      
      if (coverType === 'file' && coverFile) {
        // Use the enhanced service with file upload
        if (blog && blog.id) {
          savedBlog = await blogServiceWithUpload.updateBlog(blog.id, blogData, coverFile);
        } else {
          savedBlog = await blogServiceWithUpload.createBlog(blogData, coverFile);
        }
      } else {
        // Use regular service with URL
        const formattedData = blogServiceWithUpload.formatBlogData({
          ...blogData,
          cover: coverUrl
        });
        
        if (blog && blog.id) {
          savedBlog = await blogServiceWithUpload.updateBlog(blog.id, formattedData);
        } else {
          savedBlog = await blogServiceWithUpload.createBlog(formattedData);
        }
      }

      if (savedBlog.success) {
        onSaved(savedBlog.data);
        onClose();
      } else {
        throw new Error(savedBlog.message || 'Failed to save blog');
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert(error.message || "Failed to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{blog ? "Edit Blog" : "Add New Blog"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          
          <TextField
            label="Excerpt / Summary"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            multiline
            rows={3}
            required
            fullWidth
          />
          
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          {/* Cover Image input */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>Cover Image</Typography>
            <ToggleButtonGroup
              value={coverType}
              exclusive
              onChange={handleCoverTypeChange}
              sx={{ mb: 1 }}
            >
              <ToggleButton value="url">Use URL</ToggleButton>
              <ToggleButton value="file">Upload File</ToggleButton>
            </ToggleButtonGroup>

            {coverType === "url" && (
              <TextField
                label="Image URL"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                fullWidth
                placeholder="https://example.com/image.jpg"
              />
            )}
            
            {coverType === "file" && (
              <Box>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                />
                <Typography variant="caption" color="text.secondary">
                  Recommended: JPEG, PNG under 5MB
                </Typography>
              </Box>
            )}

            {preview && (
              <Box mt={1}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !title.trim() || !excerpt.trim()}
        >
          {loading ? 'Saving...' : (blog ? 'Update' : 'Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}