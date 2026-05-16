const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General'
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  meta_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'blogs',
  timestamps: true,
  underscored: true
});

// Instance method to increment views
Blog.prototype.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Instance method to get public data
Blog.prototype.getPublicData = function() {
  const blog = this.toJSON();
  return blog;
};

module.exports = Blog;