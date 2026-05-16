const express = require("express");
const router = express.Router();
const controller = require("./contact.controller");

router.post("/contact", controller.createContact);

module.exports = router;
