// VehicleImages/controller.js
const VehicleImage = require('./model');
const Vehicle = require('../Vehicle/vehicle.model');
const fs = require('fs');
const path = require('path');
const BASE_URL = process.env.VITE_API_URL || "http://localhost:5000";

const vehicleImageController = {
  // Upload images for a vehicle
  uploadImages: async (req, res) => {
    try {
      const { vehicle_id } = req.params;
      
      // Check if vehicle exists
      const vehicle = await Vehicle.findByPk(vehicle_id);
      if (!vehicle) {
        // Delete uploaded files if vehicle doesn't exist
        if (req.files) {
          req.files.forEach(file => {
            fs.unlinkSync(file.path);
          });
        }
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
      }

      const imageRecords = [];
      let hasDefault = await VehicleImage.findOne({ 
        where: { vehicle_id, is_default: true } 
      });

      for (const file of req.files) {
        // Create image URL - adjust this based on your server setup
        const imageUrl = `/uploads/vehicles/${file.filename}`;
        
        const imageRecord = await VehicleImage.create({
          vehicle_id,
          image_url: imageUrl,
          is_default: !hasDefault // Set first image as default if no default exists
        });

        if (!hasDefault) hasDefault = true;
        imageRecords.push(imageRecord);
      }
console.log("📸 Upload vehicle_id:", req.params.vehicle_id);
      res.status(201).json({
        message: 'Images uploaded successfully',
        images: imageRecords
      });

    } catch (err) {
      console.error('Upload images error:', err);
      // Clean up uploaded files on error
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      res.status(500).json({ 
        message: 'Server error during image upload', 
        error: err.message 
      });
    }
  },

  // Get all images for a vehicle
  getVehicleImages: async (req, res) => {
    try {
      const { vehicle_id } = req.params;

      const images = await VehicleImage.findAll({
        where: { vehicle_id },
        order: [['is_default', 'DESC'], ['createdAt', 'ASC']]
      });

      res.json({
        vehicle_id,
        count: images.length,
        images
      });
    } catch (err) {
      console.error('Get vehicle images error:', err);
      res.status(500).json({ 
        message: 'Server error fetching images', 
        error: err.message 
      });
    }
  },

  // Set an image as default
  setDefaultImage: async (req, res) => {
    try {
      const { vehicle_id, image_id } = req.params;

      // Start transaction to ensure only one default image
      const transaction = await VehicleImage.sequelize.transaction();

      try {
        // Remove default from all other images of this vehicle
        await VehicleImage.update(
          { is_default: false },
          { 
            where: { vehicle_id },
            transaction 
          }
        );

        // Set the specified image as default
        const [affectedRows] = await VehicleImage.update(
          { is_default: true },
          { 
            where: { vehicle_id, image_id },
            transaction 
          }
        );

        if (affectedRows === 0) {
          await transaction.rollback();
          return res.status(404).json({ message: 'Image not found' });
        }

        await transaction.commit();

        const updatedImage = await VehicleImage.findByPk(image_id);
        res.json({
          message: 'Default image updated successfully',
          image: updatedImage
        });

      } catch (error) {
        await transaction.rollback();
        throw error;
      }

    } catch (err) {
      console.error('Set default image error:', err);
      res.status(500).json({ 
        message: 'Server error setting default image', 
        error: err.message 
      });
    }
  },

  // Delete an image
  deleteImage: async (req, res) => {
    try {
      const { vehicle_id, image_id } = req.params;

      const image = await VehicleImage.findOne({
        where: { vehicle_id, image_id }
      });

      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // Delete physical file
      const filePath = path.join(__dirname, '..', 'uploads', 'vehicles', path.basename(image.image_url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const wasDefault = image.is_default;
      
      await image.destroy();

      // If deleted image was default, set a new default
      if (wasDefault) {
        const newDefault = await VehicleImage.findOne({
          where: { vehicle_id },
          order: [['createdAt', 'ASC']]
        });

        if (newDefault) {
          await newDefault.update({ is_default: true });
        }
      }

      res.json({ message: 'Image deleted successfully' });

    } catch (err) {
      console.error('Delete image error:', err);
      res.status(500).json({ 
        message: 'Server error deleting image', 
        error: err.message 
      });
    }
  },

  // Get single image by ID
  getImage: async (req, res) => {
    try {
      const { image_id } = req.params;

      const image = await VehicleImage.findByPk(image_id);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      res.json(image);
    } catch (err) {
      console.error('Get image error:', err);
      res.status(500).json({ 
        message: 'Server error fetching image', 
        error: err.message 
      });
    }
  }
};

module.exports = vehicleImageController;