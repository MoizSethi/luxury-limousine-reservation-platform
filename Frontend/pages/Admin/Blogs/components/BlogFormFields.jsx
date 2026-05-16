import React from 'react';
import {
  TextField,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box
} from '@mui/material';

export const BlogFormFields = ({
  title,
  setTitle,
  category,
  setCategory,
  excerpt,
  setExcerpt,
  tags,
  setTags,
  cover,
  setCover,
  status,
  setStatus
}) => {
  return (
    <Stack spacing={2}>
      <TextField
        label="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a compelling title..."
        fullWidth
        required
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Guides">Guides</MenuItem>
            <MenuItem value="Tips">Tips</MenuItem>
            <MenuItem value="Adventure">Adventure</MenuItem>
            <MenuItem value="Lifestyle">Lifestyle</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TextField
        label="Excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Brief summary of your article..."
        multiline
        rows={3}
        fullWidth
      />

      <TextField
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Separate tags with commas (travel, adventure, tips)..."
        fullWidth
        helperText="Use commas to separate multiple tags"
      />

      <TextField
        label="Cover Image URL"
        value={cover}
        onChange={(e) => setCover(e.target.value)}
        placeholder="https://example.com/image.jpg"
        fullWidth
      />

      {cover && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Cover Preview:
          </Typography>
          <img
            src={cover}
            alt="Cover preview"
            style={{
              maxWidth: '100%',
              maxHeight: 200,
              borderRadius: 8,
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Box>
      )}
    </Stack>
  );
};