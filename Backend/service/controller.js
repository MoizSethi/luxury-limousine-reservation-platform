const Service = require("./model");
const path = require("path");
const fs = require("fs");

module.exports = {
  // 📌 Create service
  createService: async (req, res) => {
    try {
      const { title, category, description } = req.body;
      const imagePath = req.file ? `/uploads/services/${req.file.filename}` : null;

      const service = await Service.create({
        title,
        category,
        description,
        image: imagePath,
      });

      res.status(201).json({ message: "Service created", service });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // 📌 Get all services
  getAllServices: async (req, res) => {
    try {
      const services = await Service.findAll();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  },

  // 📌 Get single service
  getServiceById: async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) return res.status(404).json({ error: "Service not found" });

      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  },

  // 📌 Update service
  updateService: async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) return res.status(404).json({ error: "Service not found" });

      const { title, category, description } = req.body;

      // If new image uploaded → delete old one
      let imagePath = service.image;
      if (req.file) {
        if (service.image) {
          const oldPath = path.join(__dirname, "..", service.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        imagePath = `/uploads/services/${req.file.filename}`;
      }

      await service.update({
        title,
        category,
        description,
        image: imagePath,
      });

      res.json({ message: "Service updated", service });
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  },

  // 📌 Delete service
  deleteService: async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) return res.status(404).json({ error: "Service not found" });

      // delete image
      if (service.image) {
        const filePath = path.join(__dirname, "..", service.image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await service.destroy();
      res.json({ message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  },
};
