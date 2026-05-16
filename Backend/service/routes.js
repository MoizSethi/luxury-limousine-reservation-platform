const express = require("express");
const router = express.Router();
const controller = require("./controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure /uploads/services exists
const dir = path.join(__dirname, "..", "uploads", "services");

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), controller.createService);
router.get("/", controller.getAllServices);
router.get("/:id", controller.getServiceById);
router.put("/:id", upload.single("image"), controller.updateService);
router.delete("/:id", controller.deleteService);

module.exports = router;
