// reservation/reservation.routes.js
console.log("✅ reservation.routes LOADED");

const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) =>
  res.json({ ok: true, route: "reservations" })
);

const {
  createReservation,
  listReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  sendStep0ReservationMail,
} = require("./reservation.controller");

// ✅ Step 0 lead capture email
router.post("/step0-mail", sendStep0ReservationMail);

// ✅ Full reservation submit
router.post("/", createReservation);

// ✅ Reservation listing
router.get("/", listReservations);

// ✅ Single reservation
router.get("/:id", getReservationById);

// ✅ Update reservation status
router.patch("/:id/status", updateReservationStatus);

// ✅ Delete reservation
router.delete("/:id", deleteReservation);

module.exports = router;