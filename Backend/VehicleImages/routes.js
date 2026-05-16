// VehicleImages/routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this import
const vehicleImageController = require('./controller');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'vehicles');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum 10 files allowed.' });
    }
  } else if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

// Public routes
router.get('/:vehicle_id/images', vehicleImageController.getVehicleImages);
router.get('/images/:image_id', vehicleImageController.getImage);

// Protected admin routes
router.post('/:vehicle_id/images', 
  verifyToken, 
  isAdmin, 
  upload.array('images', 10), 
  handleMulterError,
  vehicleImageController.uploadImages
);

router.patch('/:vehicle_id/images/:image_id/default', 
  verifyToken, 
  isAdmin, 
  vehicleImageController.setDefaultImage
);

router.delete('/:vehicle_id/images/:image_id', 
  verifyToken, 
  isAdmin, 
  vehicleImageController.deleteImage
);

module.exports = router;