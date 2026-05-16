const express = require('express'); 
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getCategories
} = require('./controller');

// Test route to check model initialization
router.get('/test', async (req, res) => {
  try {
    const Blog = require('./model');
    const blogCount = await Blog.count();
    res.json({
      success: true,
      message: 'Blog model is working',
      count: blogCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Blog model error',
      error: error.message
    });
  }
});

// Public routes
router.get('/public', getAllBlogs);
router.get('/public/:slug', getBlogBySlug);
router.get('/categories', getCategories);

// Admin routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;