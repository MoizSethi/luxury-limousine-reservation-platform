import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Stack
} from "@mui/material";
import { blogService } from "../../../services/blogservice";
import { BlogFormFields } from "./components/BlogFormFields";
import { TextEditor } from "./components/TextEditor";
import { ActionButtons } from "./components/ActionButtons";

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== "new";

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Travel");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedText, setSelectedText] = useState("");

  // Load blog data when editing
  useEffect(() => {
    if (isEditing) {
      loadBlog();
    }
  }, [id]);

  const loadBlog = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await blogService.getBlogById(id);
    const blog = blogService.parseBlogData(res);
    setTitle(blog.title);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCover(blog.cover);
    setTags(blog.tags);
    setStatus(blog.status);

  } catch (err) {
    setError("Failed to load blog post");
    console.error("Error loading blog:", err);
  } finally {
    setLoading(false);
  }
};


  const handleSave = async (publish = false) => {
    const finalStatus = publish ? "published" : "draft";
    
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = {
        title: title.trim(),
        category,
        excerpt: excerpt.trim(),
        content,
        cover,
        tags,
        status: finalStatus
      };

      const formattedData = blogService.formatBlogData(formData);
      
      let result;
      if (isEditing) {
        result = await blogService.updateBlog(id, formattedData);
      } else {
        result = await blogService.createBlog(formattedData);
      }

      if (publish) {
        alert(`Blog "${result.data.title}" has been ${isEditing ? 'updated' : 'published'} successfully!`);
      } else {
        alert(`Blog "${result.data.title}" has been ${isEditing ? 'updated' : 'saved'} as draft!`);
      }
      
      navigate("/dashboard/blog");
    } catch (err) {
      setError(err.message || "Failed to save blog post");
      console.error("Error saving blog:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => handleSave(false);
  const handlePublish = () => handleSave(true);
  const handleCancel = () => navigate("/dashboard/blog");

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading blog post...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          {isEditing ? "Edit Article" : "Create New Article"}
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Basic Information Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <BlogFormFields
              title={title}
              setTitle={setTitle}
              category={category}
              setCategory={setCategory}
              excerpt={excerpt}
              setExcerpt={setExcerpt}
              tags={tags}
              setTags={setTags}
              cover={cover}
              setCover={setCover}
              status={status}
              setStatus={setStatus}
            />
          </CardContent>
        </Card>

        {/* Content Editor Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Article Content
            </Typography>
            <TextEditor
              content={content}
              setContent={setContent}
              selectedText={selectedText}
              setSelectedText={setSelectedText}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <ActionButtons
          isEditing={isEditing}
          saving={saving}
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          canPublish={!!title && !!content}
        />
      </Stack>
    </Box>
  );
}