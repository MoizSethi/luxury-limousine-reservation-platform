const Blog = require('./model');
const { Op } = require('sequelize');

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Check if Blog model is properly initialized
const checkModelInitialization = () => {
  if (!Blog || typeof Blog.findAndCountAll !== 'function') {
    throw new Error('Blog model is not properly initialized');
  }
};

// Get all blogs (with filtering and pagination)
const getAllBlogs = async (req, res) => {
  try {
    checkModelInitialization();
    
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    
    // For public routes, only show published blogs
    if (req.path.includes('/public')) {
      where.status = 'published';
    } else if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

// Get blog by slug (public endpoint)
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const blog = await Blog.findOne({
      where: { 
        slug,
        status: 'published'
      }
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    await blog.incrementViews();

    res.json({
      success: true,
      data: blog.getPublicData()
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

// Create new blog
const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      cover_image,
      tags,
      status = 'draft',
      meta_title,
      meta_description
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Generate slug from title
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ where: { slug } });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'A blog with similar title already exists'
      });
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content,
      category: category || 'General',
      cover_image,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
      status,
      author_id: req.user?.id || 1, // In real app, get from auth middleware
      published_at: status === 'published' ? new Date() : null,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      category,
      cover_image,
      tags,
      status,
      meta_title,
      meta_description
    } = req.body;

    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // If title changed, generate new slug
    let slug = blog.slug;
    if (title && title !== blog.title) {
      slug = generateSlug(title);
      
      // Check if new slug exists
      const existingBlog = await Blog.findOne({ 
        where: { 
          slug,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingBlog) {
        return res.status(400).json({
          success: false,
          message: 'A blog with similar title already exists'
        });
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(category && { category }),
      ...(cover_image !== undefined && { cover_image }),
      ...(tags !== undefined && { 
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : [])
      }),
      ...(status && { status }),
      ...(meta_title && { meta_title }),
      ...(meta_description && { meta_description })
    };

    // Handle published_at for status changes
    if (status === 'published' && blog.status !== 'published') {
      updateData.published_at = new Date();
    }

    await blog.update(updateData);

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await blog.destroy();

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
};

// Get blog categories
const getCategories = async (req, res) => {
  try {
    const categories = await Blog.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const categoryList = categories.map(item => item.category);

    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getCategories
};